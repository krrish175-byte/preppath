import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

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

  // Calculate metrics
  const totalModules = modules?.length || 0;
  const completedModules = progress?.filter(p => p.status === 'completed').length || 0;
  const progressPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  
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

  const activePhase = phases.find(p => p.isActive) || phases[0];

  return (
    <div className="animate-in fade-in duration-700">
      {/* Header & Primary Countdown */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">
              Welcome back, {profile?.full_name?.split(' ')[0] || "User"}
            </h2>
            <p className="text-white/60 text-lg">
              You're preparing for <span className="font-semibold text-[#D4F87A]">{profile?.target_role}</span> at <span className="font-semibold text-[#A3D95C]">{profile?.target_company}</span>.
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2 glass-card px-5 py-2.5 rounded-xl backdrop-blur-md">
              <span className="material-symbols-outlined text-[#D4F87A]">timer</span>
              <span className="text-white font-bold">{profile?.duration_months || 3} Months left</span>
            </div>
          </div>
        </div>
        
        {/* Sleek Progress Bar */}
        <div className="w-full glass-card p-1.5 rounded-full overflow-hidden backdrop-blur-sm">
          <div className="w-full bg-[#040A04] h-3 rounded-full overflow-hidden relative">
            <div 
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#2E4024] via-[#A3D95C] to-[#D4F87A] transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(212,248,122,0.6)]" 
              style={{ width: `${progressPercentage}%` }}
            >
              {/* Shimmer effect inside progress bar */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-[200%] animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-card p-6 rounded-3xl hover:border-[#D4F87A]/30 transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4F87A]/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-[#D4F87A]/20 transition-all"></div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-[#D4F87A]/10 border border-[#D4F87A]/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#D4F87A] text-2xl">task_alt</span>
            </div>
            <span className="text-[#D4F87A] text-sm font-bold bg-[#D4F87A]/10 border border-[#D4F87A]/20 px-3 py-1 rounded-full">{progressPercentage}%</span>
          </div>
          <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Modules Completed</h3>
          <p className="text-white text-5xl font-bold tracking-tight relative z-10">{completedModules} <span className="text-xl font-normal text-white/40">/ {totalModules}</span></p>
        </div>
        
        <div className="glass-card p-6 rounded-3xl hover:border-[#A3D95C]/30 transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#A3D95C]/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-[#A3D95C]/20 transition-all"></div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-[#A3D95C]/10 border border-[#A3D95C]/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#A3D95C] text-2xl">code</span>
            </div>
          </div>
          <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Problems Solved</h3>
          <p className="text-white text-5xl font-bold tracking-tight relative z-10">0</p>
        </div>
        
        <div className="glass-card p-6 rounded-3xl hover:border-[#D4F87A]/30 transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4F87A]/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-[#D4F87A]/20 transition-all"></div>
          <div className="flex items-center justify-between mb-6 relative z-10">
             <div className="w-12 h-12 rounded-xl bg-[#D4F87A]/10 border border-[#D4F87A]/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#D4F87A] text-2xl">local_fire_department</span>
            </div>
            <span className="text-[#D4F87A] text-sm font-bold bg-[#D4F87A]/10 border border-[#D4F87A]/20 px-3 py-1 rounded-full">New</span>
          </div>
          <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Current Streak</h3>
          <p className="text-white text-5xl font-bold tracking-tight relative z-10">1 <span className="text-xl font-normal text-white/40">Day</span></p>
        </div>
      </section>

      {/* Bento Layout: Roadmap & Today's Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Roadmap Timeline */}
        <section className="lg:col-span-8 glass-card rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-[#D4F87A]/5 rounded-full blur-[80px]"></div>
          
          <div className="flex items-center justify-between mb-10 relative z-10">
            <h3 className="text-2xl font-bold tracking-tight text-white">Roadmap Timeline</h3>
            <Link href="/dashboard/roadmap" className="text-[#D4F87A] font-semibold text-sm flex items-center gap-1 hover:text-[#A3D95C] transition-colors group">
              View Full Path <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
          
          <div className="relative roadmap-line space-y-12 pl-4">
            {/* Visual Line Background */}
            <div className="absolute left-[38px] top-4 bottom-8 w-px bg-gradient-to-b from-[#D4F87A]/50 via-white/10 to-transparent z-0"></div>

            {phases.map((phase, idx) => {
              const isPast = phase.isCompleted;
              const isCurrent = phase.isActive;
              const isFuture = !isPast && !isCurrent;
              
              const phaseInfo = roadmap.roadmap_json.phases.find((p: any) => p.phase_number === phase.phase_number);
              
              return (
                <div key={phase.phase_number} className={`relative z-10 flex gap-8 ${isFuture ? 'opacity-50 grayscale' : ''} transition-all`}>
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
                      <h4 className={`text-lg font-bold ${isCurrent ? 'text-white' : 'text-white/80'}`}>
                        Phase {phase.phase_number}: {phaseInfo?.phase_title || "Preparation Phase"}
                      </h4>
                      {isCurrent && <span className="text-[10px] bg-[#D4F87A]/20 border border-[#D4F87A]/30 text-[#D4F87A] px-2.5 py-1 rounded-full font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(212,248,122,0.2)]">Active</span>}
                    </div>
                    
                    <p className="text-white/50 text-sm mb-6 leading-relaxed max-w-2xl">{phaseInfo?.goal || "Master the concepts in this phase."}</p>
                    
                    {/* Render up to 2 modules for the current phase */}
                    {(isCurrent || isPast) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {phase.modules.slice(0, 2).map((mod: any) => {
                          const modProgress = progress?.find(p => p.module_id === mod.id);
                          const isModCompleted = modProgress?.status === 'completed';
                          
                          return (
                            <Link href={`/dashboard/module/${mod.id}`} key={mod.id}>
                              <div className="glass-card p-4 rounded-2xl flex items-center justify-between hover:bg-white/10 hover:border-[#D4F87A]/30 transition-all group cursor-pointer h-full">
                                <span className="text-sm font-medium truncate max-w-[80%] pr-2 text-white/90 group-hover:text-[#D4F87A] transition-colors">{mod.module_title}</span>
                                {isModCompleted ? (
                                  <div className="w-8 h-8 rounded-full bg-[#D4F87A]/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#D4F87A] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#D4F87A]/20 flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined text-white/40 group-hover:text-[#D4F87A] text-sm">play_arrow</span>
                                  </div>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                        {phase.modules.length > 2 && (
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors border-dashed">
                            <span className="text-sm font-medium text-white/40">+{phase.modules.length - 2} more modules</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Today's Plan Sidebar */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card rounded-3xl p-7 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4F87A]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 relative z-10 text-white">
              <div className="w-10 h-10 rounded-xl bg-[#D4F87A]/10 flex items-center justify-center border border-[#D4F87A]/20">
                <span className="material-symbols-outlined text-[#D4F87A] text-lg">calendar_today</span>
              </div>
              Today's Plan
            </h3>
            <ul className="space-y-3 relative z-10">
              {activePhase?.modules.slice(0, 3).map((mod: any, idx: number) => (
                <Link href={`/dashboard/module/${mod.id}`} key={mod.id} className="block">
                  <li className="flex items-center gap-4 p-4 glass-card hover:bg-white/10 rounded-2xl hover:border-[#D4F87A]/30 transition-all cursor-pointer group">
                    <div className="w-6 h-6 rounded border border-white/20 flex items-center justify-center shrink-0 group-hover:border-[#D4F87A] group-hover:bg-[#D4F87A]/10 transition-colors">
                      {progress?.some(p => p.module_id === mod.id && p.status === 'completed') && (
                        <span className="material-symbols-outlined text-[14px] text-[#D4F87A]">check</span>
                      )}
                    </div>
                    <div className="flex-1 truncate">
                      <p className="text-sm font-semibold text-white/90 truncate group-hover:text-white transition-colors">{mod.module_title}</p>
                      <p className="text-[11px] text-[#D4F87A]/80 mt-1 uppercase tracking-wider font-semibold">Recommended Next Step</p>
                    </div>
                    <span className="material-symbols-outlined text-white/20 group-hover:text-[#D4F87A] text-sm transition-colors">chevron_right</span>
                  </li>
                </Link>
              ))}
              
              {!activePhase?.modules.length && (
                 <li className="text-sm text-white/40 p-4 bg-white/5 rounded-2xl text-center">No active modules found.</li>
              )}
            </ul>
          </div>

          {/* Ad/Promo Card */}
          <div className="relative overflow-hidden rounded-3xl p-8 h-56 flex flex-col justify-end group cursor-pointer border border-[#D4F87A]/20">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2E4024] via-[#040A04] to-[#A3D95C] opacity-90 z-0"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070')] bg-cover bg-center mix-blend-overlay opacity-30 group-hover:scale-110 transition-transform duration-1000 z-0"></div>
            
            <div className="relative z-10">
              <div className="inline-block bg-[#040A04]/40 backdrop-blur-md px-3 py-1 rounded-full mb-3 border border-[#D4F87A]/30">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4F87A]">New Feature</p>
              </div>
              <h4 className="text-2xl font-bold leading-tight mb-4 text-white drop-shadow-md">AI-Powered Mock Interviews</h4>
              <Link href="/dashboard/practice">
                <button className="btn-verdant px-6 py-2.5 rounded-full text-sm font-bold transition-all">Try Now</button>
              </Link>
            </div>
          </div>
        </section>
      </div>
      
      <div className="h-20"></div> {/* Bottom padding */}
    </div>
  );
}
