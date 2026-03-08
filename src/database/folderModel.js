import { getDatabase } from './db';

export const createFolder = async (name) => {
  const db = getDatabase();
  const now = Date.now();
  
  const result = await db.executeSql(
    `INSERT INTO folders (name, createdAt) VALUES (?, ?)`,
    [name, now]
  );
  
  return result[0].insertId;
};

export const getAllFolders = async () => {
  const db = getDatabase();
  const results = await db.executeSql(
    `SELECT * FROM folders ORDER BY createdAt DESC`
  );
  
  const folders = [];
  for (let i = 0; i < results[0].rows.length; i++) {
    folders.push(results[0].rows.item(i));
  }
  
  return folders;
};

export const deleteFolder = async (id) => {
  const db = getDatabase();
  // Also update notes in this folder to have no folder
  await db.executeSql(`UPDATE notes SET folderId = NULL WHERE folderId = ?`, [id]);
  await db.executeSql(`DELETE FROM folders WHERE id = ?`, [id]);
};

export const updateFolder = async (id, name) => {
  const db = getDatabase();
  await db.executeSql(
    `UPDATE folders SET name = ? WHERE id = ?`,
    [name, id]
  );
};
