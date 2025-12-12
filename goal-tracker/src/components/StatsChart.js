import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatsChart = ({ goals }) => {
    // Підрахунок цілей по категоріях
    const categories = {};
    goals.forEach(goal => {
        categories[goal.category] = (categories[goal.category] || 0) + 1;
    });

    const data = {
        labels: Object.keys(categories),
        datasets: [
            {
                label: 'Кількість цілей',
                data: Object.values(categories),
                backgroundColor: [
                    '#6366f1', // Primary
                    '#10b981', // Success
                    '#f59e0b', // Warning
                    '#ec4899', // Pink
                    '#8b5cf6', // Violet
                ],
                borderColor: '#ffffff',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: '#64748b' // Колір тексту легенди
                }
            }
        }
    };

    return (
        <div className="chart-container">
            <h3>📊 Аналітика категорій</h3>
            {goals.length > 0 ? (
                <div style={{ width: '300px', margin: '0 auto' }}>
                    <Doughnut data={data} options={options} />
                </div>
            ) : (
                <p className="empty-msg">Додайте цілі, щоб побачити статистику</p>
            )}
        </div>
    );
};

export default StatsChart;