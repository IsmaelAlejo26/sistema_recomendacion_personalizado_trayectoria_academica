from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llm import get_recommendations

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class SubjectsRequest(BaseModel):
    subjects: list[str]

@app.post("/recommendations")
def recommendations(request: SubjectsRequest):
    if not request.subjects:
        raise HTTPException(status_code=400, detail="No se mandaron materias.")
    result = get_recommendations(request.subjects)
    return result