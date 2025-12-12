import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Link } from 'react-router-dom';
import GoalItem from '../components/GoalItem';

const KanbanBoard = ({ goals, setGoals, onUpdateData, onStatusChange }) => {

    const columns = {
        todo: { title: '📝 Треба зробити', items: goals.filter(g => g.status === 'todo') },
        in_progress: { title: '🔥 В процесі', items: goals.filter(g => g.status === 'in_progress') },
        done: { title: '✅ Зроблено', items: goals.filter(g => g.status === 'done') }
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination } = result;
        const sourceColId = source.droppableId;
        const destColId = destination.droppableId;
        if (sourceColId === destColId && source.index === destination.index) return;

        const draggedGoal = columns[sourceColId].items[source.index];

        const updatedGoals = goals.map(g => {
            if (g.id === draggedGoal.id) {
                return { ...g, status: destColId, completed: destColId === 'done' };
            }
            return g;
        });

        setGoals(updatedGoals);

        if (destColId === 'done' && sourceColId !== 'done') onStatusChange(true);
        if (sourceColId === 'done' && destColId !== 'done') onStatusChange(false);
    };

    return (
        <div className="page-container fade-in">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>📌 Канбан-дошка</h2>

                {/* 🔥 ОНОВЛЕНА КНОПКА (використовуємо той самий клас, що і в щоденнику) */}
                <Link to="/create" className="btn-new-entry" style={{ textDecoration: 'none' }}>
                    <span>🎯 Нова ціль</span>
                </Link>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="kanban-container">
                    {Object.entries(columns).map(([colId, column]) => (
                        <div key={colId} className="kanban-column">
                            <h3 className={`col-header ${colId}`}>{column.title} ({column.items.length})</h3>
                            <Droppable droppableId={colId}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`kanban-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                                    >
                                        {column.items.map((goal, index) => (
                                            <Draggable key={goal.id} draggableId={String(goal.id)} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{ ...provided.draggableProps.style, marginBottom: '10px' }}
                                                    >
                                                        <GoalItem
                                                            goal={goal}
                                                            onUpdate={onUpdateData}
                                                            onDelete={(id) => {
                                                                const newGoals = goals.filter(g => g.id !== id);
                                                                setGoals(newGoals);
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default KanbanBoard;