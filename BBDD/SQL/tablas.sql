CREATE TABLE [dbo].[Usuarios] (
    [DNI]        VARCHAR (50) NOT NULL,
    [Email]      VARCHAR (50) NOT NULL,
    [Nombre]     VARCHAR (50) NOT NULL,
    [Contrasena] VARCHAR (50) NOT NULL,
    PRIMARY KEY CLUSTERED ([DNI] ASC),
    UNIQUE NONCLUSTERED ([Email] ASC)
);
CREATE TABLE [dbo].[empleado] (
    [id_empleado] INT             IDENTITY (1, 1) NOT NULL,
    [dni]         VARCHAR (50)    NOT NULL,
    [cargo]       VARCHAR (255)   NOT NULL,
    [sueldo]      DECIMAL (10, 2) NOT NULL,
    PRIMARY KEY CLUSTERED ([id_empleado] ASC),
    CONSTRAINT [FK_empleado_Usuarios_DNI] FOREIGN KEY ([dni]) REFERENCES [dbo].[Usuarios] ([DNI])
);
CREATE TABLE [dbo].[clientes] (
    [id_cliente] INT          IDENTITY (1, 1) NOT NULL,
    [membresia]  VARCHAR (50) NOT NULL,
    [dni]        VARCHAR (50) NOT NULL,
    PRIMARY KEY CLUSTERED ([id_cliente] ASC),
    CONSTRAINT [FK_cliente_Usuarios_DNI] FOREIGN KEY ([dni]) REFERENCES [dbo].[Usuarios] ([DNI])
);
CREATE TABLE [dbo].[Productos] (
    [ID]          INT           IDENTITY (1, 1) NOT NULL,
    [Nombre]      VARCHAR (50)  NOT NULL,
    [Unidades]    VARCHAR (50)  NOT NULL,
    [Artista]     VARCHAR (50)  NOT NULL,
    [Imagen]      VARCHAR (150) NOT NULL,
    [Precio]      VARCHAR (50)  NOT NULL,
    [Genero]      VARCHAR (50)  NOT NULL,
    [Descripcion] VARCHAR (MAX) NULL,
    PRIMARY KEY CLUSTERED ([ID] ASC)
);
