# backend/routes/obras.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Obra

router = APIRouter(prefix="/api/obras", tags=["obras"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def listar_obras(db: Session = Depends(get_db)):
    obras = db.query(Obra).all()
    return [
        {
            "id_obra": o.id_obra,
            "nombre": o.nombre,
            "contratista": o.contratista,
            "barrio": o.barrio,
            "lp_cd": o.lp_cd
        }
        for o in obras
    ]

@router.get("/{id_obra}")
def obtener_obra(id_obra: str, db: Session = Depends(get_db)):
    obra = db.query(Obra).filter(Obra.id_obra == id_obra).first()
    if not obra:
        raise HTTPException(status_code=404, detail="Obra no encontrada")
    return obra