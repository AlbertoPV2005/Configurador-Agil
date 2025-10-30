# Configurador-Agil

# 🎵 Aplicación Web Sergio - React + Vite

Esta es una aplicación web desarrollada con **React** y **Vite** que gestiona información sobre vinilos, clientes y empleados. El proyecto está organizado en componentes reutilizables y pantallas específicas, con datos simulados en formato JSON.

## 🚀 Tecnologías utilizadas

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/)
- CSS Modules

## 📁 Estructura del proyecto

- aplicacion-web-seguro-react-vite/
  - node_modules/ → Dependencias del proyecto
  - public/ → Archivos públicos (favicon, imágenes)
    - vite.svg
  - src/ → Código fuente
    - assets/ → Imágenes y recursos estáticos
      - react.svg
    - pages/ → Pantallas y componentes principales
      - data/ → Datos simulados en JSON
        - clientes.json
        - empleados.json
        - vinilos.json
    - components/ → Componentes reutilizables
    - AddViniloScreen.tsx
    - EditViniloScreen.tsx
    - InfoViniloScreen.tsx
    - PaginaVinilos.tsx
    - ViniloScreen.tsx
    - main.tsx → Punto de entrada de la aplicación
  - .gitignore → Archivos ignorados por Git
  - eslint.config.ts → Configuración de ESLint
  - index.html → HTML principal
  - package.json → Dependencias y scripts
  - tsconfig.json → Configuración de TypeScript
  - README.md → Documentación del proyecto
  - vite.config.ts → Configuración de Vit

## 📦 Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/aplicacion-web-sergio-react-vite.git
   cd aplicacion-web-sergio-react-vite

   ```

2. Instala las dependencias:

   npm install

3. Inicia el servidor de desarrollo:

   npm run dev

Funcionalidades principales- Visualización de vinilos con detalles individuales.

- Edición y creación de nuevos vinilos.
- Visualización de datos simulados de clientes y empleados.
- Navegación entre pantallas con componentes reutilizables.

Scripts disponibles- npm run dev: Inicia el servidor de desarrollo.

- npm run build: Compila la aplicación para producción.
- npm run lint: Ejecuta ESLint para análisis de código.

## Uso de la aplicación

- Landing page:
La landing page, PaginaVinilos, permite consultar los vinilos registrados y seleccionar el usuario, dependiendo del usuario elegido, se pueden añadir vinilos adicionales, en el caso de ser un usuario empleado, en el caso del usuario normal, solo puede consultar información de estos.

- EditVinilo:
La página de edición de vinilos, solo accesible si el usuario elegido es empleado, permite editar los campos del vinilo (titulo, artista, genero, descripcion, imagen, precio y unidades).
Una vez modificados, permite guardarlos y los actualiza.

- InfoVinilo:
Accesible para los usuarios base, permite consultar la información del vinilo seleccionado.

- AddVinylScreen:
También únicamente accesible para usuarios empleados, permite añadir nuevos vinilos a la página, además de poder agregar su imagen y campos mencionados en el punto anterior, una vez que el usuario selecciona la opción de guardar, aplica los cambios y agrega el vinilo nuevo.


# 📄 Documentación API (Backend)

## ⚙️ Funcionamiento de la API
Esta API conecta la **base de datos (SQL Server)** con el **Frontend (React + Vite)**.  
Su función principal es **transferir y gestionar datos** entre ambos entornos.

---

## 👤 Usuarios
Cada usuario cuenta con los siguientes atributos:

- **DNI** → `String`
- **Email** → `String`
- **Nombre** → `String`
- **Contraseña** → `String`

### 🔑 Tipos de usuario
Un usuario puede ser de dos tipos, con atributos adicionales:

#### 🔹 Cliente
- **DNI (FK)**
- **Membresía** → `String`

#### 🔹 Empleado
- **DNI (FK)** → `String`
- **Cargo** → `String`
- **Sueldo** → `String`

---

## 💿 Producto (Vinilos)
Los productos disponibles son **vinilos**, con los siguientes atributos:

- **ID** → `INT`
- **Nombre** → `String`
- **Unidades** → `String`
- **Artista** → `String`
- **Imagen** → `String`
- **Precio** → `String`
- **Género** → `String`
- **Descripción** → `String`

---

## 📂 Estructura de modelos
Para manejar estos datos, la API cuenta con una serie de **modelos** ubicados en:
Domain/Entities

Modelos disponibles:
- `Cliente.cs`
- `Empleado.cs`
- `Producto.cs`
- `Usuario.cs`

---

## 🚀 Uso de la API

### 🔗 Conexión a la Base de Datos
La conexión a **SQL Server** se configura en el archivo `appsettings.json` (línea 10):

```json
"DefaultConnection": "Server=ITMES5CG0465FTK;Database=master;Integrated Security=True;TrustServerCertificate=True;"
```
📌 Nota:
En la parte de Server se debe cambiar ITMES5CG0465FTK por el ID del servidor que se va a utilizar.

🌐 Acceso vía Swagger
Una vez la API esté conectada a la base de datos, se podrá usar a través de Swagger, el cual proporciona la URL para que el Frontend acceda a los datos.

🎛️ Control de acciones por la API
Las acciones son ejecutadas en:

API/Controllers

Cada controller contiene las operaciones que se pueden ejecutar sobre cada modelo.

## ✅ Resumen
• 	La API conecta SQL Server ↔ React + Vite.
• 	Gestiona Usuarios (Clientes y Empleados) y Productos (Vinilos).
• 	Los modelos están en .
• 	La conexión se configura en .
• 	El control de acciones se maneja en .
• 	Swagger facilita la interacción y pruebas de la API.

## Base de Datos

El sistema cuenta con una base de datos relacional compuesta por 4 tablas principales: **Usuario**, **Cliente**, **Empleado** y **Producto**. La tabla Usuario actúa como clase padre tanto para Cliente como para Empleado, mientras que Producto almacena el catálogo de vinilos disponibles.

A continuación se presenta el Modelo Entidad-Relación (MER) de la base de datos:

![](ASSETS/MER.png)

A partir de este esquema, se ha conectado la base de datos con el backend y se han creado distintas APIs REST según las necesidades de la aplicación.

Las definiciones de las tablas se encuentran en [SQL/tablas.sql](BBDD/SQL/tablas.sql)

## Obtención de Datos

La información almacenada en la base de datos se ha obtenido mediante web scraping de [una tienda online de vinilos](https://rockntipo.com/19-comprar-vinilos-musica-online). Posteriormente, se ha utilizado un script en Postman para limpiar los datos y convertirlos a formato JSON. Finalmente, se ha desarrollado otro script para automatizar la generación de consultas SQL de inserción de datos.

### Web Scraping con Postman

Utilizando [Postman](https://marcsastreinetum-2466560.postman.co/workspace/marcsastreinetum's-Workspace~a8c010e0-69b5-4020-820e-253e96161e69/request/48331114-5d5e9f0c-c773-45f7-85b4-56c349bcde50?action=share&creator=48331114&ctx=documentationhttps://), se han descargado todos los datos de la [web de vinilos](https://rockntipo.com/19-comprar-vinilos-musica-online) utilizando los parámetros de consulta `?p={pagina}&n={numero de discos por pagina}` para controlar la paginación y cantidad de registros. Para limpiar y estructurar los datos, se ha implementado un script post-response en Postman:

<details>
<summary>Ver código de post Web Scraping (click para expandir)</summary>

```js
const html = pm.response.text();
function decodeHtml(str) {
if (!str) return '';
return str.replace(/&&/g, '&')
.replace(/""/g, '"')
.replace(/''/g, "'")
.replace(/</g, '>');
}
const ulMatch = html.match(/ul[^]*id=["']product_list["'][^>]*>([\s\S]*?)<\/ul>/i);
let ulContent = ulMatch ? ulMatch[1] : '';
const liRegex = /li[^]*>([\s\S]*?)<\/li>/gi;
let match;
const discos = [];
while ((match = liRegex.exec(ulContent)) !== null) {
const li = match[1];
let nombre = '', unidades = '', artista = '', precio = '', descripcion = '', enlace = '', imagen = '';
// Nombre, unidades y artista
const nombreMatch = li.match(/a[^]*class=["']product-name["'][^>]*>([\s\S]*?)<\/a>/i);
if (nombreMatch) {
let raw = decodeHtml(nombreMatch[1]);
let parts = raw.split(/br\s*\|\n/).map(p => p.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
if (parts.length > 0) {
let nombreUnidades = parts[0].match(/^(.+?)(?:\s*\(([^)]*)\))?$/);
if (nombreUnidades) {
nombre = nombreUnidades[1] ? nombreUnidades[1].trim() : '';
unidades = nombreUnidades[2] ? nombreUnidades[2].trim() : '';
} else {
nombre = parts[0];
}
}
if (parts.length > 1) {
artista = parts[1];
}
}
// Enlace
const enlaceMatch = li.match(/a[^]*class=["']product-name["'][^>]*href=["']([^"']+)["']/i);
if (enlaceMatch) {
enlace = decodeHtml(enlaceMatch[1]);
}
// Imagen
const imgMatch = li.match(/img[^]*src=["']([^"']+)["']/i);
if (imgMatch) {
imagen = decodeHtml(imgMatch[1]);
}
// Precio
const precioMatch = li.match(/span[^]*class=["']price product-price["'][^>]*>([\s\S]*?)<\/span>/i);
if (precioMatch) {
precio = decodeHtml(precioMatch[1].replace(/<[^>]+>/g, '').trim());
}
// Descripcion dentro de .pro_second_box > .product-desc
let descMatch = li.match(/div[^]*class=["'][^"']*pro_second_box[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
if (descMatch) {
let proSecondBox = descMatch[1];
//descripcion = proSecondBox;    let descInnerMatch = proSecondBox.match(/meta[^]+itemprop="description"[^>]+content="([^"]+)"[^>]*>/);
    descripcion = descInnerMatch ? decodeHtml(descInnerMatch[1].replace(/<[^>]+>/g, '').trim()) : '';
    //descripcion = descInnerMatch;
}
discos.push({ nombre, unidades, artista, enlace, imagen, precio, descripcion });
    let descInnerMatch = proSecondBox.match(/meta[^]+itemprop="description"[^>]+content="([^"]+)"[^>]*>/);
    descripcion = descInnerMatch ? decodeHtml(descInnerMatch[1].replace(/<[^>]+>/g, '').trim()) : '';
    //descripcion = descInnerMatch;
}
discos.push({ nombre, unidades, artista, enlace, imagen, precio, descripcion });
}
// Visualización JSON pura
const template = '';
function createPayload() {
return { json: JSON.stringify(discos, null, 2) };
}
pm.visualizer.set(template, createPayload());
// Tests para verificar extracción de precio y descripción
pm.test('Todos los discos tienen campo descripcion extraído', function () {
discos.forEach(disco => {
pm.expect(disco).to.have.property('descripcion');
});
});
pm.test('Todos los discos tienen campo precio extraído', function () {
discos.forEach(disco => {
pm.expect(disco).to.have.property('precio');
});
});
```

</details>

Se realizó web scraping en distintas secciones de la tienda de vinilos para obtener diferentes géneros musicales, generando los siguientes archivos JSON: [hip-hop](BBDD/Archivos_JSON/hiphop.json), [jazz-blues-soul-reggae](BBDD/Archivos_JSON/jazz-blues-soul-reggae.json), [metal](BBDD/Archivos_JSON/metal.json), [rock internacional](BBDD/Archivos_JSON/pop-rock-internacional.json) y [rock nacional](BBDD/Archivos_JSON/pop-rock-nacional.json).

Posteriormente, se desarrolló un [script para unificar todos los géneros](BBDD/scripts/json_unificate.js), obteniendo como resultado [un archivo JSON unificado](BBDD/Archivos_JSON/unificate.json).

### Migración de Datos a MS SQL Server

Para generar las sentencias de inserción SQL, se ha creado [otro script especializado](BBDD/scripts/json_to_mssql_products.js). Este script procesa los datos de los 5 archivos JSON de géneros y permite seleccionar cuántos registros extraer de cada uno, especificando el rango de inicio y fin. Esta funcionalidad permite controlar el número de datos a importar y evitar duplicados al añadir nuevos registros. Las sentencias SQL generadas se almacenan en [un archivo SQL de inserciones](BBDD/SQL/Productos_inserts.sql).

## Instalación de la Base de Datos MS SQL Server e Inserción de Datos

Para utilizar el backend es necesario disponer de una instancia de MS SQL Server donde crear las tablas y almacenar los datos. Esta instancia puede ser local o estar alojada en un servidor externo.

En este proyecto se ha utilizado una base de datos local con [SQL Server 2022 Developer](https://www.microsoft.com/es-es/sql-server/sql-server-downloads). Para la gestión de la base de datos, se ha instalado [SQL Server Management Studio (SSMS)](https://learn.microsoft.com/es-es/ssms/install/install), que se puede instalar desde el instalador de Visual Studio. Aunque es posible gestionar la base de datos directamente desde Visual Studio, se recomienda utilizar SSMS para operaciones de importación de datos.

### Importación de la Estructura de Tablas

Una vez configurado el acceso a la base de datos, es necesario importar la estructura de tablas. Se proporciona [una exportación completa en formato SQL](BBDD/SQL/Bases%20de%20datos%20exportadas/script.sql). Esta exportación debe ejecutarse en la base de datos de destino. En el proyecto se ha utilizado una instancia local (ITMES5CG0274JB7), pero puede utilizarse cualquier servidor disponible.

![](ASSETS/20251029_121328_image.png)

Seleccione la base de datos correspondiente y ejecute el [script de importación](BBDD/SQL/Bases%20de%20datos%20exportadas/script.sql). Una vez completado este proceso, la estructura de la base de datos estará creada correctamente, si no puedes crear las tablas con [este codigo sql](BBDD/SQL/tablas.sql).

![](ASSETS/20251029_130320_image.png)

### Importación de Datos de Productos

Se pueden importar los datos de productos utilizando el [script generador de inserciones](BBDD/scripts/json_to_mssql_products.js) y el [archivo SQL de productos generado](BBDD/SQL/Productos_inserts.sql).

### Creación de Usuarios de Prueba

Es posible crear usuarios de prueba mediante inserciones SQL directas o a través del Swagger del backend. A continuación se muestra el script SQL para crear un usuario empleado y un usuario cliente:

<details>
<summary>Inserciones SQL de usuarios (click para expandir)</summary>

```sql
-- Insertar usuarios base
INSERT INTO [dbo].[Usuarios] ([DNI], [Email], [Nombre], [Contrasena])
VALUES 
    ('12345678A', 'juan.perez@empresa.com', 'Juan Pérez', 'password123'),
    ('87654321B', 'maria.garcia@cliente.com', 'María García', 'password456');

-- Insertar empleado (referencia al primer usuario)
INSERT INTO [dbo].[empleado] ([dni], [cargo], [sueldo])
VALUES 
    ('12345678A', 'Gerente de Ventas', 2500.00);

-- Insertar cliente (referencia al segundo usuario)
INSERT INTO [dbo].[clientes] ([membresia], [dni])
VALUES 
    ('Premium', '87654321B');
```

</details>

Una vez completados estos pasos, la base de datos estará configurada con la estructura de tablas, datos de productos y usuarios de prueba listos para su uso.
