'use client';

import { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Container, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    localStorage.clear(); // Очищаем при загрузке
    const role = localStorage.getItem('userRole');
    if (role && window.location.pathname !== '/users/login') {
      if (role === 'admin') router.push('/users');
      else router.push('/games');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('All fields are required');
      return;
    }

    setError(null);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const responseText = await res.text();
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        throw new Error('Invalid response format');
      }

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (!data || !data.id || !data.role) {
        throw new Error('No user data received');
      }

      setIsAuthenticated(true);
      setUserRole(data.role);
      localStorage.setItem('userRole', data.role); // Сохранение роли на клиенте
      if (data.role === 'admin') {
        router.push('/users');
      } else {
        router.push('/games');
      }
    } catch (err) {
      console.error('Caught error:', err);
      if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as any).message === 'string') {
        const message = (err as any).message as string;
        if (message.includes('No user data')) {
          setError('Error 101: No user data found');
        } else if (message.includes('Invalid response format')) {
          setError('Error 102: Server returned invalid data');
        } else {
          setError(`Error: ${message || 'Something went wrong'}`);
        }
      } else {
        setError('Error: Something went wrong');
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>Login</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required />
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" variant="contained" color="primary">Login</Button>
        <Button variant="outlined" color="secondary" href="/users/register">
          Make Registration
        </Button>
      </Box>
    </Container>
  );
}