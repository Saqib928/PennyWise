import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar  from "../Navbar";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full">
        <Navbar />
        <main className="pt-20 p-6">{children}</main>
      </div>
    </div>
  );
}
