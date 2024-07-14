import React from 'react';
import '../assets/css/hero.css';


const Hero = () => {
  return (
    <div className="hero-section">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title-gragas">Gragas</h1>
        <h1 className="hero-title">Gerencie as suas finanças com facilidade</h1>
        <p className="hero-subtitle">Descubra as melhores ferramentas para controle financeiro</p>
        <div className="hero-buttons">
          <button className="hero-button" onClick={() => window.location.href = "/login"}>Login</button>
          <button className="hero-button" onClick={() => window.location.href = "/signup"}>Sign Up</button>
          <button className="hero-button" onClick={() => window.location.href = "/informacoes"}>Informações</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
