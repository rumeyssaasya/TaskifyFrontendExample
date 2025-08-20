import React, { useState, useEffect } from "react";
import "./Landing.css";
import { useNavigate } from "react-router-dom";

// Sample images - replace these with your actual images
import image1 from "./images/demo1.jpg";
import image2 from "./images/demo2.jpg";
import image3 from "./images/demo3.jpg";
import image4 from "./images/demo4.jpg";
import image5 from "./images/demo5.jpg";

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const features = [
    "🗂 Kolay görev takibi (To Do, In Progress, Completed)",
    "👥 Ekip yönetimi ve iş birliği",
    "🔐 Güvenli giriş (JWT Authentication)",
    "📱 Mobil uyumlu tasarım",
    "📊 Gerçek zamanlı güncellemeler",
    "🔔 Bildirim sistemi"
  ];

  const testimonials = [
    {
      quote: "Taskify sayesinde ekibimizin verimliliği %40 arttı. Artık hiçbir görev atlanmıyor!",
      author: "Ahmet Yılmaz, TechLead"
    },
    {
      quote: "Kullanımı çok kolay ve arayüzü oldukça şık. Proje yönetimi artık çok daha keyifli.",
      author: "Ayşe Kaya, UX Designer"
    },
    {
      quote: "Farklı departmanlarla işbirliği yapmak hiç bu kadar kolay olmamıştı. Kesinlikle tavsiye ederim.",
      author: "Mehmet Demir, Product Manager"
    }
  ];

  const demoImages = [image1, image2, image3, image4, image5];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % demoImages.length);
    }, 5000);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(slideInterval);
    };
  }, [scrolled, demoImages.length]);

  return (
    <div className="landing-container">
      {/* Header */}
      <header className={`landing-header ${scrolled ? "scrolled" : ""}`}>
        <div className="logo">Taskify</div>
        <nav className="nav-links">
          <button onClick={() => navigate("/auth/login")}>Giriş Yap</button>
          <button onClick={() => navigate("/auth/register")}>Kayıt Ol</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="section hero-section">
        <div className="hero-content">
          <h1 className="fade-in">Görev Yönetimini Kolaylaştır</h1>
          <p className="fade-in">
            Taskify, ekiplerin projelerini düzenlemesine, görevleri yönetmesine ve işbirliğini artırmasına yardımcı olan sade ve güçlü bir görev yönetim uygulamasıdır.
          </p>
          <div className="cta-buttons fade-in">
            <button onClick={() => navigate("/auth/register")}>Hemen Başla</button>
            <button className="secondary" onClick={() => navigate("/projects")}>Demo'yu Gör</button>
          </div>
        </div>
        <div className="hero-pattern"></div>
      </section>

      {/* Features Section */}
      <section className="section features-section">
        <div className="features-content">
          <h2 className="slide-in-left">Taskify ile Neler Mümkün?</h2>
          <ul className="features-grid slide-in-right">
            {features.map((feature, index) => (
              <li key={index} className="feature-card">{feature}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section gallery-section">
        <div className="gallery-container">
          <h2>Taskify Nasıl Çalışır?</h2>
          <div className="image-slider">
            <div 
              className="slider-images" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {demoImages.map((img, index) => (
                <div key={index} className="slider-image-container">
                  <img src={img} alt={`Demo ${index + 1}`} className="slider-image" />
                </div>
              ))}
            </div>
            <div className="slider-controls">
              {demoImages.map((_, index) => (
                <div 
                  key={index}
                  className={`slider-dot ${index === currentSlide ? "active" : ""}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section testimonials-section">
        <div className="testimonials-container">
          <h2>Kullanıcılarımız Ne Diyor?</h2>
          <div className="testimonial-slider">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-slide">
                <p className="testimonial-content">"{testimonial.quote}"</p>
                <p className="testimonial-author">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#">Gizlilik Politikası</a>
            <a href="#">Kullanım Şartları</a>
            <a href="#">İletişim</a>
            <a href="#">SSS</a>
          </div>
          <div className="social-icons">
            <a href="#" className="social-icon">📱</a>
            <a href="#" className="social-icon">💻</a>
            <a href="#" className="social-icon">📧</a>
          </div>
          <div className="copyright">
            © 2025 Taskify. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;