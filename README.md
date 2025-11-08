Collaborative Canvas

A real-time collaborative drawing application that allows multiple users to draw simultaneously on a shared canvas with live synchronization, undo/redo functionality, and conflict resolution.

Project Overview

Developed by Siri Pallakonda, this project demonstrates efficient real-time communication using WebSockets, smooth Canvas API operations, and consistent global state management across multiple clients. It focuses on performance, low latency, and seamless synchronization of drawing data between users.

Features

Real-time collaborative drawing across multiple users

Brush and eraser tools with adjustable color and stroke width

Global undo and redo operations

User presence indicators with unique colors

Conflict-free state synchronization across clients

Robust error handling and smooth recovery from disconnections

Tech Stack

Frontend: Vanilla JavaScript (Canvas API), HTML, CSS
Backend: Node.js, Express, WebSocket (Socket.io)
Version Control: Git and GitHub
Deployment: Vercel / Render / Railway (configurable)

Architecture Overview

The client captures drawing actions and transmits them as serialized stroke events to the server over WebSockets. The server maintains an ordered operation history and broadcasts updates to all connected clients. Undo/redo operations are handled globally by maintaining a synchronized operation stack across all users.

For detailed architecture, refer to the ARCHITECTURE.md file which includes:

Data flow diagrams

WebSocket message structure

Undo/Redo operation strategy

Conflict resolution and latency handling
