"use client";

import { useState } from "react";
import { getDb } from "@/lib/db";

export default function QueryPage() {
  const [sql, setSql] = useState("SELECT * FROM patients");
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runQuery = async () => {
    try {
      const db = await getDb();
      const res = await db.query(sql);
      setResults(res.rows);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setResults(null);
    }
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Run SQL Query</h1>
      <textarea
        className="w-full p-2 border rounded mb-4"
        rows={4}
        value={sql}
        onChange={(e) => setSql(e.target.value)}
      />
      <button
        onClick={runQuery}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Run Query
      </button>

      {error && <p className="mt-4 text-red-600">{error}</p>}

      {results && results.length > 0 && (
        <table className="w-full mt-6 border">
          <thead className="bg-gray-100">
            <tr>
              {Object.keys(results[0]).map((col) => (
                <th key={col} className="p-2 border-b text-left">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val, j) => (
                  <td key={j} className="p-2 border-b">
                    {val === null ? "—" : String(val)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {results && results.length === 0 && (
        <p className="mt-4 text-gray-500 italic">No results found.</p>
      )}
    </main>
  );
}
