import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom } from './atoms/auth.atom';
import apiClient from './api/client';
import type { User } from './types';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [, setUser] = useAtom(userAtom);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      apiClient.get<User>('/auth/me')
        .then(({ data }) => setUser(data))
        .catch(() => {
          localStorage.removeItem('access_token');
          setUser(null);
        });
    }
  }, [setUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;