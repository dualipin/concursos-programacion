import { create } from "zustand";
import type { Usuario } from "../tipos/Usuario";

interface UsuarioState {
    usuario: Usuario | null;
    setUsuario: (usuario: Usuario | null) => void;
}

export const useUsuarioStore = create<UsuarioState>((set) => ({
    usuario: localStorage.getItem("usuario")
        ? JSON.parse(localStorage.getItem("usuario") || "") : {
            rfc: "",
            tipo: "",
            nombre: "",
            apellidos: "",
            correo: "",
            telefono: "",
        },

    // Función para establecer el usuario
    setUsuario: (usuario) => {
        localStorage.setItem("usuario", JSON.stringify(usuario));
        set({ usuario })
    }
}));