const request = require('supertest')
const { app } = require('./setup')

describe('Device Logs Endpoint', () => {
  let deviceId
  let portId

  beforeAll(async () => {
    // Create test device
    const deviceResponse = await request(app)
      .post('/api/devices')
      .send({
        name: 'Test Weather Station',
        type: 'temperature-sensor',
        location: 'Test Office',
        status: 'active'
      })

    deviceId = deviceResponse.body.id

    // Create test port
    const portResponse = await request(app)
      .post('/api/ports')
      .send({
        name: 'Temperature Sensor',
        unit: '°C',
        field: 'temperature',
        lastValue: 0,
        deviceId: deviceId
      })

    portId = portResponse.body.id

    // Create some test logs
    await request(app)
      .post(`/api/devices/${deviceId}/report`)
      .send({ temperature: 25.0 })

    await request(app)
      .post(`/api/devices/${deviceId}/report`)
      .send({ temperature: 26.5 })

    await request(app)
      .post(`/api/devices/${deviceId}/report`)
      .send({ temperature: 24.2 })
  })

  afterAll(async () => {
    // Clean up test data
    if (portId) {
      await request(app).delete(`/api/ports/${portId}`)
    }
    if (deviceId) {
      await request(app).delete(`/api/devices/${deviceId}`)
    }
  })

  test('should get device logs successfully', async () => {
    const response = await request(app)
      .get(`/api/devices/${deviceId}/logs`)
      .expect(200)

    expect(response.body.deviceId).toBe(deviceId)
    expect(response.body.deviceName).toBe('Test Weather Station')
    expect(response.body.logs).toBeDefined()
    expect(response.body.logs.length).toBeGreaterThan(0)
    expect(response.body.total).toBe(response.body.logs.length)
  })

  test('should return logs with port information', async () => {
    const response = await request(app)
      .get(`/api/devices/${deviceId}/logs`)
      .expect(200)

    const firstLog = response.body.logs[0]
    expect(firstLog.portId).toBe(portId)
    expect(firstLog.portName).toBe('Temperature Sensor')
    expect(firstLog.portField).toBe('temperature')
    expect(firstLog.portUnit).toBe('°C')
    expect(firstLog.value).toBeDefined()
    expect(firstLog.timestamp).toBeDefined()
  })

  test('should return logs ordered by timestamp DESC', async () => {
    const response = await request(app)
      .get(`/api/devices/${deviceId}/logs`)
      .expect(200)

    const logs = response.body.logs
    expect(logs.length).toBeGreaterThan(1)
    
    // Check that logs are ordered by timestamp DESC (newest first)
    for (let i = 0; i < logs.length - 1; i++) {
      const currentTimestamp = new Date(logs[i].timestamp)
      const nextTimestamp = new Date(logs[i + 1].timestamp)
      expect(currentTimestamp.getTime()).toBeGreaterThanOrEqual(nextTimestamp.getTime())
    }
  })

  test('should respect limit parameter', async () => {
    const response = await request(app)
      .get(`/api/devices/${deviceId}/logs?limit=2`)
      .expect(200)

    expect(response.body.logs.length).toBeLessThanOrEqual(2)
  })

  test('should return error for non-existent device', async () => {
    const fakeDeviceId = '507f1f77bcf86cd799439011'
    
    const response = await request(app)
      .get(`/api/devices/${fakeDeviceId}/logs`)
      .expect(500)

    expect(response.body.error.message).toBe('Device not found')
  })
})
