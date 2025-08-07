'use client';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { Inter } from 'next/font/google';
import { useState, useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });
const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(
      createTheme({
        palette: {
          primary: { main: '#1976d2' },
          secondary: { main: '#dc004e' },
          background: {
            default: 'linear-gradient(135deg, #15154eff 0%, #ffffff 100%)', // Градиент в стиле Apple
            paper: 'linear-gradient(135deg, #c0c0feff 0%, #c56e30ff 100%)',
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                background: 'linear-gradient(135deg, #ffffffff 0%, #a7adfdff 100%)', // Глобальный фон
                minHeight: '100vh', // Полная высота экрана
                margin: 0,
                padding: 0,
              },
            },
          },
        },
      })
    );
  }, []);

  if (!theme) return null; // Предотвращаем рендеринг до загрузки темы

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}