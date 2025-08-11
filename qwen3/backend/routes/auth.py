# backend/routes/auth.py
from fastapi import APIRouter

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.get("/me")
def obtener_usuario_actual():
    return {"mensaje": "Usuario autenticado"}
