import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import AOS from "aos";
import "aos/dist/aos.css";

import image1 from "../../assets/images/1.png";
import image2 from "../../assets/images/2.png";
import image3 from "../../assets/images/3.png";
import image4 from "../../assets/images/4.png";
import image5 from "../../assets/images/5.png";

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    {
      title: "🗂 Kolay Görev Takibi",
      description: "Görevlerinizi To Do, In Progress, Completed sütunlarında kolayca yönetin.",
      image: image1,
    },
    {
      title: "👥 Ekip Yönetimi",
      description: "Ekip arkadaşlarınızla gerçek zamanlı iş birliği yapın.",
      image: image2,
    },
    {
      title: "🔐 Güvenli Giriş",
      description: "JWT Authentication ile verileriniz her zaman güvende.",
      image: image3,
    },
    {
      title: "📱 Mobil Uyumlu",
      description: "Her cihazda mükemmel kullanıcı deneyimi.",
      image: image4,
    },
    {
      title: "📊 Anlık Güncellemeler",
      description: "Proje durumunu gerçek zamanlı olarak takip edin.",
      image: image5,
    },
  ];

  const testimonials = [
    { quote: "Taskify ile ekibimizin verimliliği %40 arttı.", author: "Ahmet Yılmaz, TechLead" },
    { quote: "Kullanımı kolay ve arayüzü çok şık.", author: "Ayşe Kaya, UX Designer" },
    { quote: "Farklı departmanlarla işbirliği hiç bu kadar kolay olmamıştı.", author: "Mehmet Demir, Product Manager" },
  ];

  return (
    <div className="landing-container">
      {/* HEADER */}
      <header className={`landing-header ${scrolled ? "scrolled" : ""}`}>
        <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Taskify</div>
        <nav className="nav-links">
          <button onClick={() => navigate("/auth/login")}>Giriş Yap</button>
          <button onClick={() => navigate("/auth/register")} className="btn-primary">Kayıt Ol</button>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content" data-aos="fade-up">
          <h1>Görev Yönetimini Kolaylaştır</h1>
          <p>
            Taskify, ekiplerin projelerini düzenlemesine, görevleri yönetmesine ve işbirliğini artırmasına yardımcı olan sade ve güçlü bir görev yönetim uygulamasıdır.
          </p>
          <div className="cta-buttons">
            <button onClick={() => navigate("/auth/register")} className="btn-primary">Hemen Başla</button>
            <button onClick={() => navigate("/projects")} className="btn-secondary">Demo'yu Gör</button>
          </div>
        </div>
        <div className="scroll-down">⬇</div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="features-container">
          {features.map((feature, i) => (
            <div className="feature-card" key={i} data-aos="fade-up" data-aos-delay={i * 150}>
              <img src={feature.image} alt={feature.title} />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section">
        <h2 data-aos="fade-up">Kullanıcılarımız Ne Diyor?</h2>
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          modules={[Autoplay, Pagination]}
          className="testimonials-swiper"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="testimonial-slide" data-aos="fade-up">
                <p>"{t.quote}"</p>
                <span>- {t.author}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2025 Taskify. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
