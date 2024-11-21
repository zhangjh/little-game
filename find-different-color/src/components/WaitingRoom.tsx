'use client';

import { useEffect } from 'react';
import GameWebSocket from '@/utils/websocket';

interface WaitingRoomProps {
  roomId: string;
  isHost: boolean;
  onLeave: () => void;
  onPlayerJoined: () => void;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({
  roomId,
  isHost,
  onLeave,
  onPlayerJoined,
}) => {
  useEffect(() => {
    const ws = GameWebSocket.getInstance();
    
    const handleMessage = (message: any) => {
      if (message.type === 'join' && message.roomId === roomId && message.playerId !== (isHost ? 1 : 2)) {
        onPlayerJoined();
      }
    };

    ws.addMessageHandler(handleMessage);

    // 如果是加入者，发送加入消息
    if (!isHost) {
      ws.joinRoom(roomId, 2);
    }

    return () => {
      ws.removeMessageHandler(handleMessage);
    };
  }, [roomId, isHost, onPlayerJoined]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-2xl text-white font-bold mb-4">
        {isHost ? '等待玩家加入...' : '已加入房间'}
      </div>
      
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 flex flex-col items-center gap-4">
        <div className="text-white text-lg">
          房间号：<span className="font-mono font-bold text-yellow-400">{roomId}</span>
        </div>
        {isHost && (
          <div className="text-white/80 text-sm">
            将此房间号分享给你的对手
          </div>
        )}
      </div>

      <div className="animate-pulse text-white/80">
        {isHost ? '正在等待对手加入...' : '正在等待房主开始游戏...'}
      </div>

      <button
        onClick={onLeave}
        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition transform hover:scale-105 shadow-lg mt-4"
      >
        离开房间
      </button>
    </div>
  );
};

export default WaitingRoom;
