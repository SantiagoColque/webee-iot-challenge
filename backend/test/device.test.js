const request = require('supertest')

describe('Device Model', () => {
  let deviceId

  test('should create a device', async () => {
    const deviceData = {
      name: 'Test Device',
      type: 'temperature-sensor',
      location: 'Test Location',
      status: 'active'
    }

    const response = await request(app)
      .post('/api/Devices')
      .send(deviceData)
      .expect(200)

    expect(response.body.name).toBe(deviceData.name)
    expect(response.body.type).toBe(deviceData.type)
    expect(response.body.location).toBe(deviceData.location)
    expect(response.body.status).toBe(deviceData.status)
    expect(response.body.id).toBeDefined()

    deviceId = response.body.id
  })

  test('should get all devices', async () => {
    const response = await request(app)
      .get('/api/Devices')
      .expect(200)

    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThan(0)
  })

  test('should get device by id', async () => {
    const response = await request(app)
      .get(`/api/Devices/${deviceId}`)
      .expect(200)

    expect(response.body.id).toBe(deviceId)
    expect(response.body.name).toBe('Test Device')
  })

  test('should update device', async () => {
    const updateData = {
      name: 'Updated Device',
      status: 'inactive'
    }

    const response = await request(app)
      .put(`/api/Devices/${deviceId}`)
      .send(updateData)
      .expect(200)

    expect(response.body.name).toBe(updateData.name)
    expect(response.body.status).toBe(updateData.status)
  })

  test('should delete device', async () => {
    await request(app)
      .delete(`/api/Devices/${deviceId}`)
      .expect(204)

    // Verify device is deleted
    await request(app)
      .get(`/api/Devices/${deviceId}`)
      .expect(404)
  })
})
