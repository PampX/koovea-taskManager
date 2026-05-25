import { useCallback } from 'react';
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
import { useState } from 'react';

interface FormData {
  email: string;
  password: string;
}

function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = useCallback(async (data: FormData) => {
    try {
      setLoading(true);
      setError(null);
      await login(data.email, data.password);
    } catch {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  }, [login]);

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" textAlign="center">
          Connexion
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
            {...register('password', { required: 'Mot de passe requis' })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </Box>

        <Typography textAlign="center">
          Pas de compte ?{' '}
          <Link to="/register">S'inscrire</Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default LoginPage;