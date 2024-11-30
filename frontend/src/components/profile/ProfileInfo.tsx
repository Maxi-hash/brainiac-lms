import React, { useState } from 'react';
import {
  Avatar,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { UserRole } from '../../types/auth';

export function ProfileInfo({ user }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
        <Avatar sx={{ width: 100, height: 100, mb: 2 }}>
          {user.firstName[0]}{user.lastName[0]}
        </Avatar>

        {!editMode ? (
          <>
            <Typography variant="h5">
              {user.firstName} {user.lastName}
            </Typography>
            <Typography color="textSecondary">
              {user.email}
            </Typography>
            <Chip label={user.role} color="primary" sx={{ mt: 1 }} />
            <Button
              startIcon={<Edit />}
              onClick={() => setEditMode(true)}
              sx={{ mt: 2 }}
            >
              Edit Profile
            </Button>
          </>
        ) : (
          <Dialog open={editMode} onClose={() => setEditMode(false)}>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                sx={{ mt: 2 }}
              />
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                sx={{ mt: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditMode(false)}>Cancel</Button>
              <Button onClick={handleSave} variant="contained">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </Box>
  );
}