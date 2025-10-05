# Newsfeed Application Setup Guide

This project contains both the **backend** (NestJS) and **frontend** (Next.js) parts of the Newsfeed application.

---

## 📁 Project Structure

```
newsfeed/
├── newsfeed_api/       # Backend (NestJS)
├── newsfeed_fe/        # Frontend (Next.js)
└── README.md
```

---

## 🧩 Prerequisites

Make sure you have the following installed on your system:

- **Node.js** v18 or later  
- **npm** or **yarn**  
- **PostgreSQL** (as the database)  
- **Git**  

---

## ⚙️ Backend Setup (NestJS)

### 1. Navigate to the Backend Folder
```bash
cd newsfeed_api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file based on the provided `.env.example` file.

Example configuration:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/newsfeed_db"
```

### 4. Run Database Migration
```bash
npx prisma migrate dev
```

### 5. Start the Backend Server
```bash
npm run start:dev
```
The backend will run at `http://localhost:3001` by default.

---

## 🖥️ Frontend Setup (Next.js)

### 1. Navigate to the Frontend Folder
```bash
cd newsfeed_fe
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
The frontend will run at `http://localhost:3000` by default.

---

## 🔗 Connecting Frontend and Backend

The frontend communicates with the backend through API calls to `http://localhost:3001`.  
Make sure both servers are running simultaneously.

---

## 🧪 Testing

You can test API endpoints using tools like **Postman** or **cURL**, and test frontend features by visiting the running local site.

---

## ✅ Summary of Commands

### Run Both Projects
```bash
# Terminal 1 (Backend)
cd newsfeed_api && npm run start:dev

# Terminal 2 (Frontend)
cd newsfeed_fe && npm run dev
```


