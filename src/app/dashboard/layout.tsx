import { ReactNode } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SideNav from "./_components/SideNav";
import TopNav from "./_components/TopNav";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile for the avatar/name
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="bg-[#040A04] text-white min-h-screen font-sans selection:bg-[#D4F87A]/30">
      {/* Background ambient glow */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#2E4024]/30 blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#D4F87A]/10 blur-[120px] pointer-events-none z-0"></div>

      {/* Side Navigation Shell */}
      <SideNav />

      {/* Top Navigation Shell */}
      <TopNav profile={profile} userEmail={user.email || ""} />

      {/* Main Content Canvas */}
      <main className="ml-[280px] p-8 max-w-[1400px] relative z-10">
        {children}
      </main>
      
      {/* FAB */}
      <Link href="/dashboard/practice">
        <button className="fixed bottom-8 right-8 w-14 h-14 btn-verdant rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group border border-white/10">
          <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
        </button>
      </Link>
    </div>
  );
}
