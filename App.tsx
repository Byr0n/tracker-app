import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, ToastProvider } from './src';
import { AppNavigator } from './src/task-app/AppNavigator';

export default function App() {
  return (
    <ThemeProvider initialMode="system">
      <ToastProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </ToastProvider>
    </ThemeProvider>
  );
}
