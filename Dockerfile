FROM python:3.11-slim

WORKDIR /app

# Copiar e instalar dependencias de Python
COPY backend/requeriments.txt .
RUN pip install --no-cache-dir -r requeriments.txt

# Copiar el backend
COPY backend/ .

# Copiar el build de React dentro del backend
COPY frontend/dist ./frontend/dist

# Exponer el puerto que usa Hugging Face
EXPOSE 7860

# Correr el servidor
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]