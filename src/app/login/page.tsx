import { login } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import GoogleAuthButton from './_components/GoogleAuthButton'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#040A04] p-4 relative overflow-hidden font-sans selection:bg-[#D4F87A]/30">
      
      {/* Background ambient glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#2E4024]/30 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#D4F87A]/10 blur-[120px] pointer-events-none z-0"></div>

      <div className="w-full max-w-md relative z-10 glass-card rounded-[2rem] p-8 md:p-10 border border-white/10 shadow-2xl">
        
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 mb-6 hover:border-[#D4F87A]/50 hover:bg-white/10 transition-all">
            <span className="material-symbols-outlined text-[#D4F87A] text-2xl">route</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/60">
            Sign in to continue your preparation journey
          </p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80 font-medium ml-1">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="bg-white/5 border-white/10 text-white h-12 px-4 rounded-xl focus:bg-white/10 focus:border-[#D4F87A]/50 focus:ring-1 focus:ring-[#D4F87A]/50 transition-all placeholder:text-white/30"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <Label htmlFor="password" className="text-white/80 font-medium">Password</Label>
              <Link href="#" className="text-sm text-[#D4F87A] hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="bg-white/5 border-white/10 text-white h-12 px-4 rounded-xl focus:bg-white/10 focus:border-[#D4F87A]/50 focus:ring-1 focus:ring-[#D4F87A]/50 transition-all placeholder:text-white/30"
            />
          </div>

          <Button formAction={login} type="submit" className="w-full btn-verdant h-12 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(212,248,122,0.2)] hover:shadow-[0_0_30px_rgba(212,248,122,0.4)] transition-all">
            Sign In
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0c120c] px-4 text-white/40 font-medium rounded-full">
              Or continue with
            </span>
          </div>
        </div>

        <GoogleAuthButton />

        <div className="mt-8 text-center text-sm text-white/60">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#D4F87A] font-semibold hover:text-white transition-colors">
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  )
}
