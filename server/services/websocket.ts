import WebSocket from 'ws'

export class WebSocketServer {
  private wss: WebSocket.Server
  private clients: Set<WebSocket>

  constructor(port: number) {
    this.wss = new WebSocket.Server({ port })
    this.clients = new Set()

    this.wss.on('connection', (ws: WebSocket) => {
      this.clients.add(ws)
      ws.on('message', (message: string) => this.handleMessage(ws, message))
      ws.on('close', () => this.clients.delete(ws))
    })
  }

  broadcast(message: string): void {
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    })
  }

  private handleMessage(ws: WebSocket, message: string): void {
    console.log('received: %s', message)
  }
}
