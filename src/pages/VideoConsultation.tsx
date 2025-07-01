
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import VideoCall from "@/components/VideoCall";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Video } from "lucide-react";

const VideoConsultation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isInCall, setIsInCall] = useState(false);
  
  const professionalName = searchParams.get('professional') || 'Dr. Ana Paula Silva';
  const appointmentTime = searchParams.get('time') || '14:00';
  const appointmentDate = searchParams.get('date') || 'Hoje';

  const handleStartCall = () => {
    setIsInCall(true);
  };

  const handleEndCall = () => {
    setIsInCall(false);
    navigate('/');
  };

  if (isInCall) {
    return (
      <VideoCall
        professionalName={professionalName}
        patientName="Paciente"
        onEndCall={handleEndCall}
        callStartTime={new Date()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Teleconsulta</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <User className="h-4 w-4" />
              <span>{professionalName}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{appointmentDate}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{appointmentTime}</span>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Instruções para a consulta:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Certifique-se de estar em um local silencioso</li>
              <li>• Verifique sua conexão com a internet</li>
              <li>• Teste sua câmera e microfone</li>
              <li>• Tenha seus documentos em mãos</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleStartCall} 
              className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
            >
              <Video className="mr-2 h-5 w-5" />
              Entrar na Consulta
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Voltar ao Início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoConsultation;
