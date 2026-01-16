# 🚀 CronSocket.io

**CronSocket.io** is a real-time collaborative coding interview platform that enables users to:
- Create 1-on-1 coding sessions
- Collaborate via a live code editor
- Communicate using real-time video & chat
- Execute code securely
- Track sessions and participants

The project is built with a **production-grade backend architecture** using Clerk, Inngest, Stream, and MongoDB, while the frontend focuses on a smooth real-time experience with React.

---

## 🧠 Core Features

- 🔐 Authentication with Clerk
- 🔄 Event-driven user sync using Inngest
- 🎥 Real-time video calls (Stream Video)
- 💬 Real-time chat (Stream Chat)
- 🧑‍💻 Live code editor + execution
- ⚙️ Session lifecycle management
- 🗃️ Persistent session history
- 🧠 Fully local development setup (no cloud dependency required)

---

## 🏗️ Tech Stack

### Backend
- **Node.js + Express**
- **MongoDB + Mongoose**
- **Clerk** (Auth & Webhooks)
- **Inngest** (Background jobs & events)
- **Stream** (Video + Chat)
- **JWT-based** auth middleware

### Frontend
- **React** (Vite)
- **React Router v7**
- **TanStack Query**
- **Clerk React SDK**
- **Monaco Editor**
- **Tailwind CSS + DaisyUI**
- **Stream Video & Chat SDKs**

---

# 🔥 Backend Architecture (Deep Dive)

The backend is **event-driven**, **secure**, and **scalable**, designed to mirror production systems while running locally.

---

## 🔐 Authentication Flow (Clerk)

1. User signs up / signs in via Clerk (frontend)
2. Clerk emits webhook events:
   - `user.created`
   - `user.deleted`
3. Webhook hits backend via **ngrok public URL**
4. Backend forwards event to **Inngest**
5. Inngest background function:
   - Creates / deletes user in MongoDB
   - Syncs user with Stream (video + chat)

✅ This decouples auth from database logic  
✅ Prevents race conditions  
✅ Production-safe design

---

## 🔄 Inngest Event Flow

### Events Used
- `clerk.user.created`
- `clerk.user.deleted`

### Why Inngest?
- Async processing
- Retry support
- No webhook blocking
- Clean separation of concerns

---

## 📦 Backend Data Models

### User Model
```javascript
{
  name: String,
  email: String,
  clerkId: String (unique),
  profileImage: String,
  createdAt: Date
}
```

### Session Model
```javascript
{
  problem: String,
  difficulty: "easy" | "medium" | "hard",
  host: ObjectId (ref: User),
  participant: ObjectId (ref: User, optional),
  callId: String,
  status: "active" | "completed",
  createdAt: Date
}
```

---

## 🌊 Backend Data Flow (Sessions)

### 1️⃣ Create Session
**`POST /api/sessions`**

**Flow:**
1. Auth middleware validates user
2. Session created in MongoDB
3. Stream Video Call created
4. Stream Chat Channel created
5. Session returned to client

---

### 2️⃣ Get Active Sessions
**`GET /api/sessions/active`**

Returns all active sessions with populated host data.

---

### 3️⃣ Get Session By ID
**`GET /api/sessions/:id`**

**Used by:**
- `/session/:id` page
- Video + chat initialization

---

### 4️⃣ Join Session
**`POST /api/sessions/:id/join`**

**Rules:**
- Host cannot join as participant
- Only 1 participant allowed
- Adds participant to Stream Chat

---

### 5️⃣ End Session
**`POST /api/sessions/:id/end`**

**Flow:**
1. Host validation
2. Stream video call deleted
3. Stream chat channel deleted
4. Session marked as completed

---

## 🎥 Stream Integration (Backend)

- Stream users are synced via Inngest
- Calls created during session creation
- Tokens issued via backend endpoint:
  - **`GET /api/chat/token`**

---

# 🎨 Frontend Overview

The frontend focuses on real-time UX, with server state managed via React Query.

## 📄 Pages

### `/` - HomePage
- Marketing landing page
- CTA to sign in

### `/dashboard` - DashboardPage
- Create session modal
- View active sessions
- View past sessions

### `/problems` - ProblemsPage
- List of coding problems
- Difficulty badges

### `/problem/:id` - ProblemPage
- Solo problem solving
- Code editor + execution

### `/session/:id` - SessionPage
- Live coding session
- Video call
- Chat
- Code editor
- Output panel

---

## 🔁 Frontend Data Fetching

- **axios** with `withCredentials`
- **React Query** for caching & refetching
- All API calls map 1:1 with backend endpoints

---

# 🧪 Local Development Setup

### Run Backend
```bash
npm run dev
```

### Run Frontend
```bash
npm run dev
```

### Run Inngest Dev Server
```bash
npx inngest dev
```

### Expose Webhooks via ngrok
```bash
ngrok http 3000
```

Paste ngrok URL into Clerk webhook settings.

---

## 🛡️ Production-Ready Decisions

- ✅ Event-driven user sync
- ✅ No blocking webhooks
- ✅ Proper DB indexing
- ✅ Stream cleanup on session end
- ✅ Separation of auth, events, and business logic

---

## 📌 Summary

**CronSocket.io** is a production-inspired real-time system designed to:
- **Scale**
- **Remain debuggable**
- **Be locally reproducible**
- **Mirror real SaaS architectures**

This project demonstrates strong backend fundamentals, async systems, and real-time engineering.