import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "../Navbar";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    // 1. Outer Container: Flex row, full screen, no scroll on body
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* 2. Sidebar: Fixed width, sits naturally in flex flow */}
      <Sidebar />

      {/* 3. Main Column: Takes remaining space, contains Navbar + Scrollable Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Navbar stays at the top of this column */}
        <Navbar />

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          {/* Added a subtle entry animation for pages */}
          <div className="animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}