import React, { useState } from 'react';
import {
  Container,
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
} from '@mui/material';
import { DocumentProcessor } from '../../components/content/DocumentProcessor';
import { KnowledgeLibrary } from '../../components/content/KnowledgeLibrary';

export default function KnowledgeLibraryPage() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          Knowledge Library
        </Typography>

        <Paper sx={{ mb: 4 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Library" />
            <Tab label="Upload & Process" />
          </Tabs>
        </Paper>

        <Box mt={3}>
          {activeTab === 0 && <KnowledgeLibrary />}
          {activeTab === 1 && <DocumentProcessor />}
        </Box>
      </Box>
    </Container>
  );
}