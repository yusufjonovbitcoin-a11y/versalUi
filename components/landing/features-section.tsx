"use client";

import { useEffect, useRef, useState } from "react";

const features = [
  {
    number: "01",
    title: "Bizning muavfaqiyat",
    description: "Biz 170+ ishonchli xorijiy ish beruvchilar bilan rasmiy shartnomalarga egamiz, bu esa mijozlarimizga keng tanlov va barqaror ish imkoniyatlarini taqdim etadi.",
    stats: { value: "98.7%", label: "Bizning MUaffaqiyat kayfisenti" },
  },
  {
    number: "02",
    title: "Distributed Computing",
    description: "Offload compute-heavy tasks to our global network. Your agents run on optimized infrastructure across 50+ regions worldwide.",
    stats: { value: "50+", label: "global regions" },
  },
  {
    number: "03",
    title: "Multi-Agent Orchestration",
    description: "Coordinate teams of specialized agents. They communicate, delegate, and collaborate to solve complex problems together.",
    stats: { value: "1000x", label: "parallel execution" },
  },
  {
    number: "04",
    title: "Secure Sandboxing",
    description: "Each agent runs in isolated environments. Full audit trails, encrypted execution, and zero data leakage between tasks.",
    stats: { value: "0", label: "data breaches" },
  },
];

const featureImages = ["/images/zavod.png", "/images/zavod1.jpg"];

// Floating dot particles visualization
function ParticleVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    // Generate stable particle positions
    const COUNT = 70;
    const particles = Array.from({ length: COUNT }, (_, i) => {
      const seed = i * 1.618;
      return {
        bx: ((seed * 127.1) % 1),
        by: ((seed * 311.7) % 1),
        phase: seed * Math.PI * 2,
        speed: 0.4 + (seed % 0.4),
        radius: 1.2 + (seed % 2.2),
      };
    });

    let time = 0;
    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particles.forEach((p) => {
        const flowX = Math.sin(time * p.speed * 0.4 + p.phase) * 38;
        const flowY = Math.cos(time * p.speed * 0.3 + p.phase * 0.7) * 24;

        const bx = p.bx * w;
        const by = p.by * h;
        const dx = p.bx - mx;
        const dy = p.by - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist * 2.8);

        const x = bx + flowX + influence * Math.cos(time + p.phase) * 36;
        const y = by + flowY + influence * Math.sin(time + p.phase) * 36;

        const pulse = Math.sin(time * p.speed + p.phase) * 0.5 + 0.5;
        const alpha = 0.08 + pulse * 0.18 + influence * 0.3;

        ctx.beginPath();
        ctx.arc(x, y, p.radius + pulse * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      });

      time += 0.016;
      frameRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [incomingImage, setIncomingImage] = useState<number | null>(null);
  const [isImageTransitioning, setIsImageTransitioning] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (activeImage + 1) % featureImages.length;
      setIncomingImage(next);
      setIsImageTransitioning(true);

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      transitionTimeoutRef.current = setTimeout(() => {
        setActiveImage(next);
        setIncomingImage(null);
        setIsImageTransitioning(false);
      }, 900);
    }, 3000);

    return () => {
      clearInterval(interval);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [activeImage]);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative pt-36 pb-24 lg:pt-48 lg:pb-[1px] overflow-hidden bg-black"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-[33px]">
        {/* Header - Full width with diagonal layout */}
        <div className="relative mb-24 lg:mb-32">
          <div className="-mt-10 lg:-mt-20 grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 self-start">
              <h2
                className={`-mt-4 lg:mt-[1px] text-6xl md:text-7xl lg:text-[128px] font-display text-white tracking-tight leading-[0.9] transition-all duration-1000 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                Biz
                <br />
                xaqimizda
              </h2>
              <div
                className={`mt-8 lg:mt-10 w-full max-w-md transition-all duration-1000 delay-300 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
              >
                <div className="relative h-px bg-white/20 overflow-hidden">
                  <span className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/90 to-transparent motion-safe:animate-pulse" />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse" />
                  <span className="h-1 w-1 rounded-full bg-white/60 animate-pulse [animation-delay:250ms]" />
                  <span className="h-1 w-1 rounded-full bg-white/40 animate-pulse [animation-delay:500ms]" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 lg:pb-4">
              <p className={`text-xl text-white/90 leading-relaxed transition-all duration-1000 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}>
                <span className="font-display text-2xl text-blue-300 brand-blue-animate">International Migration Line</span> - O'zbekistonda ko'p yillik tajribaga ega, rasmiy litsenziyaga ega bo'lgan ishonchli xususiy bandlik agentligi.
                <br />
                <br />
                Biz ish izlovchilarga xorijda munosib ish va martaba yo'lini topishda yordam beramiz. Agentligimiz axloqiy yollash tamoyillariga amal qiladi va har bir mijozga quyidagilarni taqdim etadi:
                <br />
                <br />
                Kasbiy yo'naltirish va maslahat
                <br />
                Ishga joylashish jarayonida to'liq qo'llab-quvvatlash
                <br />
                Hujjatlar va rasmiylashtirishda yordam
                <br />
                Ish beruvchilar bilan to'g'ridan-to'g'ri hamkorlik
                <br />
                <br />
                Bizning asosiy qadriyatlarimiz - ishonch, halollik va xalqaro standartlarga mos xizmat ko'rsatish.
              </p>
            </div>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Large feature card */}
          <div 
            className={`lg:col-span-12 relative bg-black border border-foreground/10 min-h-[500px] overflow-hidden group transition-all duration-700 flex ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
            onMouseEnter={() => setActiveFeature(0)}
          >
            {/* Left: text content */}
            <div className="relative flex-1 p-8 lg:p-12 bg-black">
              <ParticleVisualization />
              <div className="relative z-10">
                <h3 className="text-4xl lg:text-5xl font-display font-semibold text-white -mt-2 mb-6 group-hover:translate-x-2 transition-transform duration-500">
                  {features[0].title}
                </h3>
                <p className="text-lg text-white leading-relaxed max-w-md mb-8 px-5 py-[11px]">
                  {features[0].description}
                </p>
                <div>
                  <span className="text-5xl lg:text-6xl font-display text-white">{features[0].stats.value}</span>
                  <span className="block text-sm text-muted-foreground font-mono mt-2">{features[0].stats.label}</span>
                </div>
              </div>
            </div>

            {/* Right: mirrored image, full height */}
            <div className="hidden lg:block relative w-[42%] shrink-0 overflow-hidden">
              <img
                src={featureImages[activeImage]}
                alt=""
                aria-hidden="true"
                className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-900 ease-out will-change-[opacity] ${
                  isImageTransitioning ? "opacity-0" : "opacity-100"
                }`}
                style={{ transform: "scaleX(-1)" }}
              />
              {incomingImage !== null && (
                <img
                  src={featureImages[incomingImage]}
                  alt=""
                  aria-hidden="true"
                  className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-900 ease-out will-change-[opacity] ${
                    isImageTransitioning ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transform: "scaleX(-1)" }}
                />
              )}
              {/* Fade left edge into black */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .brand-blue-animate {
          animation: brandBlueShift 2.8s ease-in-out infinite;
        }

        @keyframes brandBlueShift {
          0%,
          100% {
            color: rgb(147 197 253);
          }
          50% {
            color: rgb(56 189 248);
          }
        }
      `}</style>
    </section>
  );
}
