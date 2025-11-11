# 📘 Documentación de la API – WORKFLOW CONTROL

## 🧩 Descripción general
El backend de **WORKFLOW CONTROL** gestiona empleados, autenticación y control de roles (SuperAdmin, Admin, Empleado).  
Construido con **Node.js + Express + MongoDB**, con pruebas automatizadas (Jest) y documentación **Swagger UI**.

---

## 🔐 Roles y autenticación

Roles disponibles:
- **SuperAdmin** – Control total sobre usuarios y empleados.
- **Admin** – Gestión de empleados de su área.
- **Empleado** – Acceso limitado a su propio perfil.

### Autenticación
- **Login:** `/login`  
  Envía correo y contraseña, y el sistema retorna un **token JWT**.  
  Este token se debe incluir en los headers de las peticiones protegidas:  
