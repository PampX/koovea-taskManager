import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { userAtom } from '../atoms/auth.atom';
import apiClient from '../api/client';
import type { AuthResponse } from '../types';

export function useAuth() {
  const [user, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    localStorage.setItem('access_token', data.access_token);
    await fetchMe();
    navigate('/tasks');
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
    });
    localStorage.setItem('access_token', data.access_token);
    await fetchMe();
    navigate('/tasks');
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    navigate('/login');
  };

  const fetchMe = async () => {
    const { data } = await apiClient.get('/auth/me');
    setUser(data);
};

  return { user, login, register, logout, fetchMe };
}