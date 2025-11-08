import React, { useState, useEffect } from 'react';
import type { User, ToolOptions, DrawOperation } from './types';
import { Toolbar } from './components/Toolbar';
import { UserList } from './components/UserList';
import { Canvas } from './components/Canvas';
import { useDrawing } from './hooks/useDrawing';
import { socketService } from './services/socketService';

export default function App() {
  const [self, setSelf] = useState<User | null>(socketService.getSelf());
  const [users, setUsers] = useState<User[]>([]);
  const [toolOptions, setToolOptions] = useState<ToolOptions>({
    tool: 'brush',
    color: '#FFFFFF',
    lineWidth: 5,
  });
  
  const [operationHistory, setOperationHistory] = useState<DrawOperation[]>([]);
  const [redoStack, setRedoStack] = useState<DrawOperation[]>([]);
  const [drawingOps, setDrawingOps] = useState<{ [userId: string]: DrawOperation }>({});

  const { handleStartDrawing, handleDraw, handleEndDrawing, handleCursorMove, currentOperation } = useDrawing(toolOptions);
  
  useEffect(() => {
    const handleUsersUpdate = (updatedUsers: User[]) => {
      setUsers(updatedUsers);
      const selfUser = updatedUsers.find(u => u.id === self?.id);
      if (selfUser && selfUser.color !== toolOptions.color && toolOptions.tool === 'brush') {
        setToolOptions(prev => ({ ...prev, color: selfUser.color }));
      }
    };

    const handleHistoryUpdate = ({ history, redoStack }: { history: DrawOperation[], redoStack: DrawOperation[] }) => {
      setOperationHistory(history);
      setRedoStack(redoStack);
    };

    const handleDrawingOpsUpdate = (ops: { [userId: string]: DrawOperation }) => {
        setDrawingOps({...ops});
    };

    socketService.on('users', handleUsersUpdate);
    socketService.on('history', handleHistoryUpdate);
    socketService.on('drawing-ops', handleDrawingOpsUpdate);

    return () => {
      socketService.disconnect();
    };
  }, [self?.id, toolOptions.color, toolOptions.tool]);

  const onUndo = () => socketService.emit('undo', null);
  const onRedo = () => socketService.emit('redo', null);
  
  const otherUsers = users.filter(u => u.id !== self?.id);
  // Fix: Explicitly type the 'op' parameter to 'DrawOperation'
  const otherDrawingOps = Object.values(drawingOps).filter((op: DrawOperation) => op.userId !== self?.id);

  return (
    <main className="w-screen h-screen bg-gray-900 flex flex-col relative">
      <Toolbar 
        toolOptions={toolOptions}
        setToolOptions={setToolOptions}
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={operationHistory.length > 0}
        canRedo={redoStack.length > 0}
      />
      <UserList users={users} selfId={self?.id || ''} />
      
      <div 
        className="flex-grow w-full h-full cursor-crosshair"
        onMouseDown={handleStartDrawing}
        onMouseMove={(e) => {
            handleDraw(e);
            handleCursorMove(e);
        }}
        onMouseUp={handleEndDrawing}
        onMouseLeave={handleEndDrawing}
        onTouchStart={handleStartDrawing}
        onTouchMove={handleDraw}
        onTouchEnd={handleEndDrawing}
      >
        <Canvas
          operations={[...operationHistory, ...otherDrawingOps]}
          otherUsers={otherUsers}
          onDraw={() => {}}
          onCursorMove={() => {}}
          currentOperation={currentOperation}
        />
      </div>
    </main>
  );
}