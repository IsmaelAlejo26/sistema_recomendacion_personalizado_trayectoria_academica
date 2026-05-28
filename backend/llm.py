import json
import re
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_KEY"))

def parse_response(response_text: str):
    response_text = re.sub(r'<think>.*?</think>', '', response_text, flags=re.DOTALL)
    response_text = response_text.strip()
    if response_text.startswith("```"):
        response_text = response_text.split("```")[1]
        if response_text.startswith("json"):
            response_text = response_text[4:]
    return json.loads(response_text.strip())

def get_recommendations(subjects: list[str], skills: list[str], goals: str) -> dict:
    subjects_text = ", ".join(subjects)
    skills_text = ", ".join(skills)

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        max_tokens=1000,
        messages=[
            {
                "role": "system",
                "content": """/no_think Eres un asistente educativo especializado en recomendar recursos de aprendizaje.
                Recibirás tres datos del estudiante:
                - Materias con bajo rendimiento
                - Habilidades que tiene y quiere mejorar
                - Metas profesionales

                VALIDACIÓN: Antes de generar recomendaciones, valida que las metas profesionales sean relevantes
                para el contexto educativo o profesional en el área de Sistemas Computacionales. Si el texto no 
                tiene relación con metas, carrera, aprendizaje o desarrollo profesional en el área de Sistemas 
                Computacionales, responde ÚNICAMENTE con este JSON:
                {
                    "error": "invalid_goals",
                    "message": "Las metas profesionales no son válidas. Por favor describe tus objetivos de carrera o aprendizaje."
                }

                Si los datos son válidos, responde ÚNICAMENTE con un JSON válido con esta estructura, sin texto adicional:
                {
                    "recommendations": [
                        {
                            "category": "materia | habilidad | meta",
                            "name": "nombre de la materia, habilidad o meta",
                            "resources": [
                                {
                                    "title": "nombre del recurso",
                                    "url": "enlace",
                                    "type": "curso | tutoría | material"
                                }
                            ]
                        }
                    ]
                }"""
            },
            {
               "role": "user",
                "content": f"Materias con bajo rendimiento: {subjects_text}\nHabilidades a mejorar: {skills_text}\nMetas profesionales: {goals}\n\nObligatorio: genera solo una recomendación por cada materia, por cada habilidad y para las metas profesionales."
            }
        ],
        temperature=0.3,
    )

    response_text = completion.choices[0].message.content
    # print("RESPUESTA DEL MODELO: ", response_text)
    # Solicitud desde otro origen bloqueada: la política de mismo origen impide leer el recurso remoto en http://localhost:8000/recommendations (razón: falta la cabecera CORS 'Access-Control-Allow-Origin'). Código de estado: 500.
    return parse_response(response_text)