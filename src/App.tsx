
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProfessionalRegistration from "./pages/ProfessionalRegistration";
import Login from "./pages/Login";
import LoginPaciente from "./pages/LoginPaciente";
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
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cadastro-profissional" element={<ProfessionalRegistration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-paciente" element={<LoginPaciente />} />
          <Route path="/agenda-profissional" element={<ProfessionalAgenda />} />
          <Route path="/admin" element={<AdminDashboard />} />
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
  </QueryClientProvider>
);

export default App;
