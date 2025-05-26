import Link from "next/link";
import { ArrowLeft, Database, User, Search, RefreshCw, AlertCircle } from "lucide-react";

export default function Notes() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-blue-400">Hippocrates</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-400 transition-colors"
              >
                Home
              </Link>
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
      <main className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-8">
              <Link href="/">
                <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-2xl transition-all font-medium shadow-lg hover:shadow-xl">
                  <ArrowLeft className="inline w-4 h-4 mr-2" />
                  Go Back
                </button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 text-center flex-1">
                <span className="text-blue-400">Usage Notes</span>
              </h1>
              <div className="w-20"></div>
            </div>

            <div className="space-y-8">
              {/* Overview */}
              <section className="bg-blue-50/80 backdrop-blur-sm p-6 rounded-2xl border border-blue-200">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4 flex items-center">
                  <Database className="w-6 h-6 mr-2" />
                  System Overview
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Hippocrates is a frontend-only patient registration system that uses PGlite for local data storage. 
                  All data is stored in your browser and persists across page refreshes. The system automatically 
                  synchronizes data across multiple tabs in real-time.
                </p>
              </section>

              {/* Patient Registration */}
              <section className="bg-green-50/80 backdrop-blur-sm p-6 rounded-2xl border border-green-200">
                <h2 className="text-2xl font-semibold text-green-600 mb-4 flex items-center">
                  <User className="w-6 h-6 mr-2" />
                  Patient Registration
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">How to Register a Patient:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>Navigate to the &quot;Register Patient&quot; page</li>
                      <li>Enter the patient&apos;s name (required field)</li>
                      <li>Enter the patient&apos;s age (must be a positive number)</li>
                      <li>Click &quot;Submit&quot; to save the patient record</li>
                    </ol>
                  </div>
                  <div className="bg-yellow-50/80 backdrop-blur-sm p-4 rounded-xl border border-yellow-200">
                    <p className="text-yellow-800 flex items-start">
                      <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Note:</strong> Both name and age are required fields. The system will show an error if either field is empty or invalid.</span>
                    </p>
                  </div>
                </div>
              </section>

              {/* SQL Queries */}
              <section className="bg-purple-50/80 backdrop-blur-sm p-6 rounded-2xl border border-purple-200">
                <h2 className="text-2xl font-semibold text-purple-600 mb-4 flex items-center">
                  <Search className="w-6 h-6 mr-2" />
                  Running SQL Queries
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Basic Usage:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>Navigate to the &quot;Run Query&quot; page</li>
                      <li>Type your SQL query in the text area</li>
                      <li>Click &quot;Run Query&quot; to execute</li>
                      <li>Results will be displayed in a table below</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Sample Queries:</h3>
                    <div className="bg-gray-800 text-green-400 p-4 rounded-xl font-mono text-sm space-y-2">
                      <div><span className="text-gray-400">-- View all patients</span></div>
                      <div>SELECT * FROM patients;</div>
                      <div className="mt-4"><span className="text-gray-400">-- Find patients by age range</span></div>
                      <div>SELECT * FROM patients WHERE age BETWEEN 20 AND 50;</div>
                      <div className="mt-4"><span className="text-gray-400">-- Count total patients</span></div>
                      <div>SELECT COUNT(*) as total_patients FROM patients;</div>
                      <div className="mt-4"><span className="text-gray-400">-- Find patients by name pattern</span></div>
                      <div>SELECT * FROM patients WHERE name LIKE &apos;%John%&apos;;</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Auto-Refresh Feature:
                    </h3>
                    <p className="text-gray-700">
                      Enable &quot;Auto-refresh on changes&quot; to automatically re-run your query whenever new patient data 
                      is added from other tabs or windows. This keeps your results up-to-date in real-time.
                    </p>
                  </div>
                </div>
              </section>

              {/* Database Schema */}
              <section className="bg-orange-50/80 backdrop-blur-sm p-6 rounded-2xl border border-orange-200">
                <h2 className="text-2xl font-semibold text-orange-600 mb-4">Database Schema</h2>
                <div className="bg-gray-800 text-green-400 p-4 rounded-xl font-mono text-sm">
                  <div className="text-yellow-400 mb-2">patients table:</div>
                  <div>├── id (INTEGER PRIMARY KEY AUTOINCREMENT)</div>
                  <div>├── name (TEXT NOT NULL)</div>
                  <div>├── age (INTEGER NOT NULL)</div>
                  <div>└── created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)</div>
                </div>
              </section>

              {/* Technical Details */}
              <section className="bg-gray-50/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-600 mb-4">Technical Details</h2>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Storage:</strong> Uses PGlite (PostgreSQL in the browser) for local data persistence</p>
                  <p><strong>Real-time Sync:</strong> Data changes are broadcast across all open tabs using BroadcastChannel API</p>
                  <p><strong>Data Persistence:</strong> All patient records persist across browser sessions and page refreshes</p>
                  <p><strong>SQL Support:</strong> Full PostgreSQL-compatible SQL syntax is supported for queries</p>
                </div>
              </section>

              {/* Quick Start */}
              <section className="bg-blue-100/80 backdrop-blur-sm p-6 rounded-2xl border border-blue-300">
                <h2 className="text-2xl font-semibold text-blue-700 mb-4">Quick Start</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register" className="flex-1">
                    <button className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 rounded-2xl px-6 py-4 text-white font-medium transition-all shadow-lg hover:shadow-xl">
                      <User className="w-5 h-5" />
                      Register Your First Patient
                    </button>
                  </Link>
                  <Link href="/query" className="flex-1">
                    <button className="w-full flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 rounded-2xl px-6 py-4 text-white font-medium transition-all shadow-lg hover:shadow-xl">
                      <Search className="w-5 h-5" />
                      Try Running a Query
                    </button>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
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