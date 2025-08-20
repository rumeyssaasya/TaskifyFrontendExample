import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

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
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    { image: image1, title: "Feature 1", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { image: image2, title: "Feature 2", description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { image: image3, title: "Feature 3", description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco." },
    { image: image4, title: "Feature 4", description: "Duis aute irure dolor in reprehenderit in voluptate velit esse." },
    { image: image5, title: "Feature 5", description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa." },
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

      {/* FEATURES HORIZONTAL SCROLL */}
      <section className="features-horizontal-section">
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          modules={[Pagination, Autoplay]}
          className="features-swiper"
          grabCursor={true}
        >
          {features.map((feature, i) => (
            <SwiperSlide key={i}>
              <div className="feature-slide-horizontal">
                <div className="feature-image">
                  <img src={feature.image} alt={feature.title} />
                </div>
                <div
                  className={`feature-text ${activeIndex === i ? "active" : "inactive"}`}
                >
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Taskify. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
