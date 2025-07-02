import { Button } from "@/components/ui/button";
import { Phone, VideoOff } from "lucide-react";

interface VideoCallStreamProps {
  isCallActive: boolean;
  isVideoOn: boolean;
  professionalName: string;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  handleStartCall: () => void;
}

export const VideoCallStream = ({
  isCallActive,
  isVideoOn,
  professionalName,
  localVideoRef,
  remoteVideoRef,
  handleStartCall
}: VideoCallStreamProps) => {
  return (
    <div className="flex-1 relative bg-gray-900">
      <div className="w-full h-full relative">
        {isCallActive ? (
          <div className="w-full h-full bg-black">
            {/* Tela preta limpa durante a consulta */}
          </div>
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
    </div>
  );
};