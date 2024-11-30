import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import { CloudUpload, CloudDownload } from '@mui/icons-material';

export function UserImportExport() {
  const [importDialog, setImportDialog] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImportFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/users/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setImportResults(data);
    } catch (err) {
      setError('Failed to import users. Please check your file format.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'excel' | 'csv') => {
    try {
      const response = await fetch(`/api/users/export?format=${format}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users.${format === 'excel' ? 'xlsx' : 'csv'}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setError('Failed to export users.');
    }
  };

  return (
    <Box>
      <Box display="flex" gap={2} mb={3}>
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={() => setImportDialog(true)}
        >
          Import Users
        </Button>
        <Button
          variant="outlined"
          startIcon={<CloudDownload />}
          onClick={() => handleExport('excel')}
        >
          Export to Excel
        </Button>
        <Button
          variant="outlined"
          startIcon={<CloudDownload />}
          onClick={() => handleExport('csv')}
        >
          Export to CSV
        </Button>
      </Box>

      <Dialog
        open={importDialog}
        onClose={() => {
          setImportDialog(false);
          setImportResults(null);
          setError('');
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Import Users</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!importResults && !loading && (
            <Box textAlign="center" py={3}>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                style={{ display: 'none' }}
                id="import-file"
                onChange={handleImportFile}
              />
              <label htmlFor="import-file">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUpload />}
                >
                  Choose File
                </Button>
              </label>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Supported formats: CSV, Excel (xlsx, xls)
              </Typography>
            </Box>
          )}

          {loading && (
            <Box textAlign="center" py={3}>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Processing file...
              </Typography>
            </Box>
          )}

          {importResults && (
            <Box>
              <Alert
                severity={importResults.errors ? 'warning' : 'success'}
                sx={{ mb: 2 }}
              >
                {importResults.errors
                  ? `Imported with ${importResults.errors.length} errors`
                  : 'All users imported successfully'}
              </Alert>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {importResults.results.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Alert
                            severity={result.error ? 'error' : 'success'}
                            sx={{ py: 0 }}
                          >
                            {result.error ? 'Failed' : 'Success'}
                          </Alert>
                        </TableCell>
                        <TableCell>
                          {result.firstName} {result.lastName}
                        </TableCell>
                        <TableCell>{result.email}</TableCell>
                        <TableCell>
                          {result.error || 'Successfully imported'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setImportDialog(false);
              setImportResults(null);
              setError('');
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}