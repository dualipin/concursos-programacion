import Menu from "@/compon/Menu";
import { Outlet } from "react-router";

export default function AdminLayout() {
  return (
    <>
      <Menu />
      {/* Main content area (add margin for desktop) */}
      <div className="md:ml-64">
        <div className="flex flex-col h-dvh">
          {/* Your main content goes here */}
          <main className="flex-1 p-4 overflow-y-auto">
            <Outlet />
          </main>
          <footer className="bg-gray-800 text-white p-4 text-center">
            &copy; {new Date().getFullYear()} Panel de Administración
          </footer>
        </div>
      </div>
    </>
  );
}