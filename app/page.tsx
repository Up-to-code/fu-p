import { LandingNavbar } from "@/components/marketing/navbar";
import { HeroSection } from "@/components/marketing/hero";
import { FeaturesSection } from "@/components/marketing/features";
import { HowItWorksSection } from "@/components/marketing/how-it-works";
import { StatsSection } from "@/components/marketing/stats";
import { TestimonialsSection } from "@/components/marketing/testimonials";
import { FAQSection } from "@/components/marketing/faq";
import { CTASection } from "@/components/marketing/cta";
import { LandingFooter } from "@/components/marketing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
