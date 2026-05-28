"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
      router.push(`/dashboard/practice?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
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
          placeholder="Search modules..." 
          className="w-full bg-white/5 border border-white/5 rounded-full py-2.5 pl-12 pr-4 text-sm focus:bg-white/10 focus:border-[#D4F87A]/30 focus:ring-4 focus:ring-[#D4F87A]/10 text-white outline-none transition-all placeholder:text-white/30" 
        />
      </form>
      
      <div className="flex items-center gap-5">
        <DropdownMenu>
          <DropdownMenuTrigger className="text-white/60 hover:text-white hover:bg-white/10 rounded-full p-2.5 transition-all relative cursor-pointer outline-none">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#040A04]"></span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 mr-4 bg-[#040A04]/90 backdrop-blur-xl border-[#D4F87A]/20 text-white p-2">
            <DropdownMenuLabel className="font-bold text-lg">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <div className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-white/40">notifications_paused</span>
              </div>
              <p className="text-white/60 text-sm">You're all caught up!</p>
              <p className="text-white/40 text-xs mt-1">Check back later for updates.</p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="w-10 h-10 rounded-full border-2 border-white/10 bg-white/5 overflow-hidden flex items-center justify-center hover:border-[#D4F87A]/50 transition-colors cursor-pointer outline-none">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-sm text-white">{profile?.full_name?.charAt(0) || userEmail?.charAt(0).toUpperCase()}</span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mr-4 bg-[#040A04]/90 backdrop-blur-xl border-[#D4F87A]/20 text-white">
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem onClick={() => router.push('/dashboard/profile')} className="cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white">
                <span className="material-symbols-outlined mr-2 text-sm">person</span>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/profile')} className="cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white">
                <span className="material-symbols-outlined mr-2 text-sm">settings</span>
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
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
