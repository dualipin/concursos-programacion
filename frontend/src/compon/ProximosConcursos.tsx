export default function ProximosConcursos(props: any) {
    const { titulo, fdesde, fins, fcon, lugar } = props;

    return (
        <div className="col">
            <div className="card h-100 shadow-sm border-1">
                <div className="card-header bg-primary text-white text-center">
                    <h5 className="card-title fw-bold mb-0">{titulo}</h5>
                </div>
                <div className="card-body text-center">
                    <p className="card-text mb-2">
                        <strong>Acepta inscripción:</strong> <br />
                        <span className="text-muted">{fdesde} - {fins}</span>
                    </p>
                    <p className="card-text mb-2">
                        <strong>Fecha Máxima de Inscripción:</strong> <br />
                        <span className="text-danger">{fcon}</span>
                    </p>
                    <p className="card-text">
                        <strong>Lugar:</strong> <br />
                        <span className="text-muted">{lugar}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}