import * as SQLite from 'expo-sqlite';

// Conexion con SQLITE datos locales 
export const DatabaseConnection = {
  getConnection: () => SQLite.openDatabase("database.db"),
};