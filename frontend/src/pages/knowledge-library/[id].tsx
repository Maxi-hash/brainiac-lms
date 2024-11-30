import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Divider,
} from '@mui/material';
import { PresentationEditor } from '../../components/content/PresentationEditor';
import { AssessmentGenerator } from '../../components/content/AssessmentGenerator';
import { DocumentChat } from '../../components/content/DocumentChat';

export default function DocumentDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [document, setDocument] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchDocument();
    }
  }, [id]);

  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/content/document/${id}`);
      if (response.ok) {
        const data = await response.json();
        setDocument(data);
      } else {
        setError('Failed to fetch document');
      }
    } catch (err) {
      setError('Error loading document');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        {document && (
          <>
            <Box className="flex justify-between items-start mb-4">
              <div>
                <Typography variant="h4" gutterBottom>
                  {document.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Last updated: {new Date(document.updatedAt).toLocaleDateString()}
                </Typography>
              </div>

              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => router.push(`/presentation/create/${id}`)}
                >
                  Create Presentation
                </Button>
              </Box>
            </Box>

            <Paper sx={{ mb: 4 }}>
              <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                <Tab label="Document" />
                <Tab label="Chat" />
                <Tab label="Generate Assessment" />
              </Tabs>
            </Paper>

            <Box mt={3}>
              {activeTab === 0 && (
                <Paper className="p-4">
                  <Typography variant="h6" gutterBottom>
                    Summary
                  </Typography>
                  <Typography paragraph>
                    {document.content.summary}
                  </Typography>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" gutterBottom>
                    Key Points
                  </Typography>
                  <ul>
                    {document.content.keyPoints.map((point, index) => (
                      <li key={index}>
                        <Typography paragraph>
                          {point}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Paper>
              )}

              {activeTab === 1 && <DocumentChat document={document} />}
              {activeTab === 2 && <AssessmentGenerator documentId={id} />}
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
}