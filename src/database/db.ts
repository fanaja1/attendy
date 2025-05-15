import * as SQLite from 'expo-sqlite';
import { Group, Member } from '../types/models';

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

    db.execSync(`
      CREATE TABLE IF NOT EXISTS members (
        id TEXT PRIMARY KEY NOT NULL,
        groupId TEXT,
        name TEXT,
        FOREIGN KEY (groupId) REFERENCES groupes(id)
      );
    `);
    
    db.execSync(`
      CREATE TABLE IF NOT EXISTS presences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        memberId TEXT,
        date TEXT,
        FOREIGN KEY (memberId) REFERENCES members(id)
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

export const deleteGroup = (groupId: string) => {
  try {
    // Étape 1 : Récupérer tous les membres du groupe
    const members: Member[] = db.getAllSync('SELECT id FROM members WHERE groupId = ?', [groupId]);

    // Étape 2 : Supprimer toutes les présences de ces membres
    for (const member of members) {
      db.runSync('DELETE FROM presences WHERE memberId = ?', [member.id]);
    }

    // Étape 3 : Supprimer les membres du groupe
    db.runSync('DELETE FROM members WHERE groupId = ?', [groupId]);

    // Étape 4 : Supprimer le groupe lui-même
    db.runSync('DELETE FROM groupes WHERE id = ?', [groupId]);

    console.log('Group and associated data deleted successfully');
  } catch (error) {
    console.error('Error deleting group and associated data:', error);
  }
};


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

export const getMemberById = (id: string): Member | null => {
  try {
    const result = db.getFirstSync('SELECT * FROM members WHERE id = ?', [id]);
    return result ? (result as Member) : null;
  } catch (error) {
    console.error('Error fetching member by ID: ', error);
    return null;
  }
};

export const memberExists = (id: string): boolean => {
  try {
    const result = db.getFirstSync('SELECT 1 FROM members WHERE id = ?', [id]);
    return !!result;
  } catch (error) {
    console.error('Error checking member existence:', error);
    return false;
  }
};

export const isAlreadyPresent = (memberId: string, date: string): boolean => {
  try {
    const result = db.getFirstSync(
      'SELECT 1 FROM presences WHERE memberId = ? AND date = ?',
      [memberId, date]
    );
    return !!result;
  } catch (error) {
    console.error('Error checking presence:', error);
    return false;
  }
};

export const addPresence = (memberId: string, date: string): void => {
  try {
    db.runSync(
      'INSERT INTO presences (memberId, date) VALUES (?, ?);',
      [memberId, date]
    );
    console.log('Presence recorded');
  } catch (error) {
    console.error('Error recording presence:', error);
  }
};

export const getPresenceMap = (groupId: string): Record<string, string[]> => {
  try {
    const rows = db.getAllSync(`
      SELECT p.date, p.memberId 
      FROM presences p
      INNER JOIN members m ON p.memberId = m.id
      WHERE m.groupId = ?
    `, [groupId]) as { date: string; memberId: string }[];

    const map: Record<string, string[]> = {};
    for (const row of rows) {
      if (!map[row.memberId]) {
        map[row.memberId] = [];
      }
      map[row.memberId].push(row.date);
    }

    return map;
  } catch (error) {
    console.error('Error fetching presence map:', error);
    return {};
  }
};
