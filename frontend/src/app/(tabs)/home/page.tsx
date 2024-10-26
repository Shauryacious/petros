import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Winners from "@/components/Winners";

export default function Home() {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
      <HeroSection />
      <Winners />
      <Footer />
    </main>
  );
}
