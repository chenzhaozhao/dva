import { Server } from 'mock-socket'

export default class SocketServer {
    
    constructor(url='ws://localhost:3000') {
        const mockServer = new Server(url)
        mockServer.on('connection', socket => {
            console.log('mockSocket is connection...')
            socket.on('message', data => {
                console.log('websocket servers receive params ' + JSON.stringify(data))
                setInterval(() => {
                    socket.send('test message from mock server at ' + this.id++)
                }, 2000)
            })
            socket.on('close', () => {})
        })
    }
    
    id = 0
}
