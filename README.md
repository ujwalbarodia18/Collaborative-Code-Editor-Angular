# 🚀 Collaborative Code Editor

A real-time collaborative code editor that enables multiple users to join shared rooms and edit code simultaneously with live synchronization.

Built using Angular, Node.js, Express, MongoDB, and WebSockets.

Frontend repo: https://github.com/ujwalbarodia18/Collaborative-Code-Editor-Angular

Backend repo: https://github.com/ujwalbarodia18/Collaborative-Code-Editor-Server

---
![Image](https://github.com/user-attachments/assets/9aa3a6d3-3448-4ee9-bfd1-657605caab65)
---

## ✨ Features

- 🔐 JWT-based authentication & authorization
- 👥 Multi-user room support
- ⚡ Real-time code synchronization using WebSockets
- 🧠 Room-scoped event broadcasting
- 🗄 Persistent room metadata stored in MongoDB
- 🛡 Centralized error handling middleware
- 🧱 Modular backend architecture
- 🌐 CORS-configured and production-ready setup

---

## 🏗 System Architecture

### High-Level Overview
Client (Angular) ⟷ REST APIs ⟷ Node.js + Express Backend ⟷ MongoDB

#### Real-time Layer:
Client ⟷ WebSocket ⟷ Server ⟷ Room Broadcast



## 🔄 Real-Time Synchronization Flow

1. User authenticates via REST API.
2. User joins a specific room.
3. WebSocket connection is established.
4. On code change:
   - Client emits a `code-change` event.
   - Server broadcasts the update to other users in the same room.
5. All connected clients update their editor state.

> Synchronization is room-scoped to ensure isolation between sessions.

---

## 🛠 Tech Stack

### Frontend
- Angular
- RxJS
- Angular Reactive Forms

### Backend
- Node.js
- Express
- WebSockets / Socket.io
- MongoDB
- Mongoose

---

## 📦 Installation

### 1. Clone Repositories

Backend:
```bash
git clone https://github.com/<your-username>/server-repo.git
cd server-repo
```

Frontend:
```bash
git clone https://github.com/<your-username>/client-repo.git
cd client-repo
```

### 2. Backend Setup
```bash
npm install
npm run dev
```

Create a .env file:
```bash
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret
```

### 3. Frontend Setup
```bash
npm install --legacy-peer-deps
ng serve
```
App will run at
```bash
http://localhost:4200
```

## 🔐 Environment Variables

The backend requires the following environment variables.

Create a `.env` file in the root of the server project:

PORT=5000  
MONGO_URI=mongodb://localhost:27017/collab-editor  
JWT_SECRET=your_super_secret_key  
CLIENT_URL=http://localhost:4200  
NODE_ENV=development  

---

### 📘 Variable Descriptions

| Variable      | Required | Description |
|--------------|----------|------------|
| PORT         | Yes      | Port on which the backend server runs. |
| MONGO_URI    | Yes      | MongoDB connection string. |
| JWT_SECRET   | Yes      | Secret key used to sign and verify JWT tokens. |
| CLIENT_URL   | Yes      | Allowed frontend origin for CORS configuration. |
| NODE_ENV     | No       | Application environment (`development` or `production`). |

---

### ⚠️ Security Notes

- Do NOT commit the `.env` file to version control.
- Always use a strong, unpredictable `JWT_SECRET` in production.
- Configure different values for development and production environments.

## ⚙️ Design Decisions

This project was designed with simplicity, modularity, and scalability in mind.

---

### 1️⃣ WebSockets Over Polling

WebSockets were chosen instead of HTTP polling to:

- Reduce latency for real-time updates
- Minimize unnecessary network overhead
- Enable bi-directional communication between client and server

This allows instant code synchronization across connected users.

---

### 2️⃣ Room-Based Architecture

Each collaborative session is isolated using socket rooms.

Benefits:
- Prevents cross-room event leakage
- Keeps synchronization logic simple and maintainable

---

### 3️⃣ Separation of Concerns (Backend Structure)

The backend follows a layered architecture:

Routes → Controllers → Services → Database

This ensures:
- Clear responsibility boundaries
- Easier testing and debugging
- Better scalability as features grow

---

### 4️⃣ JWT-Based Authentication

Stateless JWT authentication was used to:

- Avoid server-side session storage
- Enable horizontal scalability
- Secure both REST APIs and socket connections

---

### 5️⃣ MongoDB for Flexible Schema

MongoDB was selected because:

- Room metadata can evolve over time
- Flexible schema design supports rapid iteration
- Works well with Node.js ecosystem

---

### 6️⃣ Environment-Based Configuration

Environment variables are used for:

- Database credentials
- JWT secrets
- CORS configuration

This keeps sensitive information out of the codebase and supports multiple deployment environments.

---

### 7️⃣ Independent Frontend & Backend Deployment

The system is designed so that:

- Frontend and backend can be deployed independently
- API base URLs are environment-driven
- Infrastructure can scale separately if needed
