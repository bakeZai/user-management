'use client'; // <-- ЭТО ОБЪЯВЛЯЕТ КОМПОНЕНТ КЛИЕНТСКИМ

import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CssVarsProvider } from '@mui/joy/styles'; // Добавляем для гибкости

// Создаем тему с градиентным фоном
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: 'linear-gradient(135deg, #0e0e1dff 0%, #625d5dff 100%)', // Градиент в стиле Apple
      paper: 'linear-gradient(135deg, #000012ff 0%, #ffffff 100%)', // Для компонентов
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #f5f5f7 0%, #ffffff 100%)', // Глобальный фон
          minHeight: '100vh', // Полная высота экрана
          margin: 0,
          padding: 0,
        },
      },
    },
  },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}