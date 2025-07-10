import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

const ServerStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  const checkServerStatus = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('https://conexaomental.online/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      setIsOnline(response.ok);
      setLastCheck(new Date());
    } catch (error) {
      console.error('Server status check failed:', error);
      setIsOnline(false);
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (isOnline === null) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
        Verificando...
      </Badge>
    );
  }

  return (
    <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-1">
      {isOnline ? (
        <>
          <Wifi className="w-3 h-3" />
          Online
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3" />
          Offline
        </>
      )}
    </Badge>
  );
};

export default ServerStatus;