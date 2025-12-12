import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="landing-container fade-in">
            <div className="hero-section">
                <h1 className="hero-title">Твій шлях до <span className="highlight">успіху</span> починається тут</h1>
                <p className="hero-subtitle">
                    Керуй цілями, відстежуй звички та записуй свої думки в єдиній системі GoalMaster.
                </p>
                <Link to="/dashboard" className="btn-start">Розпочати подорож 🚀</Link>
            </div>

            <div className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon">🎯</div>
                    <h3>Розумні цілі</h3>
                    <p>Розбивай великі мрії на маленькі кроки та слідкуй за прогресом.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3>Гейміфікація</h3>
                    <p>Отримуй XP за кожну виконану задачу та підвищуй свій рівень.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">💧</div>
                    <h3>Корисні звички</h3>
                    <p>Трекер води, спорту та щоденних ритуалів.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">📔</div>
                    <h3>Особистий щоденник</h3>
                    <p>Фіксуй свої думки та аналізуй дні в зручному календарі.</p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;