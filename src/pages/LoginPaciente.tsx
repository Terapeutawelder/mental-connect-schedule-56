import { useState } from "react";
import logo from "@/assets/logo-transparent.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LogIn, User, KeyRound, UserPlus } from "lucide-react";

const LoginPaciente = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Patient login:", { email, password });
    
    // Simular autenticação do paciente
    if (email && password) {
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo, paciente. Redirecionando para a teleconsulta...",
      });
      // Redirecionar para a teleconsulta
      navigate("/video-consulta");
    } else {
      toast({
        title: "Erro no login",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Forgot password for:", forgotPasswordEmail);
    
    if (forgotPasswordEmail) {
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      setForgotPasswordEmail("");
      setShowForgotPassword(false);
    } else {
      toast({
        title: "Erro",
        description: "Por favor, insira seu email.",
        variant: "destructive",
      });
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-center mb-4">
              <img src={logo} alt="Clínica Conexão Mental" className="w-20 h-20 mx-auto mb-2" />
              <h1 className="text-3xl font-bold gradient-text">Clínica Conexão Mental</h1>
            </div>
            <p className="text-muted-foreground text-center">Recuperar senha</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <KeyRound className="h-5 w-5" />
                Esqueceu a senha?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <KeyRound className="mr-2 h-4 w-4" />
                  Enviar link de recuperação
                </Button>
              </form>

              <div className="mt-6 text-center space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-sm"
                >
                  Voltar ao login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-center mb-4">
            <img src={logo} alt="Clínica Conexão Mental" className="w-20 h-20 mx-auto mb-2" />
            <h1 className="text-3xl font-bold gradient-text">Clínica Conexão Mental</h1>
          </div>
          <p className="text-muted-foreground text-center">Acesse sua teleconsulta</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <User className="h-5 w-5" />
              Login do Paciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                <LogIn className="mr-2 h-4 w-4" />
                Entrar na Teleconsulta
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/cadastro-paciente")}
                  className="flex-1"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Cadastre-se
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowForgotPassword(true)}
                  className="flex-1"
                >
                  <KeyRound className="mr-2 h-4 w-4" />
                  Esqueceu a senha?
                </Button>
              </div>
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="w-full text-sm"
              >
                Voltar ao início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPaciente;