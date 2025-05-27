import { api } from "@/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

export default function ParticipanteRegistro() {
    const [fechaNacimiento, setFechaNacimiento] = useState("");
    const [fechaError, setFechaError] = useState("");
    const [rfcError, setRfcError] = useState("");
    const [numError, setNumError] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function validarFecha(fecha: string) {
        if (!fecha) return false;
        const hoy = new Date();
        const nacimiento = new Date(fecha);
        if (nacimiento > hoy) return false;
        // Debe tener al menos 0 años (nacimiento hoy o antes)
        // Puedes agregar más validaciones si lo deseas (ej: mínimo 18 años)
        return true;
    }

    function handleFechaChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setFechaNacimiento(value);
        if (!validarFecha(value)) {
            setFechaError("Fecha de nacimiento inválida.");
        } else {
            setFechaError("");
        }
    }


    function validarRFC(rfc: string) {
        const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/;
        return rfcRegex.test(rfc);
    }

    function handleRFCChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value.toUpperCase();
        e.target.value = value; // Convert input to uppercase
        if (!validarRFC(value)) {
            setRfcError("RFC inválido. Debe tener el formato correcto.");
        } else {
            setRfcError("");
        }
    }

    function validarNumero(numero: string) {
        const numeroRegex = /^\d{10}$/; // Debe ser un número de 10 dígitos
        return numeroRegex.test(numero);
    }

    function handleNumeroChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        if (!validarNumero(value)) {
            setNumError("Número inválido. Debe contener exactamente 10 dígitos.");
        } else {
            setNumError("");
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Validar RFC
        if (!validarRFC(data.rfc as string)) {
            setRfcError("RFC inválido.");
            return;
        }

        // Validar número de teléfono
        if (!validarNumero(data.telefono as string)) {
            setNumError("Número inválido.");
            return;
        }

        // Validar fecha de nacimiento
        if (!validarFecha(data.fechaNacimiento as string)) {
            setFechaError("Fecha de nacimiento inválida.");
            return;
        }

        // Aquí puedes enviar los datos al servidor
        console.log("Datos del formulario:", data);

        try {
            setLoading(true);
            setError("");
            const response = await api.post('/usuarios/registrar', {
                rfc: data.rfc,
                contra: data.contrasena,
                tipo: "participante",
                nom: data.nombre,
                apds: data.apellidos,
                fnac: data.fechaNacimiento,
                sex: data.sexo,
                correo: data.correo,
                tel: data.telefono
            });
            // Puedes mostrar un mensaje de éxito o redirigir al usuario aquí
            console.log("Registro exitoso:", response.data);
            setLoading(false);
            // Redirigir o mostrar mensaje de éxito
            const form = e.currentTarget as HTMLFormElement;
            navigate("/");
            form.reset();
        } catch (error) {
            console.error("Error al registrar:", error);
            setError("Error al registrar. Por favor, verifica tus datos.");
            setLoading(false);
            // Manejar el error de registro
        }
    }

    return (
        <div className="max-w-3xl mx-auto my-10 px-4">
            <div className="text-center mb-10">
                <img
                    src="https://escolar.macuspana.tecnm.mx/imagenes/empresa/logo2.png"
                    alt="logo itsm"
                    className="mx-auto mb-6 max-w-xs"
                />
                <h1 className="mb-4 text-3xl font-bold">Registro de Participante</h1>
                <p className="text-gray-500">
                    Por favor, completa el formulario con tus datos personales para registrarte como participante.
                </p>
            </div>

            <form className="bg-white p-6 rounded-lg shadow-md space-y-6" onSubmit={handleSubmit}>
                {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
                        {error}
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="rfc" className="block font-semibold mb-1">RFC:</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            id="rfc"
                            name="rfc"
                            required
                            placeholder="Ej: ABCD123456XYZ"
                            onChange={handleRFCChange}
                        />
                        {rfcError && (
                            <div className="text-red-600 text-xs mt-1">{rfcError}</div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="nombre" className="block font-semibold mb-1">Nombre:</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            id="nombre"
                            name="nombre"
                            required
                            placeholder="Ej: Juan"
                        />
                    </div>
                    <div>
                        <label htmlFor="apellidos" className="block font-semibold mb-1">Apellidos:</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            id="apellidos"
                            name="apellidos"
                            required
                            placeholder="Ej: Pérez Gómez"
                        />
                    </div>
                    <div>
                        <label htmlFor="correo" className="block font-semibold mb-1">Correo:</label>
                        <input
                            type="email"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            id="correo"
                            name="correo"
                            required
                            placeholder="Ej: correo@ejemplo.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="telefono" className="block font-semibold mb-1">Teléfono:</label>
                        <input
                            type="tel"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            id="telefono"
                            name="telefono"
                            required
                            placeholder="Ej: 5512345678"
                            onChange={handleNumeroChange}
                        />
                        {numError && (
                            <div className="text-red-600 text-xs mt-1">{numError}</div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="contrasena" className="block font-semibold mb-1">Contraseña:</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            id="contrasena"
                            name="contrasena"
                            required
                            placeholder="Mínimo 8 caracteres"
                        />
                    </div>
                    <div>
                        <label htmlFor="sexo" className="block font-semibold mb-1">Sexo:</label>
                        <select
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                            id="sexo"
                            name="sexo"
                            required
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Selecciona una opción
                            </option>
                            <option value="m">Masculino</option>
                            <option value="f">Femenino</option>
                            <option value="o">Otro</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="fechaNacimiento" className="block font-semibold mb-1">Fecha de Nacimiento:</label>
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            id="fechaNacimiento"
                            name="fechaNacimiento"
                            required
                            placeholder="Ej: 2000-01-01"
                            value={fechaNacimiento}
                            onChange={handleFechaChange}
                        />
                        {fechaError && (
                            <div className="text-red-600 text-xs mt-1">{fechaError}</div>
                        )}
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition disabled:opacity-60 flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                        ) : (
                            <span className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 16 16"><path d="M15.854 5.646a.5.5 0 0 0-.708 0L13 7.793V2.5A.5.5 0 0 0 12.5 2h-9a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-5.293l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3z" /></svg>
                                Registrar
                            </span>
                        )}
                    </button>
                </div>
            </form>

            <div className="text-center mt-8">
                <Link to="/" className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 16 16"><path d="M15 8a.5.5 0 0 1-.5.5H3.707l3.147 3.146a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L3.707 7.5H14.5A.5.5 0 0 1 15 8z" /></svg>
                    Regresar al inicio
                </Link>
            </div>
        </div>
    );

}
