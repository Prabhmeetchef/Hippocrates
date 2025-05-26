"use client";

import { useState, useEffect } from "react";
import { insertPatient, onDbChange, type SyncEvent, getAllPatients } from "@/lib/db";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [syncNotification, setSyncNotification] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patients, setPatients] = useState<Record<string, unknown>[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);

  // Load initial patients and set up sync
  useEffect(() => {
    const loadPatients = async () => {
      try {
        setIsLoadingPatients(true);
        const data = await getAllPatients();
        setPatients(data);
      } catch (err) {
        console.error("Failed to load patients:", err);
      } finally {
        setIsLoadingPatients(false);
      }
    };

    const unsubscribe = onDbChange(async (event: SyncEvent) => {
      if (event.table === "patients") {
        // Update notification
        const date = new Date(event.timestamp);
        const timeString = date.toLocaleTimeString();
        
        if (event.operation === "INSERT") {
          setSyncNotification(`New patient added in another tab at ${timeString}`);
        } else {
          setSyncNotification(`Database updated in another tab at ${timeString}`);
        }
        
        setTimeout(() => setSyncNotification(null), 5000);

        // Refresh patient list
        await loadPatients();
      }
    });

    // Initial load
    loadPatients();

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    // Validation
    if (!name.trim() || !age.trim()) {
      setError("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    const parsedAge = parseInt(age);
    if (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 150) {
      setError("Please enter a valid age (0-150)");
      setIsSubmitting(false);
      return;
    }

    try {
      const newPatient = await insertPatient(name, parsedAge) as { name: string };
      
      // Reset form
      setName("");
      setAge("");
      setSuccess(`Patient "${newPatient.name}" registered successfully!`);
      
      // Refresh patient list
      const updatedPatients = await getAllPatients();
      setPatients(updatedPatients);
    } catch (err: unknown) {
      console.error("Registration error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to register patient");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleSubmit();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-blue-200">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-2xl transition-all font-medium shadow-lg hover:shadow-xl"
            >
              ← Go Back
            </button>
            <div className="flex items-center space-x-2">
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
      <main className="flex-grow py-10 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            {/* Registration Form */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                <span className="text-blue-400">Register Patient</span>
              </h1>

              <input
                placeholder="Patient Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSubmitting}
                className="block w-full p-4 mb-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all disabled:opacity-50"
              />

              <input
                placeholder="Age"
                value={age}
                type="number"
                min={0}
                max={150}
                onChange={(e) => setAge(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSubmitting}
                className="block w-full p-4 mb-6 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all disabled:opacity-50"
              />

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-4 rounded-2xl transition-all font-medium text-lg shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Registering..." : "Register Patient"}
              </button>

              {/* Status Messages */}
              {error && (
                <div className="mt-6 text-red-600 bg-red-50/80 backdrop-blur-sm p-4 rounded-2xl border border-red-200">
                  <strong>Error:</strong> {error}
                </div>
              )}
              
              {success && (
                <div className="mt-6 text-green-700 bg-green-50/80 backdrop-blur-sm p-4 rounded-2xl border border-green-200">
                  <strong>Success:</strong> {success}
                </div>
              )}
              
              {syncNotification && (
                <div className="mt-6 text-blue-700 bg-blue-50/80 backdrop-blur-sm p-4 rounded-2xl border border-blue-200">
                  <strong>Sync:</strong> {syncNotification}
                </div>
              )}
            </div>

            {/* Patients Table */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                <span className="text-blue-400">Registered Patients</span>
              </h2>
              
              {isLoadingPatients ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <p className="mt-2 text-gray-600">Loading patients...</p>
                </div>
              ) : patients.length > 0 ? (
                <div className="overflow-x-auto bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg">
                  <table className="min-w-full">
                    <thead className="bg-blue-50/80 backdrop-blur-sm">
                      <tr>
                        {Object.keys(patients[0]).map((col) => (
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
                      {patients.map((patient, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                          {Object.values(patient).map((val, j) => (
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
              ) : (
                <div className="text-gray-500 italic text-center bg-gray-50/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200">
                  No patients registered yet.
                </div>
              )}
            </div>
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