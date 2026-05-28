import { signup, signInWithGoogle } from '@/app/login/actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101416] p-4">
      <Card className="w-full max-w-md bg-[#1d2022] border-[#424753]/30 text-[#e0e3e6]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#adc6ff]">Sign up for PrepPath</CardTitle>
          <CardDescription className="text-[#c2c6d5]">
            Enter your email below to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-[#c2c6d5]">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="bg-[#101416] border-[#424753]/50 text-white"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-[#c2c6d5]">Password</Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="bg-[#101416] border-[#424753]/50 text-white"
                />
              </div>
              <Button formAction={signup} type="submit" className="w-full bg-[#adc6ff] hover:bg-[#d8e2ff] text-[#001a41] font-bold">
                Sign up
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-[#424753]/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#1d2022] px-2 text-[#c2c6d5]">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button formAction={signInWithGoogle} formNoValidate type="submit" variant="outline" className="w-full border-[#424753]/50 text-[#c2c6d5] hover:bg-[#2b3036] hover:text-white bg-transparent">
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
                Google
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-[#c2c6d5]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#4d8efe] hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
