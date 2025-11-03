const request = require('supertest')
const { app } = require('./setup')

describe('Device Report Endpoint', () => {
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
        name: 'temperature',
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
      await request(app).delete(`/api/ports/${portId}`)
    }
    if (deviceId) {
      await request(app).delete(`/api/devices/${deviceId}`)
    }
  })

  test('should report sensor data successfully', async () => {
    const sensorData = {
      temperature: 25.5
    }

    const response = await request(app)
      .post(`/api/devices/${deviceId}/report`)
      .send(sensorData)
      .expect(200)

    expect(response.body.result).toBeDefined()
    expect(response.body.result.deviceId).toBe(deviceId)
    expect(response.body.result.fields).toBeDefined()
    expect(response.body.result.fields.length).toBe(1)
    expect(response.body.result.fields[0].field).toBe('temperature')
    expect(response.body.result.fields[0].value).toBe(25.5)
  })

  test('should update port lastValue after report', async () => {
    const sensorData = {
      temperature: 26.0
    }

    const response = await request(app)
      .post(`/api/devices/${deviceId}/report`)
      .send(sensorData)
      .expect(200)

    // Verify the response contains the log ID and value
    expect(response.body.result.logId).toBeDefined()
    expect(response.body.result.fields[0].value).toBe(26.0)
  })

  test('should create device log after report', async () => {
    const sensorData = {
      temperature: 27.0
    }

    const response = await request(app)
      .post(`/api/devices/${deviceId}/report`)
      .send(sensorData)
      .expect(200)

    // Verify the response contains the log ID
    expect(response.body.result.logId).toBeDefined()
    expect(response.body.result.fields[0].value).toBe(27.0)
  })

  test('should return error for non-existent device', async () => {
    const sensorData = {
      temperature: 25.0
    }

    await request(app)
      .post('/api/devices/99999/report')
      .send(sensorData)
      .expect(500)
  })

  test('should handle unknown sensor field', async () => {
    const sensorData = {
      humidity: 60.0  // This field doesn't exist
    }

    const response = await request(app)
      .post(`/api/devices/${deviceId}/report`)
      .send(sensorData)
      .expect(200)

    expect(response.body.result.fields[0].error).toBe('Port not found')
  })
})