import { Outlet } from "react-router";
import Menu from "./compon/Menu";

function App() {

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
        </div>
      </div>
    </>
  )
}

export default App
