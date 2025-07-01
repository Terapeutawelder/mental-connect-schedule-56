
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingFlow from "@/components/BookingFlow";
import HeroSection from "@/components/sections/HeroSection";
import OnlineTherapySection from "@/components/sections/OnlineTherapySection";
import SearchSection from "@/components/sections/SearchSection";
import ProfessionalsSection from "@/components/sections/ProfessionalsSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import CTASection from "@/components/sections/CTASection";

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
    navigate('/video-consulta');
  };

  if (showBookingFlow && selectedProfessional) {
    return <BookingFlow professional={selectedProfessional} onBack={handleBackFromBooking} />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <HeroSection 
        onFindProfessionalClick={handleScrollToProfessionals}
        onComoFuncionaClick={handleComoFuncionaClick}
        onIniciarTeleconsultaClick={handleIniciarTeleconsulta}
      />

      <OnlineTherapySection onAgendarConsultaClick={handleScrollToProfessionals} />

      <SearchSection />

      <div className="bg-gradient-to-br from-purple-50 to-white">
        <ProfessionalsSection 
          professionals={professionals}
          onBookProfessional={handleBookProfessional}
          onCadastroClick={handleCadastroClick}
        />

        <FeaturesSection />

        <CTASection onAgendarConsultaClick={handleScrollToProfessionals} />
      </div>

      <Footer />
    </div>
  );
};

export default Index;
