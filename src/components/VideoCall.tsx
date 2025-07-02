
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone,
  PhoneOff,
  MessageSquare,
  Settings,
  Monitor,
  Circle,
  Square
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
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(50);
  const [videoQuality, setVideoQuality] = useState("HD");
  const [showSettings, setShowSettings] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 1280, height: 720 }, 
          audio: { echoCancellation: true, noiseSuppression: true } 
        });
        
        streamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        // Configurar track de vídeo
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.enabled = isVideoOn;
        }
        
        // Configurar track de áudio
        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = isAudioOn;
        }
      } catch (err) {
        console.error("Erro ao acessar mídia:", err);
        // Tentar apenas áudio se vídeo falhar
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamRef.current = audioStream;
        } catch (audioErr) {
          console.error("Erro ao acessar áudio:", audioErr);
        }
      }
    };
    
    initMedia();
  }, []);

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
    if (isRecording) {
      stopRecording();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCallActive(false);
    onEndCall();
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
        
        if (localVideoRef.current) {
          if (!isVideoOn) {
            localVideoRef.current.srcObject = streamRef.current;
          } else {
            localVideoRef.current.srcObject = null;
          }
        }
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
        setIsAudioOn(!isAudioOn);
      }
    }
  };

  const startRecording = () => {
    if (streamRef.current && !isRecording) {
      recordedChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(streamRef.current);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        saveRecording(blob);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const saveRecording = (blob: Blob) => {
    const recording = {
      id: Date.now().toString(),
      patient: patientName,
      professional: professionalName,
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR'),
      duration: callDuration,
      size: blob.size,
      blob: blob
    };
    
    // Salvar no localStorage apenas para o profissional
    const professionalRecordings = JSON.parse(localStorage.getItem(`professional_recordings_${professionalName}`) || '[]');
    professionalRecordings.push({
      ...recording,
      blobUrl: URL.createObjectURL(blob)
    });
    localStorage.setItem(`professional_recordings_${professionalName}`, JSON.stringify(professionalRecordings));
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
          {isRecording && (
            <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
              <Circle className="h-3 w-3 fill-current animate-pulse" />
              <span className="text-sm font-medium">Gravando</span>
            </div>
          )}
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
                <Settings className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Configurações da Chamada</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="videoQuality">Qualidade do Vídeo</Label>
                  <Select value={videoQuality} onValueChange={setVideoQuality}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SD">SD (480p)</SelectItem>
                      <SelectItem value="HD">HD (720p)</SelectItem>
                      <SelectItem value="FHD">Full HD (1080p)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="audioLevel">Volume do Áudio: {audioLevel}%</Label>
                  <Slider
                    value={[audioLevel]}
                    onValueChange={(value) => setAudioLevel(value[0])}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoRecord">Gravação Automática</Label>
                  <Switch id="autoRecord" />
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
            onClick={toggleAudio}
            className="rounded-full w-12 h-12"
          >
            {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          
          <Button
            variant={isVideoOn ? "default" : "destructive"}
            size="icon"
            onClick={toggleVideo}
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
            variant={isRecording ? "destructive" : "default"}
            size="icon"
            onClick={isRecording ? stopRecording : startRecording}
            className="rounded-full w-12 h-12"
          >
            {isRecording ? <Square className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
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
