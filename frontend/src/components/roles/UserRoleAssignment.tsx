import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
} from '@mui/material';
import { UserRole } from '../../types/auth';

interface UserRoleAssignmentProps {
  userId: string;
  currentRole: UserRole;
  onRoleChange: (newRole: UserRole) => Promise<void>;
}

export function UserRoleAssignment({
  userId,
  currentRole,
  onRoleChange,
}: UserRoleAssignmentProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRoleChange = async () => {
    try {
      await onRoleChange(selectedRole);
      setSuccess('Role updated successfully');
      setError('');
    } catch (err) {
      setError('Failed to update role');
      setSuccess('');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Assign Role
        </Typography>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" className="mb-4">
            {success}
          </Alert>
        )}

        <FormControl fullWidth className="mb-4">
          <InputLabel>Role</InputLabel>
          <Select
            value={selectedRole}
            label="Role"
            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
          >
            {Object.values(UserRole).map((role) => (
              <MenuItem key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleRoleChange}
          disabled={selectedRole === currentRole}
        >
          Update Role
        </Button>
      </CardContent>
    </Card>
  );
}