
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData, selectedSpecialties, acceptedContract, acceptedTerms, acceptedPrivacy)) {
      return;
    }

    console.log("Dados do profissional:", {
      ...formData,
      specialties: selectedSpecialties,
      availableDates,
      timeSlots,
      referralCode
    });

    toast({
      title: "Sucesso!",
      description: referralCode 
        ? `Cadastro realizado com sucesso com código de indicação ${referralCode}. Aguarde aprovação.`
        : "Cadastro realizado com sucesso. Aguarde aprovação.",
    });
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
        <Button type="submit" size="lg">
          Cadastrar Profissional
        </Button>
      </div>
    </form>
  );
};

export default ProfessionalRegistrationForm;
