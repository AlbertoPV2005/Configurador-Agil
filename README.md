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

