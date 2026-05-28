import { createClient } from "@/utils/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-24 h-24 rounded-full bg-[#D4F87A]/10 border border-[#D4F87A]/20 flex items-center justify-center mb-6 relative overflow-hidden">
        <span className="text-4xl font-bold text-[#D4F87A]">
          {user?.email?.charAt(0).toUpperCase() || "U"}
        </span>
      </div>
      
      <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Your Profile</h1>
      <p className="text-[#D4F87A] font-medium mb-8">
        {user?.email}
      </p>
      <p className="text-white/60 max-w-lg mb-8 text-lg">
        Advanced profile management, including connected accounts and subscription settings, is currently in development.
      </p>
      
      <div className="glass-card border border-white/5 p-6 rounded-2xl max-w-md w-full bg-white/[0.02] flex flex-col gap-4 text-left">
        <div className="flex justify-between items-center pb-4 border-b border-white/5">
          <span className="text-white/60">Account Type</span>
          <span className="text-[#D4F87A] bg-[#D4F87A]/10 px-3 py-1 rounded-full text-sm">Pro Member</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-white/5">
          <span className="text-white/60">Member Since</span>
          <span className="text-white font-medium">May 2026</span>
        </div>
      </div>
    </div>
  );
}
