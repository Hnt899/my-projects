import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOrder } from "@/context/OrderContext";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import knotHero from "@/assets/knot-hero.png";
import knotSquare from "@/assets/knot-square.png";

const cards = [
  { title: <>Разработка<br />AI-решений</>, desc: "От идеи до продакшена: ML, NLP, CV и MLOps.", img: knotHero, extra: "Проектирование архитектуры, прототипы, метрики качества, запуск.", bgColor: "black" },
  { title: "Платформы и инструменты", desc: "Интеграции, пайплайны, аналитика и автоматизация.", img: knotSquare, extra: "CRM/BI интеграции, ETL, DataOps, мониторинг и алерты.", bgColor: "white" },
  { title: <>Экспертные<br />AI-услуги</>, desc: "Адаптация под домен и бизнес-процессы.", img: knotHero, extra: "Онтологии, доменные датасеты, безопасные развертывания.", bgColor: "black" },
  { title: "Исследования и разработка", desc: "Прототипирование новых моделей и подходов.", img: knotSquare, extra: "R&D эксперименты, бенчмарки,\nPoC → MVP.", bgColor: "white" },
  { title: <>Анализ данных<br />и консалтинг</>, desc: "Комплексные услуги по сбору, обработке и визуализации данных.", img: knotHero, extra: "Выявление ключевых трендов, оптимизация процессов, прогнозирование показателей.", bgColor: "black" },
  { title: <>Оптимизация<br />бизнес-процессов</>, desc: "Внедрение BPM-системы, автоматизация с RPA, Lean и Six Sigma.", img: knotSquare, extra: "Сокращение издержек, рост качества услуг, повышение конкурентоспособности.", bgColor: "white" },
];

function useTypewriter(text: string, speed = 30) {
  const [displayed, setDisplayed] = useState("");
  const intervalId = useRef<number | null>(null);

  useEffect(() => {
    setDisplayed("");
    if (intervalId.current) clearInterval(intervalId.current);

    let i = 0;
    intervalId.current = window.setInterval(() => {
      if (i < text.length) {
        setDisplayed(prev => text.substring(0, i + 1));
        i++;
      } else if(intervalId.current) {
        clearInterval(intervalId.current);
      }
    }, speed);

    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
    };
  }, [text, speed]);

  return displayed;
}

const TypewriterEffect = ({ text }: { text: string }) => {
  const typedText = useTypewriter(text);
  return (
    <>
      {typedText}
      <span className="animate-pulse">|</span>
    </>
  );
};

const Offerings = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [active, setActive] = useState(0);
  const isMobile = useIsMobile();
  const { open } = useOrder();

  const handleSelect = useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) return;
    setActive(carouselApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;
    handleSelect(api);
    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api, handleSelect]);

  const renderCard = (c: typeof cards[0], i: number) => {
    const isSelected = active === i;
    const isBlackBg = c.bgColor === 'black';

    const handleCardClick = () => {
        if (!isMobile && api) {
            api.scrollTo(i);
        }
    }

    return (
      <article
        onClick={handleCardClick}
        style={{ backgroundImage: `url(${c.img})`, backgroundSize: "cover", backgroundPosition: "top" }}
        className={`flex flex-col justify-end rounded-[30px] shadow-lg min-h-[460px] border-2 border-white select-none
                  ${!isMobile && 'cursor-pointer'}
                  ${isSelected && !isMobile ? "scale-105" : "scale-100"}
                  transition-all duration-300 overflow-hidden relative
                `}
      >
        <div
          className={`absolute bottom-0 left-0 w-full p-6 text-sm ${
            isBlackBg ? "bg-black/80 text-white" : "bg-white/80 text-black"
          }`}
        >
          <h3 className="text-xl font-extrabold mb-2 hyphens-auto">{c.title}</h3>
          <p className="opacity-80 mb-4 h-12">{c.desc}</p>

          {!isMobile && isSelected ? (
            <p className="h-12 mb-4 whitespace-pre-line">
              {c.extra && <TypewriterEffect text={c.extra} />}
            </p>
          ) : (
            <div className="h-12 mb-4" />
          )}

          <button
            onClick={(e) => { e.stopPropagation(); open(); }}
            className={`inline-block px-5 py-2 rounded-full font-bold transition-colors duration-300
              ${isBlackBg
                ? "bg-[#DBFE01] text-black hover:bg-[#5940FE] hover:text-white"
                : "bg-[#5940FE] text-white hover:bg-[#DBFE01] hover:text-black"
              }
            `}
          >
            Оставить заявку
          </button>
        </div>
      </article>
    );
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-[#0F0F0F] relative scroll-mt-[20px]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl md:text-7xl font-extrabold text-[#DBFE01]">
            что мы предлагаем
          </h2>
          {!isMobile && (
            <div className="flex gap-3">
              <button onClick={() => api?.scrollPrev()} className="p-2 rounded-full border border-gray-600 text-white hover:bg-[#DBFE01] hover:text-black transition">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => api?.scrollNext()} className="p-2 rounded-full border border-gray-600 text-white hover:bg-[#DBFE01] hover:text-black transition">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        <Carousel
            setApi={setApi}
            opts={{
                loop: true,
                align: "center",
            }}
            className="w-full"
        >
            <CarouselContent className="-ml-4">
            {cards.map((c, i) => (
                <CarouselItem
                    key={i}
                    className={`py-4 pl-4 ${isMobile ? 'basis-[90%] sm:basis-[60%]' : 'basis-auto'}`}
                >
                    {/* ИЗМЕНЕНИЕ: Ширина теперь зависит от типа устройства */}
                    <div className={isMobile ? 'w-full' : 'w-[300px]'}>
                        {renderCard(c, i)}
                    </div>
                </CarouselItem>
            ))}
            </CarouselContent>
            
            {isMobile && (
                <>
                    <CarouselPrevious className="left-2 bg-black/50 border-none text-white hover:bg-[#DBFE01] hover:text-black" />
                    <CarouselNext className="right-2 bg-black/50 border-none text-white hover:bg-[#DBFE01] hover:text-black" />
                </>
            )}
        </Carousel>

      </div>
    </section>
  );
};

export default Offerings;