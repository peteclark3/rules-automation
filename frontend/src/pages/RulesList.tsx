import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Rule {
  id: string;
  name: string;
  conditions: Array<{
    type: string;
    value: string;
  }>;
  document_types: string[];
}

const RulesList: React.FC = () => {
  const navigate = useNavigate();
  const [rules, setRules] = useState<Rule[]>([]);
  
  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch('http://localhost:8000/rules/');
      if (!response.ok) {
        throw new Error('Failed to fetch rules');
      }
      const data = await response.json();
      setRules(data);
    } catch (error) {
      console.error('Error fetching rules:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/rules/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete rule');
      }
      fetchRules(); // Refresh the list
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  const getConditionLabel = (condition: { type: string, value: string }) => {
    switch (condition.type) {
      case 'family_status':
        return `Family Status: ${condition.value === 'new' ? 'New' : 'Returning'}`;
      case 'business_owner':
        return `Business Owner: ${condition.value === 'true' ? 'Yes' : 'No'}`;
      case 'tax_filing':
        return `Tax Filing: ${condition.value === 'filed' ? 'Filed' : 'Not Filed'} 2021`;
      default:
        return '';
    }
  };

  const getDocumentLabel = (docType: string) => {
    switch (docType) {
      case 'tax_return': return 'Tax Return';
      case 'business_docs': return 'Business Documents';
      case 'income_verification': return 'Income Verification';
      default: return docType;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Document Request Rules</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/rules/new')}
        >
          Create New Rule
        </Button>
      </Box>

      <Card>
        <CardContent>
          <List>
            {rules.map((rule) => (
              <ListItem key={rule.id} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">{rule.name}</Typography>
                  <IconButton onClick={() => handleDelete(rule.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
                
                <Stack direction="column" spacing={1} sx={{ mt: 1, width: '100%' }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Conditions:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {rule.conditions.map((condition, idx) => (
                      <Chip
                        key={idx}
                        label={getConditionLabel(condition)}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Stack>
                  
                  <Typography variant="subtitle2" color="textSecondary">
                    Required Documents:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {rule.document_types.map((doc, idx) => (
                      <Chip
                        key={idx}
                        label={getDocumentLabel(doc)}
                        color="primary"
                        size="small"
                      />
                    ))}
                  </Stack>
                </Stack>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RulesList; 