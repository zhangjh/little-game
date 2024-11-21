'use client';

import { useState } from 'react';

interface RoomSelectionProps {
  onCreateRoom: () => void;
  onJoinRoom: (roomId: string) => void;
}

const RoomSelection: React.FC<RoomSelectionProps> = ({
  onCreateRoom,
  onJoinRoom,
}) => {
  const [roomId, setRoomId] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6">
      {!showJoinInput ? (
        <>
          <button
            onClick={onCreateRoom}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition transform hover:scale-105 shadow-lg text-lg"
          >
            创建房间
          </button>
          <button
            onClick={() => setShowJoinInput(true)}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition transform hover:scale-105 shadow-lg text-lg"
          >
            加入房间
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="输入房间号"
            className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-lg text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
          <div className="flex gap-4">
            <button
              onClick={() => onJoinRoom(roomId)}
              disabled={!roomId}
              className={`px-6 py-3 rounded-lg transition transform hover:scale-105 shadow-lg ${
                roomId
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-500 text-white/50 cursor-not-allowed'
              }`}
            >
              加入
            </button>
            <button
              onClick={() => setShowJoinInput(false)}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition transform hover:scale-105 shadow-lg"
            >
              返回
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomSelection;
