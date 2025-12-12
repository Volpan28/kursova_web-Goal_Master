import React, { useState } from 'react';

const Diary = ({ diaryEntries, setDiaryEntries }) => {
    const [view, setView] = useState('list');
    const [selectedDate, setSelectedDate] = useState('');
    const [note, setNote] = useState('');
    const [error, setError] = useState('');

    const sortedDates = Object.keys(diaryEntries).sort().reverse();

    const handleCreateNew = () => {
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
        setNote('');
        setError('');
        setView('editor');
    };

    const handleEdit = (date) => {
        setSelectedDate(date);
        setNote(diaryEntries[date]);
        setError('');
        setView('editor');
    };

    const handleSave = () => {
        if (!selectedDate) {
            setError('Будь ласка, оберіть дату');
            return;
        }
        if (view === 'editor' && diaryEntries[selectedDate] && diaryEntries[selectedDate] !== note) {
            if (!window.confirm(`Запис за ${selectedDate} вже існує. Перезаписати його?`)) {
                return;
            }
        }
        setDiaryEntries({ ...diaryEntries, [selectedDate]: note });
        setView('list');
    };

    const handleDelete = (e, date) => {
        e.stopPropagation();
        if (window.confirm('Видалити цей запис?')) {
            const newEntries = { ...diaryEntries };
            delete newEntries[date];
            setDiaryEntries(newEntries);
        }
    };

    return (
        <div className="page-container fade-in">
            {view === 'list' && (
                <>
                    <div className="diary-header">
                        <div>
                            <h2>📔 Мій Щоденник</h2>
                            <p className="subtitle">Твої думки, ідеї та спогади</p>
                        </div>
                        {/* ОНОВЛЕНА КНОПКА */}
                        <button onClick={handleCreateNew} className="btn-new-entry">
                            <span>✏️ Новий запис</span>
                        </button>
                    </div>

                    <div className="diary-list">
                        {sortedDates.length === 0 ? (
                            <div className="empty-state">
                                <p>Щоденник порожній. Напиши щось про сьогодні! ✍️</p>
                            </div>
                        ) : (
                            sortedDates.map(date => (
                                <div key={date} className="diary-card" onClick={() => handleEdit(date)}>
                                    <div className="diary-date-badge">
                                        <span className="day">{date.split('-')[2]}</span>
                                        <span className="month-year">{date.split('-')[1]}/{date.split('-')[0]}</span>
                                    </div>
                                    <div className="diary-preview">
                                        <p>{diaryEntries[date].substring(0, 100)}...</p>
                                    </div>
                                    <button onClick={(e) => handleDelete(e, date)} className="btn-icon-delete">
                                        🗑️
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {view === 'editor' && (
                <div className="diary-editor fade-in">
                    <div className="editor-toolbar">
                        <button onClick={() => setView('list')} className="btn-back">
                            ← Назад
                        </button>
                        <h3>{diaryEntries[selectedDate] ? 'Редагування запису' : 'Новий запис'}</h3>
                    </div>

                    <div className="card editor-card">
                        <div className="form-group">
                            <label>Дата</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="input-field date-input"
                            />
                            {error && <span className="error-text">{error}</span>}
                        </div>

                        <textarea
                            className="diary-textarea"
                            placeholder="Як пройшов твій день? Що нового?"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            autoFocus
                        ></textarea>

                        <div className="editor-actions">
                            <button onClick={handleSave} className="btn-create">
                                💾 Зберегти
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Diary;