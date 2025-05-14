import * as SQLite from 'expo-sqlite';
import { Group, Member } from '../types/models';

const db = SQLite.openDatabaseSync('attendy.db');

// Fonction de setup de la base de données
export const setupDatabase = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS groupes (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT,
        location TEXT
      );
    `);

    db.execSync(`
      CREATE TABLE IF NOT EXISTS members (
        id TEXT PRIMARY KEY NOT NULL,
        groupId TEXT,
        name TEXT,
        FOREIGN KEY (groupId) REFERENCES groupes(id)
      );
    `);

    console.log('Database setup complete');
  } catch (error) {
    console.error('Error setting up database: ', error);
  }
};

// Fonction pour ajouter un groupe
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

// Fonction pour obtenir tous les groupes
export const getGroups = (): Group[] => {
  try {
    const resultSet = db.getAllSync('SELECT * FROM groupes');
    return resultSet as Group[];
  } catch (error) {
    console.error('Error fetching groupes: ', error);
    return [];
  }
};

// Fonction pour mettre à jour un groupe
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

// Fonction pour supprimer un groupe
export const deleteGroup = (id: string) => {
  try {
    const query = `DELETE FROM groupes WHERE id = '${id}';`;
    db.execSync(query);
    console.log('Group deleted successfully');
  } catch (error) {
    console.error('Error deleting group: ', error);
  }
};

// Fonction pour ajouter un membre
export const addMember = (id: string, groupId: string, name: string) => {
  try {
    const query = `
      INSERT INTO members (id, groupId, name) 
      VALUES ('${id}', '${groupId}', '${name}');
    `;
    db.execSync(query);
    console.log('Member added successfully');
  } catch (error) {
    console.error('Error adding member: ', error);
  }
};

// Fonction pour obtenir tous les membres
export const getMembers = (groupId?: string): Member[] => {
  try {
    const query = groupId 
      ? 'SELECT * FROM members WHERE groupId = ?' 
      : 'SELECT * FROM members';
    const resultSet = groupId 
      ? db.getAllSync(query, [groupId]) 
      : db.getAllSync(query);
    return resultSet as Member[];
  } catch (error) {
    console.error('Error fetching members: ', error);
    return [];
  }
};