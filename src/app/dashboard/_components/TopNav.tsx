"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TopNav({ profile, userEmail }: { profile: any, userEmail: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Searching for: ${searchQuery}`, {
        description: "Full search functionality is coming soon!",
      });
      setSearchQuery("");
    }
  };

  const handleNotificationClick = () => {
    toast("No new notifications", {
      description: "You're all caught up for today.",
    });
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="flex justify-between items-center h-20 px-8 ml-[280px] sticky top-0 glass-nav border-b border-white/5 z-30">
      <form onSubmit={handleSearch} className="flex items-center flex-1 max-w-md relative group">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg group-focus-within:text-[#D4F87A] transition-colors">search</span>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search roadmap or questions..." 
          className="w-full bg-white/5 border border-white/5 rounded-full py-2.5 pl-12 pr-4 text-sm focus:bg-white/10 focus:border-[#D4F87A]/30 focus:ring-4 focus:ring-[#D4F87A]/10 text-white outline-none transition-all placeholder:text-white/30" 
        />
      </form>
      
      <div className="flex items-center gap-5">
        <button onClick={handleNotificationClick} className="text-white/60 hover:text-white hover:bg-white/10 rounded-full p-2.5 transition-all relative cursor-pointer">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#040A04]"></span>
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="w-10 h-10 rounded-full border-2 border-white/10 bg-white/5 overflow-hidden flex items-center justify-center hover:border-[#D4F87A]/50 transition-colors cursor-pointer">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-sm text-white">{profile?.full_name?.charAt(0) || userEmail?.charAt(0).toUpperCase()}</span>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mr-4 bg-[#040A04]/90 backdrop-blur-xl border-[#D4F87A]/20 text-white">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem onClick={() => router.push('/dashboard/profile')} className="cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white">
              <span className="material-symbols-outlined mr-2 text-sm">person</span>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast("Settings coming soon")} className="cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white">
              <span className="material-symbols-outlined mr-2 text-sm">settings</span>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400">
              <span className="material-symbols-outlined mr-2 text-sm">logout</span>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
