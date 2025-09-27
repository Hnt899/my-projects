// src/components/sections/Blog.tsx

import { ArrowUpRight } from "lucide-react";
import deepImg from "@/assets/deepseek.png";
import perplexityImg from "@/assets/perplexity.png";
import lovableImgClean from "@/assets/lovable.png";
import cursorImgClean from "@/assets/cursor.png";
import claudeImgClean from "@/assets/claude.png";
import deeplImg from "@/assets/deepl.jpg";

const posts = [
  { title: "Perplexity — поиск ИИ-ответов", href: "https://www.perplexity.ai", tag: "ИИ", desc: "Поиск и ответы с использованием искусственного интеллекта", image: perplexityImg, big: true },
  { title: "DeepSeek — глубокий поиск", href: "https://deepseek.com", tag: "ИИ", desc: "Продвинутая аналитика и поиск по данным", image: deepImg },
  { title: "Lovable — no-code платформа", href: "https://lovable.dev", tag: "ИИ", desc: "Быстрое создание приложений без кода", image: lovableImgClean },
  { title: "Cursor — AI-редактор кода", href: "https://cursor.com", tag: "ИИ", desc: "Интеллектуальный редактор кода с поддержкой ИИ", image: cursorImgClean },
  { title: "Claude — длинный контекст", href: "https://claude.ai", tag: "ИИ", desc: "Модель для рассуждений и обработки длинных текстов", image: claudeImgClean },
  { title: "DeepL — переводчик ИИ", href: "https://deepl.com", tag: "ИИ", desc: "Мощный переводчик с искусственным интеллектом", image: deeplImg }
];

const Blog = () => (
  <section id="blog" className="py-16 md:py-24 scroll-mt-[20px]">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-8 text-center md:text-left">
        <h2 className="text-display text-5xl md:text-7xl font-extrabold text-[#c6ff00]">блог</h2>
        <aside className="max-w-md text-sm text-muted-foreground/90">
          Мы следим за тем, как развиваются технологии и куда стремится научный прогресс. Пробуем самые современные подходы и используем передовые нейросети.
        </aside>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[220px] gap-6">
        {posts.map((p, i) => (
          <a
            key={i}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative group overflow-hidden rounded-3xl border border-gray-600
                        ${p.big ? "md:col-span-2 md:row-span-2" : ""}
                        // Общие плавные переходы для scale и filter
                        transition-all duration-300 ease-in-out group-hover:scale-[1.03]
                        // Новые фильтры для яркости, насыщенности и контраста:
                        // Изначально: чуть приглушенные (brightness-90, saturate-80, contrast-100)
                        // При наведении: значительно ярче, насыщеннее, контрастнее (brightness-130, saturate-120, contrast-120)
                        brightness-90 saturate-80 contrast-100
                        group-hover:brightness-130 group-hover:saturate-120 group-hover:contrast-120
                        `}
            style={{ backgroundImage: `url(${p.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            {/* 1. Градиент сверху (под текстом):
                 Начинается с фиолетового, переходит в прозрачность.
                 Изначально opacity-0, плавно проявляется. Z-index 15, чтобы был над нижним градиентом. */}
            <div className="absolute inset-0 z-15
                            bg-gradient-to-b from-[#5940FE]/70 from-0% to-transparent to-20%
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
            </div>

            {/* 2. Градиент снизу (акцентный цвет):
                 Появляется снизу вверх, покрывая ~1/4 высоты карточки.
                 Изначально opacity-0, плавно проявляется. Z-index 10. */}
            <div className="absolute inset-0 z-10
                            bg-gradient-to-t from-[#5940FE] from-0% via-[#5940FE]/50 via-15% to-transparent to-25%
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
            </div>

            {/* 3. Контент карточки:
                 Z-index 20 гарантирует, что текст всегда виден.
                 Имеет постоянный полупрозрачный черный фон для читаемости текста. */}
            <div className="absolute inset-0 p-4 z-20 flex flex-col bg-black/20">
              <div className="flex items-center gap-3 text-sm mb-2">
                <span className="px-3 py-1 rounded-full bg-black/50">{p.tag}</span>
                <ArrowUpRight className="ml-auto text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <h3 className="text-lg font-extrabold leading-snug text-white">{p.title}</h3>
              {/* Описание видно только при ховере на десктопе, на мобильных скрыто */}
              <p className="text-sm text-white mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {p.desc}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default Blog;