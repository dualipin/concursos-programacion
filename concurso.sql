CREATE TABLE IF NOT EXISTS concurso (
    clv VARCHAR(20) PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    dsc TEXT,
    fini TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del concurso',
    ffin DATE NOT NULL COMMENT 'Fecha final del concurso',
    fmin DATE NOT NULL COMMENT 'Fecha máxima de inscripción',
    lugar TEXT NOT NULL,
    rq TEXT COMMENT 'Requisitos para participar',
    maxpar INT UNSIGNED NOT NULL COMMENT 'Máximo de participantes por concurso',
);

CREATE TABLE IF NOT EXISTS criterio (
    clv SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    clvcon VARCHAR(20) NOT NULL,
    FOREIGN KEY (clvcon) REFERENCES concurso (clv)
);

CREATE TABLE IF NOT EXISTS usuario (
    rfc VARCHAR(13) PRIMARY KEY,
    contra VARCHAR(255) NOT NULL COMMENT 'Debe contener hash de contraseña',
    tipo ENUM(
        'admin',
        'jurado',
        'participante'
    ) NOT NULL
);

CREATE TABLE IF NOT EXISTS persona (
    rfc VARCHAR(13) PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    apdos VARCHAR(50) NOT NULL,
    fnac DATE NOT NULL,
    sex ENUM('M', 'F', 'O') NOT NULL,
    correo VARCHAR(50) NOT NULL,
    tel VARCHAR(15) NOT NULL,
    FOREIGN KEY (rfc) REFERENCES usuario (rfc)
);

CREATE TABLE IF NOT EXISTS rol_concurso (
    rfc VARCHAR(13),
    clvcon VARCHAR(20),
    tipo ENUM('participante', 'jurado') NOT NULL,
    PRIMARY KEY (rfc, clvcon),
    FOREIGN KEY (clvcon) REFERENCES concurso (clv),
    FOREIGN KEY (rfc) REFERENCES persona (rfc)
);

CREATE TABLE IF NOT EXISTS calificacion (
    rfcjur VARCHAR(13),
    rfcpar VARCHAR(13),
    clvcrit BIGINT UNSIGNED NOT NULL,
    clvcon VARCHAR(20) NOT NULL,
    calif DECIMAL(10, 2) NOT NULL,
    com TEXT,
    FOREIGN KEY (clvcrit) REFERENCES criterio (clv),
    FOREIGN KEY (rfcjur, clvcon) REFERENCES rol_concurso (rfc, clvcon),
    FOREIGN KEY (rfcpar, clvcon) REFERENCES rol_concurso (rfc, clvcon),
    PRIMARY KEY (rfcjur, rfcpar, clvcrit)
);

CREATE TABLE IF NOT EXISTS log_sis (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(13) NOT NULL,
    accion VARCHAR(50) NOT NULL,
    tabla_afectada VARCHAR(30),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    detalles TEXT,
    FOREIGN KEY (usuario) REFERENCES usuario (rfc)
);