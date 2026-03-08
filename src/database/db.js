import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = '@mononote_notes';
const FOLDERS_KEY = '@mononote_folders';

export const initDB = async () => {
  try {
    // Initialize storage if needed
    const notes = await AsyncStorage.getItem(NOTES_KEY);
    if (!notes) {
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify([]));
    }
    
    const folders = await AsyncStorage.getItem(FOLDERS_KEY);
    if (!folders) {
      await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify([]));
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const getDatabase = () => {
  return {
    notes: NOTES_KEY,
    folders: FOLDERS_KEY,
  };
};

export default {
  initDB,
  getDatabase,
};
