import * as SQLite from 'expo-sqlite';
import { DateEntry, Group, Member } from '../types/models';

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
      CREATE TABLE IF NOT EXISTS dates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        groupId TEXT NOT NULL,
        value TEXT NOT NULL,
        startTime TEXT DEFAULT NULL,
        endTime TEXT DEFAULT NULL,
        tolerance INTEGER DEFAULT 0,
        FOREIGN KEY (groupId) REFERENCES groupes(id)
      );
    `);

    // Ajout des colonnes status et retardMinutes si elles n'existent pas déjà
    db.execSync(`
      CREATE TABLE IF NOT EXISTS presences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        memberId TEXT,
        dateId INTEGER,
        status TEXT DEFAULT 'present',
        retardMinutes INTEGER DEFAULT 0,
        FOREIGN KEY (memberId) REFERENCES members(id),
        FOREIGN KEY (dateId) REFERENCES dates(id)
      );
    `);

    // Pour migration si la table existe déjà sans les colonnes :
    try { db.execSync(`ALTER TABLE presences ADD COLUMN status TEXT DEFAULT 'present';`); } catch {}
    try { db.execSync(`ALTER TABLE presences ADD COLUMN retardMinutes INTEGER DEFAULT 0;`); } catch {}

    console.log('Database setup complete');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
};

export const addGroup = (id: string, name: string, location: string) => {
  try {
    db.runSync(`INSERT INTO groupes (id, name, location) VALUES (?, ?, ?)`, [id, name, location]);
  } catch (error) {
    console.error('Error adding group:', error);
  }
};

export const getGroups = (): Group[] => {
  try {
    return db.getAllSync('SELECT * FROM groupes') as Group[];
  } catch (error) {
    console.error('Error fetching groupes:', error);
    return [];
  }
};

export const updateGroup = (id: string, name: string, location: string) => {
  try {
    db.runSync(`UPDATE groupes SET name = ?, location = ? WHERE id = ?`, [name, location, id]);
  } catch (error) {
    console.error('Error updating group:', error);
  }
};

export const deleteGroup = (groupId: string) => {
  try {
    const members: Member[] = db.getAllSync('SELECT id FROM members WHERE groupId = ?', [groupId]);
    for (const member of members) {
      db.runSync('DELETE FROM presences WHERE memberId = ?', [member.id]);
    }
    db.runSync('DELETE FROM members WHERE groupId = ?', [groupId]);
    db.runSync('DELETE FROM dates WHERE groupId = ?', [groupId]);
    db.runSync('DELETE FROM groupes WHERE id = ?', [groupId]);
  } catch (error) {
    console.error('Error deleting group and associated data:', error);
  }
};

export const addMember = (id: string, groupId: string, name: string) => {
  try {
    db.runSync(`INSERT INTO members (id, groupId, name) VALUES (?, ?, ?)`, [id, groupId, name]);
  } catch (error) {
    console.error('Error adding member:', error);
  }
};

export const getMembersByGroup = (groupId?: string): Member[] => {
  try {
    const query = groupId ? 'SELECT * FROM members WHERE groupId = ?' : 'SELECT * FROM members';
    return groupId ? db.getAllSync(query, [groupId]) as Member[] : db.getAllSync(query) as Member[];
  } catch (error) {
    console.error('Error fetching members:', error);
    return [];
  }
};

export const getMemberById = (id: string): Member | null => {
  try {
    const result = db.getFirstSync('SELECT * FROM members WHERE id = ?', [id]);
    return result ? result as Member : null;
  } catch (error) {
    console.error('Error fetching member by ID:', error);
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

export const addDate = (
  groupId: string,
  value: string,
  startTime: string | null = null,
  endTime: string | null = null,
  tolerance: number = 0
) => {
  try {
    db.runSync(
      'INSERT INTO dates (groupId, value, startTime, endTime, tolerance) VALUES (?, ?, ?, ?, ?)',
      [groupId, value, startTime, endTime, tolerance]
    );
  } catch (error) {
    console.error('Error adding date:', error);
  }
};

export const getDates = (groupId: string): DateEntry[] => {
  try {
    const result = db.getAllSync(
      'SELECT id, value, startTime, endTime, tolerance FROM dates WHERE groupId = ?',
      [groupId]
    ) as DateEntry[];
    return result;
  } catch (error) {
    console.error('Error fetching dates:', error);
    return [];
  }
};

export const getDateId = (groupId: string, value: string): number | null => {
  try {
    const result = db.getFirstSync('SELECT id FROM dates WHERE groupId = ? AND value = ?', [groupId, value]) as { id?: number } | undefined;
    return result && result.id !== undefined ? result.id : null;
  } catch (error) {
    console.error('Error getting date ID:', error);
    return null;
  }
};

const getDateIdByValue = (value: string): number | null => {
  try {
    const result = db.getFirstSync('SELECT id FROM dates WHERE value = ?', [value]) as { id?: number } | undefined;
    return result && result.id !== undefined ? result.id : null;
  } catch (error) {
    console.error('Error getting date ID by value:', error);
    return null;
  }
}

export const isAlreadyPresent = (memberId: string, date: string): boolean => {
  try {
    const dateId = getDateIdByValue(date);
    const result = db.getFirstSync('SELECT 1 FROM presences WHERE memberId = ? AND dateId = ?', [memberId, dateId]);
    return !!result;
  } catch (error) {
    console.error('Error checking presence:', error);
    return false;
  }
};

export const addPresence = (memberId: string, date: string): void => {
  try {
    const dateId = getDateIdByValue(date);
    db.runSync('INSERT INTO presences (memberId, dateId, status, retardMinutes) VALUES (?, ?, ?, ?);', [memberId, dateId, 'present', 0]);
  } catch (error) {
    console.error('Error recording presence:', error);
  }
};

export const getPresenceMap = (groupId: string): Record<string, { date: string, status: string, retardMinutes: number }[]> => {
  try {
    const rows = db.getAllSync(`
      SELECT d.value AS date, p.memberId, p.status, p.retardMinutes
      FROM presences p
      INNER JOIN dates d ON p.dateId = d.id
      INNER JOIN members m ON p.memberId = m.id
      WHERE m.groupId = ?
    `, [groupId]) as { date: string; memberId: string; status: string; retardMinutes: number }[];

    const map: Record<string, { date: string, status: string, retardMinutes: number }[]> = {};
    for (const row of rows) {
      if (!map[row.memberId]) map[row.memberId] = [];
      map[row.memberId].push({ date: row.date, status: row.status, retardMinutes: row.retardMinutes });
    }

    return map;
  } catch (error) {
    console.error('Error fetching presence map:', error);
    return {};
  }
};

export function updateDate(
  dateId: string,
  newDate: Date,
  newStartTime: Date | null,
  newEndTime: Date | null,
  newTolerance: string
) {
  try {
    const value = newDate.toISOString().slice(0, 10); // format YYYY-MM-DD
    const startTime = newStartTime ? newStartTime.toTimeString().slice(0, 5) : null; // format HH:MM
    const endTime = newEndTime ? newEndTime.toTimeString().slice(0, 5) : null; // format HH:MM
    const tolerance = parseInt(newTolerance, 10) || 0;

    db.runSync(
      `UPDATE dates SET value = ?, startTime = ?, endTime = ?, tolerance = ? WHERE id = ?`,
      [value, startTime, endTime, tolerance, dateId]
    );
  } catch (error) {
    console.error('Error updating date:', error);
  }
}

export function setPresence(
  memberId: string,
  date: string,
  status: 'present' | 'absent' | 'retard' | 'permission',
  retardMinutes: number = 0
) {
  try {
    const dateId = getDateIdByValue(date);
    const existing = db.getFirstSync('SELECT id FROM presences WHERE memberId = ? AND dateId = ?', [memberId, dateId]);
    if (existing) {
      db.runSync(
        'UPDATE presences SET status = ?, retardMinutes = ? WHERE memberId = ? AND dateId = ?',
        [status, retardMinutes, memberId, dateId]
      );
    } else {
      db.runSync(
        'INSERT INTO presences (memberId, dateId, status, retardMinutes) VALUES (?, ?, ?, ?)',
        [memberId, dateId, status, retardMinutes]
      );
    }
  } catch (error) {
    console.error('Error setting presence:', error);
  }
}