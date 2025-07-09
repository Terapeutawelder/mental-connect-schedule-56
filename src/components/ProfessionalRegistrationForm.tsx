
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import PersonalDataForm from "@/components/ProfessionalForm/PersonalDataForm";
import ProfessionalDataForm from "@/components/ProfessionalForm/ProfessionalDataForm";
import AddressForm from "@/components/ProfessionalForm/AddressForm";
import ScheduleForm from "@/components/ProfessionalForm/ScheduleForm";
import TermsAcceptance from "@/components/ProfessionalForm/TermsAcceptance";
import { useFormValidation } from "@/utils/formValidation";

interface ProfessionalRegistrationFormProps {
  referralCode: string | null;
}

const ProfessionalRegistrationForm = ({ referralCode }: ProfessionalRegistrationFormProps) => {
  const { toast } = useToast();
  const { validateForm } = useFormValidation();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    cpf: "",
    registrationNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    description: "",
    experience: "",
    photo: null as File | null,
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState<{[key: string]: string[]}>({});
  const [currentTimeSlot, setCurrentTimeSlot] = useState("");
  const [acceptedContract, setAcceptedContract] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
    }
  };

  const addSpecialty = (specialty: string) => {
    if (!selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties(prev => [...prev, specialty]);
    }
  };

  const removeSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev => prev.filter(s => s !== specialty));
  };

  const addAvailableDate = (date: Date | undefined) => {
    if (date && !availableDates.some(d => d.getTime() === date.getTime())) {
      setAvailableDates(prev => [...prev, date]);
      setSelectedDate(undefined);
    }
  };

  const removeAvailableDate = (date: Date) => {
    setAvailableDates(prev => prev.filter(d => d.getTime() !== date.getTime()));
    const dateKey = date.toDateString();
    setTimeSlots(prev => {
      const newSlots = { ...prev };
      delete newSlots[dateKey];
      return newSlots;
    });
  };

  const addTimeSlot = (date: Date) => {
    if (currentTimeSlot) {
      const dateKey = date.toDateString();
      setTimeSlots(prev => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), currentTimeSlot]
      }));
      setCurrentTimeSlot("");
    }
  };

  const removeTimeSlot = (date: Date, timeSlot: string) => {
    const dateKey = date.toDateString();
    setTimeSlots(prev => ({
      ...prev,
      [dateKey]: prev[dateKey]?.filter(slot => slot !== timeSlot) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData, selectedSpecialties, acceptedContract, acceptedTerms, acceptedPrivacy)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // First, create the auth user
      const { error: signUpError } = await signUp(formData.email, formData.password, {
        full_name: formData.name,
        role: 'professional'
      });

      if (signUpError) {
        toast({
          title: "Erro no cadastro",
          description: signUpError.message || "Erro ao criar conta de usuário",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Get the current user session to get the user ID
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast({
          title: "Erro",
          description: "Erro ao obter dados do usuário",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Get the profile ID from the profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', session.user.id)
        .single();

      if (!profile) {
        toast({
          title: "Erro",
          description: "Erro ao obter perfil do usuário",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Create professional profile
      const { error: professionalError } = await supabase
        .from('professionals')
        .insert({
          profile_id: profile.id,
          crp: formData.registrationNumber,
          specialties: selectedSpecialties,
          bio: formData.description,
          available_hours: {
            dates: availableDates.map(date => date.toISOString()),
            slots: timeSlots
          }
        });

      if (professionalError) {
        toast({
          title: "Erro",
          description: professionalError.message || "Erro ao criar perfil profissional",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      toast({
        title: "Sucesso!",
        description: referralCode 
          ? `Cadastro realizado com sucesso com código de indicação ${referralCode}. Verifique seu email para confirmar sua conta.`
          : "Cadastro realizado com sucesso. Verifique seu email para confirmar sua conta.",
      });

      // Redirect to login after successful registration
      setTimeout(() => {
        navigate('/auth');
      }, 2000);

    } catch (error) {
      console.error('Error during registration:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro durante o cadastro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Dados Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Pessoais</CardTitle>
          <CardDescription>Informações básicas do profissional</CardDescription>
        </CardHeader>
        <CardContent>
          <PersonalDataForm
            formData={formData}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            onInputChange={handleInputChange}
            onPhotoUpload={handlePhotoUpload}
            setShowPassword={setShowPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />
        </CardContent>
      </Card>

      {/* Dados Profissionais */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Profissionais</CardTitle>
          <CardDescription>Informações sobre sua atuação profissional</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfessionalDataForm
            formData={formData}
            selectedSpecialties={selectedSpecialties}
            onInputChange={handleInputChange}
            addSpecialty={addSpecialty}
            removeSpecialty={removeSpecialty}
          />
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card>
        <CardHeader>
          <CardTitle>Endereço</CardTitle>
          <CardDescription>Local de atendimento</CardDescription>
        </CardHeader>
        <CardContent>
          <AddressForm
            formData={formData}
            onInputChange={handleInputChange}
          />
        </CardContent>
      </Card>

      {/* Agenda */}
      <Card>
        <CardHeader>
          <CardTitle>Agenda de Disponibilidade</CardTitle>
          <CardDescription>Selecione as datas e horários disponíveis para atendimento</CardDescription>
        </CardHeader>
        <CardContent>
          <ScheduleForm
            availableDates={availableDates}
            selectedDate={selectedDate}
            timeSlots={timeSlots}
            currentTimeSlot={currentTimeSlot}
            setSelectedDate={setSelectedDate}
            setCurrentTimeSlot={setCurrentTimeSlot}
            addAvailableDate={addAvailableDate}
            removeAvailableDate={removeAvailableDate}
            addTimeSlot={addTimeSlot}
            removeTimeSlot={removeTimeSlot}
          />
        </CardContent>
      </Card>

      {/* Termos e Condições */}
      <Card>
        <CardHeader>
          <CardTitle>Termos e Condições</CardTitle>
          <CardDescription>Leia e aceite os documentos obrigatórios</CardDescription>
        </CardHeader>
        <CardContent>
          <TermsAcceptance
            acceptedContract={acceptedContract}
            acceptedTerms={acceptedTerms}
            acceptedPrivacy={acceptedPrivacy}
            setAcceptedContract={setAcceptedContract}
            setAcceptedTerms={setAcceptedTerms}
            setAcceptedPrivacy={setAcceptedPrivacy}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Cadastrando..." : "Cadastrar Profissional"}
        </Button>
      </div>
    </form>
  );
};

export default ProfessionalRegistrationForm;
