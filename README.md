# 📚 StudyTogether — Real-Time Group Study Platform

A full-stack real-time group study platform built using the MERN stack. StudyTogether enables students to collaborate in virtual study rooms with real-time chat, resource sharing, and an AI-powered study assistant.

---

## 🚀 Features

- 🔐 JWT-based Authentication (Register/Login)
- 🏠 Create & Join Study Rooms via Room Code
- 💬 Real-time Group Chat using Socket.io
- 📁 Resource Sharing (PDFs, Links, Images, Videos)
- ☁️ File Uploads via Cloudinary
- 🤖 AI Study Assistant powered by Ollama (Phi-3 Mini / Mistral 7B)
- 👤 Profile Management with Avatar Upload
- 🌐 Fully Responsive UI (Tailwind CSS)

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Socket.io-client

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.io

### Storage
- Cloudinary

### AI Integration
- Ollama
  - Phi-3 Mini
  - Mistral 7B

---

## 📂 Project Structure

```
StudyTogether/
│
├── client/          # Frontend (React + Vite)
├── server/          # Backend (Node + Express)
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/VinothanaBalakrishnan05/studytogether.git
cd studytogether
```

---

## 🔧 Backend Setup

```bash
cd server
npm install
```


Run the backend:

```bash
npm run dev
```

---

## 🎨 Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file inside the `client` folder:

Run the frontend:

```bash
npm run dev
```

---

## 🤖 AI Setup (Ollama)

Start Ollama:

```bash
ollama serve
```

Run a model:

```bash
ollama run phi3:mini
```

Or:

```bash
ollama run mistral
```

Ensure your backend connects to Ollama at:

```
http://localhost:11434
```

---

## 📦 Deployment Suggestions

- Frontend → Vercel
- Backend → Render 
- Database → MongoDB Atlas  
- Storage → Cloudinary  

Update CORS settings and environment variables for production.




## 📄 License

This project is licensed under the MIT License.