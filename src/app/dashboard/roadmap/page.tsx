import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function RoadmapPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch latest roadmap
  const { data: roadmap } = await supabase
    .from("roadmaps")
    .select("*")
    .eq("user_id", user.id)
    .order("generated_at", { ascending: false })
    .limit(1)
    .single();

  if (!roadmap) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="w-24 h-24 bg-white/5 rounded-full border border-white/10 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
          <span className="material-symbols-outlined text-5xl text-white/40">route</span>
        </div>
        <h2 className="text-4xl font-bold tracking-tight text-white">No Roadmap Found</h2>
        <p className="text-white/60 max-w-md text-lg">
          It looks like you haven't generated your personalized interview prep roadmap yet. Let's get that set up!
        </p>
        <Link href="/onboarding">
          <button className="mt-4 btn-verdant px-10 py-4 rounded-xl font-bold transition-all flex items-center gap-2">
            Generate Roadmap
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </Link>
      </div>
    );
  }

  // Fetch modules for this roadmap
  const { data: modules } = await supabase
    .from("modules")
    .select("*")
    .eq("roadmap_id", roadmap.id)
    .order("order_index", { ascending: true });

  // Fetch progress
  const { data: progress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id);

  // Group modules by phase
  const phasesMap = new Map();
  modules?.forEach(mod => {
    if (!phasesMap.has(mod.phase_number)) {
      phasesMap.set(mod.phase_number, {
        phase_number: mod.phase_number,
        modules: [],
        isCompleted: true,
        isActive: false
      });
    }
    const phase = phasesMap.get(mod.phase_number);
    phase.modules.push(mod);
  });

  const phases = Array.from(phasesMap.values()).sort((a, b) => a.phase_number - b.phase_number);
  
  // Determine active phase
  let foundActive = false;
  for (const phase of phases) {
    const isCompleted = phase.modules.every((m: any) => progress?.some(p => p.module_id === m.id && p.status === 'completed'));
    phase.isCompleted = isCompleted;
    if (!isCompleted && !foundActive) {
      phase.isActive = true;
      foundActive = true;
    }
  }

  return (
    <div className="animate-in fade-in duration-700 max-w-5xl mx-auto">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Your Custom Roadmap</h1>
          <p className="text-white/60 text-lg">A structured, end-to-end plan tailored for your target role.</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-white">
           <span className="material-symbols-outlined text-sm">schedule</span>
           <span className="font-semibold text-sm">{phases.length} Phases Total</span>
        </div>
      </div>

      <div className="relative roadmap-line space-y-16 pl-6">
        {/* Visual Line Background */}
        <div className="absolute left-[45px] top-4 bottom-8 w-px bg-gradient-to-b from-[#D4F87A]/50 via-white/10 to-transparent z-0"></div>

        {phases.map((phase, idx) => {
          const isPast = phase.isCompleted;
          const isCurrent = phase.isActive;
          const isFuture = !isPast && !isCurrent;
          
          const phaseInfo = roadmap.roadmap_json.phases.find((p: any) => p.phase_number === phase.phase_number);
          
          return (
            <div key={phase.phase_number} className={`relative z-10 flex gap-10 ${isFuture ? 'opacity-60' : ''} transition-all`}>
              {/* Phase Icon */}
              {isPast && (
                <div className="w-12 h-12 shrink-0 rounded-full bg-[#040A04] border border-[#D4F87A]/30 flex items-center justify-center text-[#D4F87A] z-10">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
              )}
              {isCurrent && (
                <div className="w-12 h-12 shrink-0 rounded-full bg-[#D4F87A] flex items-center justify-center text-[#040A04] z-10 shadow-[0_0_20px_rgba(212,248,122,0.5)] border-2 border-[#040A04]">
                  <span className="material-symbols-outlined font-bold">psychology</span>
                </div>
              )}
              {isFuture && (
                <div className="w-12 h-12 shrink-0 rounded-full bg-[#040A04] border border-white/10 flex items-center justify-center text-white/30 z-10">
                  <span className="material-symbols-outlined">lock</span>
                </div>
              )}
              
              <div className="flex-1 pb-2">
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`text-2xl font-bold ${isCurrent ? 'text-white' : 'text-white/80'}`}>
                    Phase {phase.phase_number}: {phaseInfo?.phase_title || "Preparation Phase"}
                  </h4>
                  {isCurrent && <span className="text-xs bg-[#D4F87A]/20 border border-[#D4F87A]/30 text-[#D4F87A] px-3 py-1 rounded-full font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(212,248,122,0.2)]">Active</span>}
                </div>
                
                <p className="text-white/60 text-base mb-8 leading-relaxed max-w-3xl">{phaseInfo?.goal || "Master the concepts in this phase."}</p>
                
                {/* Modules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {phase.modules.map((mod: any, i: number) => {
                    const modProgress = progress?.find(p => p.module_id === mod.id);
                    const isModCompleted = modProgress?.status === 'completed';
                    const isModInProgress = modProgress?.status === 'in_progress';
                    
                    return (
                      <div key={mod.id} className="glass-card p-6 rounded-3xl flex flex-col hover:border-[#D4F87A]/30 transition-all group h-full relative overflow-hidden">
                        {isCurrent && i === 0 && !isModCompleted && (
                           <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4F87A]/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-[#D4F87A]/10 transition-colors"></div>
                        )}
                        <div className="flex justify-between items-start mb-4">
                           <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                             <span className="material-symbols-outlined text-sm">menu_book</span>
                           </div>
                           {isModCompleted ? (
                             <span className="text-[10px] text-[#D4F87A] font-bold uppercase tracking-widest bg-[#D4F87A]/10 px-2.5 py-1 rounded-full">Completed</span>
                           ) : isModInProgress ? (
                             <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest bg-yellow-500/10 px-2.5 py-1 rounded-full">In Progress</span>
                           ) : null}
                        </div>
                        <h5 className="text-lg font-bold text-white mb-2 line-clamp-1">{mod.module_title}</h5>
                        <p className="text-sm text-white/50 mb-6 line-clamp-2 flex-1">{mod.description}</p>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-xs font-semibold text-white/40">{mod.estimated_hours} Hours</span>
                          <Link href={`/dashboard/module/${mod.id}`}>
                            <button className="text-sm font-semibold text-white/80 group-hover:text-[#D4F87A] flex items-center gap-1 transition-colors">
                              {isModCompleted ? 'Review' : 'Start'}
                              <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="h-20"></div> {/* Bottom padding */}
    </div>
  );
}
