"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";

const COMPANIES = [
  "Google", "Meta", "Amazon", "Apple", "Microsoft",
  "Flipkart", "Zomato", "Swiggy", "Paytm", "Razorpay",
  "Meesho", "CRED", "Atlassian", "Adobe", "Netflix",
  "Uber", "Airbnb", "Stripe", "Coinbase", "Goldman Sachs",
  "JP Morgan", "Other / Generic FAANG prep"
];

const ROLES = [
  "Internship (Software Engineering Intern)",
  "STEP / Explorer / Similar early-career program",
  "SDE-1 / New Grad",
  "SDE-2 / Mid-level",
  "Data Scientist",
  "ML Engineer",
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer"
];

const DURATIONS = [
  { label: "1 month (crash course)", value: 1 },
  { label: "3 months (standard)", value: 3 },
  { label: "6 months (thorough)", value: 6 },
  { label: "1 year (deep mastery)", value: 12 },
  { label: "2 years (long-term)", value: 24 }
];

const LEVELS = [
  "Complete beginner (never done DSA)",
  "Know the basics (done some arrays/loops)",
  "Intermediate (solved ~50 LeetCode problems)",
  "Advanced (solved 150+ problems, want to target hard)"
];

const LANGUAGES = ["Python", "C++", "Java", "JavaScript", "Go"];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [profile, setProfile] = useState({
    target_company: "",
    target_role: "",
    duration_months: 3,
    current_level: "",
    preferred_language: ""
  });

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      // Save profile to Supabase
      const { error: profileError } = await supabase
        .from("user_profiles")
        .update({
          target_company: profile.target_company,
          target_role: profile.target_role,
          duration_months: profile.duration_months,
          current_level: profile.current_level,
          preferred_language: profile.preferred_language,
          onboarding_completed: true,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Call Gemini API to generate roadmap
      const res = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || "Failed to generate roadmap");
      }

      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      alert("Error: " + (error.message || "Failed to save profile or generating roadmap. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101416] p-4 font-sans text-white">
      <Card className="w-full max-w-2xl bg-[#1d2022] border-[#424753]/30 text-[#e0e3e6]">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <span className="text-[#adc6ff] font-bold">Step {step} of 5</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`h-2 w-8 rounded-full ${i <= step ? 'bg-[#adc6ff]' : 'bg-[#323538]'}`} />
              ))}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === 1 && "Which company are you targeting?"}
            {step === 2 && "What role are you applying for?"}
            {step === 3 && "How much time do you have to prepare?"}
            {step === 4 && "What is your current level?"}
            {step === 5 && "What is your preferred programming language?"}
          </CardTitle>
          <CardDescription className="text-[#c2c6d5]">
            We&apos;ll use this to customize your learning roadmap.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {COMPANIES.map((company) => (
                <Button
                  key={company}
                  variant={profile.target_company === company ? "default" : "outline"}
                  className={`h-auto py-3 justify-start text-left ${profile.target_company === company ? 'bg-[#adc6ff] text-[#001a41]' : 'bg-[#101416] border-[#424753]/50 text-white hover:bg-[#323538]'}`}
                  onClick={() => setProfile({ ...profile, target_company: company })}
                >
                  {company}
                </Button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ROLES.map((role) => (
                <Button
                  key={role}
                  variant={profile.target_role === role ? "default" : "outline"}
                  className={`h-auto py-3 justify-start text-left ${profile.target_role === role ? 'bg-[#adc6ff] text-[#001a41]' : 'bg-[#101416] border-[#424753]/50 text-white hover:bg-[#323538]'}`}
                  onClick={() => setProfile({ ...profile, target_role: role })}
                >
                  {role}
                </Button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-3">
              {DURATIONS.map((dur) => (
                <Button
                  key={dur.value}
                  variant={profile.duration_months === dur.value ? "default" : "outline"}
                  className={`h-auto py-4 justify-start text-left ${profile.duration_months === dur.value ? 'bg-[#adc6ff] text-[#001a41]' : 'bg-[#101416] border-[#424753]/50 text-white hover:bg-[#323538]'}`}
                  onClick={() => setProfile({ ...profile, duration_months: dur.value })}
                >
                  {dur.label}
                </Button>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-3">
              {LEVELS.map((level) => (
                <Button
                  key={level}
                  variant={profile.current_level === level ? "default" : "outline"}
                  className={`h-auto py-4 justify-start text-left whitespace-normal ${profile.current_level === level ? 'bg-[#adc6ff] text-[#001a41]' : 'bg-[#101416] border-[#424753]/50 text-white hover:bg-[#323538]'}`}
                  onClick={() => setProfile({ ...profile, current_level: level })}
                >
                  {level}
                </Button>
              ))}
            </div>
          )}

          {step === 5 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {LANGUAGES.map((lang) => (
                <Button
                  key={lang}
                  variant={profile.preferred_language === lang ? "default" : "outline"}
                  className={`h-auto py-4 justify-start text-left ${profile.preferred_language === lang ? 'bg-[#adc6ff] text-[#001a41]' : 'bg-[#101416] border-[#424753]/50 text-white hover:bg-[#323538]'}`}
                  onClick={() => setProfile({ ...profile, preferred_language: lang })}
                >
                  {lang}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-[#424753]/20 pt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1 || loading}
            className="bg-transparent border-[#424753] text-white hover:bg-[#323538]"
          >
            Back
          </Button>
          
          {step < 5 ? (
            <Button 
              onClick={handleNext} 
              className="bg-[#adc6ff] hover:bg-[#d8e2ff] text-[#001a41] font-bold"
              disabled={
                (step === 1 && !profile.target_company) ||
                (step === 2 && !profile.target_role) ||
                (step === 3 && !profile.duration_months) ||
                (step === 4 && !profile.current_level)
              }
            >
              Continue
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={!profile.preferred_language || loading}
              className="bg-[#adc6ff] hover:bg-[#d8e2ff] text-[#001a41] font-bold shimmer-effect overflow-hidden relative"
            >
              {loading ? "Generating Roadmap..." : "Generate My Roadmap"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
