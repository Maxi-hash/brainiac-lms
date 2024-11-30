import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Upload, PictureAsPdf, Description, Chat } from '@mui/icons-material';
import { DocumentChat } from './DocumentChat';

export function DocumentProcessor() {
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState(null);
  const [error, setError] = useState('');
  const [chatOpen, setChatOpen] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/content/process-document', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setDocument(data);
      } else {
        setError('Failed to process document');
      }
    } catch (err) {
      setError('Error uploading document');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePresentation = async () => {
    try {
      const response = await fetch(`/api/content/create-presentation/${document.id}`, {
        method: 'POST',
      });

      if (response.ok) {
        const presentation = await response.json();
        // Navigate to presentation editor
        window.location.href = `/content/presentation/${presentation.id}`;
      }
    } catch (err) {
      setError('Failed to create presentation');
    }
  };

  const handleCreateAssessment = async () => {
    try {
      const response = await fetch(`/api/content/create-assessment/${document.id}`, {
        method: 'POST',
      });

      if (response.ok) {
        const assessment = await response.json();
        // Navigate to assessment editor
        window.location.href = `/content/assessment/${assessment.id}`;
      }
    } catch (err) {
      setError('Failed to create assessment');
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!document && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              style={{ display: 'none' }}
              id="document-upload"
              onChange={handleFileUpload}
            />
            <label htmlFor="document-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<Upload />}
                size="large"
              >
                Upload Document
              </Button>
            </label>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Supported formats: PDF, Word, Text
            </Typography>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Box className="text-center py-8">
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>
            Processing document...
          </Typography>
        </Box>
      )}

      {document && (
        <Card>
          <CardContent>
            <Box className="flex justify-between items-center mb-4">
              <Typography variant="h6">{document.title}</Typography>
              <Button
                startIcon={<Chat />}
                onClick={() => setChatOpen(true)}
              >
                Chat with Document
              </Button>
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Summary
            </Typography>
            <Typography paragraph>
              {document.content.summary}
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
              Key Points
            </Typography>
            <List>
              {document.content.keyPoints.map((point, index) => (
                <ListItem key={index}>
                  <ListItemText primary={point} />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Box className="flex gap-2">
              <Button
                variant="contained"
                onClick={handleCreatePresentation}
              >
                Create Presentation
              </Button>
              <Button
                variant="outlined"
                onClick={handleCreateAssessment}
              >
                Generate Assessment
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chat with Document</DialogTitle>
        <DialogContent>
          <DocumentChat document={document} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChatOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}