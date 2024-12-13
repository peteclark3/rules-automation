import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import RulesList from './pages/RulesList';
import RuleEdit from './pages/RuleEdit';
import Apply from './pages/Apply';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RulesList />} />
          <Route path="/rules/new" element={<RuleEdit />} />
          <Route path="/rules/:id" element={<RuleEdit />} />
          <Route path="/apply" element={<Apply />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App; 