
export interface User {
  id: string;
  name: string;
  color: string;
  cursor?: { x: number; y: number };
}

export type Tool = 'brush' | 'eraser';

export interface ToolOptions {
  tool: Tool;
  color: string;
  lineWidth: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface DrawOperation {
  id: string;
  userId: string;
  options: ToolOptions;
  points: Point[];
}
