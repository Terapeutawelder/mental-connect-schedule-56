import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Eye, X, CheckCircle, AlertCircle, Edit, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Appointment {
  id: number;
  patient: string;
  professional: string;
  date: string;
  time: string;
  type: 'online' | 'presencial';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  price: number;
  notes?: string;
}

const AdminAppointments = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      patient: "Maria Silva Santos",
      professional: "Dra. Ana Paula Silva",
      date: "2024-06-30",
      time: "14:00",
      type: 'online',
      status: 'scheduled',
      price: 150,
      notes: "Primeira consulta"
    },
    {
      id: 2,
      patient: "João Carlos Oliveira",
      professional: "Dr. Carlos Roberto",
      date: "2024-06-30",
      time: "15:30",
      type: 'online',
      status: 'completed',
      price: 180,
      notes: "Consulta de retorno"
    },
    {
      id: 3,
      patient: "Ana Beatriz Costa",
      professional: "Dra. Mariana Souza",
      date: "2024-06-29",
      time: "10:00",
      type: 'presencial',
      status: 'cancelled',
      price: 160,
      notes: "Cancelado pelo paciente"
    },
    {
      id: 4,
      patient: "Pedro Henrique Lima",
      professional: "Dra. Ana Paula Silva",
      date: "2024-06-28",
      time: "16:00",
      type: 'online',
      status: 'no-show',
      price: 150,
      notes: "Paciente não compareceu"
    },
    {
      id: 5,
      patient: "Carla Fernandes",
      professional: "Dr. Carlos Roberto",
      date: "2024-06-30",
      time: "09:00",
      type: 'online',
      status: 'scheduled',
      price: 180
    }
  ]);

  const handleCancelAppointment = (appointmentId: number) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: 'cancelled' as const }
          : appointment
      )
    );
    toast({
      title: "Consulta cancelada",
      description: "A consulta foi cancelada e os envolvidos foram notificados.",
      variant: "destructive",
    });
  };

  const handleCompleteAppointment = (appointmentId: number) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: 'completed' as const }
          : appointment
      )
    );
    toast({
      title: "Consulta concluída",
      description: "A consulta foi marcada como concluída.",
    });
  };

  const handleMarkNoShow = (appointmentId: number) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: 'no-show' as const }
          : appointment
      )
    );
    toast({
      title: "Falta registrada",
      description: "A consulta foi marcada como falta do paciente.",
      variant: "destructive",
    });
  };

  const handleDeleteAppointment = (appointmentId: number) => {
    setAppointments(prev => prev.filter(appointment => appointment.id !== appointmentId));
    toast({
      title: "Consulta excluída",
      description: "A consulta foi removida permanentemente do sistema.",
      variant: "destructive",
    });
  };

  const handleEditAppointment = (appointmentId: number) => {
    toast({
      title: "Editar consulta",
      description: "Funcionalidade de edição será implementada em breve.",
    });
  };

  const handleViewAppointment = (appointmentId: number) => {
    toast({
      title: "Visualizar consulta",
      description: "Funcionalidade de visualização será implementada em breve.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Agendada</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Concluída</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>;
      case 'no-show':
        return <Badge className="bg-orange-100 text-orange-800">Faltou</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'online':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">Online</Badge>;
      case 'presencial':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700">Presencial</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.professional.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.date.includes(searchTerm)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Gestão de Consultas
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar consultas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Profissional</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="font-medium">{appointment.patient}</TableCell>
                <TableCell>{appointment.professional}</TableCell>
                <TableCell>
                  {new Date(appointment.date).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{getTypeBadge(appointment.type)}</TableCell>
                <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                <TableCell>R$ {appointment.price}</TableCell>
                <TableCell className="max-w-32 truncate">
                  {appointment.notes || '-'}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handleViewAppointment(appointment.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditAppointment(appointment.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    {appointment.status === 'scheduled' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCompleteAppointment(appointment.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkNoShow(appointment.id)}
                          className="text-orange-600 hover:text-orange-700"
                        >
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancelar consulta?</AlertDialogTitle>
                              <AlertDialogDescription>
                                A consulta será cancelada e os envolvidos serão notificados.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Não cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleCancelAppointment(appointment.id)}>
                                Cancelar consulta
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir consulta?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. A consulta será permanentemente removida do sistema.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteAppointment(appointment.id)}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminAppointments;
