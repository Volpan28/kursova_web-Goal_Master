import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true); // Перемикач Вхід/Реєстрація
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, signup, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password);
            }
            navigate('/dashboard');
        } catch (err) {
            setError('Помилка: ' + err.message);
        }
    };

    const handleGoogle = async () => {
        try {
            await loginWithGoogle();
            navigate('/dashboard');
        } catch (err) {
            setError('Помилка Google входу');
        }
    };

    return (
        <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card form-card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                    {isLogin ? '👋 Вхід' : '🚀 Реєстрація'}
                </h2>

                {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Пароль</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-create" style={{ marginTop: '20px' }}>
                        {isLogin ? 'Увійти' : 'Зареєструватися'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                    <button onClick={handleGoogle} className="btn-secondary" style={{ width: '100%' }}>
                        G Увійти через Google
                    </button>
                </div>

                <p style={{ textAlign: 'center', marginTop: '20px', cursor: 'pointer', color: 'var(--primary)' }} onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Немає акаунту? Створити' : 'Вже є акаунт? Увійти'}
                </p>
            </div>
        </div>
    );
};

export default Login;