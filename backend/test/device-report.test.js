const request = require('supertest')

describe('Device Report Endpoint', () => {
  let deviceId
  let portId

  beforeAll(async () => {
    // Create test device
    const deviceResponse = await request(app)
      .post('/api/Devices')
      .send({
        name: 'Test Weather Station',
        type: 'temperature-sensor',
        location: 'Test Office',
        status: 'active'
      })

    deviceId = deviceResponse.body.id

    // Create test port
    const portResponse = await request(app)
      .post('/api/Ports')
      .send({
        name: 'Temperature Sensor',
        unit: '°C',
        field: 'temperature',
        lastValue: 0,
        deviceId: deviceId
      })

    portId = portResponse.body.id
  })

  afterAll(async () => {
    // Clean up test data
    if (portId) {
      await request(app).delete(`/api/Ports/${portId}`)
    }
    if (deviceId) {
      await request(app).delete(`/api/Devices/${deviceId}`)
    }
  })

  test('should report sensor data successfully', async () => {
    const sensorData = {
      temperature: 25.5
    }

    const response = await request(app)
      .post(`/api/Devices/${deviceId}/report`)
      .send(sensorData)
      .expect(200)

    expect(response.body.result).toBeDefined()
    expect(response.body.result.deviceId).toBe(deviceId)
    expect(response.body.result.results).toBeDefined()
    expect(response.body.result.results.length).toBe(1)
    expect(response.body.result.results[0].field).toBe('temperature')
    expect(response.body.result.results[0].value).toBe(25.5)
  })

  test('should update port lastValue after report', async () => {
    const sensorData = {
      temperature: 26.0
    }

    await request(app)
      .post(`/api/Devices/${deviceId}/report`)
      .send(sensorData)
      .expect(200)

    // Check that port was updated
    const portResponse = await request(app)
      .get(`/api/Ports/${portId}`)
      .expect(200)

    expect(portResponse.body.lastValue).toBe(26.0)
  })

  test('should create device log after report', async () => {
    const sensorData = {
      temperature: 27.0
    }

    await request(app)
      .post(`/api/Devices/${deviceId}/report`)
      .send(sensorData)
      .expect(200)

    // Check that log was created
    const logsResponse = await request(app)
      .get('/api/DeviceLogs')
      .expect(200)

    const latestLog = logsResponse.body.find(log => 
      log.deviceId == deviceId && log.portId == portId
    )

    expect(latestLog).toBeDefined()
    expect(latestLog.value).toBe(27.0)
    expect(latestLog.data.temperature).toBe(27.0)
  })

  test('should return error for non-existent device', async () => {
    const sensorData = {
      temperature: 25.0
    }

    await request(app)
      .post('/api/Devices/99999/report')
      .send(sensorData)
      .expect(500)
  })

  test('should handle unknown sensor field', async () => {
    const sensorData = {
      humidity: 60.0  // This field doesn't exist
    }

    const response = await request(app)
      .post(`/api/Devices/${deviceId}/report`)
      .send(sensorData)
      .expect(200)

    expect(response.body.result.results[0].error).toBe('Port not found')
  })
})
