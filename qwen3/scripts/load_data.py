# scripts/load_data.py
# Carga y procesamiento de datos desde Excel: soporta .xls, .xlsx, .xlsm

import pandas as pd
import numpy as np
import json
import os
from pathlib import Path

# -----------------------------
# 1. Cargar el archivo maestro con todas las obras
# -----------------------------
def cargar_obras_maestro():
    try:
        df = pd.read_excel(
            "../data/000 - PLANES Y AMPLIACIONES.xls",
            sheet_name="Hoja1",
            header=3  # Fila 4 del Excel
        )

        # Normalizar nombres de columnas (quitar espacios extra)
        df.columns = [str(col).strip() for col in df.columns]

        # Verificar columnas clave
        columnas_requeridas = [
            'id', 'OBRA', 'EMPRESA', 'BARRIO', 'INICIO', 
            'FINAL', 'PLAZO ORIGINAL', 'AVANCE MENSUAL CONJUNTO', 
            'AVANCE ACUMULADO CONJUNTO'
        ]

        faltantes = [col for col in columnas_requeridas if col not in df.columns]
        if faltantes:
            raise KeyError(f"Faltan columnas: {faltantes}")

        # Seleccionar y limpiar
        df = df[columnas_requeridas].copy()
        df['id'] = df['id'].astype(str).str.strip()
        df['BARRIO'] = df['BARRIO'].fillna('BARRIO VARIOS').astype(str).str.strip().str.upper()

        print(f"✅ Obras maestras cargadas: {len(df)}")
        return df

    except Exception as e:
        print("❌ Error al cargar archivo maestro:", e)
        return pd.DataFrame()

# -----------------------------
# 2. Detectar motor de lectura según extensión
# -----------------------------
def obtener_motor_lectura(ruta):
    ext = Path(ruta).suffix.lower()
    if ext == ".xls":
        return "xlrd"
    elif ext in [".xlsx", ".xlsm"]:
        return "openpyxl"
    else:
        raise ValueError(f"Formato no soportado: {ext}")

# -----------------------------
# 3. Extraer ID desde 'TABLERO CERTIFICADO' -> celda D1
# -----------------------------
def obtener_id_desde_archivo(ruta):
    try:
        engine = obtener_motor_lectura(ruta)
        # Leer solo la fila 1 (índice 0), columna D (índice 3)
        df = pd.read_excel(
            ruta,
            sheet_name="TABLERO CERTIFICADO",
            engine=engine,
            nrows=1,
            header=None
        )
        # Obtener valor de D1 (columna 3, fila 0)
        valor = df.iloc[0, 3]
        
        # Convertir a string y limpiar
        id_str = str(valor).strip()
        
        # Si es 'nan', retornar None
        if id_str.lower() == 'nan':
            print(f"❌ ID no válido (NaN) en {ruta}")
            return None

        # Si es un número con decimal (ej: 1059.0), convertir a entero primero
        try:
            # Intentar convertir a float, luego a int, luego a str
            id_clean = str(int(float(id_str)))
            print(f"✅ ID leído y limpiado: {id_clean} desde {ruta}")
            return id_clean
        except ValueError:
            # Si no es un número, usar como está (por si es un ID alfanumérico)
            print(f"✅ ID alfanumérico detectado: {id_str} desde {ruta}")
            return id_str

    except Exception as e:
        print(f"❌ Error leyendo ID de {ruta}: {e}")
        return None
    
# -----------------------------
# 4. Cargar avances desde 'Comparativa'
# -----------------------------
def cargar_avances_individual(ruta):
    try:
        engine = obtener_motor_lectura(ruta)
        df = pd.read_excel(
            ruta,
            sheet_name="Comparativa",
            skiprows=7,  # Saltar las primeras 6 filas
            usecols="D:H",  # Solo leer columnas D a H
            header=None  # No usar encabezados automáticos
        )

        avances = []
        for _, row in df.iterrows():
            mes = int(row.iloc[0])  # Columna D: MESES
            minima = float(row.iloc[1]) / 100  # Columna E: MINIMA
            maxima = float(row.iloc[2]) / 100  # Columna F: MAXIMA
            esperado = float(row.iloc[3]) / 100  # Columna G: Avance Esperado
            real = float(row.iloc[4]) / 100  # Columna H: % Reales

            avances.append({
                "mes": mes,
                "minima": round(minima, 2),
                "maxima": round(maxima, 2),
                "esperado": round(esperado, 2),
                "real": round(real, 2)
            })

        print(f"✅ Avances extraídos: {len(avances)} registros desde {ruta}")
        return avances

    except Exception as e:
        print(f"❌ Error al cargar avances de {ruta}: {e}")
        return []
# -----------------------------
# 5. Cargar ampliaciones desde 'Ampliaciones'
# -----------------------------
def cargar_ampliaciones_individual(ruta):
    try:
        engine = obtener_motor_lectura(ruta)
        df = pd.read_excel(ruta, sheet_name="Ampliaciones", engine=engine, header=None)

        ampliaciones = []
        for cell in df.iloc[:, 2]:  # Columna C
            if pd.notna(cell) and "Ampliacion" in str(cell):
                ampliaciones.append(str(cell))
                if len(ampliaciones) >= 5:
                    break
        return ampliaciones
    except Exception as e:
        print(f"❌ Error al cargar ampliaciones de {ruta}: {e}")
        return []

# -----------------------------
# 6. Procesar todos los archivos de seguimiento
# -----------------------------
def procesar_archivos_individuales():
    obras_data = {}
    carpeta_data = "../data"

    for archivo in os.listdir(carpeta_data):
        if archivo.startswith("Certificados y Comparativa") and archivo.endswith((".xls", ".xlsx", ".xlsm")):
            ruta = os.path.join(carpeta_data, archivo)
            id_obra = obtener_id_desde_archivo(ruta)

            if id_obra:
                # Convertir ID a string limpio (ej: 1059.0 → 1059)
                id_obra = str(id_obra).split('.')[0]
                avances = cargar_avances_individual(ruta)
                ampliaciones = cargar_ampliaciones_individual(ruta)

                obras_data[id_obra] = {
                    "avances": avances,
                    "ampliaciones": ampliaciones
                }
                print(f"✅ Procesado: Obra ID {id_obra} desde {archivo}")
            else:
                print(f"⚠️ No se encontró ID en {archivo}")

    return obras_data

# -----------------------------
# 7. Integrar todo y guardar JSON
# -----------------------------
def generar_json_final():
    df_obras = cargar_obras_maestro()
    if df_obras.empty:
        print("❌ No se pudo cargar el archivo maestro. Abortando.")
        return

    datos_detalle = procesar_archivos_individuales()

    obras_json = []
    for _, row in df_obras.iterrows():
        id_obra = str(row['id']).split('.')[0]  # Quitar .0 si es decimal
        obra = {
            "id_obra": id_obra,
            "nombre": row['OBRA'],
            "contratista": row['EMPRESA'],
            "barrio": row['BARRIO'],
            "fecha_inicio": str(row['INICIO']),
            "fecha_fin_original": str(row['FINAL']),
            "plazo_obra": row['PLAZO ORIGINAL'],
            "avance_mensual": row['AVANCE MENSUAL CONJUNTO'],
            "avance_acumulado": row['AVANCE ACUMULADO CONJUNTO'],
            "avances": datos_detalle.get(id_obra, {}).get("avances", []),
            "ampliaciones": datos_detalle.get(id_obra, {}).get("ampliaciones", [])
        }
        obras_json.append(obra)

    # Crear carpeta si no existe
    os.makedirs('../frontend/public/data', exist_ok=True)

    # Guardar en JSON
    with open('../frontend/public/data/obras-detalladas.json', 'w', encoding='utf-8') as f:
        json.dump(obras_json, f, indent=2, ensure_ascii=False)

    print(f"\n📁 Datos de {len(obras_json)} obras guardados en /frontend/public/data/obras-detalladas.json")

# -----------------------------
# 8. Ejecutar
# -----------------------------
if __name__ == "__main__":
    generar_json_final()