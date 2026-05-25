import { useEffect, useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Box,
} from '@mui/material';
import type { Task, User } from '../types';

type TaskStatus = 'todo' | 'in_progress' | 'done';

interface FormData {
  title: string;
  description?: string;
  status?: TaskStatus;
  assignees?: string[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<FormData>) => Promise<void>;
  users: User[];
  task?: Task | null;
}

function TaskFormDialog({ open, onClose, onSubmit, users, task }: Props) {
  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<FormData>();

  const assignees = useWatch({ control, name: 'assignees' }) ?? [];
  const currentStatus = useWatch({ control, name: 'status' });

  // Owner is auto-added by the backend — exclude them from the selectable list to avoid duplication
  const selectableUsers = task
    ? users.filter(u => u._id !== task.owner._id)
    : users;

  useEffect(() => {
    if (task) {
      // Strip owner from pre-filled assignees (backend already handles that relationship)
      const assigneesWithoutOwner = task.assignees
        .filter(a => a._id !== task.owner._id)
        .map(a => a._id);
      reset({
        title: task.title,
        description: task.description ?? '',
        status: task.status,
        assignees: assigneesWithoutOwner,
      });
    } else {
      reset({ title: '', description: '', assignees: [] });
    }
  }, [task, reset, open]);

  const handleFormSubmit = useCallback(async (data: FormData) => {
    // Strip undefined/empty values so the PATCH body only contains valid fields
    const clean = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ) as Partial<FormData>;
    await onSubmit(clean);
    onClose();
  }, [onSubmit, onClose]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{task ? 'Modifier la tâche' : 'Nouvelle tâche'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Titre"
            {...register('title', { required: 'Titre requis' })}
            error={!!errors.title}
            helperText={errors.title?.message}
            autoFocus
          />
          <TextField
            label="Description"
            multiline
            rows={3}
            {...register('description')}
          />
          {task && (
            <FormControl>
              <InputLabel>Statut</InputLabel>
              <Select
                value={currentStatus ?? 'todo'}
                label="Statut"
                onChange={(e) => setValue('status', e.target.value as TaskStatus)}
              >
                <MenuItem value="todo">À faire</MenuItem>
                <MenuItem value="in_progress">En cours</MenuItem>
                <MenuItem value="done">Terminé</MenuItem>
              </Select>
            </FormControl>
          )}
          <FormControl>
            <InputLabel>Assignés</InputLabel>
            <Select
              multiple
              value={assignees}
              onChange={(e) => setValue('assignees', e.target.value as string[])}
              input={<OutlinedInput label="Assignés" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((id) => {
                    const user = selectableUsers.find(u => u._id === id);
                    return <Chip key={id} label={user?.name ?? id} size="small" />;
                  })}
                </Box>
              )}
            >
              {selectableUsers.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained">
            {task ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default TaskFormDialog;
