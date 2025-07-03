
import { Button } from "@/components/ui/button";
import { Calendar, Menu, X, UserPlus, Video } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo-transparent.png";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Simular estado de autenticação - em uma aplicação real, isso viria de um contexto/hook de auth
  const isLoggedIn = false; // Para simular usuário não logado

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleComoFuncionaClick = () => {
    navigate('/como-funciona');
    setIsMenuOpen(false);
  };

  const handleScheduleClick = () => {
    scrollToSection('professionals-section');
  };

  const handleIniciarConsultaClick = () => {
    navigate('/video-consulta');
    setIsMenuOpen(false);
  };

  const handleSobreNosClick = () => {
    navigate('/sobre-nos');
    setIsMenuOpen(false);
  };

  const handleContatoClick = () => {
    navigate('/contato');
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate('/auth');
    setIsMenuOpen(false);
  };

  const handleProfissionaisClick = () => {
    navigate('/auth');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img src={logo} alt="Clínica Conexão Mental" className="w-12 h-12" />
            <span className="font-bold text-xl gradient-text">Clínica Conexão Mental</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={handleSobreNosClick}
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              Sobre Nós
            </button>
            <button 
              onClick={handleContatoClick}
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              Contato
            </button>
            <button 
              onClick={handleProfissionaisClick}
              className="text-purple-600 hover:text-purple-700 transition-colors font-medium flex items-center"
            >
              <UserPlus className="mr-1 h-4 w-4" />
              Profissionais
            </button>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" onClick={handleLoginClick} className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-medium">
              Entrar
            </Button>
            <Button onClick={handleIniciarConsultaClick} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
              <Video className="mr-1 h-4 w-4" />
              Iniciar Consulta
            </Button>
            <Button onClick={handleScheduleClick} className="bg-purple-600 hover:bg-purple-700 text-white shadow-md">
              <Calendar className="mr-1 h-4 w-4" />
              Agendar
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-4">
              <button 
                onClick={handleSobreNosClick}
                className="text-gray-700 hover:text-purple-600 transition-colors text-left font-medium"
              >
                Sobre Nós
              </button>
              <button 
                onClick={handleContatoClick}
                className="text-gray-700 hover:text-purple-600 transition-colors text-left font-medium"
              >
                Contato
              </button>
              <button 
                onClick={handleProfissionaisClick}
                className="text-purple-600 hover:text-purple-700 transition-colors text-left font-medium flex items-center"
              >
                <UserPlus className="mr-1 h-4 w-4" />
                Profissionais
              </button>
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Button variant="ghost" className="justify-start text-purple-600 hover:text-purple-700 hover:bg-purple-50" onClick={handleLoginClick}>
                  Entrar
                </Button>
                <Button 
                  className="justify-start bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={handleIniciarConsultaClick}
                >
                  <Video className="mr-1 h-4 w-4" />
                  Iniciar Consulta
                </Button>
                <Button 
                  className="justify-start bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={handleScheduleClick}
                >
                  <Calendar className="mr-1 h-4 w-4" />
                  Agendar
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
