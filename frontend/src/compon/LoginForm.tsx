import { api } from "@/api";
import { useUsuarioStore } from "@/estados/usuario-est";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function LoginForm() {
  const setUsuario = useUsuarioStore((state) => state.setUsuario);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      const response = await api.post('/usuarios/login', {
        rfc: email,
        contrasena: password
      })

      if (response.status === 200) {
        setUsuario(response.data);
        console.log("usuario", response.data);
        setError("");
        setIsSubmitting(false);

        if (response.data?.tipo === "jurado") {
          navigate("/jurado");
        }
        if (response.data?.tipo === "participante") {
          navigate("/participante");
        }
        if (response.data?.tipo === "admin") {
          navigate("/admin");
        }

      } else {
        console.log("Error en la respuesta del servidor:", response);
        setError("Credenciales inválidas.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError((error as any).response?.data.error || "Error al iniciar sesión.");
      setIsSubmitting(false);
    }

  };

  const handleReset = () => {
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8">

      <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="rfc" className="block text-gray-700 font-medium mb-2">
            RFC
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="rfc"
            placeholder="XXXX000000XXX"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Correo Electrónico"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="text-xs text-gray-500 mt-1">
            Este es tu usuario.
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="contrasena" className="block text-gray-700 font-medium mb-2">
            Contraseña
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="contrasena"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Contraseña"
          />
        </div>
        {error && <div className="mb-4 text-red-600 bg-red-100 border border-red-300 rounded px-4 py-2">{error}</div>}
        <div className="flex flex-col gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Cargando..." : "Iniciar Sesión"}
          </button>
          <button
            type="button"
            className="bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition-colors"
            onClick={() => navigate("/registro")}
          >
            Registrarse
          </button>
          <button
            type="button"
            className="border border-gray-400 text-gray-700 font-semibold py-2 rounded hover:bg-gray-100 transition-colors"
            onClick={handleReset}
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}
