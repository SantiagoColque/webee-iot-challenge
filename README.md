# 🌐 Webee IoT Challenge

Sistema IoT completo para gestión de dispositivos y sensores con simulación en tiempo real.

## 🚀 Características

- **Backend LoopBack 3**: API REST completa con modelos de datos
- **Base de datos MongoDB**: Almacenamiento de dispositivos y logs
- **Simulación de sensores**: Endpoint `/report` para datos en tiempo real
- **Docker Compose**: Entorno de desarrollo completo
- **Tests automatizados**: Jest + Supertest para backend
- **CI/CD**: GitHub Actions para releases

## 📊 Modelos de Datos

### Device (Dispositivo)
- `name`: Nombre del dispositivo
- `type`: Tipo de sensor
- `location`: Ubicación física
- `status`: Estado (active/inactive)

### Port (Puerto/Sensor)
- `name`: Nombre del sensor
- `unit`: Unidad de medida
- `field`: Campo de datos
- `lastValue`: Último valor registrado

### DeviceLog (Log de Datos)
- `deviceId`: ID del dispositivo
- `portId`: ID del puerto
- `value`: Valor del sensor
- `timestamp`: Fecha y hora
- `data`: Datos adicionales

## 🛠️ Instalación y Uso

### Prerrequisitos
- Docker Desktop
- Git

### Desarrollo
```bash
# Clonar el repositorio
git clone <repository-url>
cd webee-iot-challenge

# Levantar el entorno de desarrollo
docker compose --profile dev up -d

# Verificar que funciona
curl http://localhost:3000/api/Devices
```

### Testing
```bash
# Ejecutar tests del backend
docker compose --profile test up backend-test

# Ver logs de tests
docker logs backend-test
```

## 🌐 Endpoints Principales

### Dispositivos
- `GET /api/Devices` - Listar dispositivos
- `POST /api/Devices` - Crear dispositivo
- `GET /api/Devices/{id}` - Obtener dispositivo
- `PUT /api/Devices/{id}` - Actualizar dispositivo
- `DELETE /api/Devices/{id}` - Eliminar dispositivo

### Sensores
- `GET /api/Ports` - Listar sensores
- `POST /api/Ports` - Crear sensor
- `GET /api/Devices/{id}/ports` - Sensores de un dispositivo

### Simulación
- `POST /api/Devices/{id}/report` - Reportar datos de sensores

### Logs
- `GET /api/DeviceLogs` - Listar todos los logs
- `GET /api/Devices/{id}/deviceLogs` - Logs de un dispositivo

## 🧪 Ejemplo de Uso

### 1. Crear un dispositivo
```bash
curl -X POST http://localhost:3000/api/Devices \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sensor Temperatura",
    "type": "temperature-sensor",
    "location": "Oficina Principal",
    "status": "active"
  }'
```

### 2. Crear un sensor
```bash
curl -X POST http://localhost:3000/api/Ports \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sensor Temperatura",
    "unit": "°C",
    "field": "temperature",
    "lastValue": 0,
    "deviceId": "ID_DEL_DEVICE"
  }'
```

### 3. Simular datos
```bash
curl -X POST http://localhost:3000/api/Devices/ID_DEL_DEVICE/report \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 25.5,
    "humidity": 60.2
  }'
```

## 🔧 Configuración

### Variables de Entorno
- `MONGODB_URL`: URL de conexión a MongoDB
- `PORT`: Puerto del backend (default: 3000)
- `HOST`: Host del backend (default: 0.0.0.0)

### Docker Compose Profiles
- `dev`: Entorno de desarrollo completo
- `test`: Solo testing del backend

## 📚 API Explorer

Accede a la documentación interactiva en:
```
http://localhost:3000/explorer
```

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   MongoDB       │
│   (Angular)     │◄──►│   (LoopBack)    │◄──►│   (Database)    │
│   Port: 4200    │    │   Port: 3000    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Roadmap

- [x] Backend con modelos y API
- [x] Simulación de sensores
- [x] Tests automatizados
- [x] Docker Compose
- [ ] Frontend Angular
- [ ] Interfaz de usuario
- [ ] Gráficos en tiempo real
- [ ] Alertas y notificaciones

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

Para preguntas o sugerencias, abre un issue en el repositorio.