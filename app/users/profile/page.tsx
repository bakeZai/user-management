'use client';

import { useState, useEffect } from 'react';
import { Typography, Container, Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

type User = {
  name: string;
  email: string;
  role: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const role = localStorage.getItem('userRole');
      if (!role) {
        router.push('/users/login');
        return;
      }

      try {
        const response = await fetch('/api/auth/profile', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('userRole')}` }, // Пример авторизации
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch profile');
        setUser(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        router.push('/users/login'); // Перенаправление при ошибке
      }
    };
    fetchProfile();
  }, [router]);

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>Profile</Typography>
      <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography><strong>Name:</strong> {user.name}</Typography>
        <Typography><strong>Email:</strong> {user.email}</Typography>
        <Typography><strong>Role:</strong> {user.role}</Typography>
      </Box>
      <Button variant="outlined" color="secondary" onClick={() => router.push('/games')} sx={{ mt: 2 }}>
        Back to Games
      </Button>
    </Container>
  );
}