import { getDatabase } from './db';

export const createNote = async (title, content, folderId = null) => {
  const db = getDatabase();
  const now = Date.now();
  
  const result = await db.executeSql(
    `INSERT INTO notes (title, content, createdAt, updatedAt, folderId) VALUES (?, ?, ?, ?, ?)`,
    [title, content, now, now, folderId]
  );
  
  return result[0].insertId;
};

export const getAllNotes = async () => {
  const db = getDatabase();
  const results = await db.executeSql(
    `SELECT * FROM notes WHERE isArchived = 0 ORDER BY isPinned DESC, updatedAt DESC`
  );
  
  const notes = [];
  for (let i = 0; i < results[0].rows.length; i++) {
    notes.push(results[0].rows.item(i));
  }
  
  return notes;
};

export const getNoteById = async (id) => {
  const db = getDatabase();
  const results = await db.executeSql(
    `SELECT * FROM notes WHERE id = ?`,
    [id]
  );
  
  if (results[0].rows.length > 0) {
    return results[0].rows.item(0);
  }
  return null;
};

export const updateNote = async (id, title, content) => {
  const db = getDatabase();
  const now = Date.now();
  
  await db.executeSql(
    `UPDATE notes SET title = ?, content = ?, updatedAt = ? WHERE id = ?`,
    [title, content, now, id]
  );
};

export const deleteNote = async (id) => {
  const db = getDatabase();
  await db.executeSql(`DELETE FROM notes WHERE id = ?`, [id]);
};

export const togglePinNote = async (id, isPinned) => {
  const db = getDatabase();
  await db.executeSql(
    `UPDATE notes SET isPinned = ? WHERE id = ?`,
    [isPinned ? 1 : 0, id]
  );
};

export const archiveNote = async (id) => {
  const db = getDatabase();
  await db.executeSql(
    `UPDATE notes SET isArchived = 1 WHERE id = ?`,
    [id]
  );
};

export const searchNotes = async (query) => {
  const db = getDatabase();
  const results = await db.executeSql(
    `SELECT * FROM notes WHERE isArchived = 0 AND (title LIKE ? OR content LIKE ?) ORDER BY updatedAt DESC`,
    [`%${query}%`, `%${query}%`]
  );
  
  const notes = [];
  for (let i = 0; i < results[0].rows.length; i++) {
    notes.push(results[0].rows.item(i));
  }
  
  return notes;
};

export const getNotesByFolder = async (folderId) => {
  const db = getDatabase();
  const results = await db.executeSql(
    `SELECT * FROM notes WHERE folderId = ? AND isArchived = 0 ORDER BY isPinned DESC, updatedAt DESC`,
    [folderId]
  );
  
  const notes = [];
  for (let i = 0; i < results[0].rows.length; i++) {
    notes.push(results[0].rows.item(i));
  }
  
  return notes;
};
