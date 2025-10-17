-- Eliminar base de datos si existe
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'configurador_agil')
BEGIN
    DROP DATABASE configurador_agil;
END
GO

-- Crear base de datos
CREATE DATABASE configurador_agil;
GO

-- Usar la base de datos
USE configurador_agil;
GO

-- Tabla persona
CREATE TABLE persona (
    dni VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL
);
GO

-- Tabla usuarios
CREATE TABLE usuarios (
    id_usuario INT IDENTITY(1,1) PRIMARY KEY,
    membresia VARCHAR(50) NOT NULL,
    dni VARCHAR(20),
    FOREIGN KEY (dni) REFERENCES persona(dni)
);
GO

-- Tabla empleado
CREATE TABLE empleado (
    id_empleado INT IDENTITY(1,1) PRIMARY KEY,
    dni VARCHAR(20),
    cargo VARCHAR(255) NOT NULL,
    sueldo DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (dni) REFERENCES persona(dni)
);
GO

-- Tabla producto
CREATE TABLE producto (
    id_producto INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    artista VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    genero_musical VARCHAR(100) NOT NULL,
    unidades INT NOT NULL
);
GO

-- Relación N:N producto-usuario
CREATE TABLE producto_usuario (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_producto INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha_compra DATE,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);
GO

-- Relación N:N producto-empleado
CREATE TABLE producto_empleado (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_producto INT NOT NULL,
    id_empleado INT NOT NULL,
    fecha_gestion DATE,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado)
);
GO