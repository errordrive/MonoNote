import React, { createContext, useContext, useState } from 'react';

const StorageContext = createContext();

export const StorageProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);

  // Note operations
  const createNote = (title, content, folderId = null) => {
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
    setNotes(prev => [...prev, newNote]);
    return newNote.id;
  };

  const getAllNotes = () => {
    return notes
      .filter(note => !note.isArchived)
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.updatedAt - a.updatedAt;
      });
  };

  const getNoteById = (id) => {
    return notes.find(note => note.id === id) || null;
  };

  const updateNote = (id, title, content) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, title, content, updatedAt: Date.now() }
          : note
      )
    );
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const togglePinNote = (id, isPinned) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id ? { ...note, isPinned } : note
      )
    );
  };

  const archiveNote = (id) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id ? { ...note, isArchived: true } : note
      )
    );
  };

  const searchNotes = (query) => {
    const lowerQuery = query.toLowerCase();
    return notes
      .filter(note =>
        !note.isArchived &&
        (note.title.toLowerCase().includes(lowerQuery) ||
         (note.content && note.content.toLowerCase().includes(lowerQuery)))
      )
      .sort((a, b) => b.updatedAt - a.updatedAt);
  };

  const getNotesByFolder = (folderId) => {
    return notes
      .filter(note => note.folderId === folderId && !note.isArchived)
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.updatedAt - a.updatedAt;
      });
  };

  // Folder operations
  const createFolder = (name) => {
    const now = Date.now();
    const newFolder = {
      id: now,
      name,
      createdAt: now,
    };
    setFolders(prev => [...prev, newFolder]);
    return newFolder.id;
  };

  const getAllFolders = () => {
    return folders.sort((a, b) => b.createdAt - a.createdAt);
  };

  const deleteFolder = (id) => {
    setFolders(prev => prev.filter(folder => folder.id !== id));
    // Update notes in this folder to have no folder
    setNotes(prev =>
      prev.map(note =>
        note.folderId === id ? { ...note, folderId: null } : note
      )
    );
  };

  const updateFolder = (id, name) => {
    setFolders(prev =>
      prev.map(folder =>
        folder.id === id ? { ...folder, name } : folder
      )
    );
  };

  const value = {
    // Note operations
    createNote,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote,
    togglePinNote,
    archiveNote,
    searchNotes,
    getNotesByFolder,
    // Folder operations
    createFolder,
    getAllFolders,
    deleteFolder,
    updateFolder,
  };

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within StorageProvider');
  }
  return context;
};
