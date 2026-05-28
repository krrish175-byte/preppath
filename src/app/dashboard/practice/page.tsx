import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PracticePage() {
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
        <h2 className="text-4xl font-bold tracking-tight text-white">No Roadmap Found</h2>
        <p className="text-white/60 max-w-md text-lg">
          Generate your roadmap first to start practicing modules.
        </p>
        <Link href="/onboarding">
          <button className="mt-4 btn-verdant px-10 py-4 rounded-xl font-bold transition-all flex items-center gap-2">
            Generate Roadmap
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

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Practice Arena</h1>
        <p className="text-white/60 text-lg">
          Master your interview skills with AI-powered mock interviews and coding challenges.
        </p>
      </div>

      <div className="grid gap-6">
        {modules?.map((module, index) => {
          const modProgress = progress?.find((p) => p.module_id === module.id);
          const status = modProgress ? modProgress.status : "not_started";
          const isCompleted = status === "completed";
          const inProgress = status === "in_progress";

          return (
            <div key={module.id} className="glass-card border border-white/5 rounded-2xl p-6 hover:border-[#D4F87A]/30 transition-all group relative overflow-hidden flex flex-col md:flex-row gap-6 items-center">
              {/* Module Index Badge */}
              <div className="w-16 h-16 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                <span className="text-xs text-white/40 uppercase font-bold tracking-wider">Mod</span>
                <span className="text-2xl font-bold text-white leading-none">{index + 1}</span>
              </div>

              {/* Module Info */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                <p className="text-white/50 text-sm line-clamp-2">{module.description}</p>
                <div className="flex items-center gap-4 mt-4 justify-center md:justify-start">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs font-medium text-white/70">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    {module.estimated_hours}h
                  </div>
                  {isCompleted && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-[#D4F87A]/10 rounded-full border border-[#D4F87A]/20 text-xs font-medium text-[#D4F87A]">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Completed
                    </div>
                  )}
                  {inProgress && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20 text-xs font-medium text-yellow-500">
                      <span className="material-symbols-outlined text-[14px]">pending</span>
                      In Progress
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 w-full md:w-auto">
                <Link href={`/dashboard/practice/${module.id}`}>
                  <button className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    isCompleted 
                      ? 'bg-white/5 text-white hover:bg-white/10 border border-white/10' 
                      : 'btn-verdant text-[#040A04]'
                  }`}>
                    <span className="material-symbols-outlined">{isCompleted ? 'replay' : 'play_arrow'}</span>
                    {isCompleted ? 'Practice Again' : 'Start Practice'}
                  </button>
                </Link>
              </div>
            </div>
          );
        })}

        {(!modules || modules.length === 0) && (
          <div className="text-center py-12 glass-card rounded-2xl border border-white/5">
            <span className="material-symbols-outlined text-4xl text-white/30 mb-4">inventory_2</span>
            <p className="text-white/50">No modules found for your roadmap.</p>
          </div>
        )}
      </div>
    </div>
  );
}
