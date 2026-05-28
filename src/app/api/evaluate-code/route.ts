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

    const { moduleId, problemId, code, language, timeTakenSeconds } = await req.json();

    if (!moduleId || !problemId || !code) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch the module
    const { data: moduleData, error: moduleError } = await supabase
      .from("modules")
      .select("*")
      .eq("id", moduleId)
      .single();

    if (moduleError || !moduleData) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    // Find the specific problem
    const problems = moduleData.problems || [];
    const problem = problems.find((p: any) => p.id === problemId);

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Evaluate code using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });
    
    const prompt = `
You are an expert technical interviewer evaluating a candidate's code.

Problem Title: ${problem.title}
Problem Description: ${problem.description}

Candidate's Code (${language}):
\`\`\`${language}
${code}
\`\`\`

Evaluate the candidate's code. Does it correctly solve the problem? Provide constructive feedback.

Return a JSON object with the following structure:
{
  "success": true or false,
  "feedback": "A detailed, encouraging markdown string explaining what they did well and what could be improved or fixed if incorrect. Be specific."
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const evaluation = JSON.parse(responseText);

    // Save the attempt to the database
    const { error: attemptError } = await supabase
      .from("problem_attempts")
      .insert({
        user_id: user.id,
        module_id: moduleId,
        problem_id: problemId,
        solved: evaluation.success,
        attempts: 1, // Simplified for now
        final_code: code,
        language: language,
        time_taken_seconds: timeTakenSeconds || 0
      });

    if (attemptError) {
      console.error("Failed to save attempt", attemptError);
    }

    // Update user progress if successful
    if (evaluation.success) {
      await supabase
        .from("user_progress")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("module_id", moduleId);
    }

    return NextResponse.json(evaluation);

  } catch (error: any) {
    console.error("Evaluate Code Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
