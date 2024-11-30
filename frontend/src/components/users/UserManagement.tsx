import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { UserRole } from '../../types/auth';
import { UserForm } from './UserForm';
import { useAuth } from '../auth/AuthContext';

export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      let endpoint = '/api/users';
      if (currentUser.role === UserRole.MANAGER) {
        endpoint = `/api/users/trainers?managerId=${currentUser.id}`;
      }
      const response = await fetch(endpoint);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleDeactivateUser = async (userId) => {
    if (confirm('Are you sure you want to deactivate this user?')) {
      try {
        await fetch(`/api/users/${userId}`, { method: 'DELETE' });
        fetchUsers();
      } catch (error) {
        console.error('Error deactivating user:', error);
      }
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      const method = selectedUser ? 'PUT' : 'POST';
      const url = selectedUser ? `/api/users/${selectedUser.id}` : '/api/users';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setDialogOpen(false);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'error';
      case UserRole.MANAGER:
        return 'warning';
      case UserRole.TRAINER:
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h5">User Management</Typography>
          {currentUser.role === UserRole.ADMIN && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateUser}
            >
              Create User
            </Button>
          )}
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{user.section}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEditUser(user)}
                      disabled={currentUser.role !== UserRole.ADMIN &&
                        currentUser.id !== user.managerId}
                    >
                      <Edit />
                    </IconButton>
                    {currentUser.role === UserRole.ADMIN && (
                      <IconButton
                        size="small"
                        onClick={() => handleDeactivateUser(user.id)}
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <UserForm
            user={selectedUser}
            onSave={handleSaveUser}
            onCancel={() => setDialogOpen(false)}
          />
        </Dialog>
      </CardContent>
    </Card>
  );
}