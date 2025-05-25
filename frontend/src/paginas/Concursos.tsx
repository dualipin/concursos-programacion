export default function Concursos() {
    return (
        <div className="container my-4">
            <h1 className="mb-4 text-center">Concursos</h1>
            <div className="row g-3">
                <div className="col-12 col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Concurso 1</h5>
                            <p className="card-text">Descripción del concurso 1.</p>
                            <a href="#" className="btn btn-primary">Inscribirse</a>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Concurso 2</h5>
                            <p className="card-text">Descripción del concurso 2.</p>
                            <a href="#" className="btn btn-primary">Inscribirse</a>
                        </div>
                    </div>
                </div>
                {/* Agrega más concursos según sea necesario */}
            </div>
        </div>
    );
}