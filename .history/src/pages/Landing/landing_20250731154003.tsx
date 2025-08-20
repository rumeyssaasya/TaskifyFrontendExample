import React from "react";
import "./Landing.css";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="logo">Taskify</div>
        <nav className="nav-links">
          <button onClick={() => navigate("/login")}>Giriş Yap</button>
          <button onClick={() => navigate("/register")}>Kayıt Ol</button>
        </nav>
      </header>

      <main className="hero-section">
        <h1>Görev Yönetimini Kolaylaştır</h1>
        <p>
          Taskify, ekiplerin projelerini düzenlemesine, görevleri yönetmesine ve işbirliğini artırmasına yardımcı olan sade ve güçlü bir görev yönetim uygulamasıdır.
        </p>
        <div className="cta-buttons">
          <button onClick={() => navigate("/auth/register")}>Hemen Başla</button>
          <button onClick={() => navigate("/projects")}>Demo'yu Gör</button>
        </div>
      </main>

      <section className="features">
        <h2>Taskify ile Neler Mümkün?</h2>
        <ul>
          <li>🗂 Kolay görev takibi (To Do, In Progress, Completed)</li>
          <li>👥 Ekip yönetimi ve iş birliği</li>
          <li>🔐 Güvenli giriş (JWT Authentication)</li>
          <li>📱 Mobil uyumlu tasarım</li>
        </ul>
      </section>

      <footer className="footer">
        © 2025 Taskify. Tüm hakları saklıdır.
      </footer>
    </div>
  );
};

export default LandingPage;
