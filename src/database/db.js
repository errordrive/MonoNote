// No initialization needed for in-memory storage
export const initDB = async () => {
  console.log('In-memory storage initialized');
  return Promise.resolve();
};

export const getDatabase = () => {
  return {
    type: 'memory',
    notes: [],
    folders: [],
  };
};

export default {
  initDB,
  getDatabase,
};
