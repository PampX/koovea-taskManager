import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  TextField,
} from '@mui/material';
import { useAtom } from 'jotai';
import { userAtom } from '../atoms/auth.atom';
import { useTasks } from '../hooks/useTasks';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskFormDialog from '../components/TaskFormDialog';
import apiClient from '../api/client';
import type { Task, User } from '../types';

function TasksPage() {
  const [user] = useAtom(userAtom);
  const { tasks, loading, fetchTasks, createTask, updateTask, removeTask } = useTasks();
  const [users, setUsers] = useState<User[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTasks();
    apiClient.get<User[]>('/users').then(({ data }) => setUsers(data));
  }, [fetchTasks]);

  const filteredTasks = useMemo(() => {
    if (!search) return tasks;
    return tasks.filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [tasks, search]);

  const handleOpenCreate = useCallback(() => {
    setSelectedTask(null);
    setDialogOpen(true);
  }, []);

  const handleOpenEdit = useCallback((task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setDialogOpen(false);
    setSelectedTask(null);
  }, []);

  const handleSubmit = useCallback(async (data: any) => {
    if (selectedTask) {
      await updateTask(selectedTask._id, data);
    } else {
      await createTask(data);
    }
  }, [selectedTask, createTask, updateTask]);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Supprimer cette tâche ?')) {
      await removeTask(id);
    }
  }, [removeTask]);

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Mes tâches</Typography>
          <Button variant="contained" onClick={handleOpenCreate}>
            + Nouvelle tâche
          </Button>
        </Box>

        <TextField
          placeholder="Rechercher une tâche..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 3, width: '100%' }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredTasks.length === 0 ? (
          <Typography color="text.secondary" textAlign="center">
            Aucune tâche pour le moment
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {filteredTasks.map(task => (
              <Grid item xs={12} sm={6} md={4} key={task._id}>
                <TaskCard
                  task={task}
                  currentUser={user}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                />
              </Grid>
            ))}
          </Grid>
        )}

        <TaskFormDialog
          open={dialogOpen}
          onClose={handleClose}
          onSubmit={handleSubmit}
          users={users}
          task={selectedTask}
        />
      </Container>
    </>
  );
}

export default TasksPage;