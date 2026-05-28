"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

export default function ModulePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [moduleData, setModuleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressStatus, setProgressStatus] = useState<string>("not_started");

  useEffect(() => {
    fetchModuleAndProgress();
  }, [id]);

  const fetchModuleAndProgress = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      // Fetch module
      const { data: mod, error: modError } = await supabase
        .from("modules")
        .select("*")
        .eq("id", id)
        .single();

      if (modError || !mod) {
        setError("Module not found");
        return;
      }

      setModuleData(mod);

      // Fetch progress
      let { data: prog } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("module_id", id)
        .single();

      // If no progress record, create one
      if (!prog) {
        const { data: newProg } = await supabase
          .from("user_progress")
          .insert({
            user_id: user.id,
            module_id: id,
            status: "in_progress",
            started_at: new Date().toISOString()
          })
          .select()
          .single();
        
        prog = newProg;
      } else if (prog.status === "not_started") {
        await supabase
          .from("user_progress")
          .update({ status: "in_progress", started_at: new Date().toISOString() })
          .eq("id", prog.id);
      }

      if (prog) {
        setProgressStatus(prog.status);
      }

      // If lesson doesn't exist, generate it
      if (!mod.lesson_content) {
        generateLesson(id);
      } else {
        setLoading(false);
      }

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const generateLesson = async (moduleId: string) => {
    try {
      setGenerating(true);
      const res = await fetch("/api/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId })
      });

      if (!res.ok) throw new Error("Failed to generate lesson");

      const data = await res.json();
      
      setModuleData((prev: any) => ({
        ...prev,
        lesson_content: data.lesson,
        problems: data.problems
      }));

    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      await supabase
        .from("user_progress")
        .update({ lesson_read: true })
        .eq("user_id", user.id)
        .eq("module_id", id);
        
      // Navigate to practice
      router.push(`/dashboard/practice/${id}`);
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  if (loading || generating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <h2 className="text-xl font-bold text-white animate-pulse">
          {generating ? "AI is crafting your personalized lesson..." : "Loading module..."}
        </h2>
        {generating && (
          <p className="text-white/50 text-sm max-w-sm text-center">
            We are tailoring the concepts, explanations, and code examples exactly to your target role and skill level.
          </p>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center">
        <span className="material-symbols-outlined text-red-500 text-4xl mb-4">error</span>
        <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
        <p className="text-white/70">{error}</p>
        <Link href="/dashboard">
          <button className="mt-6 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl transition-colors">
            Back to Dashboard
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm font-semibold transition-colors">
              <span className="material-symbols-outlined text-sm">arrow_back</span> Dashboard
            </Link>
            <span className="text-white/20">•</span>
            <span className="text-white/40 text-sm font-semibold uppercase tracking-wider">Phase {moduleData?.phase_number}</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">{moduleData?.module_title}</h1>
        </div>
        
        {progressStatus === 'completed' && (
          <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-full border border-green-500/20 font-bold text-sm">
            <span className="material-symbols-outlined text-lg">check_circle</span>
            Completed
          </div>
        )}
      </div>

      {/* Lesson Content */}
      <div className="bg-[#040A04]/40 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4F87A]/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="prose prose-invert prose-stone max-w-none relative z-10 
          prose-headings:font-bold prose-headings:text-white prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2
          prose-p:text-white/80 prose-p:leading-relaxed prose-p:mb-6
          prose-pre:bg-[#040A04]/80 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
          prose-code:text-[#D4F87A] prose-code:bg-[#D4F87A]/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:hidden prose-code:after:hidden
          prose-a:text-[#D4F87A] prose-a:no-underline hover:prose-a:underline
          prose-li:text-white/80 prose-ul:mb-6 prose-ol:mb-6
          prose-strong:text-white prose-strong:font-bold">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {moduleData?.lesson_content?.markdown || "*No lesson content available.*"}
          </ReactMarkdown>
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-[280px] right-0 p-6 bg-[#040A04]/90 backdrop-blur-xl border-t border-white/5 flex justify-center z-40">
        <div className="w-full max-w-4xl flex justify-between items-center">
          <p className="text-white/60 text-sm font-medium">Take your time to understand the concepts before practicing.</p>
          <button 
            onClick={markAsRead}
            className="btn-verdant px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 active:scale-95"
          >
            I'm Ready to Practice
            <span className="material-symbols-outlined">code</span>
          </button>
        </div>
      </div>
    </div>
  );
}
