# backend/cargar_datos.py
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import json
import os

# Crear las tablas si no existen
models.Base.metadata.create_all(bind=engine)

# Función para cargar los datos
def cargar_datos():
    db = SessionLocal()

    # Leer el archivo JSON
    try:
        with open("../frontend/public/data/obras-detalladas.json", "r", encoding="utf-8") as f:
            obras_data = json.load(f)
    except FileNotFoundError:
        print("❌ Error: No se encontró el archivo obras-detalladas.json")
        print("Verifica que el archivo esté en: ../frontend/public/data/obras-detalladas.json")
        return
    except Exception as e:
        print(f"❌ Error al leer el JSON: {e}")
        return

    print(f"✅ Cargando {len(obras_data)} obras en la base de datos...")

    for item in obras_data:
        # Verificar si la obra ya existe
        obra_existente = db.query(models.Obra).filter(models.Obra.id_obra == item["id_obra"]).first()
        if obra_existente:
            print(f"⚠️ Obra ID {item['id_obra']} ya existe. Saltando...")
            continue

        # Crear nueva obra
        obra = models.Obra(
            id_obra=item["id_obra"],
            nombre=item["nombre"],
            contratista=item["contratista"],
            barrio=item["barrio"],
            fecha_inicio=item["fecha_inicio"],
            fecha_fin_original=item["fecha_fin_original"],
            plazo_obra=item["plazo_obra"],
            lp_cd=item["lp_cd"],
            avance_mensual=item["avance_mensual"],
            avance_acumulado=item["avance_acumulado"],
            fecha_avance=item.get("fecha_avance")
        )
        db.add(obra)
        db.flush()  # Para obtener el ID antes de commit

        # Cargar avances
        for avance in item.get("avances", []):
            av = models.Avance(
                obra_id=obra.id,
                mes=avance["mes"],
                minima=avance["minima"],
                maxima=avance["maxima"],
                esperado=avance["esperado"],
                real=avance["real"]
            )
            db.add(av)

        # Cargar ampliaciones
        for ampliacion in item.get("ampliaciones", []):
            amp = models.Ampliacion(
                obra_id=obra.id,
                descripcion=ampliacion
            )
            db.add(amp)

        print(f"✅ Obra ID {item['id_obra']} cargada con {len(item.get('avances', []))} avances y {len(item.get('ampliaciones', []))} ampliaciones")

    # Guardar todos los cambios
    db.commit()
    db.close()
    print("🎉 ¡Todos los datos han sido cargados exitosamente en la base de datos!")

if __name__ == "__main__":
    cargar_datos()