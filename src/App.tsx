
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import ProfessionalRegistration from "./pages/ProfessionalRegistration";
import Auth from "./pages/Auth";
import ProfessionalAgenda from "./pages/ProfessionalAgenda";
import AdminDashboard from "./pages/AdminDashboard";
import ComoFunciona from "./pages/ComoFunciona";
import SobreNos from "./pages/SobreNos";
import Contrato from "./pages/Contrato";
import TermosDeUso from "./pages/TermosDeUso";
import PoliticaDePrivacidade from "./pages/PoliticaDePrivacidade";
import Contato from "./pages/Contato";
import Afiliados from "./pages/Afiliados";
import VideoConsultation from "./pages/VideoConsultation";
import AgendarConsulta from "./pages/AgendarConsulta";
import FinalizarAgendamento from "./pages/FinalizarAgendamento";
import ConfirmacaoAgendamento from "./pages/ConfirmacaoAgendamento";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cadastro-profissional" element={<ProfessionalRegistration />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/agenda-profissional" element={
            <ProtectedRoute requiredRole="professional">
              <ProfessionalAgenda />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/como-funciona" element={<ComoFunciona />} />
          <Route path="/sobre-nos" element={<SobreNos />} />
          <Route path="/contrato" element={<Contrato />} />
          <Route path="/termos-de-uso" element={<TermosDeUso />} />
          <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/afiliados" element={<Afiliados />} />
          <Route path="/agendar-consulta" element={<AgendarConsulta />} />
          <Route path="/finalizar-agendamento" element={<FinalizarAgendamento />} />
          <Route path="/confirmacao-agendamento" element={<ConfirmacaoAgendamento />} />
          <Route path="/video-consulta" element={<VideoConsultation />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
