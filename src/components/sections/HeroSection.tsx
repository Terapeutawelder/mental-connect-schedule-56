
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface HeroSectionProps {
  onFindProfessionalClick: () => void;
  onComoFuncionaClick: () => void;
  onIniciarTeleconsultaClick?: () => void;
}

const HeroSection = ({ onFindProfessionalClick, onComoFuncionaClick, onIniciarTeleconsultaClick }: HeroSectionProps) => {
  return (
    <section className="purple-bg py-20 overflow-hidden text-white">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Cuidando da sua saúde mental com carinho e profissionalismo
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 mb-8">
            Conectamos você aos melhores profissionais de saúde mental, oferecendo apoio personalizado e acessível quando você mais precisa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 bg-white text-purple-600 hover:bg-purple-50" onClick={onFindProfessionalClick}>
              Encontrar Profissional
            </Button>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-purple-600 border-2 border-white text-white hover:bg-white hover:text-purple-600 transition-colors" 
              onClick={onIniciarTeleconsultaClick}
            >
              Iniciar Teleconsulta
            </Button>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-purple-600 border-2 border-white text-white hover:bg-white hover:text-purple-600 transition-colors" 
              onClick={onComoFuncionaClick}
            >
              <Play className="mr-2 h-5 w-5" />
              Como Funciona
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
