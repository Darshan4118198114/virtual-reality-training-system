# Virtual Reality Training System

A complete, functional, production-quality VR training system built with React, Three.js, React Three Fiber, WebXR, and FastAPI.

## Project Structure

- `/frontend`: React + Vite + Three.js application.
- `/backend`: Python FastAPI backend.
- `/database`: Migrations and schemas.
- `/docs`: Documentation and architecture.

## Getting Started

### Frontend (Desktop & VR Mode)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000`. You can test the demo without a VR headset (click on objects to interact). If you have a WebXR compatible headset, use the "Enter VR" button.

### Backend (API Server)
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Open `http://localhost:8000/docs` to see the Swagger UI.

### Database (PostgreSQL via Docker)
```bash
docker-compose up -d
```

## Features Implemented in Demo
- **Training State Machine:** Strict sequential step validation (Identify -> Grab -> Pin -> Fire).
- **Interactive 3D Objects:** Objects respond to clicks and XR controller interactions.
- **Scoring System:** Score drops on mistakes.
- **Dashboard:** React UI overlays the VR canvas showing instructions and current score.
