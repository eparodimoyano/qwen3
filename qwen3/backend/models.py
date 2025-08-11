# backend/models.py
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Obra(Base):
    __tablename__ = "obras"

    id = Column(Integer, primary_key=True, index=True)
    id_obra = Column(String, unique=True, index=True)
    nombre = Column(String)
    contratista = Column(String)
    barrio = Column(String)
    fecha_inicio = Column(String)
    fecha_fin_original = Column(String)
    plazo_obra = Column(String)
    lp_cd = Column(String)
    avance_mensual = Column(Float)
    avance_acumulado = Column(Float)
    fecha_avance = Column(String)

    avances = relationship("Avance", back_populates="obra")
    ampliaciones = relationship("Ampliacion", back_populates="obra")

class Avance(Base):
    __tablename__ = "avances"

    id = Column(Integer, primary_key=True, index=True)
    obra_id = Column(Integer, ForeignKey("obras.id"))
    mes = Column(Integer)
    minima = Column(Float)
    maxima = Column(Float)
    esperado = Column(Float)
    real = Column(Float)

    obra = relationship("Obra", back_populates="avances")

class Ampliacion(Base):
    __tablename__ = "ampliaciones"

    id = Column(Integer, primary_key=True, index=True)
    obra_id = Column(Integer, ForeignKey("obras.id"))
    descripcion = Column(Text)

    obra = relationship("Obra", back_populates="ampliaciones")