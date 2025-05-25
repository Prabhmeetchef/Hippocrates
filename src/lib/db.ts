"use client";

import { PGlite } from "@electric-sql/pglite";

let db: PGlite | null = null;

const CHANNEL_NAME = "patient-db-sync";
let broadcastChannel: BroadcastChannel | null = null;

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
  data?: any;
};

// Function to broadcast database changes
export const broadcastChange = (
  operation: "INSERT" | "UPDATE" | "DELETE",
  table: string,
  data?: any
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
    
    // Small delay to ensure the database operation is completed
    setTimeout(() => {
      channel.postMessage(event);
    }, 100);
  }
};

export const getDb = async () => {
  if (!db) {
    try {
      db = new PGlite("idb://patient-db");
      
      await db.query(`
        CREATE TABLE IF NOT EXISTS patients (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          age INTEGER NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      getBroadcastChannel();
      
      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Failed to initialize database:", error);
      throw error;
    }
  }
  return db;
};

export const insertPatient = async (name: string, age: number) => {
  const database = await getDb();
  
  try {
    const result = await database.query(
      "INSERT INTO patients (name, age) VALUES ($1, $2) RETURNING *",
      [name.trim(), age]
    );
    
    broadcastChange("INSERT", "patients", result.rows[0]);
    
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
  if (!channel) {
    console.warn("BroadcastChannel not available");
    return () => {};
  }

  const handler = (event: MessageEvent) => {
    if (event.data?.type === "DB_CHANGE") {
      console.log("Received sync event:", event.data);
      callback(event.data);
    }
  };

  channel.addEventListener("message", handler);
  
  return () => {
    channel.removeEventListener("message", handler);
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