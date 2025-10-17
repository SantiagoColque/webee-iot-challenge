# 🧠 IoT Dashboard Challenge

## 🎯 Objetivo general

Desarrollar una aplicación **fullstack** (API + Frontend) utilizando **LoopBack**, **MongoDB** y **Angular**, que permita **gestionar dispositivos IoT, simular el envío de datos de sensores y visualizar esta información en una tabla**.

El desafío tiene una duración estimada de **2 semanas** a **3 semanas** y busca poner en práctica conocimientos de **backend, frontend y base de datos**, además de buenas prácticas de desarrollo.

---

## 🧩 Descripción funcional

La aplicación debe incluir dos módulos principales:

### 1. Gestión de Dispositivos (CRUD completo)

Implementar un módulo que permita crear, editar, listar y eliminar dispositivos IoT.

Cada **Device** debe tener al menos los siguientes campos:

| Campo       | Tipo     | Descripción                            |
|--------------|----------|----------------------------------------|
| `name`       | string   | Nombre del dispositivo                 |
| `type`       | string   | Tipo de dispositivo (ej: temperature-sensor, humidity-sensor) |
| `location`   | string   | Ubicación del dispositivo              |
| `status`     | enum     | `"active"` o `"inactive"`              |
| `createdAt`  | date     | Fecha de creación                      |

Además, cada dispositivo puede tener **ports asociados**.

Cada **Port** debe tener:

| Campo        | Tipo     | Descripción                            |
|---------------|----------|----------------------------------------|
| `name`        | string   | Nombre del port                        |
| `unit`        | string   | Unidad de medida (ej: °C, %, lux)      |
| `field`       | string   | Identificador lógico (ej: temperature, humidity) |
| `lastValue`   | number   | Último valor reportado                 |
| `deviceId`    | ObjectId | Relación con el dispositivo padre      |

**Relación:**  
- Un `Device` tiene varios `Ports` (1:N).  
- Los puertos se guardan en una colección separada.

---

### 2. Simulación y Tabla de datos

#### Backend (LoopBack + MongoDB)

Crear un endpoint `POST /devices/:id/report` que reciba datos de sensores, por ejemplo:

```json
{
  "temperature": 24.5
}
```

Este endpoint debe:

1. Guardar el valor en una colección `DeviceLog` con los campos:
   - `deviceId`
   - ...log
2. Actualizar el campo `lastValue` del sensor correspondiente.

---

#### Frontend (Angular)

Implementar un **modulo de datos** que permita:

- Ver la lista de dispositivos en una tabla (con búsqueda y filtro).
- Crear, editar y eliminar dispositivos (CRUD).
- Al seleccionar un dispositivo:
  - Mostrar los ports asociados.
  - Mostrar una **tabla de datos de lecturas recientes**.
- Incluir un botón **“Simular datos”** que realice llamadas a `/report` con valores aleatorios para los sensores de ese dispositivo.

---

## 🧱 Requisitos técnicos

### Backend
- **Framework:** LoopBack (versión 3)
- **Base de datos:** MongoDB
- **Endpoints mínimos:**
  - `/devices` → CRUD
  - `/ports` → CRUD
  - `/devices/:id/report` → Registro de lecturas

### Frontend
- **Framework:** Angular (versión 8 o superior)
- **Librerías recomendadas:** Angular Material
- **Páginas:**
  - Lista de dispositivos
  - Detalle de dispositivo (ports + tabla de datos)
  - Simulación de datos

---

## 🚀 Extras opcionales

Si el tiempo lo permite, se pueden agregar funcionalidades adicionales:

- **Autenticación simple** (login con usuario y contraseña).
- Mostrar el **estado del dispositivo** (ej: “offline” si no reporta hace más de 1 minuto).
- Sistema de **alertas o notificaciones** si algún valor supera un umbral definido.
- Filtros y paginación en las tablas.
- Además de la tabla de datos, mostrar un gráfico utilizando Echarts.

---

## 🕒 Plan sugerido (2 semanas)

| Semana | Objetivos principales |
|--------|------------------------|
| **Semana 1** | Setup del entorno, modelos en LoopBack, conexión a MongoDB, CRUD de Devices y Sensors. |
| **Semana 2** | Frontend en Angular, simulación de datos, tabla de datos de lectura y mejoras visuales. |

---

## 🧪 Entrega

El participante deberá entregar un repositorio GitHub que contenga:

1. Carpeta `/backend` → Proyecto LoopBack configurado con MongoDB.
2. Carpeta `/frontend` → Proyecto Angular funcional.
3. Archivo `README.md` con instrucciones para levantar ambos proyectos:
   - Cómo iniciar el backend (`npm start`, variables de entorno, conexión a MongoDB, etc.)
   - Cómo iniciar el frontend (`ng serve` o `npm run start`)
4. Datos de prueba (pueden incluir un script de seed o export de MongoDB).

---

## 🧭 Criterios de evaluación

| Criterio | Descripción |
|----------|--------------|
| **Funcionalidad** | Cumple con los requerimientos básicos y CRUD. |
| **Estructura del código** | Código ordenado, modular y con buenas prácticas. |
| **Uso correcto del stack** | Aplicación funcional con Angular, LoopBack y MongoDB. |
| **UI/UX** | Interfaz clara, uso correcto de Angular Material y componentes. |
| **Creatividad y extras** | Implementación de simulación, gráficos o mejoras opcionales. |

---

## 💡 Tips

- Se puede usar `setInterval` en Angular para refrescar los datos de la tabla cada X segundos.  
- La simulación puede realizarse desde el frontend llamando al endpoint `/report` con valores aleatorios.  

---

## 📦 Ejemplo de flujo de simulación

1. El usuario crea un dispositivo `Weather Station`.
2. Le agrega 2 puertos: `temperature (°C)` y `humidity (%)`.
3. Desde el dashboard, hace clic en “Simular datos”.
4. El frontend envía cada 5 segundos requests a:
   ```http
   POST /devices/:id/report
   ```
   con valores aleatorios de temperatura y humedad.
5. La tabla se actualiza con los valores recibidos.

---

> 🧭 **Objetivo final:** que el participante entienda cómo conectar un backend en Node.js con un frontend en Angular, manejar datos en MongoDB y simular el comportamiento de un sistema IoT real.



