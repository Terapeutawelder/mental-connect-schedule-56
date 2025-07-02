
import { useState, lazy, Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import SectionSkeleton from "@/components/ui/section-skeleton";

// Lazy load non-critical sections for better performance
const BookingFlow = lazy(() => import("@/components/BookingFlow"));
const OnlineTherapySection = lazy(() => import("@/components/sections/OnlineTherapySection"));
const SearchSection = lazy(() => import("@/components/sections/SearchSection"));
const ProfessionalsSection = lazy(() => import("@/components/sections/ProfessionalsSection"));
const FeaturesSection = lazy(() => import("@/components/sections/FeaturesSection"));
const CTASection = lazy(() => import("@/components/sections/CTASection"));

interface Professional {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  image: string;
  available: boolean;
  description: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  
  // Preload components after initial render for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      import("@/components/sections/OnlineTherapySection");
      import("@/components/sections/SearchSection");
      import("@/components/sections/ProfessionalsSection");
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const [professionals] = useState<Professional[]>([
    {
      id: 1,
      name: "Dra. Ana Paula Silva",
      specialty: "Psicóloga Cognitivo-Comportamental",
      experience: "8 anos de experiência",
      rating: 4.8,
      image: "/images/professional1.jpg",
      available: true,
      description: "Especialista em terapia cognitivo-comportamental com foco em ansiedade e depressão. Possui experiência com ansiedade, relacionamentos familiares, amorosos e de amizade, perda de luto, mudança de Estado, trabalho."
    },
    {
      id: 2,
      name: "Dr. Carlos Roberto Oliveira",
      specialty: "Psicanalista",
      experience: "12 anos de experiência",
      rating: 4.5,
      image: "/images/professional2.jpg",
      available: true,
      description: "Psicanalista com especialização em análise clínica e processos inconscientes. Possui experiência com ansiedade, relacionamentos familiares, amorosos e de amizade, perda de luto, mudança de Estado, trabalho."
    },
    {
      id: 3,
      name: "Dra. Mariana Souza",
      specialty: "Terapeuta Familiar",
      experience: "6 anos de experiência",
      rating: 4.9,
      image: "/images/professional3.jpg",
      available: false,
      description: "Terapeuta familiar e de casal com abordagem sistêmica. Possui experiência com ansiedade, relacionamentos familiares, amorosos e de amizade, perda de luto, mudança de Estado, trabalho."
    },
    {
      id: 4,
      name: "Dr. Rafael Mendes",
      specialty: "Psicólogo Clínico",
      experience: "10 anos de experiência",
      rating: 4.7,
      image: "/images/professional4.jpg",
      available: true,
      description: "Psicólogo clínico especializado em transtornos de humor e ansiedade. Possui experiência com depressão, ansiedade, relacionamentos familiares, amorosos e de amizade, perda de luto, mudança de Estado, trabalho."
    },
  ]);

  const handleBookProfessional = (professional: Professional) => {
    // Redirecionar para a página de agendamento
    navigate(`/agendar-consulta?professional=${professional.id}`);
  };

  const handleBackFromBooking = () => {
    setShowBookingFlow(false);
    setSelectedProfessional(null);
  };

  const handleComoFuncionaClick = () => {
    navigate('/como-funciona');
  };

  const handleScrollToProfessionals = () => {
    document.getElementById('professionals-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCadastroClick = () => {
    navigate('/login');
  };

  const handleIniciarTeleconsulta = () => {
    navigate('/login-paciente');
  };

  if (showBookingFlow && selectedProfessional) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      }>
        <BookingFlow professional={selectedProfessional} onBack={handleBackFromBooking} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <HeroSection 
        onFindProfessionalClick={handleScrollToProfessionals}
        onComoFuncionaClick={handleComoFuncionaClick}
        onIniciarTeleconsultaClick={handleIniciarTeleconsulta}
      />

      <Suspense fallback={<SectionSkeleton height="h-20" />}>
        <OnlineTherapySection onAgendarConsultaClick={handleScrollToProfessionals} />
      </Suspense>

      <Suspense fallback={<SectionSkeleton height="h-32" />}>
        <SearchSection />
      </Suspense>

      <div className="bg-gradient-to-br from-purple-50 to-white">
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <ProfessionalsSection 
            professionals={professionals}
            onBookProfessional={handleBookProfessional}
            onCadastroClick={handleCadastroClick}
          />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-64" />}>
          <FeaturesSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-40" />}>
          <CTASection onAgendarConsultaClick={handleScrollToProfessionals} />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
