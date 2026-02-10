import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import RecentCases from "@/components/RecentCases";
import IntegrationSection from "@/components/IntegrationSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main>
      <HeroSection />
      <HowItWorks />
      <RecentCases />
      <IntegrationSection />
    </main>
    <Footer />
  </div>
);

export default Index;
