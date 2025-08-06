// src/pages/ObrasPorBarrio.js
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function ObrasPorBarrio() {
  const { barrio } = useParams(); // Ej: "BARRIO 20"
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔍 Cargando obras para barrio:", barrio);

    fetch('/data/obras-detalladas.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("📄 Datos cargados:", data.length, "obras");
        const obrasFiltradas = data.filter(obra => obra.barrio === barrio);
        console.log("✅ Obras filtradas:", obrasFiltradas);
        setObras(obrasFiltradas);
      })
      .catch(err => {
        console.error("❌ Error al cargar obras:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [barrio]);

  if (loading) return <div>Cargando obras para {barrio}...</div>;
  if (error) return <div>Error: {error}</div>;
  if (obras.length === 0) return <div>No se encontraron obras para {barrio}.</div>;

  return (
    <div className="container mx-auto px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Obras - {barrio}</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Obra</th>
              <th className="py-2 px-4 border">LP</th>
            </tr>
          </thead>
          <tbody>
            {obras.map(obra => (
              <tr
                key={obra.id_obra}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/obra/${obra.id_obra}`)}
              >
                <td className="py-2 px-4 border">{obra.id_obra}</td>
                <td className="py-2 px-4 border">{obra.nombre}</td>
                <td className="py-2 px-4 border">{obra.lp_cd || "Sin LP"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={() => navigate('/barrios')}
        className="mt-6 bg-dark text-light px-4 py-2 rounded hover:bg-gray-800"
      >
        ← Volver a Barrios
      </button>
    </div>
  );
}