// src/app/page.tsx
"use client";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import Winners from "@/components/Winners";

export default function Home() {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
      <div className="relative w-full flex items-center justify-center ">
        <Navbar />
      </div>
      <HeroSection />
      <Winners />
      <Footer />
    </main>
  );
}
