import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./landing.css";

// Görseller local assets klasöründe
import img1 from "../../assets/images/1.png";
import img2 from "../../assets/images/2.png";
import img3 from "../../assets/images/3.png";
import img4 from "../../assets/images/4.png";
import img5 from "../../assets/images/5.png";

const features = [
  {
    title: "Kolay Görev Takibi",
    description: "Görevlerinizi hızlı ve etkili şekilde yönetin.",
    image: img1,
  },
  {
    title: "Ekip Yönetimi",
    description: "Ekip içi koordinasyon ve gerçek zamanlı iş birliği.",
    image: img2,
  },
  {
    title: "Güvenli Giriş",
    description: "JWT ile verileriniz güvenli ve koruma altında.",
    image: img3,
  },
  {
    title: "Mobil Uyumlu",
    description: "Her cihazda kusursuz kullanıcı deneyimi.",
    image: img4,
  },
  {
    title: "Anlık Güncellemeler",
    description: "Projelerinizi gerçek zamanlı takip edin.",
    image: img5,
  },
];

const LandingPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

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
    <div className="landing-wrapper">
      {/* HEADER */}
      <header className="header">
        <div className="logo">Taskify</div>
        <nav>
          <button className="btn login" onClick={() => navigate("/auth/login")}>
            Giriş Yap
          </button>
          <button className="btn register" onClick={() => navigate("/auth/register")}>
            Kayıt Ol
          </button>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <div className="landing-container" ref={containerRef}>
        {features.map(({ title, description, image }, idx) => (
          <section key={idx} className={`section-block ${activeIndex === idx ? "active" : ""}`}>
            <div className="content-inner">
              <div className="text-content">
                <h2>{title}</h2>
                <p>{description}</p>
                <button className="btn cta" onClick={() => navigate("/auth/register")}>
                  Hemen Başla
                </button>
              </div>
              <div className="image-content">
                <img src={image} alt={title} />
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
