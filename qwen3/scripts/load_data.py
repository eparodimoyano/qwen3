# scripts/load_data.py
# Carga y procesamiento de datos desde Excel

import pandas as pd
import numpy as np

def cargar_obras():
    """
    Carga el archivo '000 - PLANES Y AMPLIACIONES.xls'
    Extrae: ID, Nombre, Contratista, Barrio, Fechas, Ampliaciones
    """
    try:
        df = pd.read_excel(
            "../data/000 - PLANES Y AMPLIACIONES.xls",
            sheet_name="Planes y ampliaciones de plazo",
            header=2  # Ajustar según estructura real
        )

        # Filtrar columnas útiles
        obras_data = df[[
            'id', 'OBRA', 'Empresa', 'AVANCE MENSUAL CONJUNTO',
            'AVANCE ACUMULADO CONJUNTO', 'FECHA AVANCE', 'INICIO',
            'FINAL', 'PLAZO ORIGINAL', 'ULTIMO FIN APROBADO', 'BARRIO'
        ]].copy()

        # Renombrar para claridad
        obras_data.rename(columns={
            'id': 'id_obra',
            'OBRA': 'nombre',
            'Empresa': 'contratista',
            'BARRIO': 'barrio'
        }, inplace=True)

        # Limpiar barrios
        obras_data['barrio'] = obras_data['barrio'].fillna('BARRIO VARIOS')
        obras_data['barrio'] = obras_data['barrio'].astype(str).str.strip().str.upper()

        # Guardar CSV
        obras_data.to_csv("../data/obras_procesadas.csv", index=False)
        print("✅ Obras cargadas y guardadas en /data/obras_procesadas.csv")
        return obras_data

    except Exception as e:
        print(f"❌ Error al cargar obras: {e}")
        return None

def cargar_avances():
    """
    Carga avances esperado vs real del archivo Aleste S.A.
    """
    try:
        df = pd.read_excel(
            "../data/Certificados y Comparativa Aleste S.A. - INFRA B° 20 - MAZ 29-29-30.xls",
            sheet_name="Comparativa",
            skiprows=1
        )

        # Extraer avances (ajustar columnas según estructura)
        avances = df.iloc[:, [1, 3]].copy()  # Suponiendo: col B = real, col D = esperado
        avances.columns = ['avance_real', 'avance_esperado']

        # Convertir % a float
        avances = avances.apply(lambda x: x.astype(str).str.replace('%', '').astype(float))

        avances.to_csv("../data/avances_procesados.csv", index=False)
        print("✅ Avances guardados en /data/avances_procesados.csv")
        return avances

    except Exception as e:
        print(f"❌ Error al cargar avances: {e}")
        return None

if __name__ == "__main__":
    df_obras = cargar_obras()
    df_avances = cargar_avances()