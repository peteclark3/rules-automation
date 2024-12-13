import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Alert,
} from '@mui/material';

interface ApplicationResult {
  matching_rules: Array<{
    document_types: string[];
  }>;
}

const Apply: React.FC = () => {
  const [familyStatus, setFamilyStatus] = useState('');
  const [businessOwner, setBusinessOwner] = useState('');
  const [taxFiling, setTaxFiling] = useState('');
  const [result, setResult] = useState<ApplicationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const application = {
      family_id: crypto.randomUUID(),
      family_status: familyStatus,
      business_owner: businessOwner === 'true',
      tax_filing: taxFiling
    };

    try {
      const response = await fetch('http://localhost:8000/applications/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(application)
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.detail || 'Failed to submit application');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const formatDocumentName = (docType: string) => {
    const names: Record<string, string> = {
      'tax_return': 'Tax Return',
      'business_docs': 'Business Documents',
      'income_verification': 'Income Verification'
    };
    return names[docType] || docType;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Submit Application
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl fullWidth>
                <InputLabel
                  sx={{
                    backgroundColor: 'white',
                    px: 0.5,
                  }}
                >
                  Family Status
                </InputLabel>
                <Select
                  value={familyStatus}
                  onChange={(e) => setFamilyStatus(e.target.value)}
                  required
                >
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="returning">Returning</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel
                  sx={{
                    backgroundColor: 'white',
                    px: 0.5,
                  }}
                >
                  Business Owner
                </InputLabel>
                <Select
                  value={businessOwner}
                  onChange={(e) => setBusinessOwner(e.target.value)}
                  required
                >
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel
                  sx={{
                    backgroundColor: 'white',
                    px: 0.5,
                  }}
                >
                  Tax Filing Status
                </InputLabel>
                <Select
                  value={taxFiling}
                  onChange={(e) => setTaxFiling(e.target.value)}
                  required
                >
                  <MenuItem value="filed">Filed 2021 Taxes</MenuItem>
                  <MenuItem value="not_filed">Did Not File 2021 Taxes</MenuItem>
                </Select>
              </FormControl>

              <Button type="submit" variant="contained" color="primary">
                Submit Application
              </Button>
            </Box>
          </form>

          {result && (
            <Box sx={{ mt: 3 }}>
              <Alert severity="success">
                <Typography variant="h6">Application submitted successfully!</Typography>
                {result.matching_rules.length > 0 ? (
                  <>
                    <Typography sx={{ mt: 1 }}>Please provide the following documents:</Typography>
                    <ul>
                      {Array.from(new Set(result.matching_rules.flatMap(rule => rule.document_types)))
                        .map((doc, index) => (
                          <li key={index}>{formatDocumentName(doc)}</li>
                        ))}
                    </ul>
                  </>
                ) : (
                  <Typography sx={{ mt: 1 }}>No additional documents required at this time.</Typography>
                )}
              </Alert>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Apply; 