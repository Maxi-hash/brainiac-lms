import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Delete, Edit, Add, Save } from '@mui/icons-material';

export function AssessmentGenerator({ documentId }) {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingQuestion, setEditingQuestion] = useState(null);

  const handleGenerateAssessment = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/content/generate-assessment/${documentId}`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setAssessment(data);
      } else {
        setError('Failed to generate assessment');
      }
    } catch (err) {
      setError('Error generating assessment');
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion({
      ...question,
      options: [...question.options],
    });
  };

  const handleUpdateQuestion = () => {
    if (!editingQuestion) return;

    const newAssessment = {
      ...assessment,
      questions: assessment.questions.map((q) =>
        q.id === editingQuestion.id ? editingQuestion : q
      ),
    };

    setAssessment(newAssessment);
    setEditingQuestion(null);
  };

  const handleAddOption = () => {
    if (!editingQuestion) return;

    setEditingQuestion({
      ...editingQuestion,
      options: [...editingQuestion.options, ''],
    });
  };

  const handleSaveAssessment = async () => {
    try {
      const response = await fetch(`/api/content/assessment/${assessment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessment),
      });

      if (response.ok) {
        // Handle successful save
      }
    } catch (err) {
      setError('Error saving assessment');
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!assessment && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <Typography variant="h6" gutterBottom>
              Generate Assessment
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Create an assessment based on the document content
            </Typography>
            <Button
              variant="contained"
              onClick={handleGenerateAssessment}
              disabled={loading}
            >
              Generate Questions
            </Button>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Box className="text-center py-8">
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>
            Generating assessment...
          </Typography>
        </Box>
      )}

      {assessment && (
        <Box>
          <Box className="flex justify-between items-center mb-4">
            <Typography variant="h6">
              Assessment Questions
            </Typography>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveAssessment}
            >
              Save Assessment
            </Button>
          </Box>

          <List>
            {assessment.questions.map((question, index) => (
              <Card key={question.id} sx={{ mb: 2 }}>
                <CardContent>
                  {editingQuestion?.id === question.id ? (
                    <Box>
                      <TextField
                        fullWidth
                        label="Question"
                        value={editingQuestion.question}
                        onChange={(e) =>
                          setEditingQuestion({
                            ...editingQuestion,
                            question: e.target.value,
                          })
                        }
                        sx={{ mb: 2 }}
                      />

                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Options:
                      </Typography>

                      {editingQuestion.options.map((option, optionIndex) => (
                        <Box key={optionIndex} className="flex gap-2 mb-2">
                          <Radio
                            checked={editingQuestion.correctAnswer === optionIndex}
                            onChange={() =>
                              setEditingQuestion({
                                ...editingQuestion,
                                correctAnswer: optionIndex,
                              })
                            }
                          />
                          <TextField
                            fullWidth
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...editingQuestion.options];
                              newOptions[optionIndex] = e.target.value;
                              setEditingQuestion({
                                ...editingQuestion,
                                options: newOptions,
                              });
                            }}
                          />
                          <IconButton
                            onClick={() => {
                              const newOptions = editingQuestion.options.filter(
                                (_, i) => i !== optionIndex
                              );
                              setEditingQuestion({
                                ...editingQuestion,
                                options: newOptions,
                              });
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      ))}

                      <Button
                        startIcon={<Add />}
                        onClick={handleAddOption}
                        sx={{ mt: 1 }}
                      >
                        Add Option
                      </Button>

                      <Box className="flex justify-end mt-4">
                        <Button
                          variant="contained"
                          onClick={handleUpdateQuestion}
                        >
                          Save Question
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        {index + 1}. {question.question}
                      </Typography>

                      <RadioGroup value={question.correctAnswer}>
                        {question.options.map((option, optionIndex) => (
                          <FormControlLabel
                            key={optionIndex}
                            value={optionIndex}
                            control={<Radio />}
                            label={option}
                            disabled
                          />
                        ))}
                      </RadioGroup>

                      <Box className="flex justify-end mt-2">
                        <IconButton
                          onClick={() => handleEditQuestion(question)}
                        >
                          <Edit />
                        </IconButton>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}