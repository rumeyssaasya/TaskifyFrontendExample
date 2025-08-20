import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./landing.css";

import img from "../../assets/images/lBackground.png";
import hero from "../../assets/images/hero.png"

const features = [
  {
    title: "Kolay Görev Yönetimi",
    description: "Görevlerinizi hızlı ve pratik şekilde organize edin, takip edin ve tamamlayın.",
    image: img,
  },
  {
    title: "Ekip İş Birliği",
    description: "Ekip üyelerinizle gerçek zamanlı iletişim kurarak verimliliği artırın.",
    image: img,
  },
  {
    title: "Güvenli ve Hızlı Giriş",
    description: "JWT tabanlı kimlik doğrulama ile verileriniz her zaman güvende.",
    image: img,
  },
  {
    title: "Mobil Uyumlu Tasarım",
    description: "Her cihazda mükemmel deneyim, ofiste veya hareket halinde kolay erişim.",
    image: img,
  },
  {
    title: "Anlık Proje Güncellemeleri",
    description: "Projelerinizdeki değişiklikleri anında takip edin, asla geride kalmayın.",
    image: img,
  },
];

const sliderData = [
  { img: img, text: "Görevlerinizi tek ekrandan yönetin." },
  { img: img, text: "Ekiplerinizle iş birliğini güçlendirin." },
  { img: img, text: "Güvenli ve hızlı giriş deneyimi." },
  { img: img, text: "Mobilde bile sorunsuz kullanım." },
  { img: img, text: "Her an proje güncellemelerinden haberdar olun." },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Otomatik slider geçişi
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-wrapper">
      <header className="header">
        <div className="logo">Taskify</div>
        <nav>
          <button className="btn login" onClick={() => navigate("/auth/login")}>
            Giriş Yap
          </button>
          <button className="btn register" onClick={() => navigate("/auth/register")}>
            Kayıt Ol
          </button>
          <button className="btn connection">
            <a
            className="btn-link"
              href="mailto:taskifyRMR@gmail.com"onMouseEnter={e => (e.currentTarget)}
              onMouseLeave={e => (e.currentTarget)}
              aria-label="Bize mail gönder"
              target="_blank"
              rel="noopener noreferrer"
            >
              İletişim
            </a>
          </button>
        </nav>
      </header>

      <main className="main-content">
        {/* HERO */}
        <section className="hero-section">
          <div className="hero-text">
            <h1>Görev Yönetiminde Yeni Dönem</h1>
            <p>
              Taskify ile projelerinizi, görevlerinizi ve ekiplerinizi modern,
              kolay ve güvenli bir şekilde yönetin.
            </p>
            <div className="hero-cta">
              <button onClick={() => navigate("/auth/register")} className="btn primary">
                Hemen Başla
              </button>
              <button onClick={() => navigate("/projects")} className="btn secondary">
                Demo'yu Gör
              </button>
            </div>
          </div>
          <div className="hero-image">
            <img src= "../../assets/images/hero.png" alt="Taskify Hero" />
          </div>
        </section>

        {/* SLIDER */}
        <section className="slider-section">
          <div className="slider">
            {sliderData.map((slide, index) => (
              <div
                key={index}
                className={`slide ${index === currentSlide ? "active" : ""}`}
              >
                <img src={slide.img} alt={`slide-${index}`} />
                <p className="slide-text">{slide.text}</p>
              </div>
            ))}
          </div>
          <div className="slider-dots">
            {sliderData.map((_, i) => (
              <span
                key={i}
                className={`dot ${i === currentSlide ? "active" : ""}`}
                onClick={() => setCurrentSlide(i)}
              />
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="features-section">
          {features.map(({ title, description }, i) => (
            <div className="feature" key={i}>
              <div className="feature-text">
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </section>

        {/* TESTIMONIAL */}
        {/* <section className="testimonial-section">
          <h2>Kullanıcılarımız Ne Diyor?</h2>
          <blockquote>
            “Taskify sayesinde ekip içi iletişim ve iş takibi kolaylaştı. %40 daha verimli çalışıyoruz.”
            <cite>- Ahmet Yılmaz, Tech Lead</cite>
          </blockquote>
          <blockquote>
            “Modern arayüzü ve hızlı performansı ile favorim oldu.”
            <cite>- Ayşe Kaya, UX Designer</cite>
          </blockquote>
        </section> */}
      </main>

      <footer className="footer">
        
        <p>© 2025 Taskify - RMR Apps & Games. Tüm Hakları Saklıdır.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
