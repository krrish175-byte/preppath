import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { moduleId } = await req.json();

    if (!moduleId) {
      return NextResponse.json({ error: "Module ID is required" }, { status: 400 });
    }

    // Fetch the module
    const { data: moduleData, error: moduleError } = await supabase
      .from("modules")
      .select("*, roadmaps ( user_id )")
      .eq("id", moduleId)
      .single();

    if (moduleError || !moduleData) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    // Ensure the module belongs to the user
    if (moduleData.roadmaps.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If lesson already exists, return it
    if (moduleData.lesson_content) {
      return NextResponse.json({ lesson: moduleData.lesson_content, problems: moduleData.problems });
    }

    // Fetch user profile for context
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // Generate content using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });
    
    const prompt = `
You are an expert technical interviewer and software engineering coach.
Generate a comprehensive interactive lesson for a module titled "${moduleData.module_title}".
The user is preparing for a ${profile?.target_role || 'Software Engineer'} role at ${profile?.target_company || 'a top tech company'}.
Their current skill level is ${profile?.current_level || 'Beginner'} and they prefer ${profile?.preferred_language || 'Python'}.

Return a JSON object with the following structure:
{
  "lesson_content": {
    "markdown": "A detailed, engaging markdown string explaining the concepts of this module. Include code examples in their preferred language. Use headings, lists, and bold text."
  },
  "problems": [
    {
      "id": "prob-1",
      "title": "A relevant coding problem",
      "difficulty": "Easy/Medium/Hard",
      "description": "Markdown description of the problem, including input/output examples.",
      "starter_code": "The starter code template in their preferred language."
    }
  ]
}

Provide exactly one problem for them to practice at the end of the lesson.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const generatedData = JSON.parse(responseText);

    // Update the module in the database
    const { error: updateError } = await supabase
      .from("modules")
      .update({
        lesson_content: generatedData.lesson_content,
        problems: generatedData.problems
      })
      .eq("id", moduleId);

    if (updateError) {
      console.error("Failed to update module with generated lesson", updateError);
      return NextResponse.json({ error: "Failed to save lesson" }, { status: 500 });
    }

    return NextResponse.json({ lesson: generatedData.lesson_content, problems: generatedData.problems });

  } catch (error: any) {
    console.error("Generate Lesson Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
