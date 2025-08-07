'use client';

import { Button, Box, Typography, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function GamesPage() {
  const [userRole, setUserRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role) setUserRole(role);
  }, []);

  const handleAdminPanel = () => {
    if (userRole === 'admin') {
      router.push('/users');
    } else {
      alert('Only admins can access the admin panel!');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/users/login');
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 4,
        minHeight: '100vh',
        position: 'relative',
        backgroundImage: `url(https://avatars.mds.yandex.net/get-vh/4834374/2a0000018d7cab8023dfe88670a2403f7b84/orig)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
      }}
    >
      <Typography variant="h4" mb={3}>Welcome to Games!</Typography>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdminPanel}
          disabled={userRole !== 'admin'}
          sx={{ color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)', mr: 1 }}
        >
          Go to Admin Panel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{ color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          Logout
        </Button>
      </Box>
      <Typography>Enjoy your games!</Typography>
    </Container>
  );
}