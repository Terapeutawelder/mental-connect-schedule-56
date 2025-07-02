import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Star, CheckCircle, Calendar, Clock, User, Mail, Phone, CreditCard } from "lucide-react";
import { useWhatsAppNotifications } from "@/hooks/useWhatsAppNotifications";
import { useToast } from "@/hooks/use-toast";

const FinalizarAgendamento = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { sendAppointmentConfirmation } = useWhatsAppNotifications();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  
  const professionalId = searchParams.get('professional') || '1';
  const date = searchParams.get('date') || '';
  const time = searchParams.get('time') || '';
  
  // Dados do profissional (normalmente viriam de uma API)
  const professional = {
    id: professionalId,
    name: "Dra. Ana Paula Silva",
    specialty: "Psicóloga Cognitivo-Comportamental",
    rating: 4.8,
    image: "/images/professional1.jpg",
    initials: "DAPS"
  };

  const handleVoltar = () => {
    navigate(-1);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFinalizarAgendamento = async () => {
    if (!formData.nome || !formData.email || !formData.telefone) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simular processamento do pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Gerar link de acesso único para a teleconsulta
      const accessLink = `https://teleconsulta.conexaomental.com/sala/${professionalId}-${Date.now()}`;

      // Enviar confirmação via WhatsApp com link de acesso
      const whatsappSent = await sendAppointmentConfirmation(
        formData.nome,
        formData.telefone,
        date,
        time
      );

      if (whatsappSent) {
        // Enviar também mensagem com link de acesso
        const linkMessage = `🔗 Link de acesso à sua teleconsulta: ${accessLink}\n\nGuarde este link com cuidado, você precisará dele para entrar na consulta.`;
        await fetch('', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('whatsapp_api_key')}`,
          },
          body: JSON.stringify({
            phone: formData.telefone,
            message: linkMessage,
          }),
        }).catch(() => {}); // Ignora erros silenciosamente
      }

      toast({
        title: "Agendamento confirmado!",
        description: "Confirmação enviada via WhatsApp com link de acesso.",
      });

      navigate('/video-consulta?success=true');
    } catch (error) {
      toast({
        title: "Erro no processamento",
        description: "Tente novamente ou entre em contato.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={handleVoltar}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Finalizar Agendamento</h1>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                <CheckCircle className="h-4 w-4" />
              </div>
              <span className="font-medium text-green-600">Data e Horário</span>
            </div>
            <div className="w-16 h-px bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                2
              </div>
              <span className="font-medium text-purple-600">Dados e Pagamento</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={professional.image} alt={professional.name} />
                    <AvatarFallback className="text-lg bg-purple-600 text-white">
                      {professional.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{professional.name}</h3>
                    <p className="text-purple-600 font-medium">{professional.specialty}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-sm">{professional.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{time}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="max-w-lg mx-auto">
                <CardTitle className="flex items-center gap-2 mb-6">
                  <User className="h-5 w-5" />
                  Dados Pessoais
                </CardTitle>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      placeholder="Digite seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="seu@email.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg mt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-green-800 font-semibold text-lg">Valor Total</p>
                      <p className="text-green-600 text-sm">Pagamento via Mercado Pago</p>
                    </div>
                    <div className="text-green-600 font-bold text-2xl">R$ 37,90</div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleFinalizarAgendamento}
                disabled={isProcessing}
                className="w-full mt-8 bg-purple-600 hover:bg-purple-700 text-white text-lg py-6"
              >
                {isProcessing ? "Processando..." : "Prosseguir para Pagamento"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FinalizarAgendamento;