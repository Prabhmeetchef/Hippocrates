import Link from "next/link";
import { Search, User } from "lucide-react";
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-blue-200">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-blue-400">Hippocrates</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/notes"
                className="text-gray-600 hover:text-blue-400 transition-colors"
              >
                Notes
              </Link>
              <Link
                href="https://github.com/Prabhmeetchef/Hippocrates"
                target="_blank"
                className="text-gray-600 hover:text-blue-400 transition-colors"
              >
                Github
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 py-12 sm:py-32 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="block text-blue-400 my-2">
              Patient Record System
            </span>
          </h1>
          <p className="text-base md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
             Frontend-only patient registration application built with PGlite for data storage. It allows users to register new patients, run raw SQL queries on the stored data, persist patient records across page refreshes, and ensures data is synchronized across multiple tabs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href={"/register"}><button className="flex gap-2 bg-blue-500 hover:bg-blue-600 rounded-2xl px-[18px] py-[12px] text-white">
              <User/>Register Patient
            </button></Link>
            <Link href={"/query"}><button
              className="flex gap-2 bg-blue-500 hover:bg-blue-600 rounded-2xl px-[18px] py-[12px] text-white"
            >
              <Search/>Run Query
            </button></Link>
          </div>
        </div>
      </section>

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