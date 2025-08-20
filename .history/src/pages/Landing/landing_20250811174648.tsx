import React, { useRef, useEffect, useState } from "react";
import "./landing.css"; // Assuming you have a CSS file for styling

const features = [
  {
    title: "Kolay Görev Takibi",
    description:
      "Görevlerinizi To Do, In Progress, Completed sütunlarında kolayca yönetin ve projelerinizi hızlandırın.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Ekip Yönetimi",
    description:
      "Ekip arkadaşlarınızla gerçek zamanlı iş birliği yaparak verimliliği artırın.",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Güvenli Giriş",
    description:
      "JWT Authentication ile verileriniz her zaman korunur, güvenliğinizi artırır.",
    image:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Mobil Uyumlu Tasarım",
    description:
      "Her cihazda sorunsuz ve akıcı kullanıcı deneyimi sağlayarak esneklik sunar.",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Anlık Güncellemeler",
    description:
      "Projelerinizin durumunu gerçek zamanlı takip edin, hızlı kararlar alın.",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
  },
];

const StickyFullPageScroll = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const height = window.innerHeight;
    const index = Math.round(scrollTop / height);
    setActiveIndex(index);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="landing-container" ref={containerRef} role="main" aria-label="Taskify Özellikleri">
      {features.map((feature, idx) => (
        <section
          key={idx}
          className={`section-block ${activeIndex === idx ? "active" : ""}`}
          style={{ backgroundImage: `url(${feature.image})` }}
          aria-hidden={activeIndex !== idx}
          tabIndex={activeIndex === idx ? 0 : -1}
        >
          <div className="content-wrapper">
            <img src={feature.image} alt={`${feature.title} görseli`} loading="lazy" />
            <div className="text-content">
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default StickyFullPageScroll;
