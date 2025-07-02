import { useState, useRef, useEffect } from "react";

interface UseVideoCallProps {
  callStartTime: Date;
  patientName: string;
  professionalName: string;
  onEndCall: () => void;
}

export const useVideoCall = ({ callStartTime, patientName, professionalName, onEndCall }: UseVideoCallProps) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState("00:00");
  const [audioLevel, setAudioLevel] = useState(50);
  const [videoQuality, setVideoQuality] = useState("HD");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
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
        
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.enabled = isVideoOn;
        }
        
        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = isAudioOn;
        }
      } catch (err) {
        console.error("Erro ao acessar mídia:", err);
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
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCallActive(false);
    onEndCall();
  };

  const toggleVideo = () => {
    const newVideoState = !isVideoOn;
    setIsVideoOn(newVideoState);
    
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.stop();
        streamRef.current?.removeTrack(track);
      });
      
      if (newVideoState) {
        // Recriar stream de vídeo quando ligar
        navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } })
          .then(newStream => {
            const newVideoTrack = newStream.getVideoTracks()[0];
            if (newVideoTrack && streamRef.current) {
              streamRef.current.addTrack(newVideoTrack);
              if (localVideoRef.current) {
                localVideoRef.current.srcObject = streamRef.current;
              }
            }
          })
          .catch(err => console.error("Erro ao recriar stream de vídeo:", err));
      } else {
        // Limpar o vídeo local quando desligar
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = null;
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

  return {
    isVideoOn,
    isAudioOn,
    isCallActive,
    callDuration,
    audioLevel,
    setAudioLevel,
    videoQuality,
    setVideoQuality,
    localVideoRef,
    remoteVideoRef,
    streamRef,
    handleStartCall,
    handleEndCall,
    toggleVideo,
    toggleAudio,
    professionalName,
    patientName
  };
};