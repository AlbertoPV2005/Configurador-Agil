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


CREATE TABLE usuarios (
    Dni VARCHAR(50) PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Email VARCHAR(50) NOT NULL UNIQUE,
    Contrasena VARCHAR(50) NOT NULL
);
GO

-- Tabla usuarios
CREATE TABLE clientes (
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
/*
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
*/




--- Resuldato final

CREATE TABLE [dbo].[Usuarios] ( 
    [DNI]        VARCHAR (50) NOT NULL, 
    [Email]      VARCHAR (50) NOT NULL, 
    [Nombre]     VARCHAR (50) NOT NULL, 
    [Contrasena] VARCHAR (50) NOT NULL, 
    PRIMARY KEY CLUSTERED ([DNI] ASC), UNIQUE NONCLUSTERED ([Email] ASC) 
); 

CREATE TABLE [dbo].[clientes] ( 
    [id_cliente] INT          IDENTITY (1, 1) NOT NULL, 
    [membresia]  VARCHAR (50) NOT NULL, 
    [dni]        VARCHAR (50) NOT NULL, 
    PRIMARY KEY CLUSTERED ([id_cliente] ASC), 
    CONSTRAINT [FK_cliente_Usuarios_DNI] FOREIGN KEY ([dni]) REFERENCES [dbo].[Usuarios] ([DNI]) 
); 

CREATE TABLE [dbo].[empleado] ( 
    [id_empleado] INT             IDENTITY (1, 1) NOT NULL, 
    [dni]         VARCHAR (50)    NOT NULL, 
    [cargo]       VARCHAR (255)   NOT NULL, 
    [sueldo]      DECIMAL (10, 2) NOT NULL, 
    PRIMARY KEY CLUSTERED ([id_empleado] ASC), 
    CONSTRAINT [FK_empleado_Usuarios_DNI] FOREIGN KEY ([dni]) REFERENCES [dbo].[Usuarios] ([DNI]) 
); 
CREATE TABLE [dbo].[Productos] ( 
    [ID]           INT IDENTITY (1, 1) NOT NULL, 
    [Nombre]      VARCHAR (50)  NOT NULL, 
    [Unidades]    VARCHAR (50)  NOT NULL, 
    [Artista]     VARCHAR (50)  NOT NULL, 
    [Imagen]      VARCHAR (50)  NOT NULL, 
    [Precio]      VARCHAR (50)  NOT NULL, 
    [Genero]      VARCHAR (50)  NOT NULL, 
    [Descripcion] VARCHAR (MAX) NULL, 
    PRIMARY KEY CLUSTERED ([ID] ASC) 
); 