'use client';

import { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // По умолчанию 'user'
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      setError('All fields are required');
      return;
    }

    setError(null);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      console.log('Registration success:', data);
      localStorage.clear(); // Очищаем localStorage после регистрации
      router.push('/users/login'); // Перенаправляем на страницу логина
    } catch (err) {
      console.error('Caught error:', err);
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>Register</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
        <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required />
        <TextField label="Role" value={role} onChange={(e) => setRole(e.target.value)} fullWidth required />
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" variant="contained" color="primary">Register</Button>
        <Button variant="outlined" color="secondary" href="/users/login">
          Back to Login
        </Button>
      </Box>
    </Container>
  );
}