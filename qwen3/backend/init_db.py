# backend/init_db.py
from database import Base, engine
from backend.models import Obra, Avance, Ampliacion

Base.metadata.create_all(bind=engine)
print("✅ Tablas creadas en obras.db")