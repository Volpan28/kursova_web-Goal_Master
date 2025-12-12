import React from 'react';
// Link нам тут більше не потрібен, якщо ми прибрали кнопку
import StatsChart from '../components/StatsChart';

const Dashboard = ({ goals, userStats, achievements }) => {
    const total = goals.length;
    const completed = goals.filter(g => g.completed).length; // Враховуємо completed навіть якщо статус done
    // Для точності Канбану:
    const doneCount = goals.filter(g => g.status === 'done').length;

    const efficiency = total === 0 ? 0 : Math.round((doneCount / total) * 100);
    const levelProgress = Math.round((userStats.xp / userStats.nextLevelXp) * 100);

    return (
        <div className="page-container fade-in">
            {/* --- Блок Привітання --- */}
            <div className="welcome-banner">
                <div>
                    <h2>👋 З поверненням!</h2>
                    <p>Рівень {userStats.level}</p>
                </div>
                <div className="level-circle"><span>{userStats.level}</span></div>
            </div>

            <div className="xp-container card">
                <div className="xp-header">
                    <span>XP Progress</span>
                    <span>{userStats.xp} / {userStats.nextLevelXp}</span>
                </div>
                <div className="xp-bar-bg">
                    <div className="xp-bar-fill" style={{ width: `${levelProgress}%` }}></div>
                </div>
            </div>

            {/* --- Статистика --- */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Всього</h3>
                    <p className="stat-number">{total}</p>
                </div>
                <div className="stat-card success">
                    <h3>Виконано</h3>
                    <p className="stat-number">{doneCount}</p>
                </div>
                <div className="stat-card">
                    <h3>Ефективність</h3>
                    <p className="stat-percent">{efficiency}%</p>
                </div>
            </div>

            {/* --- Графік та Ачівки --- */}
            <div className="dashboard-columns">
                <div className="card">
                    <StatsChart goals={goals} />
                </div>

                <div className="card">
                    <h3>🏆 Досягнення</h3>
                    {achievements.length === 0 ? (
                        <p className="empty-msg">Поки що пусто. Працюй старанно!</p>
                    ) : (
                        <div className="achievements-list">
                            {achievements.map(a => (
                                <div key={a.id} className="achievement-item">
                                    <span className="achievement-icon">{a.icon}</span>
                                    <div className="achievement-info">
                                        <h4>{a.title}</h4>
                                        <span className="achievement-desc">Розблоковано!</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* КНОПКУ ЗНИЗУ ПРИБРАЛИ */}
        </div>
    );
};

export default Dashboard;