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
