import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('attendy.db');

export const setupDatabase = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS groupes (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT,
        location TEXT
      );
    `);
    console.log('Database setup complete');
  } catch (error) {
    console.error('Error setting up database: ', error);
  }
};

export const addGroup = (id: string, name: string, location: string) => {
  try {
    const query = `
    INSERT INTO groupes (id, name, location) 
    VALUES ('${id}', '${name}', '${location}');
    `;
    db.execSync(query);
    console.log('Group added successfully');
  } catch (error) {
    console.error('Error adding group: ', error);
  }
};

export interface Group {
  id: string;
  name: string;
  location: string;
}

export const getGroups = (): Group[] => {
  try {
    const resultSet = db.getAllSync('SELECT * FROM groupes');
    return resultSet as Group[];
  } catch (error) {
    console.error('Error fetching groupes: ', error);
    return [];
  }
};

export const updateGroup = (id: string, name: string, location: string) => {
  try {
    const query = `
      UPDATE groupes 
      SET name = '${name}', location = '${location}' 
      WHERE id = '${id}';
    `;
    db.execSync(query);
    console.log('Group updated successfully');
  } catch (error) {
    console.error('Error updating group: ', error);
  }
};

export const deleteGroup = (id: string) => {
  try {
    const query = `DELETE FROM groupes WHERE id = '${id}';`;
    db.execSync(query);
    console.log('Group deleted successfully');
  } catch (error) {
    console.error('Error deleting group: ', error);
  }
};
