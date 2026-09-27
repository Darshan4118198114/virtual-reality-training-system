from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="VR Training System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ModuleInfo(BaseModel):
    id: str
    title: str
    progress: int

@app.get("/api/trainings")
def get_trainings():
    return [
        {"id": "fire_safety_01", "title": "Fire Safety Training", "difficulty": "Beginner"},
        {"id": "machine_op_01", "title": "Machine Operation", "difficulty": "Intermediate"}
    ]

@app.get("/api/progress")
def get_progress():
    return {
        "overall_score": 82,
        "modules": [
            {"id": "fire_safety_01", "title": "Fire Safety Training", "progress": 75},
            {"id": "machine_op_01", "title": "Machine Operation", "progress": 0}
        ]
    }

@app.post("/api/sessions/{session_id}/event")
def log_event(session_id: str, event: dict):
    # Log event (mock)
    print(f"Received event for session {session_id}: {event}")
    return {"status": "ok"}

@app.get("/")
def read_root():
    return {"message": "VR Training API is running"}
