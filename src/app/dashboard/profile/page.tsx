import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const memberSince = new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="animate-in fade-in duration-700 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Your Profile</h1>
        <p className="text-white/60 text-lg">Manage your settings and prep preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Basic Info */}
        <div className="md:col-span-1">
          <div className="glass-card rounded-3xl p-8 text-center relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4F87A]/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <div className="w-32 h-32 mx-auto rounded-full bg-[#D4F87A]/10 border-4 border-[#D4F87A]/20 flex items-center justify-center mb-6 relative z-10 shadow-[0_0_20px_rgba(212,248,122,0.1)]">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-5xl font-bold text-[#D4F87A]">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-1 relative z-10">{profile?.full_name || "Prep Path User"}</h2>
            <p className="text-[#D4F87A] font-medium text-sm mb-6 relative z-10">{user.email}</p>
            
            <div className="bg-white/5 rounded-2xl p-4 flex justify-between items-center relative z-10">
              <span className="text-xs text-white/50 uppercase tracking-widest font-semibold">Member Since</span>
              <span className="text-sm font-semibold text-white">{memberSince}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Preferences */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="glass-card rounded-3xl p-8 border border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4F87A]/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#D4F87A]">target</span>
              Career Goals
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#040A04]/50 border border-white/5 rounded-2xl p-4">
                <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-1">Target Role</p>
                <p className="text-lg font-medium text-white">{profile?.target_role || "Not specified"}</p>
              </div>
              <div className="bg-[#040A04]/50 border border-white/5 rounded-2xl p-4">
                <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-1">Target Company</p>
                <p className="text-lg font-medium text-white">{profile?.target_company || "Not specified"}</p>
              </div>
              <div className="bg-[#040A04]/50 border border-white/5 rounded-2xl p-4">
                <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-1">Experience Level</p>
                <p className="text-lg font-medium text-white">{profile?.years_of_experience ? `${profile.years_of_experience} Years` : "Not specified"}</p>
              </div>
              <div className="bg-[#040A04]/50 border border-white/5 rounded-2xl p-4">
                <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-1">Timeline</p>
                <p className="text-lg font-medium text-white">{profile?.duration_months ? `${profile.duration_months} Months` : "Not specified"}</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#D4F87A]">settings</span>
              Account Settings
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-[#D4F87A]/30 transition-colors cursor-pointer group">
                <div>
                  <h4 className="text-white font-medium mb-1">Update Password</h4>
                  <p className="text-sm text-white/50">Change your current account password</p>
                </div>
                <span className="material-symbols-outlined text-white/30 group-hover:text-[#D4F87A] transition-colors">chevron_right</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-red-500/30 transition-colors cursor-pointer group">
                <div>
                  <h4 className="text-white font-medium mb-1 group-hover:text-red-400 transition-colors">Delete Account</h4>
                  <p className="text-sm text-white/50">Permanently remove your account and data</p>
                </div>
                <span className="material-symbols-outlined text-white/30 group-hover:text-red-400 transition-colors">delete</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
