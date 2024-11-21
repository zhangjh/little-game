const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3001 });

// 存储房间信息
const rooms = new Map();

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      const { type, roomId, playerId } = data;

      switch (type) {
        case 'join':
          // 加入房间
          if (!rooms.has(roomId)) {
            rooms.set(roomId, new Set());
          }
          rooms.get(roomId).add(ws);
          
          // 广播加入消息
          broadcastToRoom(roomId, {
            type: 'join',
            roomId,
            playerId
          });
          break;

        case 'start':
          // 开始新回合
          broadcastToRoom(roomId, {
            type: 'start',
            roomId,
            playerId,
            data: data.data
          });
          break;

        case 'click':
          // 广播点击事件
          broadcastToRoom(roomId, {
            type: 'click',
            roomId,
            playerId,
            data: data.data
          });
          break;

        case 'leave':
          // 离开房间
          if (rooms.has(roomId)) {
            rooms.get(roomId).delete(ws);
            if (rooms.get(roomId).size === 0) {
              rooms.delete(roomId);
            }
          }
          broadcastToRoom(roomId, {
            type: 'leave',
            roomId,
            playerId
          });
          break;
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    // 清理断开连接的客户端
    for (const [roomId, clients] of rooms.entries()) {
      if (clients.has(ws)) {
        clients.delete(ws);
        if (clients.size === 0) {
          rooms.delete(roomId);
        }
      }
    }
  });
});

function broadcastToRoom(roomId, message) {
  if (rooms.has(roomId)) {
    const clients = rooms.get(roomId);
    const messageStr = JSON.stringify(message);
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    }
  }
}

console.log('WebSocket server is running on ws://localhost:3001');
