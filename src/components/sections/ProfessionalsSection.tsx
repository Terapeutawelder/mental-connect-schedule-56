
import ProfessionalCard from "@/components/ProfessionalCard";

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

interface ProfessionalsSectionProps {
  professionals: Professional[];
  onBookProfessional: (professional: Professional) => void;
  onCadastroClick: () => void;
}

const ProfessionalsSection = ({ professionals, onBookProfessional, onCadastroClick }: ProfessionalsSectionProps) => {
  return (
    <section id="professionals-section" className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <p className="text-lg text-gray-600 mb-4">
          Encontramos <strong>197 especialistas</strong> em
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Nossos Profissionais</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {professionals.map((professional) => (
          <ProfessionalCard 
            key={professional.id} 
            professional={professional} 
            onBook={() => onBookProfessional(professional)} 
          />
        ))}
      </div>
    </section>
  );
};

export default ProfessionalsSection;
