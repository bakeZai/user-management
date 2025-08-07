'use client';

import { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Container, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<{ email: string }[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        if (response.ok) setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      setError('All fields are required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      return;
    }
    if (users.find((u) => u.email === email)) {
      setError('Email already exists');
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
      localStorage.clear();
      router.push('/users/login');
    } catch (err) {
      console.error('Caught error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
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