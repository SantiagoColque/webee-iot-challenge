module.exports = function(Device) {
  
  // Implementación interna async
  async function reportImpl(deviceId, data) {
    const device = await Device.findById(deviceId);
    if (!device) {
      throw new Error('Device not found');
    }

    const DeviceLog = Device.app.models.DeviceLog;
    const Port = Device.app.models.Port;

    const ports = await Port.find({ where: { deviceId: deviceId } });

    // Actualizar lastValue de cada port que tenga un campo en este reporte
    await Promise.all(
      Object.keys(data).map(async (fieldName) => {
        const port = ports.find(p => p.name === fieldName);
        if (!port) return;
        const value = data[fieldName];
        await Port.updateAll({ id: port.id }, { lastValue: value });
      })
    );

    // Construir listado de fields y mantener TODOS los datos reportados
    const fields = Object.keys(data).map(fieldName => {
      const port = ports.find(p => p.name === fieldName);
      const base = { field: fieldName, value: data[fieldName] };
      if (!port) return { ...base, error: 'Port not found' };
      return base;
    });

    // Crear un único log con TODOS los campos reportados (incluidos los que no matchean Port)
    const log = await DeviceLog.create({
      deviceId: deviceId,
      data: data,
      timestamp: new Date()
    });

    return {
      deviceId: deviceId,
      timestamp: log.timestamp,
      logId: log.id,
      fields: fields
    };
  }

  // Exponer solo promesas (sin callbacks)
  Device.report = async function(deviceId, data) {
    return reportImpl(deviceId, data);
  };
  
  Device.remoteMethod('report', { // expone report como un endpoint remoto, para que el cliente pueda llamarlo
    accepts: [
      { arg: 'deviceId', type: 'string', required: true, http: { source: 'path' } },
      { arg: 'data', type: 'object', required: true, http: { source: 'body' } }
    ],
    returns: { arg: 'result', type: 'object' },
    http: { path: '/:deviceId/report', verb: 'post' },
    description: 'Report sensor data for a device'
  });

  // Implementación interna async
  async function getLogsImpl(deviceId, limit) {
    const device = await Device.findById(deviceId);
    if (!device) {
      const err = new Error('Device not found');
      err.statusCode = 404;
      throw err;
    }

    const DeviceLog = Device.app.models.DeviceLog;
    const Port = Device.app.models.Port;

    const logs = await DeviceLog.find({
      where: { deviceId: deviceId },
      order: 'timestamp DESC',
      limit: limit || 50
    });

    // Cargar los ports del dispositivo una sola vez
    const ports = await Port.find({ where: { deviceId: deviceId } });

    const formattedLogs = logs.map(log => {
      const fields = Object.keys(log.data || {}).map(fieldName => {
        const port = ports.find(p => p.name === fieldName);
        return {
          field: fieldName,
          value: log.data[fieldName],
          portName: port ? port.name : 'Unknown',
          portField: port ? port.field : fieldName,
          portUnit: port ? port.unit : ''
        };
      });
      return {
        id: log.id,
        deviceId: log.deviceId,
        timestamp: log.timestamp,
        data: log.data,
        fields: fields
      };
    });

    return {
      deviceId: deviceId,
      deviceName: device.name,
      logs: formattedLogs,
      total: formattedLogs.length
    };
  }

  // Exponer solo promesas (sin callbacks)
  Device.getLogs = async function(deviceId, limit) {
    return getLogsImpl(deviceId, limit);
  };
  
  Device.remoteMethod('getLogs', {
    accepts: [
      { arg: 'deviceId', type: 'string', required: true, http: { source: 'path' } },
      { arg: 'limit', type: 'number', http: { source: 'query' } }
    ],
    returns: { arg: 'result', type: 'object' },
    http: { path: '/:deviceId/logs', verb: 'get' },
    description: 'Get device logs with port information'
  });
};