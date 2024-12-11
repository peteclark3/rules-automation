import React from 'react';
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

const RulesList: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock data - replace with API call
  const rules = [
    {
      id: 1,
      name: 'New Family Document Request',
      conditions: [
        { type: 'family_status', value: 'new' },
        { type: 'business_owner', value: 'true' }
      ],
      document_types: ['tax_return', 'business_docs']
    },
    {
      id: 2,
      name: 'Tax Filing Verification',
      conditions: [
        { type: 'tax_filing', value: 'not_filed' }
      ],
      document_types: ['income_verification']
    },
  ];

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
                  <IconButton>
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