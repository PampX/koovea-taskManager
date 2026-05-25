import { useCallback } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  Stack,
} from '@mui/material';
import type { Task, User } from '../types';

const statusLabel: Record<string, string> = {
  todo: 'À faire',
  in_progress: 'En cours',
  done: 'Terminé',
};

const statusColor: Record<string, 'default' | 'warning' | 'success'> = {
  todo: 'default',
  in_progress: 'warning',
  done: 'success',
};

interface Props {
  task: Task;
  currentUser: User | null;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

function TaskCard({ task, currentUser, onEdit, onDelete }: Props) {
  const isOwner = currentUser?._id === task.owner._id;

  const handleEdit = useCallback(() => {
    onEdit(task);
  }, [onEdit, task]);

  const handleDelete = useCallback(() => {
    onDelete(task._id);
  }, [onDelete, task._id]);

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6">{task.title}</Typography>
          <Chip
            label={statusLabel[task.status]}
            color={statusColor[task.status]}
            size="small"
          />
        </Box>
        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {task.description}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary">
          Créé par {task.owner.name}
        </Typography>
        {task.assignees.filter(a => a._id !== task.owner._id).length > 0 && (
          <Stack direction="row" spacing={0.5} sx={{ mt: 1, flexWrap: 'wrap' }}>
            {task.assignees
              .filter(a => a._id !== task.owner._id)
              .map(a => (
                <Chip key={a._id} label={a.name} size="small" variant="outlined" />
              ))}
          </Stack>
        )}
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleEdit}>
          Modifier
        </Button>
        {isOwner && (
          <Button size="small" color="error" onClick={handleDelete}>
            Supprimer
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default TaskCard;