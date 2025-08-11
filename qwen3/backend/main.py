# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="API - Gestión de Obras",
    description="Backend para el sistema de gestión de obras de EPCM Software",
    version="1.0.0"
)

# Permitir conexión desde el frontend (React en localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"mensaje": "Bienvenido al backend del Sistema de Gestión de Obras"}

# Incluir rutas
from routes import obras, auth, archivos

app.include_router(obras.router)
app.include_router(auth.router)
app.include_router(archivos.router)