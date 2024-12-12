import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Grid,
  Link,
  IconButton,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Condition {
  type: string;
  value: string;
}

interface Rule {
  name: string;
  conditions: Condition[];
  document_types: string[];
}

interface ValueOption {
  value: string;
  label: string;
}

const RuleEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  
  const [rule, setRule] = useState<Rule>({
    name: '',
    conditions: [{ type: '', value: '' }],
    document_types: [''],
  });

  const getValueOptions = (type: string): ValueOption[] => {
    switch (type) {
      case 'family_status':
        return [
          { value: 'new', label: 'New' },
          { value: 'returning', label: 'Returning' }
        ];
      case 'business_owner':
        return [
          { value: 'true', label: 'Yes' },
          { value: 'false', label: 'No' }
        ];
      case 'tax_filing':
        return [
          { value: 'filed', label: 'Filed 2021 Taxes' },
          { value: 'not_filed', label: 'Did Not File 2021 Taxes' }
        ];
      default:
        return [];
    }
  };

  const getAvailableConditionTypes = (currentIndex: number): ValueOption[] => {
    const usedTypes = rule.conditions
      .filter((_, idx) => idx !== currentIndex)
      .map(c => c.type);

    const allTypes = [
      { value: 'family_status', label: 'Family Status' },
      { value: 'business_owner', label: 'Business Owner' },
      { value: 'tax_filing', label: 'US Tax Filing Status' }
    ];

    return allTypes.filter(type => !usedTypes.includes(type.value));
  };

  const getAvailableDocumentTypes = (currentIndex: number) => {
    const usedTypes = rule.document_types
      .filter((_, idx) => idx !== currentIndex)
      .map(d => d);

    const allTypes = [
      { value: 'tax_return', label: 'Tax Return' },
      { value: 'business_docs', label: 'Business Documents' },
      { value: 'income_verification', label: 'Income Verification' }
    ];

    return allTypes.filter(type => !usedTypes.includes(type.value));
  };

  const handleAddCondition = () => {
    setRule({
      ...rule,
      conditions: [...rule.conditions, { type: '', value: '' }]
    });
  };

  const handleAddDocument = () => {
    setRule({
      ...rule,
      document_types: [...rule.document_types, '']
    });
  };

  const handleRemoveCondition = (index: number) => {
    setRule({
      ...rule,
      conditions: rule.conditions.filter((_, i) => i !== index)
    });
  };

  const handleRemoveDocument = (index: number) => {
    if (rule.document_types.length > 1) {
      setRule({
        ...rule,
        document_types: rule.document_types.filter((_, i) => i !== index)
      });
    }
  };

  const handleConditionChange = (index: number, field: keyof Condition, value: string) => {
    const newConditions = [...rule.conditions];
    newConditions[index] = { 
      ...newConditions[index], 
      [field]: value,
      ...(field === 'type' ? { value: '' } : {})
    };
    setRule({ ...rule, conditions: newConditions });
  };

  const handleDocumentChange = (index: number, value: string) => {
    const newDocuments = [...rule.document_types];
    newDocuments[index] = value;
    setRule({ ...rule, document_types: newDocuments });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate conditions
    const invalidConditions = rule.conditions.some(c => !c.type || !c.value);
    if (invalidConditions) {
      setError('All conditions must have both a type and value selected');
      return;
    }

    // Validate document types
    const invalidDocuments = rule.document_types.some(d => !d);
    if (invalidDocuments) {
      setError('All document types must be selected');
      return;
    }

    console.log('Submitting rule:', rule); // Debug log

    try {
      const response = await fetch('http://localhost:8000/rules/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rule),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData); // Debug log
        throw new Error(errorData.detail || 'Failed to create rule');
      }

      const savedRule = await response.json();
      console.log('Rule saved successfully:', savedRule); // Debug log

      navigate('/');
    } catch (err) {
      console.error('Error saving rule:', err); // Debug log
      setError(err instanceof Error ? err.message : 'An error occurred while creating the rule');
    }
  };

  const calculateMatchingApplicants = (conditions: Condition[]): number => {
    // Start with a base number of applicants
    let baseApplicants = 1000;
    // Decrease the number for each condition
    return conditions.reduce((acc, condition) => {
      if (condition.type && condition.value) {
        return acc - 100; // Subtract 100 for each filled condition as a mock
      }
      return acc;
    }, baseApplicants);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {id ? 'Edit Rule' : 'Create New Rule'}
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Rule Name"
                  value={rule.name}
                  onChange={(e) => setRule({ ...rule, name: e.target.value })}
                  required
                  sx={{
                    '& .MuiInputLabel-root': {
                      backgroundColor: 'white',
                      px: 0.5,
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Conditions
                </Typography>
              </Grid>

              {rule.conditions.map((condition, index) => (
                <Grid item xs={12} key={`condition-${index}`} container spacing={2}>
                  <Grid item xs={5}>
                    <FormControl fullWidth required>
                      <InputLabel
                        sx={{
                          backgroundColor: 'white',
                          px: 0.5,
                        }}
                      >
                        Condition Type
                      </InputLabel>
                      <Select
                        value={condition.type}
                        onChange={(e) => handleConditionChange(index, 'type', e.target.value)}
                      >
                        {getAvailableConditionTypes(index).map(type => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <FormControl fullWidth disabled={!condition.type} required>
                      <InputLabel
                        sx={{
                          backgroundColor: 'white',
                          px: 0.5,
                        }}
                      >
                        Value
                      </InputLabel>
                      <Select
                        value={condition.value}
                        onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                      >
                        {getValueOptions(condition.type).map((option: ValueOption) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {index > 0 && (
                    <Grid item xs={1}>
                      <IconButton onClick={() => handleRemoveCondition(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
              ))}

              {getAvailableConditionTypes(-1).length > 0 && (
                <Grid item xs={12}>
                  <Link
                    component="button"
                    type="button"
                    onClick={handleAddCondition}
                    sx={{ textDecoration: 'none' }}
                  >
                    + Add another condition
                  </Link>
                </Grid>
              )}

              {rule.conditions.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    Given conditions match with {calculateMatchingApplicants(rule.conditions)} existing applicants.
                  </Typography>
                </Grid>
              )}

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Required Documents
                </Typography>
              </Grid>

              {rule.document_types.map((doc, index) => (
                <Grid item xs={12} key={`doc-${index}`} container spacing={2}>
                  <Grid item xs={11}>
                    <FormControl fullWidth required>
                      <InputLabel
                        sx={{
                          backgroundColor: 'white',
                          px: 0.5,
                        }}
                      >
                        Document Type
                      </InputLabel>
                      <Select
                        value={doc}
                        onChange={(e) => handleDocumentChange(index, e.target.value)}
                      >
                        {getAvailableDocumentTypes(index).map(type => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={1}>
                    {rule.document_types.length > 1 && (
                      <IconButton onClick={() => handleRemoveDocument(index)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              ))}

              {getAvailableDocumentTypes(-1).length > 0 && (
                <Grid item xs={12}>
                  <Link
                    component="button"
                    type="button"
                    onClick={handleAddDocument}
                    sx={{ textDecoration: 'none' }}
                  >
                    + Add another document
                  </Link>
                </Grid>
              )}

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                  <Button onClick={() => navigate('/')}>Cancel</Button>
                  <Button type="submit" variant="contained" color="primary">
                    Save Rule
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RuleEdit;