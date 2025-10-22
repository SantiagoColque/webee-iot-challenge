module.exports = function(Device) {
  
  Device.report = function(deviceId, data, cb) {
    // Buscar el dispositivo
    Device.findById(deviceId, function(err, device) {
      if (err) return cb(err);
      if (!device) return cb(new Error('Device not found'));
      
      const DeviceLog = Device.app.models.DeviceLog;
      const Port = Device.app.models.Port;
      
      // Buscar ports del dispositivo
      Port.find({ where: { deviceId: deviceId } }, function(err, ports) {
        if (err) return cb(err);
        
        // Procesar cada campo de datos recibido
        const promises = Object.keys(data).map(fieldName => {
          return new Promise((resolve, reject) => {
            // Buscar el port que corresponde a este field
            const port = ports.find(p => p.field === fieldName);
            if (!port) {
              return resolve({ field: fieldName, error: 'Port not found' });
            }
            
            const value = data[fieldName];
            
            // Crear el log
            DeviceLog.create({
              deviceId: deviceId,
              portId: port.id,
              value: value,
              data: { [fieldName]: value }
            }, function(err, log) {
              if (err) return reject(err);
              
              // Actualizar el lastValue del port
              Port.updateAll(
                { id: port.id },
                { lastValue: value },
                function(err, info) {
                  if (err) return reject(err);
                  resolve({ field: fieldName, value: value, logId: log.id });
                }
              );
            });
          });
        });
        
        Promise.all(promises)
          .then(results => {
            cb(null, {
              deviceId: deviceId,
              timestamp: new Date(),
              results: results
            });
          })
          .catch(cb);
      });
    });
  };
  
  Device.remoteMethod('report', {
    accepts: [
      { arg: 'deviceId', type: 'string', required: true, http: { source: 'path' } },
      { arg: 'data', type: 'object', required: true, http: { source: 'body' } }
    ],
    returns: { arg: 'result', type: 'object' },
    http: { path: '/:deviceId/report', verb: 'post' },
    description: 'Report sensor data for a device'
  });

  Device.getLogs = function(deviceId, limit, cb) {
    // Buscar el dispositivo
    Device.findById(deviceId, function(err, device) {
      if (err) return cb(err);
      if (!device) return cb(new Error('Device not found'));
      
      const DeviceLog = Device.app.models.DeviceLog;
      const Port = Device.app.models.Port;
      
      // Buscar logs del dispositivo
      DeviceLog.find({
        where: { deviceId: deviceId },
        order: 'timestamp DESC',
        limit: limit || 50
      }, function(err, logs) {
        if (err) return cb(err);
        
        // Buscar información de los ports por separado
        const portIds = [...new Set(logs.map(log => log.portId))];
        Port.find({ where: { id: { inq: portIds } } }, function(err, ports) {
          if (err) return cb(err);
          
          // Crear mapa de ports para lookup rápido
          const portMap = {};
          ports.forEach(port => {
            portMap[port.id] = port;
          });
          
          // Formatear la respuesta con información del port
          const formattedLogs = logs.map(log => {
            const port = portMap[log.portId];
            return {
              id: log.id,
              deviceId: log.deviceId,
              portId: log.portId,
              portName: port ? port.name : 'Unknown',
              portField: port ? port.field : 'unknown',
              portUnit: port ? port.unit : '',
              value: log.value,
              timestamp: log.timestamp,
              data: log.data
            };
          });
          
          cb(null, {
            deviceId: deviceId,
            deviceName: device.name,
            logs: formattedLogs,
            total: formattedLogs.length
          });
        });
      });
    });
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