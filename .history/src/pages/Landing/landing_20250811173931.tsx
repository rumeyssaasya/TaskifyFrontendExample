import React, { useRef, useEffect, useState } from "react";

// Görselleri yerel assets klasöründen import ediyoruz
import img1 from "../../assets/images/1.png";
import img2 from "../../assets/images/2.png";
import img3 from "../../assets/images/3.png";
import img4 from "../../assets/images/4.png";
import img5 from "../../assets/images/5.png";

const features = [
  {
    title: "Kolay Görev Takibi",
    description:
      "Görevlerinizi kolayca yöneterek, projelerinizi hızlı ve etkili bir şekilde tamamlayın.",
    image: img1,
  },
  {
    title: "Ekip Yönetimi",
    description:
      "Ekip içi koordinasyonu maksimuma çıkarın, iş birliğinizi güçlendirin.",
    image: img2,
  },
  {
    title: "Güvenlik Önceliğimiz",
    description:
      "JWT Authentication ile verileriniz her zaman koruma altında.",
    image: img3,
  },
  {
    title: "Mobil Uyumluluk",
    description:
      "Her cihazda kusursuz deneyim, her yerde projelerinize ulaşın.",
    image: img4,
  },
  {
    title: "Anlık Güncellemeler",
    description:
      "Projelerinizi gerçek zamanlı takip edin, kararlarınızı hızlandırın.",
    image: img5,
  },
];

const LandingPage = () => {
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
    <div
      className="landing-container"
      ref={containerRef}
      role="main"
      aria-label="Taskify Tanıtım Sayfası"
    >
      {features.map((feature, idx) => (
        <section
          key={idx}
          className={`section-block ${activeIndex === idx ? "active" : ""}`}
          style={{ backgroundImage: `url(${feature.image})` }}
          aria-hidden={activeIndex !== idx}
          tabIndex={activeIndex === idx ? 0 : -1}
        >
          <div className="content-wrapper">
            <div className="text-content">
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </div>
            <img
              src={feature.image}
              alt={`${feature.title} görseli`}
              loading="lazy"
              className="feature-image"
            />
          </div>
        </section>
      ))}
    </div>
  );
};

export default LandingPage;
