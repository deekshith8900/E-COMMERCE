import { Navbar } from "@/components/landing/Navbar";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <Footer />
    </main>
  );
}
