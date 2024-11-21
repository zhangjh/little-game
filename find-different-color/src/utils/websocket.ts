type MessageType = 'join' | 'start' | 'click' | 'leave';

interface GameMessage {
  type: MessageType;
  roomId: string;
  playerId: number;
  data?: any;
}

class GameWebSocket {
  private ws: WebSocket | null = null;
  private messageHandlers: ((message: GameMessage) => void)[] = [];
  private static instance: GameWebSocket;

  private constructor() {
    this.connect();
  }

  static getInstance(): GameWebSocket {
    if (!GameWebSocket.instance) {
      GameWebSocket.instance = new GameWebSocket();
    }
    return GameWebSocket.instance;
  }

  private connect() {
    // 本地开发使用 ws://localhost:3001
    // 生产环境需要替换为实际的WebSocket服务器地址
    this.ws = new WebSocket('ws://localhost:3001');

    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const message: GameMessage = JSON.parse(event.data);
        this.messageHandlers.forEach(handler => handler(message));
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      // 尝试重新连接
      setTimeout(() => this.connect(), 3000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  addMessageHandler(handler: (message: GameMessage) => void) {
    this.messageHandlers.push(handler);
  }

  removeMessageHandler(handler: (message: GameMessage) => void) {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }

  sendMessage(message: GameMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  joinRoom(roomId: string, playerId: number) {
    this.sendMessage({
      type: 'join',
      roomId,
      playerId
    });
  }

  startGame(roomId: string, playerId: number, gameData: any) {
    this.sendMessage({
      type: 'start',
      roomId,
      playerId,
      data: gameData
    });
  }

  sendClick(roomId: string, playerId: number, index: number) {
    this.sendMessage({
      type: 'click',
      roomId,
      playerId,
      data: { index }
    });
  }

  leaveRoom(roomId: string, playerId: number) {
    this.sendMessage({
      type: 'leave',
      roomId,
      playerId
    });
  }

  disconnect() {
    this.ws?.close();
  }
}

export default GameWebSocket;
