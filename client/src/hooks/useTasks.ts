import { useState, useCallback } from 'react';
import apiClient from '../api/client';
import type { Task } from '../types';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get<Task[]>('/tasks');
      setTasks(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (dto: {
  title: string;
  description?: string;
  assignees?: string[];
}) => {
  await apiClient.post<Task>('/tasks', dto);
  await fetchTasks();
}, [fetchTasks]);

  const updateTask = useCallback(async (id: string, dto: {
  title?: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done';
  assignees?: string[];
}) => {
  await apiClient.patch<Task>(`/tasks/${id}`, dto);
  await fetchTasks();
}, [fetchTasks]);

  const removeTask = useCallback(async (id: string) => {
    await apiClient.delete(`/tasks/${id}`);
    setTasks(prev => prev.filter(t => t._id !== id));
  }, []);

  return { tasks, loading, fetchTasks, createTask, updateTask, removeTask };
}