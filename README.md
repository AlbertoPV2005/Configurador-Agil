# 📄 Documentación API (Backend)

## ⚙️ Funcionamiento de la API
Esta API conecta la **base de datos (SQL Server)** con el **Frontend (React + Vite)**.  
Su función principal es transferir y gestionar los siguientes datos:

---

## 👤 Usuarios
Cada usuario cuenta con los siguientes atributos:

- **DNI** → `String`
- **Email** → `String`
- **Nombre** → `String`
- **Contraseña** → `String`

### Tipos de usuario
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
Los productos disponibles son vinilos, con los siguientes atributos:

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
