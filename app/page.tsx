'use client';

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Collapse, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleInstructions = () => setInstructionsOpen(!instructionsOpen);

  return (
    <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 1 }}>
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center', }}>
        <Typography variant="h4" gutterBottom>
          Welcome to the Game Portal
        </Typography>
        {/* Оборачиваем обе кнопки в Box с Flexbox */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
          {/* Кнопка Start */}
          <Button
            variant="contained"
            color="primary"
            href="/users/login"
            // Отступы mb: 2 и mt: 2 удалены, так как Box с gap управляет расстоянием
          >
            Start
          </Button>
          {/* Кнопка Show Instructions */}
          <Button
            variant="contained"
            color="primary"
            onClick={toggleInstructions}
            endIcon={instructionsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            // Отступы mt: 2, mb: 2 удалены
          >
            Show Instructions
          </Button>
        </Box>
        <Collapse in={instructionsOpen}>
         <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography>
            1. Register a new account on the Register page.
              2. Log in with your credentials on the Login page.
              3. Enjoy games or manage users if you are an admin.
              4. Use the logout button to exit.
                  </Typography>
          </Box>
        </Collapse>
      </Container>
    </Box>
  );
}
