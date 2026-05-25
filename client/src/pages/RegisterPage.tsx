import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

interface FormData {
  name: string;
  email: string;
  password: string;
}

function RegisterPage() {
  const { register: registerAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = useCallback(async (data: FormData) => {
    try {
      setLoading(true);
      setError(null);
      await registerAuth(data.name, data.email, data.password);
    } catch {
      setError('Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  }, [registerAuth]);

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" textAlign="center">
          Inscription
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nom"
            {...register('name', { required: 'Nom requis' })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="Email"
            type="email"
            {...register('email', { required: 'Email requis' })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Mot de passe"
            type="password"
            {...register('password', {
              required: 'Mot de passe requis',
              minLength: { value: 6, message: '6 caractères minimum' }
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
          >
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </Button>
        </Box>

        <Typography textAlign="center">
          Déjà un compte ?{' '}
          <Link to="/login">Se connecter</Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default RegisterPage;