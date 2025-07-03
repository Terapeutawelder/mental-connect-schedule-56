
import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Share2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import AgendaSummary from "@/components/AgendaSummary";
import AppointmentsSection from "@/components/AppointmentsSection";
import { getAppointmentsByProfessional } from "@/utils/appointmentStorage";

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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  // Carregar agendamentos do localStorage
  useEffect(() => {
    const professionalId = "1"; // ID do profissional logado
    const storedAppointments = getAppointmentsByProfessional(professionalId);
    
    // Converter para o formato esperado pelo componente
    const formattedAppointments = storedAppointments.map((apt, index) => ({
      id: parseInt(apt.id) || index + 1,
      patientName: apt.patientName,
      patientPhone: apt.patientPhone,
      patientEmail: apt.patientEmail,
      date: apt.date,
      time: apt.time,
      status: apt.status,
      type: apt.type
    }));
    
    setAppointments(formattedAppointments);
  }, []);

  const handleLogout = () => {
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
    navigate("/login");
  };

  const today = new Date().toLocaleDateString('pt-BR');
  const todayAppointments = appointments.filter(apt => apt.date === today);
  const upcomingAppointments = appointments.filter(apt => new Date(apt.date.split('/').reverse().join('-')) > new Date());

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Clínica Conexão Mental" className="w-12 h-12" />
              <span className="font-bold text-xl gradient-text">Clínica Conexão Mental</span>
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
