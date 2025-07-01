
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ReferralSection from "@/components/ReferralSection";
import AgendaSummary from "@/components/AgendaSummary";
import AppointmentsSection from "@/components/AppointmentsSection";

interface Appointment {
  id: number;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  date: string;
  time: string;
  status: "agendado" | "confirmado" | "realizado" | "cancelado";
  type: "consulta" | "retorno";
}

const ProfessionalAgenda = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Dados mock para demonstração
  const [appointments] = useState<Appointment[]>([
    {
      id: 1,
      patientName: "Maria Silva",
      patientPhone: "(11) 99999-9999",
      patientEmail: "maria@email.com",
      date: "2024-01-15",
      time: "09:00",
      status: "agendado",
      type: "consulta"
    },
    {
      id: 2,
      patientName: "João Santos",
      patientPhone: "(11) 88888-8888",
      patientEmail: "joao@email.com",
      date: "2024-01-15",
      time: "10:30",
      status: "confirmado",
      type: "retorno"
    },
    {
      id: 3,
      patientName: "Ana Costa",
      patientPhone: "(11) 77777-7777",
      patientEmail: "ana@email.com",
      date: "2024-01-15",
      time: "14:00",
      status: "agendado",
      type: "consulta"
    },
    {
      id: 4,
      patientName: "Pedro Lima",
      patientPhone: "(11) 66666-6666",
      patientEmail: "pedro@email.com",
      date: "2024-01-16",
      time: "09:30",
      status: "agendado",
      type: "consulta"
    }
  ]);

  const handleLogout = () => {
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
    navigate("/login");
  };

  const todayAppointments = appointments.filter(apt => apt.date === "2024-01-15");
  const upcomingAppointments = appointments.filter(apt => apt.date > "2024-01-15");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CM</span>
              </div>
              <span className="font-bold text-xl gradient-text">Conexão Mental</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/afiliados')}>
                <Share2 className="mr-2 h-4 w-4" />
                Programa de Afiliados
              </Button>
              <span className="text-sm text-muted-foreground">Dr. João Silva</span>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Minha Agenda</h1>
          <p className="text-muted-foreground">Gerencie seus agendamentos e consultas</p>
        </div>

        {/* Seção de Indicação */}
        <ReferralSection />

        {/* Resumo da Agenda */}
        <AgendaSummary 
          appointments={appointments}
          todayAppointments={todayAppointments}
          upcomingAppointments={upcomingAppointments}
        />

        {/* Seções de Agendamentos */}
        <AppointmentsSection 
          todayAppointments={todayAppointments}
          upcomingAppointments={upcomingAppointments}
        />
      </div>
    </div>
  );
};

export default ProfessionalAgenda;
