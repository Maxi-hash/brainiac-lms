import { useState, useEffect } from 'react';
import { Box, Container, Typography, Alert } from '@mui/material';
import { RoleManagement } from '../../components/roles/RoleManagement';
import { PermissionGuard } from '../../components/roles/PermissionGuard';
import { Permission } from '../../types/roles';

export default function RoleManagementPage() {
  const [error, setError] = useState('');

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          Role & Permission Management
        </Typography>

        <PermissionGuard
          permission={Permission.ASSIGN_ROLES}
          fallback={
            <Alert severity="error">
              You don't have permission to access this page.
            </Alert>
          }
        >
          <RoleManagement />
        </PermissionGuard>
      </Box>
    </Container>
  );
}