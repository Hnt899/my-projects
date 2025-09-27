import { useState, MouseEvent } from "react";
import { Phone, Send, MessageCircle, X, Plus } from "lucide-react";
import axios from 'axios';
import { useOrder } from "@/context/OrderContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
// ИЗМЕНЕНИЕ 1: Используем 'sonner' который уже есть в проекте, вместо 'react-hot-toast'
import { toast } from "sonner";
import PolicyFile from "@/assets/policy.pdf"

const Order = () => {
    const { close } = useOrder();
    const isMobile = useIsMobile();
    const [loading, setLoading] = useState(false);
    const [agree, setAgree] = useState(false);
    const [selectedServices, setSelectedServices] = useState<number[]>([]);
    const [selectedContact, setSelectedContact] = useState<string>("phone");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("+7");
    const [desc, setDesc] = useState("");
    const [phoneError, setPhoneError] = useState(false);
    const [nameError, setNameError] = useState(false);

    const apiUrl = import.meta.env.VITE_APP_API_URL;

    const services = ["Сайт", "Чат-боты", "ИИ-агенты", "Трейд-бот", "ИИ-по ТЗ", "Другое"];
    
    const toggleService = (index: number) => { setSelectedServices((prev) => prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]); };

    const formatPhoneNumber = (value: string) => {
        if (!value) return "+7";
        const digitsOnly = value.replace(/\D/g, '');
        if (!digitsOnly) return "+7";
        const userDigits = digitsOnly.startsWith('7') ? digitsOnly.substring(1) : digitsOnly;
        const truncatedDigits = userDigits.slice(0, 10);
        let formatted = "+7";

        if (truncatedDigits.length > 0) {
            formatted += ` (${truncatedDigits.slice(0, 3)}`;
        }
        if (truncatedDigits.length >= 4) {
            formatted += `) ${truncatedDigits.slice(3, 6)}`;
        }
        if (truncatedDigits.length >= 7) {
            formatted += `-${truncatedDigits.slice(6, 8)}`;
        }
        if (truncatedDigits.length >= 9) {
            formatted += `-${truncatedDigits.slice(8, 10)}`;
        }

        return formatted;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        if (input.length < 2) {
            setPhone("+7");
            return;
        }
        const formatted = formatPhoneNumber(input);
        setPhone(formatted);
        
        const totalDigits = formatted.replace(/\D/g, '').length;
        setPhoneError(totalDigits > 1 && totalDigits < 11);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);
        const nameRegex = /^[A-Za-zА-Яа-яЁё\s-]+$/;
        
        if (newName.length > 0) {
            if (newName.length < 3 || !nameRegex.test(newName)) {
                setNameError(true);
            } else {
                setNameError(false);
            }
        } else {
            setNameError(false);
        }
    };


    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      const nameRegex = /^[A-Za-zА-Яа-яЁё\s-]+$/;
      if (name.length < 2 || !nameRegex.test(name)) {
          setNameError(true);
          toast.error("Введите корректное имя (минимум 2 буквы).");
          return;
      }

      const actualPhoneNumber = phone.replace(/\D/g, "");
      if (actualPhoneNumber.length !== 11) {
          setPhoneError(true);
          toast.error("Пожалуйста, введите полный номер телефона.");
          setLoading(false);
          return;
      }

      if (!agree) {
          toast.error("Пожалуйста, согласитесь с политикой конфиденциальности.");
          setLoading(false);
          return;
      }

      if (!apiUrl) {
        toast.error("API URL не настроен. Обратитесь к администратору.");
        setLoading(false);
        return;
      }

      setLoading(true);

      axios.post(`${apiUrl}api/v1/leads/`, {
          name: name,
          phone: actualPhoneNumber,
          contact_method: selectedContact,
          services: selectedServices.map(index => services[index]),
          project_description: desc,
          privacy_policy_agreed: agree
        }).then(response => {
            if (response.status === 201) {
                // ИЗМЕНЕНИЕ 2: Вызываем toast.success и добавляем duration для плавного исчезновения
                toast.success("Ваша заявка отправлена.", {
                    duration: 3000, // Уведомление исчезнет через 3 секунды
                });
                close();
                setName("");
                setPhone("+7");
                setDesc("");
                setAgree(false);
                setSelectedServices([]);
                setSelectedContact("phone");
            }
        }).catch(error => {
            const errorMessage = error.response?.data?.message || "Неизвестная ошибка.";
            toast.error(`Произошла ошибка: ${errorMessage}`);
        }).finally(() => {
            setLoading(false);
        });
    };

    const handleBackdropClick = (e: MouseEvent<HTMLElement>) => {
        if (e.target === e.currentTarget) {
            close();
        }
    };

  if (isMobile) {
    // ИЗМЕНЕНИЕ 3: Полностью удаляем компонент <Toaster> отсюда. Он уже есть в App.tsx
    return (
        <main className="bg-black text-white font-text min-h-screen p-4">
            <form onSubmit={onSubmit} className="flex flex-col h-full space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-[#DBFE01] text-3xl font-extrabold font-display">заказать<br/>проект</h1>
                    <button type="button" onClick={close} className="p-1" aria-label="Закрыть форму"><X className="size-8 text-gray-400" /></button>
                </div>
                <p>Выберите задачу и расскажите о своём проекте</p>

                <div className="grid grid-cols-2 gap-3">
                    {services.map((t, i) => (
                      <button key={i} type="button" onClick={() => toggleService(i)} className={`flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm border font-bold transition-colors duration-300 ${selectedServices.includes(i) ? "bg-[#5940FE] text-white border-[#5940FE]" : "bg-white text-black border-white"}`}>
                        <span>{t}</span> <Plus className="size-4" />
                      </button>
                    ))}
                </div>

                <Input 
                    required 
                    placeholder="Ваше имя" 
                    value={name} 
                    onChange={handleNameChange} 
                    className={`bg-transparent border-0 border-b rounded-none px-0 text-lg font-bold focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors ${nameError ? 'border-red-500 focus:border-red-500' : 'border-gray-500 focus:border-b-[#DBFE01]'}`} 
                />
                
                <div>
                    <p className="mb-3 text-lg font-bold">Удобный способ связи</p>
                    <div className="flex flex-col items-start gap-4">
                        {[ { id: "phone", label: "Телефон", icon: <Phone className="mr-3 size-5" /> }, { id: "telegram", label: "Telegram", icon: <Send className="mr-3 size-5" /> }, { id: "whatsapp", label: "WhatsApp", icon: <MessageCircle className="mr-3 size-5" /> } ].map((contact) => (
                            <button key={contact.id} type="button" onClick={() => setSelectedContact(contact.id)} className={`flex items-center transition-colors text-lg ${selectedContact === contact.id ? "text-[#DBFE01] font-bold" : "text-white"}`}>
                                {contact.icon} {contact.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={`flex items-center border-b transition-colors focus-within:border-b-[#DBFE01] ${phoneError ? "border-red-500" : "border-gray-500"}`}>
                    <span className="text-lg font-bold pr-2">RU</span>
                    <Input 
                        required 
                        type="tel" 
                        placeholder="+7 (___) ___-__-__" 
                        value={phone}
                        onChange={handlePhoneChange} 
                        className="bg-transparent w-full py-2 text-lg font-bold focus:outline-none placeholder:text-gray-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>

                <Textarea className="flex-grow min-h-24 resize-none bg-transparent border-0 border-b border-gray-500 rounded-none p-0 text-lg font-bold focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-b-[#DBFE01]" placeholder="Расскажите в двух словах про ваш проект" value={desc} onChange={(e) => setDesc(e.target.value)} />

                <div className="flex items-start gap-3">
                    <Checkbox id="agree-mobile" checked={agree} onCheckedChange={(v) => setAgree(Boolean(v))} className="w-6 h-6 mt-1 border-gray-400 data-[state=checked]:bg-[#DBFE01] data-[state=checked]:text-black"/>
                    <label htmlFor="agree-mobile" className="text-sm text-gray-400">я согласен с условиями <a download="policy.pdf" href={PolicyFile} target="_blank" rel="noopener noreferrer" className="underline text-[#DBFE01] font-bold">политики конфиденциальности</a></label>
                </div>

                <button type="submit" disabled={loading || phoneError || nameError || !agree} className="w-full bg-[#DBFE01] text-black rounded-full py-3.5 font-semibold text-lg transition-colors duration-300 hover:bg-lime-300 disabled:bg-gray-500">
                    {loading ? "Отправляем…" : "Отправить"}
                </button>
             </form>
        </main>
    );
  }
  
  return (
    <main 
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto"
        onMouseDown={handleBackdropClick}
    >
        {/* ИЗМЕНЕНИЕ 4: Полностью удаляем компонент <Toaster> отсюда. */}
        <form 
            onSubmit={onSubmit} 
            className="relative bg-black text-white p-8 w-11/12 md:w-3/4 lg:w-1/2 max-w-2xl max-h-[90vh] overflow-y-auto mx-auto rounded-3xl border border-gray-700"
            // ИЗМЕНЕНИЕ 5: Меняем onClick на onMouseDown, чтобы остановить событие до того, как оно "всплывет" до фона.
            onMouseDown={(e) => e.stopPropagation()}
        >
          <button type="button" onClick={close} className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors" aria-label="Закрыть форму">
            <X className="size-5 text-[#DBFE01]" />
          </button>
          <h1 className="text-center text-[#DBFE01] text-3xl font-extrabold mb-2">заказать проект</h1>
          <p className="text-center text-white mb-10">Выберите задачу и расскажите о своём проекте</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {services.map((t, i) => (
              <button key={i} type="button" onClick={() => toggleService(i)} className={`flex items-center justify-between rounded-full px-4 py-2 text-sm border font-bold transition-colors duration-300 ${selectedServices.includes(i) ? "bg-[#5940FE] text-white border-[#5940FE]" : "bg-white text-black border-white"}`}>
                <span>{t}</span> <Plus className="size-4" />
              </button>
            ))}
          </div>
          <Input 
            required 
            placeholder="Ваше имя" 
            value={name} 
            onChange={handleNameChange} 
            className={`bg-transparent border-b mb-6 transition-colors ${nameError ? 'border-red-500' : 'border-gray-500'}`} 
          />
          <p className="mb-3">Удобный способ связи</p>
          <div className="flex flex-wrap gap-3 mb-6">
            {[ { id: "phone", label: "Телефон", icon: <Phone className="mr-2 size-4" /> }, { id: "telegram", label: "Telegram", icon: <Send className="mr-2 size-4" /> }, { id: "whatsapp", label: "WhatsApp", icon: <MessageCircle className="mr-2 size-4" /> } ].map((contact) => (
              <button key={contact.id} type="button" onClick={() => setSelectedContact(contact.id)} className={`flex items-center rounded-full px-4 py-2 border transition-colors duration-300 ${selectedContact === contact.id ? "bg-[#DBFE01] text-black border-[#DBFE01]" : "bg-transparent border-gray-500" }`}>
                {contact.icon} {contact.label}
              </button>
            ))}
          </div>
          <Input 
              required 
              type="tel" 
              placeholder="+7 (___) ___-__-__" 
              value={phone} 
              onChange={handlePhoneChange} 
              className={`bg-transparent border-b mb-6 transition-colors ${phoneError ? "border-red-500" : "border-gray-500" }`} 
          />
          <p className="mb-3">Расскажите в двух словах про ваш проект</p>
          <Textarea className="min-h-32 resize-none bg-transparent border border-gray-500 mb-6" placeholder="Короткое описание" value={desc} onChange={(e) => setDesc(e.target.value)} />
          <div className="flex items-center gap-2 mb-6">
            <Checkbox id="agree-desktop" checked={agree} onCheckedChange={(v) => setAgree(Boolean(v))} />
            <label htmlFor="agree-desktop" className="text-sm">я согласен с условиями <a download="policy.pdf" href={PolicyFile} target="_blank" rel="noopener noreferrer" className="underline">политики конфиденциальности</a></label>
          </div>
          <button type="submit" disabled={loading || phoneError || nameError || !agree} className="w-full bg-[#DBFE01] text-black rounded-full py-3 font-semibold transition-colors duration-300 hover:bg-lime-300 disabled:bg-gray-500">
            {loading ? "Отправляем…" : "Отправить"}
          </button>
        </form>
      </main>
  )
};

export default Order;