import * as SQLite from 'expo-sqlite';

// Ouverture de la base de données en mode synchrone
const db = SQLite.openDatabaseSync('attendy.db');

// Fonction pour configurer la base de données (création des tables)
export const setupDatabase = () => {
  try {
    // Création de la table si elle n'existe pas
    db.execSync(`
      CREATE TABLE IF NOT EXISTS classes (
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

export const addClass = (id: string, name: string, location: string) => {
  try {
    // Construction de la requête SQL avec les valeurs insérées directement
    const query = `
    INSERT INTO classes (id, name, location) 
    VALUES ('${id}', '${name}', '${location}');
    `;

    // Exécution de la requête SQL
    db.execSync(query);
    console.log('Class added successfully');
    } catch (error) {
    console.error('Error adding class: ', error);
  }
};
  

// Récupérer toutes les classes de la base de données
export const getClasses = () => {
  try {
    // Exécution de la requête pour obtenir toutes les classes
    const resultSet = db.execSync('SELECT * FROM classes');
    return resultSet;
  } catch (error) {
    console.error('Error fetching classes: ', error);
    return [];
  }
};

export const updateClass = (id: string, name: string, location: string) => {
    try {
      // Création de la requête SQL sous forme de chaîne de caractères
      const query = `
        UPDATE classes 
        SET name = '${name}', location = '${location}' 
        WHERE id = '${id}';
      `;
      
      // Exécution de la requête SQL
      db.execSync(query);
      console.log('Class updated successfully');
    } catch (error) {
      console.error('Error updating class: ', error);
    }
  };
  

export const deleteClass = (id: string) => {
try {
    // Construction de la requête SQL avec l'id de la classe à supprimer
    const query = `DELETE FROM classes WHERE id = '${id}';`;
    
    // Exécution de la requête SQL
    db.execSync(query);
    console.log('Class deleted successfully');
} catch (error) {
    console.error('Error deleting class: ', error);
}
};
  