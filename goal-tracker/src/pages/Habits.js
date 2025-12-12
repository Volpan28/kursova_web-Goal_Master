import React, { useState } from 'react';

const Habits = ({ habits, setHabits }) => {
    const [newHabit, setNewHabit] = useState('');

    const addHabit = (e) => {
        e.preventDefault();
        if (!newHabit.trim()) return;
        const habit = { id: Date.now(), title: newHabit, completed: false };
        setHabits([...habits, habit]);
        setNewHabit('');
    };

    const toggleHabit = (id) => {
        setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
    };

    const deleteHabit = (id) => {
        if(window.confirm('Видалити цю звичку?')) {
            setHabits(habits.filter(h => h.id !== id));
        }
    };

    const resetDaily = () => {
        if(window.confirm("Почати новий день? Всі галочки будуть скинуті.")) {
            setHabits(habits.map(h => ({ ...h, completed: false })));
        }
    };

    return (
        <div className="page-container fade-in">
            <div className="page-header">
                <div>
                    <h2>🌱 Трекер звичок</h2>
                    <p className="subtitle">Маленькі кроки до великих змін</p>
                </div>
                <button onClick={resetDaily} className="btn-secondary">
                    🔄 Новий день
                </button>
            </div>

            <div className="card habits-card">
                <form onSubmit={addHabit} className="add-habit-wrapper">
                    <input
                        type="text"
                        value={newHabit}
                        onChange={(e) => setNewHabit(e.target.value)}
                        placeholder="Що хочеш робити щодня?"
                        className="input-field habit-input"
                    />
                    <button type="submit" className="btn-primary btn-add-habit">
                        +
                    </button>
                </form>

                <div className="habits-list">
                    {habits.length === 0 && (
                        <div className="empty-state-small">
                            <span>📭</span> Поки що звичок немає
                        </div>
                    )}

                    {habits.map(habit => (
                        <div key={habit.id} className={`habit-item ${habit.completed ? 'completed' : ''}`}>
                            <div className="habit-click-area" onClick={() => toggleHabit(habit.id)}>
                                <div className={`custom-checkbox ${habit.completed ? 'checked' : ''}`}>
                                    {habit.completed && '✓'}
                                </div>
                                <span className="habit-title">{habit.title}</span>
                            </div>
                            <button onClick={() => deleteHabit(habit.id)} className="btn-icon-delete">
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Habits;