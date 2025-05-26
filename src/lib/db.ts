"use client";

import { PGlite } from "@electric-sql/pglite";

let db: PGlite | null = null;
const SYNC_KEY = 'patient-db-sync-v3';
const CHANNEL_NAME = "patient-db-sync";
let broadcastChannel: BroadcastChannel | null = null;

// Database initialization with retry logic
export const getDb = async () => {
  if (!db) {
    try {
      db = new PGlite("idb://patient-db", { relaxedDurability: true });
      
      await db.query(`
        CREATE TABLE IF NOT EXISTS patients (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          age INTEGER NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Force initial sync
      await db.query("SELECT 1");
      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Failed to initialize database:", error);
      throw error;
    }
  }
  return db;
};

// Enhanced sync function
export const forceSync = async () => {
  const database = await getDb();
  try {
    // Triple sync pattern
    await database.query("COMMIT");
    await database.query("SELECT 1");
    await database.query("VACUUM");
    localStorage.setItem(SYNC_KEY, Date.now().toString());
  } catch (error) {
    console.error("Sync failed:", error);
  }
};

// BroadcastChannel setup
const getBroadcastChannel = () => {
  if (typeof window !== "undefined" && !broadcastChannel) {
    try {
      broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
    } catch (err) {
      console.error("BroadcastChannel not supported:", err);
    }
  }
  return broadcastChannel;
};

export type SyncEvent = {
  type: "DB_CHANGE";
  operation: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  timestamp: number;
  data?: Record<string, unknown>;
};

export const broadcastChange = (
  operation: "INSERT" | "UPDATE" | "DELETE",
  table: string,
  data?: Record<string, unknown>
) => {
  const channel = getBroadcastChannel();
  if (channel) {
    const event: SyncEvent = {
      type: "DB_CHANGE",
      operation,
      table,
      timestamp: Date.now(),
      data,
    };
    channel.postMessage(event);
  }
};

export const insertPatient = async (name: string, age: number) => {
  const database = await getDb();
  
  try {
    const result = await database.query(
      "INSERT INTO patients (name, age) VALUES ($1, $2) RETURNING *",
      [name.trim(), age]
    );
    
    // Dual sync system
    broadcastChange("INSERT", "patients", result.rows[0]);
    await forceSync();
    
    return result.rows[0];
  } catch (error) {
    console.error("Failed to insert patient:", error);
    throw error;
  }
};

export const getAllPatients = async () => {
  const database = await getDb();
  try {
    const result = await database.query("SELECT * FROM patients ORDER BY id DESC");
    return result.rows;
  } catch (error) {
    console.error("Failed to get patients:", error);
    throw error;
  }
};

export const onDbChange = (
  callback: (event: SyncEvent) => void
): (() => void) => {
  const channel = getBroadcastChannel();
  
  const bcHandler = (event: MessageEvent) => {
    if (event.data?.type === "DB_CHANGE") {
      callback(event.data);
    }
  };

  const lsHandler = (e: StorageEvent) => {
    if (e.key === SYNC_KEY) {
      callback({
        type: "DB_CHANGE",
        operation: "UPDATE",
        table: "patients",
        timestamp: parseInt(e.newValue || '0'),
        data: undefined
      });
    }
  };

  if (channel) channel.addEventListener("message", bcHandler);
  window.addEventListener('storage', lsHandler);
  
  return () => {
    if (channel) channel.removeEventListener("message", bcHandler);
    window.removeEventListener('storage', lsHandler);
  };
};

export const closeDb = async () => {
  if (db) {
    await db.close();
    db = null;
  }
  if (broadcastChannel) {
    broadcastChannel.close();
    broadcastChannel = null;
  }
};