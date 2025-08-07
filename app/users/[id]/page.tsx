import { Container, Typography } from '@mui/material';

async function fetchUser(id: string) {
  const res = await fetch(`http://localhost:3000/api/users/${id}`, { cache: 'force-cache' });
  if (!res.ok) throw new Error('User not found');
  return res.json();
}

export async function generateStaticParams() {
  const res = await fetch('http://localhost:3000/api/users');
  const users = await res.json();
  return users.map((user: { id: string }) => ({ id: user.id }));
}

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await fetchUser(params.id);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4">User Details (ID: {params.id})</Typography>
      <Typography>Name: {user.name}</Typography>
      <Typography>Email: {user.email}</Typography>
      <Typography>Role: {user.role}</Typography>
    </Container>
  );
}