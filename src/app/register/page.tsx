"use client";

import { useState } from "react";
import { getDb } from "@/lib/db";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = async () => {
    if (!name || !age) return alert("Please fill in all fields");

    const parsedAge = parseInt(age);
    if (isNaN(parsedAge)) return alert("Invalid age");

    const db = await getDb();
    await db.query("INSERT INTO patients (name, age) VALUES ($1, $2)", [
      name,
      parsedAge,
    ]);

    setName("");
    setAge("");
    alert("Patient registered!");
  };

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register Patient</h1>
      <input
        className="block w-full p-2 border rounded mb-2"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="block w-full p-2 border rounded mb-4"
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </main>
  );
}
