"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Editor, { useMonaco } from "@monaco-editor/react";
import Link from "next/link";

export default function PracticePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const router = useRouter();
  const supabase = createClient();
  const monaco = useMonaco();

  const [moduleData, setModuleData] = useState<any>(null);
  const [problem, setProblem] = useState<any>(null);
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    fetchModule();
  }, [moduleId]);

  const fetchModule = async () => {
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
        .eq("id", moduleId)
        .single();

      if (modError || !mod) {
        setError("Module not found");
        return;
      }

      setModuleData(mod);

      if (mod.problems && mod.problems.length > 0) {
        setProblem(mod.problems[0]);
        // Default to python or js based on starter code
        setCode(mod.problems[0].starter_code || "# Write your code here");
      } else {
        setError("No practice problems found for this module.");
      }
      
      setStartTime(Date.now());

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async () => {
    if (!problem || !code.trim()) return;

    try {
      setEvaluating(true);
      setFeedback(null);
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);

      const res = await fetch("/api/evaluate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          moduleId, 
          problemId: problem.id, 
          code, 
          language: "python", // Hardcoded for now, could be dynamic
          timeTakenSeconds: timeTaken
        })
      });

      if (!res.ok) throw new Error("Evaluation failed");

      const data = await res.json();
      setFeedback(data);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <h2 className="text-xl font-bold text-white animate-pulse">Loading Practice Environment...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center max-w-2xl mx-auto mt-20">
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
    <div className="h-[calc(100vh-100px)] flex gap-6 pb-6">
      {/* Left Panel: Problem Description */}
      <div className="w-1/2 flex flex-col bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
        <div className="absolute top-[-50px] left-[-50px] w-[200px] h-[200px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none z-0"></div>
        
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0b0e14]/50 z-10">
          <div className="flex items-center gap-3">
            <Link href={`/dashboard/module/${moduleId}`} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-wider">{moduleData?.module_title}</p>
              <h1 className="text-xl font-bold text-white tracking-tight">{problem?.title}</h1>
            </div>
          </div>
          <div className="bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full text-xs font-bold border border-orange-500/20">
            {problem?.difficulty || "Medium"}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 z-10 custom-scrollbar">
          <div className="prose prose-invert prose-blue max-w-none
            prose-headings:font-bold 
            prose-p:text-white/80 prose-p:leading-relaxed 
            prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
            prose-code:text-blue-300 prose-code:bg-blue-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:hidden prose-code:after:hidden
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {problem?.description || "*No description provided.*"}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Right Panel: Editor and Output */}
      <div className="w-1/2 flex flex-col gap-6">
        {/* Editor */}
        <div className="flex-1 bg-[#1e1e1e] rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col relative group">
          <div className="h-12 bg-[#2d2d2d] flex items-center justify-between px-4 border-b border-black/50">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="ml-4 text-xs font-mono text-white/50">main.py</span>
            </div>
            <div className="flex gap-3">
               <button className="text-white/40 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors">
                  <span className="material-symbols-outlined text-sm">refresh</span> Reset
               </button>
               <button 
                onClick={submitCode}
                disabled={evaluating}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]"
               >
                 {evaluating ? (
                   <><span className="material-symbols-outlined animate-spin text-sm">autorenew</span> Running...</>
                 ) : (
                   <><span className="material-symbols-outlined text-sm">play_arrow</span> Run & Submit</>
                 )}
               </button>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <Editor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                lineHeight: 24,
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                renderLineHighlight: "all",
              }}
            />
          </div>
        </div>

        {/* Console / Feedback */}
        <div className={`h-[250px] rounded-3xl border flex flex-col overflow-hidden shadow-2xl transition-all duration-500 ${
          feedback 
            ? feedback.success 
              ? 'bg-green-500/5 border-green-500/20' 
              : 'bg-red-500/5 border-red-500/20' 
            : 'bg-white/5 border-white/10 backdrop-blur-xl'
        }`}>
          <div className={`px-6 py-3 border-b flex justify-between items-center ${
             feedback 
              ? feedback.success 
                ? 'border-green-500/20 bg-green-500/10' 
                : 'border-red-500/20 bg-red-500/10'
              : 'border-white/10 bg-[#0b0e14]/50'
          }`}>
            <h3 className="font-bold flex items-center gap-2 text-sm tracking-wide">
              <span className="material-symbols-outlined text-[18px]">terminal</span> 
              AI FEEDBACK
            </h3>
            {feedback && (
              <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${feedback.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {feedback.success ? 'Passed' : 'Needs Work'}
              </span>
            )}
          </div>
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            {feedback ? (
              <div className="prose prose-sm prose-invert max-w-none
                prose-p:leading-relaxed
                prose-code:bg-black/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {feedback.feedback}
                </ReactMarkdown>
              </div>
            ) : evaluating ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-white/40">
                 <div className="w-8 h-8 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin"></div>
                 <p className="text-sm animate-pulse">AI is reviewing your code...</p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-white/30 text-sm">
                 Run your code to get AI-powered feedback on correctness, time complexity, and style.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
