import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PracticePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch modules for this user
  const { data: roadmaps } = await supabase
    .from("roadmaps")
    .select("id")
    .eq("user_id", user.id)
    .order("generated_at", { ascending: false })
    .limit(1);
    
  let modules: any[] = [];
  
  if (roadmaps && roadmaps.length > 0) {
    const { data } = await supabase
      .from("modules")
      .select("*")
      .eq("roadmap_id", roadmaps[0].id)
      .order("order_index", { ascending: true });
    
    modules = data || [];
  }

  return (
    <div className="animate-in fade-in duration-700 max-w-5xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Practice Area</h1>
          <p className="text-white/60 text-lg">Test your knowledge with mock interviews and challenges.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#D4F87A]/10 border border-[#D4F87A]/20 px-4 py-2 rounded-xl text-[#D4F87A]">
           <span className="material-symbols-outlined text-sm">local_fire_department</span>
           <span className="font-bold text-sm">0 Questions Solved Today</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-6">Available Modules</h2>
          
          {modules.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {modules.map((mod) => (
                <div key={mod.id} className="glass-card p-6 rounded-3xl border border-white/5 hover:border-[#D4F87A]/30 transition-all group flex flex-col h-full relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4F87A]/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-[#D4F87A]/10 transition-colors"></div>
                  
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-white/40 group-hover:text-[#D4F87A] group-hover:border-[#D4F87A]/30 transition-colors">
                    <span className="material-symbols-outlined">code</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{mod.module_title}</h3>
                  <p className="text-sm text-white/50 mb-6 flex-1 line-clamp-3">
                    Practice your skills in this module through AI-driven questions.
                  </p>
                  
                  <Link href={`/dashboard/module/${mod.id}`} className="mt-auto">
                     <button className="w-full bg-white/5 hover:bg-[#D4F87A]/10 text-white hover:text-[#D4F87A] border border-white/10 hover:border-[#D4F87A]/30 py-2.5 rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-2">
                       Start Practice
                       <span className="material-symbols-outlined text-sm">arrow_forward</span>
                     </button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card border border-white/5 p-12 rounded-3xl text-center bg-white/[0.02]">
              <div className="w-16 h-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-white/40 text-2xl">inventory_2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Practice Modules Yet</h3>
              <p className="text-white/50 mb-6">Generate your roadmap first to unlock practice modules.</p>
              <Link href="/onboarding">
                <button className="btn-verdant px-6 py-2.5 rounded-xl font-bold text-sm">Create Roadmap</button>
              </Link>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <div className="glass-card rounded-3xl p-6 border border-white/5 mb-6 sticky top-28">
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#D4F87A]">psychology</span>
              Mock Interviews
            </h3>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#2E4024] to-[#040A04] p-5 rounded-2xl border border-[#D4F87A]/20 relative overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070')] bg-cover bg-center mix-blend-overlay opacity-20 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="inline-block bg-[#040A04]/60 backdrop-blur px-2.5 py-0.5 rounded-full mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4F87A]">AI Coach</p>
                  </div>
                  <h4 className="text-white font-bold mb-1">Full Behavioral Interview</h4>
                  <p className="text-xs text-white/60 mb-4">45 mins • Voice or Text</p>
                  <button className="text-sm font-semibold text-[#D4F87A] flex items-center gap-1 group-hover:gap-2 transition-all">
                    Start Session <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
                  </button>
                </div>
              </div>
              
              <div className="bg-white/5 hover:bg-white/10 p-5 rounded-2xl border border-white/10 transition-all cursor-pointer group">
                <h4 className="text-white font-bold mb-1 group-hover:text-[#D4F87A] transition-colors">Technical Phone Screen</h4>
                <p className="text-xs text-white/60 mb-4">30 mins • DSA focus</p>
                <button className="text-sm font-medium text-white/80 group-hover:text-[#D4F87A] transition-colors">
                  Prepare
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
