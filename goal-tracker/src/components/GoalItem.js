import React, { useState } from 'react';

const GoalItem = ({ goal, onUpdate, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [newStep, setNewStep] = useState('');

    // Обчислення прогресу підцілей
    const steps = goal.steps || [];
    const completedSteps = steps.filter(s => s.completed).length;
    const progress = steps.length > 0
        ? Math.round((completedSteps / steps.length) * 100)
        : 0;

    // Додавання кроку
    const handleAddStep = (e) => {
        e.preventDefault();
        if (!newStep.trim()) return;

        const updatedSteps = [...steps, { id: Date.now(), title: newStep, completed: false }];
        onUpdate(goal.id, { ...goal, steps: updatedSteps });
        setNewStep('');
    };

    // Перемикання кроку
    const toggleStep = (stepId) => {
        const updatedSteps = steps.map(s =>
            s.id === stepId ? { ...s, completed: !s.completed } : s
        );
        onUpdate(goal.id, { ...goal, steps: updatedSteps });
    };

    // Колір пріоритету
    const getPriorityColor = (p) => {
        switch(p) {
            case 'High': return '#ef4444'; // Червоний
            case 'Medium': return '#f59e0b'; // Жовтий
            default: return '#10b981'; // Зелений
        }
    };

    return (
        <div className="goal-card-dnd">
            <div className="goal-header-dnd">
                <div className="badges">
                    <span className="badge category">{goal.category}</span>
                    <span className="badge priority" style={{ background: getPriorityColor(goal.priority) }}>
            {goal.priority || 'Low'}
          </span>
                </div>
                <button onClick={() => onDelete(goal.id)} className="btn-close">×</button>
            </div>

            <h4 onClick={() => setIsExpanded(!isExpanded)} className="goal-title">
                {goal.title}
            </h4>

            {/* Прогрес бар підцілей */}
            {steps.length > 0 && (
                <div className="mini-progress">
                    <div className="mini-bar" style={{ width: `${progress}%` }}></div>
                </div>
            )}

            {/* Розкривний список підцілей */}
            {isExpanded && (
                <div className="subtasks-area">
                    <ul className="subtasks-list">
                        {steps.map(step => (
                            <li key={step.id} className={step.completed ? 'completed' : ''}>
                                <input
                                    type="checkbox"
                                    checked={step.completed}
                                    onChange={() => toggleStep(step.id)}
                                />
                                <span>{step.title}</span>
                            </li>
                        ))}
                    </ul>
                    <form onSubmit={handleAddStep} className="add-step-form">
                        <input
                            value={newStep}
                            onChange={(e) => setNewStep(e.target.value)}
                            placeholder="+ Крок"
                        />
                        <button type="submit">OK</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default GoalItem;