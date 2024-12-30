/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express'
import helmet from 'helmet'
import http from 'http'
import { BrowserWindow } from 'electron'
import { exec } from 'child_process'

export const PORT = 3003
const WORDS_TO_REMOVE_FOCUS_NFCE = [
  'https://api.focusnfe.com.br/images/logo-nfce.png',
  'max-width: 300px;',
  'max-width: 500px;'
]

type T = {
  printed: boolean
  error: boolean
}

class Server {
  public app: express.Application
  public server?: http.Server
  private healthCheckInterval?: NodeJS.Timeout
  private mainWindow: BrowserWindow

  constructor(mainWindow: BrowserWindow) {
    this.app = express()
    this.setupMiddleware()
    this.setupRoutes()
    this.mainWindow = mainWindow
  }

  private setupMiddleware() {
    this.app.use(express.json())
    this.app.use(helmet())
  }

  private removeWordsRegex(input: string, wordsToRemove: string[]) {
    const pattern = new RegExp(`\\b(${wordsToRemove.join('|')})\\b`, 'gi')
    return input.replace(pattern, '').replace(/\s+/g, ' ').trim()
  }

  private async isPrinterQueueBlocked(command: string) {
    return new Promise<T>((resolve) => {
      exec(command, (err, stdout) => {
        if (err) {
          console.log('Error:', err)
          return resolve({ printed: false, error: true })
        }
        if (stdout.search('Error') !== -1) {
          return resolve({ printed: false, error: true })
        }
        if (stdout.search('Printing') !== -1 && stdout.search('OK') === -1) {
          return resolve({
            printed: true,
            error: false
          })
        } else {
          return resolve({
            printed: false,
            error: false
          })
        }
      })
    })
  }

  private setupRoutes() {
    this.app.post('/print-nfce', async (req: any, res: any) => {
      const { data } = req.body
      let defaultPrinter: string | undefined
      let defaultPrinterStatus: number | undefined = 0

      await this.mainWindow.webContents.getPrintersAsync().then((printers) => {
        defaultPrinter = printers.find((printer) => printer.isDefault)?.name
        defaultPrinterStatus = printers.find(
          (printer) => printer.isDefault
        )?.status
      })
      if (!defaultPrinter || defaultPrinter === undefined) {
        return res.status(500).json({ error: 'No default printer found' })
      }
      if (defaultPrinterStatus !== 0) {
        return res.status(500).json({ error: 'Default printer is not OK' })
      }

      try {
        const printableWindow = new BrowserWindow({
          show: false
        })
        const sanitizedData = this.removeWordsRegex(
          data,
          WORDS_TO_REMOVE_FOCUS_NFCE
        )
        printableWindow.loadURL(
          'data:text/html;charset=utf-8,' +
            encodeURIComponent(`
            ${sanitizedData}
          `)
        )
        printableWindow.webContents.on('did-finish-load', () => {
          printableWindow.webContents.print(
            {
              silent: true,
              printBackground: false,
              deviceName: defaultPrinter,
              margins: {
                marginType: 'none'
              }
            },
            (success, errorType) => {
              printableWindow.close()
              if (!success) {
                console.log('Error printing', errorType)
                return res
                  .status(500)
                  .send('Error sending to printer:', errorType)
              }
            }
          )
        })
      } catch (error) {
        console.log('Error printing', error)
        return res.status(500).send('Error sending to printer:', error)
      }
      const command = `powershell.exe -Command "Get-WmiObject -Class Win32_PrintJob | Select-Object JobStatus, Status"`

      let counter = 0
      const interval = setInterval(async () => {
        let isBlocked = false
        let isPrinted = false
        await this.isPrinterQueueBlocked(command).then((result: T) => {
          if (result.error) {
            isBlocked = true
          }
          if (result.printed) {
            isPrinted = true
          }
        })
        if (isBlocked) {
          clearInterval(interval)
          return res.status(500).json({ error: 'Printer queue is blocked' })
        } else if (isPrinted || counter > 3) {
          clearInterval(interval)
          return res.status(200).json({ message: 'Printed' })
        } else {
          counter += 1
        }
      }, 300)
    })

    this.app.post('/print-stone-receipt', async (req: any, res: any) => {
      const { receipt } = req.body
      const { clientVia } = receipt
      let defaultPrinter: string | undefined
      let defaultPrinterStatus: number | undefined = 0

      await this.mainWindow.webContents.getPrintersAsync().then((printers) => {
        defaultPrinter = printers.find((printer) => printer.isDefault)?.name
        defaultPrinterStatus = printers.find(
          (printer) => printer.isDefault
        )?.status
      })
      if (!defaultPrinter || defaultPrinter === undefined) {
        return res.status(500).json({ error: 'No default printer found' })
      }
      if (defaultPrinterStatus !== 0) {
        return res.status(500).json({ error: 'Default printer is not OK' })
      }

      try {
        const printableWindow = new BrowserWindow({
          show: false
        })
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Printable Page</title>
            </head>
            <body>
              <pre>${clientVia}</pre>
            </body>
          </html>
        `
        printableWindow.loadURL(
          'data:text/html;charset=utf-8,' +
            encodeURIComponent(`
            ${htmlContent}
          `)
        )
        printableWindow.webContents.on('did-finish-load', () => {
          printableWindow.webContents.print(
            {
              silent: true,
              printBackground: false,
              deviceName: defaultPrinter,
              margins: {
                marginType: 'none'
              }
            },
            (success, errorType) => {
              printableWindow.close()
              if (!success) {
                console.log('Error printing', errorType)
                return res
                  .status(500)
                  .send('Error sending to printer:', errorType)
              }
            }
          )
        })
      } catch (error) {
        console.log('Error printing', error)
        return res.status(500).send('Error sending to printer:', error)
      }
      const command = `powershell.exe -Command "Get-WmiObject -Class Win32_PrintJob | Select-Object JobStatus, Status"`

      let counter = 0
      const interval = setInterval(async () => {
        let isBlocked = false
        let isPrinted = false
        await this.isPrinterQueueBlocked(command).then((result: T) => {
          if (result.error) {
            isBlocked = true
          }
          if (result.printed) {
            isPrinted = true
          }
        })
        if (isBlocked) {
          clearInterval(interval)
          return res.status(500).json({ error: 'Printer queue is blocked' })
        } else if (isPrinted || counter > 3) {
          clearInterval(interval)
          return res.status(200).json({ message: 'Printed' })
        } else {
          counter += 1
        }
      }, 300)
    })

    this.app.get('/health', (_req: any, res: any) => {
      res.send('Server is alive')
    })

    this.app.get('/simulate-crash', (_req: any, res: any) => {
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

    this.server = this.app.listen(PORT, '127.0.0.1', () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })

    this.server?.on('error', (err) => {
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
