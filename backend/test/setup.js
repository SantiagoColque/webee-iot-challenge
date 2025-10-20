const app = require('../server/server.js')

// Setup global test environment
global.app = app

// Clean up after tests
afterAll(async () => {
  if (app && app.dataSources) {
    await Promise.all(
      Object.keys(app.dataSources).map(name => {
        const ds = app.dataSources[name]
        if (ds.connected) {
          return ds.disconnect()
        }
      })
    )
  }
})
