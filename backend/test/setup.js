const app = require('../server/server');

beforeAll(async () => {
  // Configurar MongoDB para tests
  process.env.NODE_ENV = 'test';
  
  // Cargar configuración de test
  const testConfig = require('../server/datasources.test.json');
  app.dataSources.db.settings = testConfig.db;
  
  // Conectar a la base de datos de test
  await app.dataSources.db.connect();
  
  // Limpiar base de datos de test
  await app.dataSources.db.autoupdate();
  
  // FORZAR la carga del archivo device.js
  const deviceModel = app.models.Device;
  if (deviceModel && !deviceModel.report) {
    console.log('Forzando carga de device.js...');
    require('../common/models/device.js')(deviceModel);
  }
  
  // Iniciar servidor en puerto dinámico para evitar conflictos
  if (!app.server) {
    const server = app.listen(0, '0.0.0.0', function() {
      const port = server.address().port;
      app.set('port', port);
      app.emit('started');
      console.log('Test server listening at:', port);
    });
    app.server = server;
    
    await new Promise(resolve => app.once('started', resolve));
  }
});

afterAll(async () => {
  if (app && app.dataSources) {
    // Limpiar datos de test
    const Device = app.models.Device;
    const Port = app.models.Port;
    const DeviceLog = app.models.DeviceLog;
    
    await Device.deleteAll();
    await Port.deleteAll();
    await DeviceLog.deleteAll();
    
    // Desconectar de la base de datos
    if (app.dataSources.db.connected) {
      await app.dataSources.db.disconnect();
    }
    
    // Cerrar el servidor
    if (app.server) {
      await new Promise((resolve) => {
        app.server.close(resolve);
      });
    }
  }
});

module.exports = { app };