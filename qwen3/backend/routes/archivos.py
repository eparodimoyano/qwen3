# backend/routes/archivos.py
from fastapi import APIRouter

router = APIRouter(prefix="/api/archivos", tags=["archivos"])

@router.get("/")
def listar_archivos():
    return {"mensaje": "Lista de archivos"}