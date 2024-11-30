import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  Button,
  Alert,
} from '@mui/material';

export function NotificationSettings({ userId }) {
  const [settings, setSettings] = useState({
    contentUpdates: true,
    peerFeedback: true,
    managerApproval: true,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [userId]);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/preferences`);
      const data = await response.json();
      setSettings(data.notifications || settings);
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    }
  };

  const handleSave = async () => {
    try {
      await fetch(`/api/users/${userId}/preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifications: settings }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Notification Preferences
      </Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings saved successfully!
        </Alert>
      )}

      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={settings.contentUpdates}
              onChange={(e) =>
                setSettings({ ...settings, contentUpdates: e.target.checked })
              }
            />
          }
          label="Content Updates"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.peerFeedback}
              onChange={(e) =>
                setSettings({ ...settings, peerFeedback: e.target.checked })
              }
            />
          }
          label="Peer Feedback"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.managerApproval}
              onChange={(e) =>
                setSettings({ ...settings, managerApproval: e.target.checked })
              }
            />
          }
          label="Manager Approval"
        />
      </FormGroup>

      <Button
        variant="contained"
        onClick={handleSave}
        sx={{ mt: 2 }}
      >
        Save Preferences
      </Button>
    </Box>
  );
}