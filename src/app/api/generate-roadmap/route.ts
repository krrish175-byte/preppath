import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/utils/supabase/server";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { target_company, target_role, duration_months, current_level, preferred_language } = body;

    const prompt = `You are an expert software engineering interview coach.
Generate a detailed, structured interview preparation roadmap for the following profile:
- Target company: ${target_company}
- Target role: ${target_role}
- Time available: ${duration_months} months
- Current level: ${current_level}
- Preferred language: ${preferred_language}

Return ONLY a valid JSON object with this exact structure:
{
  "roadmap_title": "string",
  "total_weeks": number,
  "phases": [
    {
      "phase_number": number,
      "phase_title": "string",
      "duration_weeks": number,
      "goal": "string",
      "modules": [
        {
          "module_id": "string (slug-format-like-this)",
          "module_title": "string",
          "estimated_hours": number,
          "topics": ["topic1", "topic2"],
          "difficulty": "beginner" | "intermediate" | "advanced",
          "problems_count": number
        }
      ]
    }
  ],
  "company_specific_tips": ["tip1", "tip2", "tip3"],
  "interview_format": "string describing the company's interview process"
}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    let roadmapData;
    try {
      roadmapData = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON", responseText);
      return NextResponse.json({ error: "Invalid response from AI" }, { status: 500 });
    }

    // Save to Supabase
    const { data: roadmap, error: roadmapError } = await supabase
      .from("roadmaps")
      .insert({
        user_id: user.id,
        roadmap_json: roadmapData,
      })
      .select()
      .single();

    if (roadmapError) {
      console.error("Failed to save roadmap to Supabase", roadmapError);
      return NextResponse.json({ error: "Failed to save roadmap: " + roadmapError.message }, { status: 500 });
    }

    // Flatten modules and save to 'modules' table
    const modulesToInsert = [];
    let orderIndex = 0;

    for (const phase of roadmapData.phases) {
      for (const module of phase.modules) {
        modulesToInsert.push({
          roadmap_id: roadmap.id,
          module_slug: module.module_id,
          module_title: module.module_title,
          phase_number: phase.phase_number,
          order_index: orderIndex++,
        });
      }
    }

    if (modulesToInsert.length > 0) {
      const { error: modulesError } = await supabase
        .from("modules")
        .insert(modulesToInsert);

      if (modulesError) {
        console.error("Failed to save modules", modulesError);
      }
    }

    return NextResponse.json({ success: true, roadmapId: roadmap.id });
  } catch (error: any) {
    console.error("Roadmap generation error:", error);
    return NextResponse.json({ error: "Internal Server Error: " + (error.message || String(error)) }, { status: 500 });
  }
}
