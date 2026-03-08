import AsyncStorage from '@react-native-async-storage/async-storage';

const FOLDERS_KEY = '@mononote_folders';
const NOTES_KEY = '@mononote_notes';

const getFolders = async () => {
  try {
    const folders = await AsyncStorage.getItem(FOLDERS_KEY);
    return folders ? JSON.parse(folders) : [];
  } catch (error) {
    console.error('Error getting folders:', error);
    return [];
  }
};

const saveFolders = async (folders) => {
  try {
    await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  } catch (error) {
    console.error('Error saving folders:', error);
  }
};

export const createFolder = async (name) => {
  const folders = await getFolders();
  const now = Date.now();
  
  const newFolder = {
    id: now,
    name,
    createdAt: now,
  };
  
  folders.push(newFolder);
  await saveFolders(folders);
  
  return newFolder.id;
};

export const getAllFolders = async () => {
  const folders = await getFolders();
  return folders.sort((a, b) => b.createdAt - a.createdAt);
};

export const deleteFolder = async (id) => {
  // Remove folder
  const folders = await getFolders();
  const filtered = folders.filter(folder => folder.id !== id);
  await saveFolders(filtered);
  
  // Update notes in this folder to have no folder
  try {
    const notesJson = await AsyncStorage.getItem(NOTES_KEY);
    if (notesJson) {
      const notes = JSON.parse(notesJson);
      const updatedNotes = notes.map(note => 
        note.folderId === id ? { ...note, folderId: null } : note
      );
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
    }
  } catch (error) {
    console.error('Error updating notes after folder delete:', error);
  }
};

export const updateFolder = async (id, name) => {
  const folders = await getFolders();
  const index = folders.findIndex(folder => folder.id === id);
  
  if (index !== -1) {
    folders[index].name = name;
    await saveFolders(folders);
  }
};
