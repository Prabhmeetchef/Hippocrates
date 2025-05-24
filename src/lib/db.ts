"use client";

import { PGlite } from "@electric-sql/pglite";

let db: PGlite | null = null;

// Initialize database
export const getDb = async () => {
  if (!db) {
    db = new PGlite("idb://patient-db"); // use idb:// to persist
    await db.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        name TEXT,
        age INTEGER
      );
    `);
  }
  return db;
};