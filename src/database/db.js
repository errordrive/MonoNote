import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(false);
SQLite.enablePromise(true);

const database_name = 'MonoNote.db';
const database_version = '1.0';
const database_displayname = 'MonoNote Database';
const database_size = 200000;

let db;

export const initDB = async () => {
  try {
    db = await SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );
    
    await createTables();
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

const createTables = async () => {
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS folders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      createdAt INTEGER NOT NULL
    );
  `);

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      folderId INTEGER,
      isPinned INTEGER DEFAULT 0,
      isArchived INTEGER DEFAULT 0,
      FOREIGN KEY (folderId) REFERENCES folders (id)
    );
  `);

  console.log('Tables created successfully');
};

export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  return db;
};

export default {
  initDB,
  getDatabase,
};
