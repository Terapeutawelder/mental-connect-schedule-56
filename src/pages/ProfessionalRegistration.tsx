
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import ProfessionalRegistrationForm from "@/components/ProfessionalRegistrationForm";

const ProfessionalRegistration = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    // Capturar código de indicação da URL
    const urlParams = new URLSearchParams(location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
      toast({
        title: "Código de indicação detectado!",
        description: `Você foi indicado com o código: ${refCode}`,
      });
    }
  }, [location, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold gradient-text mb-2">Cadastro de Profissional</h1>
          <p className="text-muted-foreground">Preencha os dados para se tornar um profissional da plataforma</p>
          
          {referralCode && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                ✅ Cadastro via indicação - Código: <span className="font-mono">{referralCode}</span>
              </p>
            </div>
          )}
        </div>

        <ProfessionalRegistrationForm referralCode={referralCode} />
      </div>
    </div>
  );
};

export default ProfessionalRegistration;
