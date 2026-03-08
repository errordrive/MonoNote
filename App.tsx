import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { StorageProvider } from './src/database/StorageContext';
import { initDB } from './src/database/db';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const App = () => {
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await initDB();
      console.log('App initialized successfully');
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StorageProvider>
        <AppNavigator />
      </StorageProvider>
    </GestureHandlerRootView>
  );
};

export default App;
