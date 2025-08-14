import React from "react";
import { useNavigate } from "react-router-dom";
import "./landing.css"; // Assuming you have a CSS file for styling

const features = [
  {
    title: "Kolay Görev Yönetimi",
    description:
      "Görevlerinizi hızlı ve pratik şekilde organize edin, takip edin ve tamamlayın.",
    image: "../../assets/images/1.png",
  },
  {
    title: "Ekip İş Birliği",
    description:
      "Ekip üyelerinizle gerçek zamanlı iletişim kurarak verimliliği artırın.",
    image: "/assets/images/2.png",
  },
  {
    title: "Güvenli ve Hızlı Giriş",
    description:
      "JWT tabanlı kimlik doğrulama ile verileriniz her zaman güvende.",
    image: "/assets/images/3.png",
  },
  {
    title: "Mobil Uyumlu Tasarım",
    description:
      "Her cihazda mükemmel deneyim, ofiste veya hareket halinde kolay erişim.",
    image: "/assets/images/4.png",
  },
  {
    title: "Anlık Proje Güncellemeleri",
    description:
      "Projelerinizdeki değişiklikleri anında takip edin, asla geride kalmayın.",
    image: "/assets/images/5.png",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

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
        </nav>
      </header>

      <main className="main-content">
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
            <img src="/assets/images/hero.png" alt="Taskify Hero" />
          </div>
        </section>

        <section className="features-section">
          {features.map(({ title, description, image }, i) => (
            <div className="feature" key={i}>
              <img src={image} alt={title} />
              <div className="feature-text">
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="testimonial-section">
          <h2>Kullanıcılarımız Ne Diyor?</h2>
          <blockquote>
            “Taskify sayesinde ekip içi iletişim ve iş takibi kolaylaştı. %40 daha verimli çalışıyoruz.”
            <cite>- Ahmet Yılmaz, Tech Lead</cite>
          </blockquote>
          <blockquote>
            “Modern arayüzü ve hızlı performansı ile favorim oldu.”
            <cite>- Ayşe Kaya, UX Designer</cite>
          </blockquote>
        </section>
      </main>

      <footer className="footer">
        <p>© 2025 Taskify. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
