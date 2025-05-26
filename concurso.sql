CREATE TABLE IF NOT EXISTS concurso (
    clv VARCHAR(20) PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    dsc TEXT COMMENT 'descripcion',
    fcre TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del concurso',
    ffin DATE NOT NULL COMMENT 'Fecha final del concurso',
    fins DATE NOT NULL COMMENT 'Fecha máxima de inscripción',
    lugar TEXT NOT NULL,
    rq TEXT COMMENT 'Requisitos para participar',
    maxpar INT UNSIGNED NOT NULL COMMENT 'Máximo de participantes por concurso'
);

CREATE TABLE IF NOT EXISTS criterio (
    clv SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL COMMENT 'nombre',
    valor DECIMAL(10, 2) NOT NULL,
    clvcon VARCHAR(20) NOT NULL COMMENT 'clave concurso',
    FOREIGN KEY (clvcon) REFERENCES concurso (clv)
);

CREATE TABLE IF NOT EXISTS usuario (
    rfc VARCHAR(13) PRIMARY KEY,
    contra VARCHAR(255) NOT NULL COMMENT 'hash de contraseña',
    tipo ENUM(
        'admin',
        'jurado',
        'participante'
    ) NOT NULL
);

CREATE TABLE IF NOT EXISTS persona (
    rfc VARCHAR(13) PRIMARY KEY,
    nom VARCHAR(50) NOT NULL COMMENT 'nombre',
    apds VARCHAR(50) NOT NULL COMMENT 'apellidos',
    fnac DATE NOT NULL COMMENT 'fecha de nacimiento',
    sex ENUM('M', 'F', 'O') NOT NULL COMMENT 'sexo',
    correo VARCHAR(50) NOT NULL,
    tel VARCHAR(15) NOT NULL COMMENT 'telefono',
    FOREIGN KEY (rfc) REFERENCES usuario (rfc)
);

CREATE TABLE IF NOT EXISTS rol_concurso (
    rfc VARCHAR(13),
    clvcon VARCHAR(20) COMMENT 'clave concurso',
    tipo ENUM('participante', 'jurado') NOT NULL,
    PRIMARY KEY (rfc, clvcon),
    FOREIGN KEY (clvcon) REFERENCES concurso (clv),
    FOREIGN KEY (rfc) REFERENCES persona (rfc)
);

CREATE TABLE IF NOT EXISTS calificacion (
    rfcjur VARCHAR(13) COMMENT 'rfc jurado',
    rfcpar VARCHAR(13) COMMENT 'rfc participante',
    clvcrit BIGINT UNSIGNED NOT NULL COMMENT 'clave criterio',
    clvcon VARCHAR(20) NOT NULL COMMENT 'clave concurso',
    calif DECIMAL(10, 2) NOT NULL COMMENT 'calificacion',
    com TEXT COMMENT 'comentario',
    FOREIGN KEY (clvcrit) REFERENCES criterio (clv),
    FOREIGN KEY (rfcjur, clvcon) REFERENCES rol_concurso (rfc, clvcon),
    FOREIGN KEY (rfcpar, clvcon) REFERENCES rol_concurso (rfc, clvcon),
    PRIMARY KEY (rfcjur, rfcpar, clvcrit)
);

CREATE TABLE IF NOT EXISTS log_sis (
    clv SERIAL PRIMARY KEY,
    usr VARCHAR(13) NOT NULL COMMENT 'usuario',
    acc VARCHAR(50) NOT NULL COMMENT 'accion',
    ta VARCHAR(30) COMMENT 'tabla afectada',
    fch TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'fecha',
    FOREIGN KEY (usr) REFERENCES usuario (rfc)
);