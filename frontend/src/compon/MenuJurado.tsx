import { useUsuarioStore } from "@/estados/usuario-est"

export default function MenuJurado() {
    const usuario = useUsuarioStore(state => state.setUsuario);

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Concurso - Jurado</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/">Inicio</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/jurado/concurso">Concursos</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/registro">Participante</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-danger" onClick={
                                () => {
                                    usuario(null);
                                }
                            }>Cerrar Sesion</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}