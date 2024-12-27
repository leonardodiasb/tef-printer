import express from 'express'
import helmet from 'helmet'
import http from 'http'

export const PORT = 3003

class Server {
  public app: express.Application
  public server?: http.Server
  private healthCheckInterval?: NodeJS.Timeout

  constructor() {
    this.app = express()
    this.setupMiddleware()
    this.setupRoutes()
  }

  private setupMiddleware() {
    this.app.use(express.json())
    this.app.use(helmet())
  }

  private setupRoutes() {
    this.app.post('/print-nfce', (req, res) => {
      const body = req.body
      console.log(body)
      res.send('Hello World!')
    })

    this.app.get('/health', (req, res) => {
      res.send('Server is alive')
    })

    this.app.get('/simulate-crash', (req, res) => {
      console.log('Simulating server crash...')
      this.stop()
      res.send('Server is dead')
    })
  }

  stop() {
    if (this.server) {
      this.server.close(() => {
        console.log('Server stopped.')
      })
      this.server = undefined
    }
  }

  public start() {
    if (this.server) {
      console.log('Server is already running.')
      return
    }

    this.server = this.app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })

    this.server.on('error', (err) => {
      console.error('Server error:', err)
    })

    this.healthCheckInterval = setInterval(() => this.checkHealth(), 5000)
  }

  public restart() {
    console.log('Restarting server...')
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
      this.healthCheckInterval = undefined
    }
    this.stop()
    this.start()
  }

  public checkHealth() {
    // console.log('checking health...')
    if (!this.server) {
      // console.log('Server is dead. Restarting...', this.restart)
      this.restart()
    }
  }
}

export default Server
