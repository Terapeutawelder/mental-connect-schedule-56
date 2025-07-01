
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone,
  PhoneOff,
  MessageSquare,
  Settings,
  Monitor
} from "lucide-react";

interface VideoCallProps {
  patientName?: string;
  professionalName?: string;
  onEndCall: () => void;
  callStartTime?: Date;
}

const VideoCall = ({ 
  patientName = "Paciente", 
  professionalName = "Dr. Ana Paula Silva",
  onEndCall,
  callStartTime = new Date()
}: VideoCallProps) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [callDuration, setCallDuration] = useState("00:00");
  const [messages, setMessages] = useState<Array<{id: number, sender: string, text: string, time: string}>>([]);
  const [newMessage, setNewMessage] = useState("");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && isVideoOn) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.log("Erro ao acessar câmera:", err));
    }
  }, [isVideoOn]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - callStartTime.getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setCallDuration(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [callStartTime]);

  const handleStartCall = () => {
    setIsCallActive(true);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    onEndCall();
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "Você",
        text: newMessage,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Teleconsulta</h2>
          <p className="text-sm text-gray-300">
            {professionalName} • {callDuration}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 relative bg-gray-900">
        <div className="w-full h-full relative">
          {isCallActive ? (
            <video
              ref={remoteVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              poster="/placeholder.svg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">
                    {professionalName.split(' ')[0][0]}{professionalName.split(' ')[1]?.[0]}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{professionalName}</h3>
                <p className="text-gray-300 mb-4">Aguardando conexão...</p>
                <Button onClick={handleStartCall} className="bg-green-600 hover:bg-green-700">
                  <Phone className="mr-2 h-4 w-4" />
                  Iniciar Chamada
                </Button>
              </div>
            </div>
          )}

          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
            {isVideoOn ? (
              <video
                ref={localVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <VideoOff className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {showChat && (
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-lg">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Chat da Consulta</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="text-sm">
                    <div className="font-medium text-purple-600">{message.sender}</div>
                    <div className="text-gray-700">{message.text}</div>
                    <div className="text-xs text-gray-400">{message.time}</div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  />
                  <Button onClick={handleSendMessage} size="sm">
                    Enviar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-900 p-4">
        <div className="flex justify-center space-x-4">
          <Button
            variant={isAudioOn ? "default" : "destructive"}
            size="icon"
            onClick={() => setIsAudioOn(!isAudioOn)}
            className="rounded-full w-12 h-12"
          >
            {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          
          <Button
            variant={isVideoOn ? "default" : "destructive"}
            size="icon"
            onClick={() => setIsVideoOn(!isVideoOn)}
            className="rounded-full w-12 h-12"
          >
            {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowChat(!showChat)}
            className="rounded-full w-12 h-12 text-white hover:bg-gray-700"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-12 h-12 text-white hover:bg-gray-700"
          >
            <Monitor className="h-5 w-5" />
          </Button>

          <Button
            variant="destructive"
            size="icon"
            onClick={handleEndCall}
            className="rounded-full w-12 h-12"
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
