"use client";

import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import BentoGrid from "@/components/landing/BentoGrid";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="bg-deep-forest min-h-screen text-mint-cream selection:bg-verdant-lime selection:text-deep-forest font-sans">
      <Navbar />
      <Hero />
      <BentoGrid />
      <Footer />
    </div>
  );
}
