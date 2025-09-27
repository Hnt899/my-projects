// src/components/sections/CTA.tsx

import TelegramIcon from "@/assets/svg/telegram.svg";
import WhatsappIcon from "@/assets/svg/whatsapp.svg";
import PolicyFile from "@/assets/policy.pdf"
import { useOrder } from "@/context/OrderContext";

const CTA = () => {
  const { open } = useOrder();
  
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <section id="cta-section" className="bg-[#d4ff00] py-16 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold text-black leading-tight px-4">
          пора{' '}
          <button
            type="button"
            onClick={open}
            className="underline unbounded hover:text-[#5940FE] transition-colors"
          >
            внедрять ии
          </button>
          <br />
          в свой бизнес
        </h2>
        
        <a href="tel:+79855551779" className="mt-4 inline-block text-xl md:text-2xl text-black hover:underline transition-colors">
          +7 985-555-17-79
        </a>

        <div className="flex justify-center gap-4 mt-4">
          <a
            href="https://t.me/ai_tech_llc"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            className="rounded-full p-4 transition-colors duration-300 bg-transparent hover:bg-[#5940FE] group"
          >
            <img src={TelegramIcon} alt="Telegram" className="size-8 transition-colors duration-300 group-hover:invert" />
          </a>
          <a
            href="https://wa.me/79855551779"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="rounded-full p-4 transition-colors duration-300 bg-transparent hover:bg-[#5940FE] group"
          >
            <img src={WhatsappIcon} alt="WhatsApp" className="size-8 transition-colors duration-300 group-hover:invert" />
          </a>
        </div>
      </section>

      <footer id="contacts" className="bg-black text-white py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: `
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ЭйАй Тех",
              "legalName": "ООО ЭЙАЙ ТЕХ",
              "taxID": "5404958006",
              "url": "https://ВАШ_САЙТ.РУ",
              "telephone": "+79855551779"
            }
          `}}
        />
        <div className="container mx-auto px-4">
            {/* Мобильная версия */}
            <div className="md:hidden flex flex-col items-start text-left gap-6 text-lg">
                <div className="flex flex-col gap-3">
                    <a href="#portfolio" onClick={(e) => handleScroll(e, "#portfolio")} className="hover:underline">Портфолио</a>
                    <a href="#services" onClick={(e) => handleScroll(e, "#services")} className="hover:underline">Услуги</a>
                    <a href="#team" onClick={(e) => handleScroll(e, "#team")} className="hover:underline">О нас</a>
                    <a href="#blog" onClick={(e) => handleScroll(e, "#blog")}>Блог</a>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col mb-3"> 
                        <span className="text-xl font-bold">© 2025 ЭйАй Тех</span>
                        <span className="text-sm text-gray-400">ИНН: 5404958006</span>
                    </div>
                    <a href="https://itm-ai.ru" target="_blank" rel="noopener noreferrer" className="hover:underline">ИИ в медицине</a>
                    <a href="https://www.meshalkin.ru/" target="_blank" rel="noopener noreferrer" className="hover:underline">Клиника Мешалкина</a>
                </div>
                <a download="policy.pdf" href={PolicyFile} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Политика конфиденциальности
                </a>
            </div>
            {/* Десктопная версия */}
            <div className="hidden md:grid md:grid-cols-3 md:gap-6 md:text-left items-start">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col mb-3"> 
                    <a href="#hero" onClick={(e) => handleScroll(e, "#hero")} className="text-lg font-bold hover:underline">
                      © 2025 ЭйАй Тех
                    </a>
                    <span className="text-sm text-gray-400">ИНН: 5404958006</span>
                </div>
                <a href="https://itm-ai.ru" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                  ИИ в медицине
                </a>
                 <a href="https://www.meshalkin.ru/" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                  Клиника Мешалкина
                </a>
              </div>
              <div className="flex flex-col gap-2 items-start md:items-center">
                <a href="#portfolio" onClick={(e) => handleScroll(e, "#portfolio")} className="hover:underline">Портфолио</a>
                <a href="#services" onClick={(e) => handleScroll(e, "#services")} className="hover:underline">Услуги</a>
                <a href="#team" onClick={(e) => handleScroll(e, "#team")} className="hover:underline">О нас</a>
                <a href="#blog" onClick={(e) => handleScroll(e, "#blog")} className="hover:underline">Блог</a>
              </div>
              <div className="w-full flex flex-col items-start md:items-end gap-4">
                 <a download="policy.pdf" href={PolicyFile} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                  Политика конфиденциальности
                </a>
                <button onClick={open} className="bg-[#d4ff00] hover:bg-[#5940FE] text-black font-bold px-6 py-3 rounded-full transition-colors w-auto">
                  Оставить заявку
                </button>
              </div>
            </div>
        </div>
      </footer>
    </>
  );
};

export default CTA;