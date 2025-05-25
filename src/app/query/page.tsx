"use client";

import { useState, useEffect, useCallback } from "react";
import { getDb, onDbChange, type SyncEvent } from "@/lib/db";

export default function QueryPage() {
  const [sql, setSql] = useState("SELECT * FROM patients ORDER BY id DESC");
  const [results, setResults] = useState<Record<string, unknown>[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [syncNotification, setSyncNotification] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastQueryTime, setLastQueryTime] = useState<Date | null>(null);

  const runQuery = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError(null);

    try {
      const db = await getDb();
      const res = await db.query(sql);
      setResults((res.rows as Record<string, unknown>[]) || []);
      setLastQueryTime(new Date());
      console.log("Query executed, results:", res.rows?.length || 0, "rows");
    } catch (err: unknown) {
      console.error("Query error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to execute query");
      }
      setResults(null);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [sql]);

  useEffect(() => {
    runQuery();
  }, [runQuery]);

  useEffect(() => {
    const unsubscribe = onDbChange((event: SyncEvent) => {
      console.log("Query page received sync event:", event);
      
      if (event.table === "patients") {
        const date = new Date(event.timestamp);
        const timeString = date.toLocaleTimeString();
        
        setSyncNotification(
          `Data ${event.operation.toLowerCase()}d in another tab at ${timeString}`
        );

        if (autoRefresh && sql.toLowerCase().includes("patients")) {
          console.log("Auto-refreshing query due to sync event");
          runQuery(false);
        }

        setTimeout(() => setSyncNotification(null), 4000);
      }
    });

    return unsubscribe;
  }, [autoRefresh, sql, runQuery]);

  const handleRunQuery = () => {
    runQuery(true);
  };

  const handleSqlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSql(e.target.value);
    setError(null);
  };

  const queryExamples = [
    {
      name: "All Patients",
      query: "SELECT * FROM patients ORDER BY id DESC"
    },
    {
      name: "Patient Count",
      query: "SELECT COUNT(*) as total_patients FROM patients"
    },
    {
      name: "Patients by Age",
      query: "SELECT age, COUNT(*) as count FROM patients GROUP BY age ORDER BY age"
    },
    {
      name: "Recent Patients",
      query: "SELECT * FROM patients ORDER BY created_at DESC LIMIT 10"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-blue-200">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => window.history.back()}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-2xl transition-all font-medium shadow-lg hover:shadow-xl"
              >
                ← Go Back
              </button>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a
                href="/notes"
                className="text-gray-600 hover:text-blue-400 transition-colors"
              >
                Notes
              </a>
              <a
                href="https://github.com/Prabhmeetchef/Hippocrates"
                target="_blank"
                className="text-gray-600 hover:text-blue-400 transition-colors"
              >
                Github
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              <span className="text-blue-400">SQL Query Interface</span>
            </h1>

            {/* Query Examples */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Examples:
              </label>
              <div className="flex flex-wrap gap-2">
                {queryExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setSql(example.query)}
                    className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors"
                  >
                    {example.name}
                  </button>
                ))}
              </div>
            </div>
            
            <textarea
              value={sql}
              onChange={handleSqlChange}
              rows={4}
              placeholder="Enter your SQL query here..."
              className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all mb-6 font-mono text-sm"
            />
            
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleRunQuery}
                disabled={isLoading || !sql.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-3 rounded-2xl transition-all font-medium shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                {isLoading ? "Running..." : "Run Query"}
              </button>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoRefresh"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="autoRefresh" className="text-sm text-gray-700">
                    Auto-refresh on changes
                  </label>
                </div>
                
                {lastQueryTime && (
                  <span className="text-xs text-gray-500">
                    Last run: {lastQueryTime.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>

            {/* Notifications */}
            {syncNotification && (
              <div className="mb-6 text-blue-700 bg-blue-50/80 backdrop-blur-sm p-4 rounded-2xl border border-blue-200">
                <strong>Sync:</strong> {syncNotification}
              </div>
            )}

            {error && (
              <div className="mb-6 text-red-600 bg-red-50/80 backdrop-blur-sm p-4 rounded-2xl border border-red-200">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Results */}
            {isLoading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-600">Running query...</p>
              </div>
            )}

            {!isLoading && results && results.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Results ({results.length} rows)
                  </h3>
                </div>
                
                <div className="overflow-x-auto bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg">
                  <table className="min-w-full">
                    <thead className="bg-blue-50/80 backdrop-blur-sm">
                      <tr>
                        {Object.keys(results[0]).map((col) => (
                          <th
                            key={col}
                            className="text-left p-4 border-b border-gray-200 font-semibold text-gray-800 first:rounded-tl-2xl last:rounded-tr-2xl"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((row, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                          {Object.values(row).map((val, j) => (
                            <td key={j} className="p-4 border-b border-gray-100 text-gray-700">
                              {val === null || val === undefined
                                ? <span className="text-gray-400 italic">null</span>
                                : typeof val === "object"
                                ? JSON.stringify(val)
                                : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!isLoading && results && results.length === 0 && (
              <div className="mt-6 text-gray-500 italic text-center bg-gray-50/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200">
                No results found. The query executed successfully but returned no rows.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white w-full">
        <div className="container mx-auto"> 
          <div className="border-t border-gray-800 p-8 text-center text-gray-400">
            <p>
              by Prabhmeet Singh, prabhmeetsinghns1000@gmail.com
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}