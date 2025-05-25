import { Outlet } from "react-router";
import MenuJurado from "./compon/MenuJurado";
import MenuParticipante from "./compon/MenuParticipante";
import { useUsuarioStore } from "./estados/usuario-est";

function App() {
  const user = useUsuarioStore((state) => state.usuario);

  return (
    <>
      {user?.tipo === "jurado" && <MenuJurado />}
      {user?.tipo === "participante" && <MenuParticipante />}
      <Outlet />
    </>
  )
}

export default App
