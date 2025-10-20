# 🧠 IoT Dashboard Challenge

Una aplicación **fullstack** desarrollada con **LoopBack**, **MongoDB** y **Angular** para gestionar dispositivos IoT, simular el envío de datos de sensores y visualizar información en tiempo real.

## 🚀 Inicio Rápido

### Prerrequisitos
- Docker y Docker Compose
- Git

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd webee-iot-challenge

# Levantar todos los servicios
docker compose up -d

# Verificar que todo funciona
curl http://localhost:3000/api/Devices
```

### Servicios Disponibles

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Backend API** | http://localhost:3000/api | API REST de LoopBack |
| **API Explorer** | http://localhost:3000/explorer | Documentación interactiva |
| **Frontend** | http://localhost:4200 | Aplicación Angular |
| **MongoDB** | localhost:27017 | Base de datos |

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   Angular 8     │◄──►│   LoopBack 3    │◄──►│   MongoDB       │
│   Port 4200     │    │   Port 3000     │    │   Port 27017    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📊 Modelos de Datos

### Device (Dispositivo)
- `name`: Nombre del dispositivo
- `type`: Tipo de dispositivo
- `location`: Ubicación
- `status`: Estado (active/inactive)
- `createdAt`: Fecha de creación

### Port (Puerto/Sensor)
- `name`: Nombre del sensor
- `unit`: Unidad de medida
- `field`: Identificador lógico
- `lastValue`: Último valor reportado
- `deviceId`: Relación con dispositivo

### DeviceLog (Registro)
- `deviceId`: ID del dispositivo
- `portId`: ID del puerto
- `value`: Valor del sensor
- `timestamp`: Fecha y hora
- `data`: Datos adicionales

## 🔌 API Endpoints

### Dispositivos
```bash
GET    /api/Devices          # Listar dispositivos
POST   /api/Devices          # Crear dispositivo
GET    /api/Devices/:id      # Obtener dispositivo
PUT    /api/Devices/:id      # Actualizar dispositivo
DELETE /api/Devices/:id      # Eliminar dispositivo
POST   /api/Devices/:id/report # Simular datos
```

### Puertos
```bash
GET    /api/Ports            # Listar puertos
POST   /api/Ports            # Crear puerto
GET    /api/Ports/:id        # Obtener puerto
PUT    /api/Ports/:id        # Actualizar puerto
DELETE /api/Ports/:id        # Eliminar puerto
```

### Logs
```bash
GET    /api/DeviceLogs       # Listar logs
POST   /api/DeviceLogs       # Crear log
GET    /api/DeviceLogs/:id   # Obtener log
```

## 🧪 Testing

```bash
# Tests del backend
cd backend
npm test

# Tests del frontend
cd frontend
npm test
```

## 🚀 Desarrollo

### Estructura de Branches
- `main`: Producción
- `develop`: Desarrollo
- `feature/*`: Nuevas funcionalidades
- `hotfix/*`: Correcciones urgentes

### Commits
Seguimos [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Documentación
- `test:` Tests
- `refactor:` Refactoring

## 📝 Ejemplo de Uso

### 1. Crear un dispositivo
```bash
curl -X POST http://localhost:3000/api/Devices \
  -H "Content-Type: application/json" \
  -d '{"name": "Weather Station", "type": "temperature-sensor", "location": "Office"}'
```

### 2. Agregar un sensor
```bash
curl -X POST http://localhost:3000/api/Ports \
  -H "Content-Type: application/json" \
  -d '{"name": "Temperature", "unit": "°C", "field": "temperature", "deviceId": "1"}'
```

### 3. Simular datos
```bash
curl -X POST http://localhost:3000/api/Devices/1/report \
  -H "Content-Type: application/json" \
  -d '{"temperature": 25.3}'
```

## 🛠️ Tecnologías

- **Backend**: LoopBack 3, Node.js, MongoDB
- **Frontend**: Angular 8, Angular Material
- **DevOps**: Docker, Docker Compose
- **Testing**: Jest, Jasmine/Karma
- **CI/CD**: GitHub Actions

## 📄 Licencia

MIT License
