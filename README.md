# 🏔️ Sistema de Reservas para Cabañas en Ushuaia

Este proyecto es una aplicación web desarrollada con **Next.js** que permite gestionar reservas para un complejo turístico en Ushuaia. El sistema ofrece una interfaz amigable para los usuarios y un manejo robusto de datos mediante persistencia en archivos JSON.

## 📋 Descripción del Proyecto

El objetivo es ofrecer una experiencia fluida para los usuarios que buscan reservar alojamiento. La aplicación permite visualizar un catálogo de cabañas, gestionar reservas y validar disponibilidad, todo ello sin requerir un sistema de autenticación tradicional.

### Indicaciones Generales
Siguiendo las pautas del desarrollo, **no se implementa un sistema completo de registro/login**. La identificación de usuarios se maneja mediante:
- **IDs Temporales:** Generados en el cliente (UUID) y almacenados en `localStorage` o `sessionStorage`.
- **Persistencia:** Simulación de base de datos mediante archivos JSON (`cabanas.json` y `reservas.json`).

---

## 🚀 Funcionalidades Principales

### 1. Catálogo de Cabañas
- Visualización de cabañas disponibles con detalles (capacidad, servicios, precio).
- Galería de imágenes.
- Datos precargados desde un archivo JSON local.

### 2. Gestión de Reservas
- **Formulario de Reserva:** Recolección de datos del huésped (nombre, email, teléfono, fechas).
- **Validación Lógica:** Verificación automática para evitar superposición de fechas en una misma cabaña.
- **Persistencia:** Las reservas exitosas se escriben en el archivo `reservas.json`.

### 3. Panel de Administración
- Visualización simple de las reservas existentes en el sistema.

### 4. Notificaciones (Simulación)
- Código preparado para el envío de emails de confirmación utilizando la API de **Twilio SendGrid**.
- *Nota: No requiere cuenta real activa, la implementación sigue la documentación oficial para dejar la funcionalidad lista.*

---

## 🛠️ Requisitos y Stack Técnico

El proyecto prioriza el código seguro, mantenible y las buenas prácticas.

- **Framework:** Next.js
- **Lenguaje:** JavaScript / React
- **Estilos:** Tailwind
- **Base de Datos (Simulada):** Archivos JSON (`/data`)
- **Identificación:** `uuid` para IDs temporales de sesión.

---

## 📂 Estructura del Proyecto

### Componentes Clave
| Componente | Descripción |
| :--- | :--- |
| `CabanaGallery` | Renderiza la galería de imágenes de una cabaña. |
| `CabanaDetailPage` | Muestra el detalle completo y permite iniciar la reserva. |
| `ReservationForm` | Maneja el input del usuario y envía la solicitud al backend. |

### Rutas de API (Backend)
El proyecto utiliza API Routes de Next.js para la lógica del servidor:

- **`GET /api/cabanas/[id]`**
  - Obtiene los detalles de una cabaña específica por su ID.
- **`POST /api/reservar`**
  - Recibe los datos del formulario.
  - Verifica conflictos de fechas (superposición).
  - Guarda la reserva en `reservas.json` si es válida.
  - Dispara el proceso de envío de email.

---

## ⚙️ Instalación y Ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>

---
## 🚀 Desarrolladores
- Pablo Navarro
- Tomás Civiero
- Thiago Parise
- Paula Bonifazi
