'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Box,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
};

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/users', { next: { revalidate: 60 } });
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      }
    };
    fetchUsers();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/users/login');
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword(user.password); // Устанавливаем начальное значение пароля
    setRole(user.role);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete user');
        setUsers(users.filter((u) => u.id !== id));
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Failed to delete user');
      }
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSave = async () => {
    if (!name || !email || !role) {
      setError('All fields are required');
      return;
    }
    if (password && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      const response = await fetch(`/api/users/${selectedUser?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: password || undefined, role }),
      });
      if (!response.ok) throw new Error('Failed to update user');
      const updatedUser = await response.json();
      setUsers(users.map((u) => (u.id === selectedUser?.id ? updatedUser : u)));
      setOpen(false);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const paginatedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>Admin Panel - Users</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <Table sx={{ border: '2px solid black', borderCollapse: 'collapse' }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell sx={{ border: '1px solid black', padding: '8px' }}>ID</TableCell>
            <TableCell sx={{ border: '1px solid black', padding: '8px' }}>Name</TableCell>
            <TableCell sx={{ border: '1px solid black', padding: '8px' }}>Email</TableCell>
            <TableCell sx={{ border: '1px solid black', padding: '8px' }}>Password</TableCell>
            <TableCell sx={{ border: '1px solid black', padding: '8px' }}>Role</TableCell>
            <TableCell sx={{ border: '1px solid black', padding: '8px' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell sx={{ border: '1px solid black', padding: '8px' }}>{user.id}</TableCell>
              <TableCell sx={{ border: '1px solid black', padding: '8px' }}>{user.name}</TableCell>
              <TableCell sx={{ border: '1px solid black', padding: '8px' }}>{user.email}</TableCell>
              <TableCell sx={{ border: '1px solid black', padding: '8px' }}>{user.password}</TableCell> {/* Отображаем пароль */}
              <TableCell sx={{ border: '1px solid black', padding: '8px' }}>{user.role}</TableCell>
              <TableCell sx={{ border: '1px solid black', padding: '8px' }}>
                <Button variant="contained" color="primary" onClick={() => handleEdit(user)} sx={{ mr: 1 }}>
                  Edit
                </Button>
                <Button variant="contained" color="error" onClick={() => handleDelete(user.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        BackdropProps={{ style: { backgroundColor: 'transparent' } }}
        PaperProps={{
          style: {
            backgroundColor: '#ffffff',
            minWidth: '500px',
            maxWidth: '400px',
            padding: '16px',
            borderRadius: '8px',
          },
        }}
      >
        <DialogTitle>Edit User (ID: {selectedUser?.id})</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
            <TextField
              label="Password"
              type="text" // Изменяем на text для видимости
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              placeholder="Leave blank to keep current password"
            />
            <TextField label="Role" value={role} onChange={(e) => setRole(e.target.value)} fullWidth required />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}