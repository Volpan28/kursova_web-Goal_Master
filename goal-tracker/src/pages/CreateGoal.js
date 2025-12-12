import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateGoal = ({ onAdd }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Навчання');
    const [priority, setPriority] = useState('Medium');
    const [deadline, setDeadline] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title) return;

        onAdd({ title, category, priority, deadline });
        navigate('/goals');
    };

    return (
        <div className="page-container fade-in">
            <div className="form-header">
                <h2>🎯 Створити нову ціль</h2>
                <p>Заповни деталі, щоб почати рух до мрії</p>
            </div>

            <div className="card form-card">
                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>📝 Назва цілі</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Наприклад: Вивчити React за вихідні"
                            className="input-field primary-input"
                            autoFocus
                        />
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>📂 Категорія</label>
                            <div className="select-wrapper">
                                <select value={category} onChange={(e) => setCategory(e.target.value)} className="select-field">
                                    <option>📚 Навчання</option>
                                    <option>💪 Спорт</option>
                                    <option>💼 Робота</option>
                                    <option>🏠 Особисте</option>
                                    <option>💰 Фінанси</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>🔥 Пріоритет</label>
                            <div className="select-wrapper">
                                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="select-field">
                                    <option value="Low">☕ Низький</option>
                                    <option value="Medium">⚡ Середній</option>
                                    <option value="High">🚀 Високий</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>📅 Дедлайн</label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="input-field date-input"
                        />
                    </div>

                    <button type="submit" className="btn-create">
                        <span>Створити ціль</span>
                        <span className="btn-icon">➜</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateGoal;