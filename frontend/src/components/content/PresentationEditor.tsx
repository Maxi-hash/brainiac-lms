import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Image,
  FormatBold,
  FormatItalic,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  ViewColumn,
  ViewStream,
  ViewModule,
  AutoAwesome,
  Save,
} from '@mui/icons-material';

const layoutTemplates = {
  standard: { name: 'Standard', icon: ViewStream },
  twoColumn: { name: 'Two Columns', icon: ViewColumn },
  imageGrid: { name: 'Image Grid', icon: ViewModule },
};

export function PresentationEditor({ presentationId }) {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [editDialog, setEditDialog] = useState(false);
  const [imageDialog, setImageDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');

  useEffect(() => {
    loadPresentation();
  }, [presentationId]);

  const loadPresentation = async () => {
    try {
      const response = await fetch(`/api/content/presentation/${presentationId}`);
      const data = await response.json();
      setSlides(data.content.slides);
    } catch (error) {
      console.error('Error loading presentation:', error);
    }
  };

  const handleAddSlide = () => {
    setSlides([...slides, {
      id: slides.length + 1,
      title: 'New Slide',
      content: '',
      layout: 'standard',
    }]);
    setCurrentSlide(slides.length);
  };

  const handleDeleteSlide = (index) => {
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    if (currentSlide >= newSlides.length) {
      setCurrentSlide(newSlides.length - 1);
    }
  };

  const handleUpdateSlide = (index, updates) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], ...updates };
    setSlides(newSlides);
  };

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/content/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt }),
      });
      const data = await response.json();
      handleUpdateSlide(currentSlide, {
        image: data.imageUrl,
      });
      setImageDialog(false);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch(`/api/content/presentation/${presentationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides }),
      });
    } catch (error) {
      console.error('Error saving presentation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="h-full flex flex-col">
      {/* Toolbar */}
      <Paper className="p-2 mb-4 flex items-center gap-2" elevation={1}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddSlide}
        >
          Add Slide
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<Image />}
          onClick={() => setImageDialog(true)}
        >
          Add Image
        </Button>

        <Button
          variant="outlined"
          startIcon={<AutoAwesome />}
          onClick={() => handleGenerateImage()}
          disabled={loading}
        >
          Enhance
        </Button>

        <Select
          size="small"
          value={slides[currentSlide]?.layout || 'standard'}
          onChange={(e) => handleUpdateSlide(currentSlide, { layout: e.target.value })}
          className="min-w-[120px]"
        >
          {Object.entries(layoutTemplates).map(([key, layout]) => (
            <MenuItem key={key} value={key}>
              <Box className="flex items-center gap-2">
                <layout.icon fontSize="small" />
                <span>{layout.name}</span>
              </Box>
            </MenuItem>
          ))}
        </Select>

        <div className="flex-grow" />

        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
          disabled={loading}
        >
          Save
        </Button>
      </Paper>

      {/* Editor Area */}
      <Grid container spacing={2} className="flex-grow">
        {/* Slide List */}
        <Grid item xs={2}>
          <Paper className="p-2 h-full overflow-auto">
            {slides.map((slide, index) => (
              <Paper
                key={slide.id}
                elevation={currentSlide === index ? 3 : 1}
                className={`p-2 mb-2 cursor-pointer ${currentSlide === index ? 'border-2 border-primary' : ''}`}
                onClick={() => setCurrentSlide(index)}
              >
                <Typography variant="caption" className="mb-1">
                  Slide {index + 1}
                </Typography>
                <Box className="flex justify-end">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSlide(index);
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Paper>
        </Grid>

        {/* Current Slide Editor */}
        <Grid item xs={10}>
          <Paper className="p-4 h-full">
            {slides[currentSlide] && (
              <Box>
                <TextField
                  fullWidth
                  variant="standard"
                  value={slides[currentSlide].title}
                  onChange={(e) => handleUpdateSlide(currentSlide, { title: e.target.value })}
                  className="mb-4"
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={slides[currentSlide].content}
                  onChange={(e) => handleUpdateSlide(currentSlide, { content: e.target.value })}
                />
                {slides[currentSlide].image && (
                  <Box className="mt-4">
                    <img
                      src={slides[currentSlide].image}
                      alt="Slide content"
                      className="max-w-full max-h-[300px] object-contain"
                    />
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Image Generation Dialog */}
      <Dialog open={imageDialog} onClose={() => setImageDialog(false)}>
        <DialogTitle>Generate Image</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="mt-2"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialog(false)}>Cancel</Button>
          <Button
            onClick={handleGenerateImage}
            variant="contained"
            disabled={loading}
          >
            Generate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}