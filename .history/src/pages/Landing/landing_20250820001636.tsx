import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSwipeable } from "react-swipeable"; // 👈 eklendi
import "./landing.css";

import img from "../../assets/images/lBackground.png";
import hero from "../../assets/images/hero2.png";
import expPhoto1 from "../../assets/images/landing1.png";
import expPhoto2 from "../../assets/images/landing2.png";
import expPhoto3 from "../../assets/images/landing3.png";
import expPhoto4 from "../../assets/images/landing4.png";
import expPhoto5 from "../../assets/images/landing5.png";
import expPhoto6 from "../../assets/images/landin6.png";
import expPhoto7 from "../../assets/images/landing7.png";

const features = [
  { title: "Kolay Görev Yönetimi", description: "Görevlerinizi hızlı ve pratik şekilde organize edin, takip edin ve tamamlayın.", image: img },
  { title: "Ekip İş Birliği", description: "Ekip üyelerinizle gerçek zamanlı iletişim kurarak verimliliği artırın.", image: img },
  { title: "Güvenli ve Hızlı Giriş", description: "JWT tabanlı kimlik doğrulama ile verileriniz her zaman güvende.", image: img },
  { title: "Mobil Uyumlu Tasarım", description: "Her cihazda mükemmel deneyim, ofiste veya hareket halinde kolay erişim.", image: img },
  { title: "Anlık Proje Güncellemeleri", description: "Projelerinizdeki değişiklikleri anında takip edin, asla geride kalmayın.", image: img },
];

const sliderData = [
  { img: expPhoto1, text: "Görevlerinizi tek ekrandan yönetin." },
  { img: expPhoto2, text: "Ekiplerinizle iş birliğini güçlendirin." },
  { img: expPhoto3, text: "Güvenli ve hızlı giriş deneyimi." },
  { img: expPhoto4, text: "Mobilde bile sorunsuz kullanım." },
  { img: expPhoto5, text: "Her an proje güncellemelerinden haberdar olun." },
  { img: expPhoto6, text: "" },
  { img: expPhoto7, text: "" },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // otomatik geçiş
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // swipe / mouse drag eventleri
  const handlers = useSwipeable({
    onSwipedLeft: () =>
      setCurrentSlide((prev) => (prev + 1) % sliderData.length),
    onSwipedRight: () =>
      setCurrentSlide((prev) =>
        prev === 0 ? sliderData.length - 1 : prev - 1
      ),
    trackMouse: true, // 👈 mouse drag desteği
  });

  return (
    <div className="landing-wrapper">
      <header className="header">
        <div className="logo">Taskify</div>
        <nav className="auth-navbar">
          <input type="checkbox" id="menu-toggle" className="menu-checkbox" />
          <label htmlFor="menu-toggle" className="menu-button">☰</label>
          <ul className="menu">
            <li><Link to="/auth/login">Giriş Yap</Link></li>
            <li><Link to="/auth/register">Kayıt Ol</Link></li>
            <li><a href="mailto:taskifyRMR@gmail.com">İletişim</a></li>
          </ul>
        </nav>
        <nav>
          <button className="btn login" onClick={() => navigate("/auth/login")}>Giriş Yap</button>
          <button className="btn register" onClick={() => navigate("/auth/register")}>Kayıt Ol</button>
          <button className="btn connection">
            <a
              className="btn-link"
              href="mailto:taskifyRMR@gmail.com"
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
            </div>
          </div>
          <div className="hero-image">
            <img src={hero} alt="Taskify Hero" className="hero-img" />
          </div>
        </section>

        {/* SLIDER */}
        <section className="slider-section" {...handlers}>
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
      </main>

      <footer className="footer">
        <p>© 2025 Taskify - RMR Apps & Games. Tüm Hakları Saklıdır.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
