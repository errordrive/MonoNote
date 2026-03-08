import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = '@mononote_notes';

const getNotes = async () => {
  try {
    const notes = await AsyncStorage.getItem(NOTES_KEY);
    return notes ? JSON.parse(notes) : [];
  } catch (error) {
    console.error('Error getting notes:', error);
    return [];
  }
};

const saveNotes = async (notes) => {
  try {
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes:', error);
  }
};

export const createNote = async (title, content, folderId = null) => {
  const notes = await getNotes();
  const now = Date.now();
  
  const newNote = {
    id: now,
    title,
    content,
    createdAt: now,
    updatedAt: now,
    folderId,
    isPinned: false,
    isArchived: false,
  };
  
  notes.push(newNote);
  await saveNotes(notes);
  
  return newNote.id;
};

export const getAllNotes = async () => {
  const notes = await getNotes();
  return notes
    .filter(note => !note.isArchived)
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.updatedAt - a.updatedAt;
    });
};

export const getNoteById = async (id) => {
  const notes = await getNotes();
  return notes.find(note => note.id === id) || null;
};

export const updateNote = async (id, title, content) => {
  const notes = await getNotes();
  const index = notes.findIndex(note => note.id === id);
  
  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      content,
      updatedAt: Date.now(),
    };
    await saveNotes(notes);
  }
};

export const deleteNote = async (id) => {
  const notes = await getNotes();
  const filtered = notes.filter(note => note.id !== id);
  await saveNotes(filtered);
};

export const togglePinNote = async (id, isPinned) => {
  const notes = await getNotes();
  const index = notes.findIndex(note => note.id === id);
  
  if (index !== -1) {
    notes[index].isPinned = isPinned;
    await saveNotes(notes);
  }
};

export const archiveNote = async (id) => {
  const notes = await getNotes();
  const index = notes.findIndex(note => note.id === id);
  
  if (index !== -1) {
    notes[index].isArchived = true;
    await saveNotes(notes);
  }
};

export const searchNotes = async (query) => {
  const notes = await getNotes();
  const lowerQuery = query.toLowerCase();
  
  return notes
    .filter(note => 
      !note.isArchived &&
      (note.title.toLowerCase().includes(lowerQuery) ||
       (note.content && note.content.toLowerCase().includes(lowerQuery)))
    )
    .sort((a, b) => b.updatedAt - a.updatedAt);
};

export const getNotesByFolder = async (folderId) => {
  const notes = await getNotes();
  return notes
    .filter(note => note.folderId === folderId && !note.isArchived)
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.updatedAt - a.updatedAt;
    });
};
