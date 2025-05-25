import { useUsuarioStore } from "@/estados/usuario-est";
import { useNavigate } from "react-router";

export default function MenuParticipante() {
    const navigate = useNavigate();
    const setUser = useUsuarioStore((state) => state.setUsuario);
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Concurso - Participante</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Features</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Pricing</a>
                        </li>
                        <li className="nav-item">
                            <a className="btn-danger btn" onClick={() => {
                                setUser(null);
                                navigate("/");
                            }}>Cerrar Sesion</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}