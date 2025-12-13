import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ theme, toggleTheme, userStats, currentUser, logout }) => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="app-header">
            <div className="header-content">
                <div className="logo-row">
                    <div className="logo-section">
                        <Link to="/" className="logo" onClick={closeMenu}>🚀 GoalMaster</Link>
                        {location.pathname !== '/' && currentUser && (
                            <div className="level-badge">Lvl {userStats.level}</div>
                        )}
                    </div>

                    {/* Кнопка Бургер (видима тільки на мобільному) */}
                    <button
                        className="burger-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Навігація */}
                <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
                    {currentUser && (
                        <>
                            <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''} onClick={closeMenu}>
                                Дашборд
                            </Link>

                            <Link to="/goals" className={location.pathname === '/goals' ? 'active' : ''} onClick={closeMenu}>
                                Цілі
                            </Link>

                            <Link to="/habits" className={location.pathname === '/habits' ? 'active' : ''} onClick={closeMenu}>
                                Звички
                            </Link>

                            <Link to="/diary" className={location.pathname === '/diary' ? 'active' : ''} onClick={closeMenu}>
                                Щоденник
                            </Link>
                        </>
                    )}

                    {/* ВИПРАВЛЕНО: Кнопки тема + вийти */}
                    <div className="header-actions">
                        <button onClick={() => { toggleTheme(); closeMenu(); }} className="theme-toggle" title="Змінити тему">
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>

                        {currentUser ? (
                            <button onClick={() => { logout(); closeMenu(); }} className="btn-logout">
                                Вийти
                            </button>
                        ) : (
                            <Link to="/login" className="btn-nav-create" onClick={closeMenu}>
                                Увійти
                            </Link>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;