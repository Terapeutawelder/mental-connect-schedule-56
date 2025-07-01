
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Check, X, Edit, Trash, Eye, UserPlus, UserMinus } from "lucide-react";
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

interface Professional {
  id: number;
  name: string;
  email: string;
  specialty: string;
  crp: string;
  status: 'pending' | 'approved' | 'suspended' | 'inactive';
  registrationDate: string;
  totalAppointments: number;
  rating: number;
}

const AdminProfessionals = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [professionals, setProfessionals] = useState<Professional[]>([
    {
      id: 1,
      name: "Dra. Ana Paula Silva",
      email: "ana.silva@email.com",
      specialty: "Psicóloga Cognitivo-Comportamental",
      crp: "CRP 06/123456",
      status: 'approved',
      registrationDate: "2024-01-15",
      totalAppointments: 245,
      rating: 4.8
    },
    {
      id: 2,
      name: "Dr. Carlos Roberto Oliveira",
      email: "carlos.oliveira@email.com",
      specialty: "Psiquiatra",
      crp: "CRM 123456",
      status: 'approved',
      registrationDate: "2024-02-20",
      totalAppointments: 189,
      rating: 4.5
    },
    {
      id: 3,
      name: "Dra. Mariana Souza",
      email: "mariana.souza@email.com",
      specialty: "Terapeuta Familiar",
      crp: "CRP 06/789012",
      status: 'pending',
      registrationDate: "2024-06-25",
      totalAppointments: 0,
      rating: 0
    },
    {
      id: 4,
      name: "Dr. João Santos",
      email: "joao.santos@email.com",
      specialty: "Psicólogo Clínico",
      crp: "CRP 06/345678",
      status: 'suspended',
      registrationDate: "2024-03-10",
      totalAppointments: 67,
      rating: 3.2
    }
  ]);

  const handleApprove = (professionalId: number) => {
    setProfessionals(prev => 
      prev.map(prof => 
        prof.id === professionalId 
          ? { ...prof, status: 'approved' as const }
          : prof
      )
    );
    toast({
      title: "Profissional aprovado!",
      description: "O profissional foi aprovado e pode começar a atender pacientes.",
    });
  };

  const handleReject = (professionalId: number) => {
    setProfessionals(prev => prev.filter(prof => prof.id !== professionalId));
    toast({
      title: "Profissional rejeitado",
      description: "O profissional foi rejeitado e removido do sistema.",
      variant: "destructive",
    });
  };

  const handleSuspend = (professionalId: number) => {
    setProfessionals(prev => 
      prev.map(prof => 
        prof.id === professionalId 
          ? { ...prof, status: 'suspended' as const }
          : prof
      )
    );
    toast({
      title: "Profissional suspenso",
      description: "O profissional foi suspenso temporariamente.",
      variant: "destructive",
    });
  };

  const handleActivate = (professionalId: number) => {
    setProfessionals(prev => 
      prev.map(prof => 
        prof.id === professionalId 
          ? { ...prof, status: 'approved' as const }
          : prof
      )
    );
    toast({
      title: "Profissional ativado",
      description: "O profissional foi ativado com sucesso.",
    });
  };

  const handleDeactivate = (professionalId: number) => {
    setProfessionals(prev => 
      prev.map(prof => 
        prof.id === professionalId 
          ? { ...prof, status: 'inactive' as const }
          : prof
      )
    );
    toast({
      title: "Profissional desativado",
      description: "O profissional foi desativado.",
      variant: "destructive",
    });
  };

  const handleDelete = (professionalId: number) => {
    setProfessionals(prev => prev.filter(prof => prof.id !== professionalId));
    toast({
      title: "Profissional excluído",
      description: "O profissional foi removido permanentemente do sistema.",
      variant: "destructive",
    });
  };

  const handleEdit = (professionalId: number) => {
    toast({
      title: "Editar profissional",
      description: "Funcionalidade de edição será implementada em breve.",
    });
  };

  const handleView = (professionalId: number) => {
    toast({
      title: "Visualizar profissional",
      description: "Funcionalidade de visualização será implementada em breve.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspenso</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const filteredProfessionals = professionals.filter(prof =>
    prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Gestão de Profissionais
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar profissionais..."
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
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Especialidade</TableHead>
              <TableHead>Registro</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Consultas</TableHead>
              <TableHead>Avaliação</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProfessionals.map((professional) => (
              <TableRow key={professional.id}>
                <TableCell className="font-medium">{professional.name}</TableCell>
                <TableCell>{professional.email}</TableCell>
                <TableCell>{professional.specialty}</TableCell>
                <TableCell>{professional.crp}</TableCell>
                <TableCell>{getStatusBadge(professional.status)}</TableCell>
                <TableCell>{professional.totalAppointments}</TableCell>
                <TableCell>
                  {professional.rating > 0 ? professional.rating.toFixed(1) : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handleView(professional.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(professional.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    {professional.status === 'pending' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApprove(professional.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
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
                              <AlertDialogTitle>Rejeitar profissional?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. O profissional será removido do sistema.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleReject(professional.id)}>
                                Rejeitar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}

                    {professional.status === 'approved' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeactivate(professional.id)}
                          className="text-orange-600 hover:text-orange-700"
                        >
                          <UserMinus className="h-4 w-4" />
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
                              <AlertDialogTitle>Suspender profissional?</AlertDialogTitle>
                              <AlertDialogDescription>
                                O profissional será suspenso temporariamente e não poderá atender pacientes.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleSuspend(professional.id)}>
                                Suspender
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}

                    {(professional.status === 'suspended' || professional.status === 'inactive') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleActivate(professional.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
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
                          <AlertDialogTitle>Excluir profissional?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Todos os dados do profissional serão permanentemente removidos.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(professional.id)}>
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

export default AdminProfessionals;
