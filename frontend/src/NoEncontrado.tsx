import { Link } from "react-router";

export default function NoEncontrado() {
  return (
    <div>
      <h1>Página no encontrada</h1>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <Link to="/" className="text-blue-500 hover:underline">
        Regresar al inicio
      </Link>
    </div>
  );
}
