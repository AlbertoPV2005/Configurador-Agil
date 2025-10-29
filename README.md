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
