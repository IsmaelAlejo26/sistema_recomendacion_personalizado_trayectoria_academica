from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llm import get_recommendations

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class SubjectsRequest(BaseModel):
    subjects: list[str]
    skills: list[str]
    goals: str

@app.post("/recommendations")
def recommendations(request: SubjectsRequest):
    if not request.subjects:
        raise HTTPException(status_code=400, detail="No se mandaron materias.")
    if not request.skills:
        raise HTTPException(status_code=400, detail="No se mandaron habilidades.")
    if not request.goals.strip():
        raise HTTPException(status_code=400, detail="No se mandaron metas profesionales.")
    result = get_recommendations(request.subjects, request.skills, request.goals)
    return result

# Al final, después de tus rutas
app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="static")