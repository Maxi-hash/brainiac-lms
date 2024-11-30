import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Send } from '@mui/icons-material';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function DocumentChat({ document }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/content/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: document.id,
          message: input,
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Paper 
        variant="outlined" 
        sx={{ 
          height: '400px', 
          mb: 2, 
          p: 2,
          overflowY: 'auto'
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              mb: 2,
              textAlign: message.role === 'user' ? 'right' : 'left',
            }}
          >
            <Typography
              component="span"
              sx={{
                bgcolor: message.role === 'user' ? 'primary.main' : 'grey.200',
                color: message.role === 'user' ? 'white' : 'text.primary',
                py: 1,
                px: 2,
                borderRadius: 2,
                display: 'inline-block',
                maxWidth: '80%',
              }}
            >
              {message.content}
            </Typography>
          </Box>
        ))}
        {loading && (
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={20} />
          </Box>
        )}
      </Paper>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask a question about the document..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={loading}
        >
          <Send />
        </Button>
      </Box>
    </Box>
  );
}