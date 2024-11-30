import React, { useState, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { UserRole } from '../../types/auth';

interface UserFormProps {
  user?: any;
  onSave: (userData: any) => void;
  onCancel: () => void;
}

export function UserForm({ user, onSave, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: UserRole.TRAINER,
    section: '',
    managerId: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        password: '', // Don't populate password field
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        {user ? 'Edit User' : 'Create User'}
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={2} className="mt-2">
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </Grid>
          
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Grid>

          {!user && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Grid>
          )}

          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <MenuItem value={UserRole.TRAINER}>Trainer</MenuItem>
                <MenuItem value={UserRole.MANAGER}>Manager</MenuItem>
                <MenuItem value={UserRole.ADMIN}>Admin</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Section"
              name="section"
              value={formData.section}
              onChange={handleChange}
            />
          </Grid>

          {formData.role === UserRole.TRAINER && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Manager ID"
                name="managerId"
                value={formData.managerId}
                onChange={handleChange}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          {user ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </form>
  );
}