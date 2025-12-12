import React, { useState } from 'react';
import GoalItem from '../components/GoalItem';

const AllGoals = ({ goals, onToggle, setGoals }) => {
    const [filter, setFilter] = useState('all');

    const deleteGoal = (id) => {
        setGoals(goals.filter(g => g.id !== id));
    };

    const filteredGoals = goals.filter(g => {
        if (filter === 'completed') return g.completed;
        if (filter === 'active') return !g.completed;
        return true;
    });

    return (
        <div className="page-container fade-in">
            <div className="page-header">
                <h2>Мої цілі</h2>
                <div className="filters">
                    <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>Всі</button>
                    <button onClick={() => setFilter('active')} className={filter === 'active' ? 'active' : ''}>В процесі</button>
                    <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Готові</button>
                </div>
            </div>

            <div className="goals-list">
                {filteredGoals.length === 0 ? <p className="empty-msg">Список порожній 📭</p> : null}
                {filteredGoals.map(goal => (
                    <GoalItem key={goal.id} goal={goal} onToggle={onToggle} onDelete={deleteGoal} />
                ))}
            </div>
        </div>
    );
};

export default AllGoals;