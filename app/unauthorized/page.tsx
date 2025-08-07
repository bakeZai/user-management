'use client';

import { Container, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Unauthorized Access
      </Typography>
      <Typography variant="body1" gutterBottom>
        You do not have permission to view this page. Please log in as an admin.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => router.push('/users/login')}>
        Go to Login
      </Button>
    </Container>
  );
}