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
  
  // FORZAR la carga del archivo device.js SIEMPRE
  const deviceModel = app.models.Device;
  if (deviceModel) {
    console.log('Forzando carga de device.js...');
    try {
      require('../common/models/device.js')(deviceModel);
      console.log('device.js cargado exitosamente');
    } catch (error) {
      console.error('Error cargando device.js:', error);
    }
  }
  
  // Verificar que los métodos estén disponibles
  if (deviceModel && (!deviceModel.report || !deviceModel.getLogs)) {
    console.error('ERROR: Métodos personalizados no están disponibles');
    console.log('report disponible:', !!deviceModel.report);
    console.log('getLogs disponible:', !!deviceModel.getLogs);
  } else {
    console.log('✅ Métodos personalizados cargados correctamente');
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
    // NO limpiar datos automáticamente - cada test debe limpiar sus propios datos
    
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