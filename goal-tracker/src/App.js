import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { db } from './firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import './App.css';

// Імпорт компонентів
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import KanbanBoard from './pages/KanbanBoard';
import CreateGoal from './pages/CreateGoal';
import Habits from './pages/Habits';
import Diary from './pages/Diary';
import Login from './pages/Login';

// --- ДОПОМІЖНІ КОМПОНЕНТИ ---

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  // Якщо дані ще вантажаться, currentUser може бути null, але loading true.
  // Тут спрощена перевірка. Якщо у вас є loading в useAuth, краще використовувати його.
  return currentUser ? children : <Navigate to="/login" />;
};

const HeaderWrapper = (props) => {
  const { currentUser, logout } = useAuth();
  return <Header {...props} currentUser={currentUser} logout={logout} />;
};

// --- ГОЛОВНА ЛОГІКА ДОДАТКУ (MainApp) ---
// Ми винесли всю логіку сюди, щоб вона могла безпечно використовувати useAuth()
function MainApp() {
  const { currentUser } = useAuth(); // Тепер це працює, бо MainApp всередині AuthProvider

  // --- STATE ---
  const [goals, setGoals] = useState([]);
  const [userStats, setUserStats] = useState({ level: 1, xp: 0, nextLevelXp: 100 });
  const [achievements, setAchievements] = useState([]);
  const [habits, setHabits] = useState([]);
  const [diaryEntries, setDiaryEntries] = useState({});
  const [theme, setTheme] = useState('light');
  const [loadingData, setLoadingData] = useState(true);

  // --- 1. ЗАВАНТАЖЕННЯ ДАНИХ ---
  useEffect(() => {
    if (!currentUser) {
      setGoals([]);
      setHabits([]);
      setDiaryEntries({});
      setUserStats({ level: 1, xp: 0, nextLevelXp: 100 });
      setAchievements([]);
      setLoadingData(false);
      return;
    }

    setLoadingData(true);
    const userDocRef = doc(db, 'users', currentUser.uid);

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setGoals(data.goals || []);
        setUserStats(data.userStats || { level: 1, xp: 0, nextLevelXp: 100 });
        setAchievements(data.achievements || []);
        setHabits(data.habits || []);
        setDiaryEntries(data.diaryEntries || {});
        setTheme(data.theme || 'light');
      } else {
        // Створення профілю для нового юзера
        setDoc(userDocRef, {
          goals: [],
          userStats: { level: 1, xp: 0, nextLevelXp: 100 },
          achievements: [],
          habits: [],
          diaryEntries: {},
          theme: 'light'
        });
      }
      setLoadingData(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // --- 2. ЗБЕРЕЖЕННЯ ДАНИХ ---
  const updateUserData = async (updates) => {
    if (!currentUser) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    try {
      await setDoc(userDocRef, updates, { merge: true });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  // --- 3. UI ЕФЕКТИ ---
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // --- ФУНКЦІЇ ---
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    updateUserData({ theme: newTheme });
  };

  const addGoal = (goal) => {
    const newGoal = {
      id: Date.now(),
      ...goal,
      completed: false,
      status: 'todo',
      steps: [],
      priority: goal.priority || 'Medium'
    };
    const newGoals = [newGoal, ...goals];
    setGoals(newGoals);
    updateUserData({ goals: newGoals });
  };

  const updateGoalData = (id, newData) => {
    const newGoals = goals.map(g => g.id === id ? newData : g);
    setGoals(newGoals);
    updateUserData({ goals: newGoals });
  };

  const handleSetHabits = (newHabits) => {
    setHabits(newHabits);
    updateUserData({ habits: newHabits });
  };

  const handleSetDiary = (newDiary) => {
    setDiaryEntries(newDiary);
    updateUserData({ diaryEntries: newDiary });
  };

  const handleSetGoals = (newGoals) => {
    setGoals(newGoals);
    updateUserData({ goals: newGoals });
  };

  const checkAchievements = (completedCount, currentAchievements) => {
    const rules = [
      { id: 'first_blood', count: 1, title: 'Перший крок', icon: '🦶' },
      { id: 'five_goals', count: 5, title: 'Дай п’ять!', icon: '✋' },
      { id: 'master', count: 10, title: 'Машина продуктивності', icon: '🤖' }
    ];

    let newUnlock = false;
    let updatedAchievements = [...currentAchievements];

    rules.forEach(rule => {
      if (completedCount >= rule.count && !updatedAchievements.find(a => a.id === rule.id)) {
        updatedAchievements.push(rule);
        alert(`🏆 Нове досягнення: ${rule.title}!`);
        newUnlock = true;
      }
    });

    if (newUnlock) {
      setAchievements(updatedAchievements);
      updateUserData({ achievements: updatedAchievements });
    }
  };

  const handleTaskCompletion = (isCompleted) => {
    let { xp, level, nextLevelXp } = userStats;
    const xpAmount = 50;

    if (isCompleted) {
      xp += xpAmount;
      if (xp >= nextLevelXp) {
        level += 1;
        xp = xp - nextLevelXp;
        nextLevelXp = Math.round(nextLevelXp * 1.2);
        alert(`🎉 Рівень підвищено! Тепер ти ${level}-го рівня!`);
      }
      const completedCount = goals.filter(g => g.status === 'done').length + 1;
      checkAchievements(completedCount, achievements);
    } else {
      xp -= xpAmount;
      if (xp < 0) {
        if (level > 1) {
          level -= 1;
          nextLevelXp = Math.round(nextLevelXp / 1.2);
          xp = nextLevelXp + xp;
        } else {
          xp = 0;
        }
      }
    }

    const newStats = { level, xp, nextLevelXp };
    setUserStats(newStats);
    updateUserData({ userStats: newStats });
  };

  if (loadingData && currentUser) {
    return <div className="loading-screen">Завантаження твого світу... 🌍</div>;
  }

  return (
      <Router>
        <div className="app-wrapper">
          <HeaderWrapper theme={theme} toggleTheme={toggleTheme} userStats={userStats} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />

              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard goals={goals} userStats={userStats} achievements={achievements} />
                </PrivateRoute>
              } />

              <Route path="/goals" element={
                <PrivateRoute>
                  <KanbanBoard
                      goals={goals}
                      setGoals={handleSetGoals}
                      onUpdateData={updateGoalData}
                      onStatusChange={handleTaskCompletion}
                  />
                </PrivateRoute>
              } />

              <Route path="/create" element={<PrivateRoute><CreateGoal onAdd={addGoal} /></PrivateRoute>} />
              <Route path="/habits" element={<PrivateRoute><Habits habits={habits} setHabits={handleSetHabits} /></PrivateRoute>} />
              <Route path="/diary" element={<PrivateRoute><Diary diaryEntries={diaryEntries} setDiaryEntries={handleSetDiary} /></PrivateRoute>} />

            </Routes>
          </main>
        </div>
      </Router>
  );
}

// --- КОРЕНЕВИЙ КОМПОНЕНТ ---
// Він просто надає AuthProvider для MainApp
function App() {
  return (
      <AuthProvider>
        <MainApp />
      </AuthProvider>
  );
}

export default App;