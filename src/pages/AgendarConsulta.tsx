import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Clock } from "lucide-react";

const AgendarConsulta = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const professionalId = searchParams.get('professional') || '1';
  
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
    navigate('/');
  };

  const handleConfirmarAgendamento = () => {
    if (selectedDate) {
      // Aqui você pode processar o agendamento
      // Por enquanto, vamos redirecionar para a página de teleconsulta
      const dateStr = selectedDate.toLocaleDateString('pt-BR');
      navigate(`/video-consulta?professional=${encodeURIComponent(professional.name)}&date=${dateStr}&time=14:00`);
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
          <h1 className="text-2xl font-bold text-gray-900">Agendar Consulta</h1>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                1
              </div>
              <span className="font-medium text-purple-600">Data e Horário</span>
            </div>
            <div className="w-16 h-px bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                2
              </div>
              <span className="text-gray-500">Dados e Pagamento</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
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
              </CardHeader>
            </Card>

            <Card className="mt-6">
              <CardContent className="p-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-green-800 font-semibold text-lg">Valor da Consulta</p>
                      <p className="text-green-600 text-sm">Pagamento facilitado</p>
                    </div>
                    <div className="text-green-600 font-bold text-2xl">R$ 37,90</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Agendar Consulta
                </CardTitle>
                <p className="text-gray-600">Escolha a data e horário ideal para sua consulta</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Selecione a Data</h3>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleConfirmarAgendamento}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={!selectedDate}
                  >
                    Confirmar Agendamento
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendarConsulta;