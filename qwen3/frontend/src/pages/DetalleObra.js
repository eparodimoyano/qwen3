// src/pages/DetalleObra.js
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DetalleObra() {
  const { id } = useParams(); // ID de la obra
  const [obra, setObra] = useState(null);

  useEffect(() => {
    fetch('/data/obras-detalladas.json')
      .then(res => res.json())
      .then(data => {
        const obraEncontrada = data.find(o => o.id_obra === id);
        setObra(obraEncontrada);
      });
  }, [id]);

  if (!obra) return <div>Cargando...</div>;

  return (
    <div className="container mx-auto px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Detalle de Obra</h1>
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">{obra.nombre}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><strong>ID:</strong> {obra.id_obra}</div>
          <div><strong>Contratista:</strong> {obra.contratista}</div>
          <div><strong>Barrio:</strong> {obra.barrio}</div>
          <div><strong>Inicio:</strong> {obra.fecha_inicio}</div>
          <div><strong>Fin Original:</strong> {obra.fecha_fin_original}</div>
          <div><strong>Plazo:</strong> {obra.plazo_obra}</div>
          <div><strong>Avance Acumulado:</strong> {(obra.avance_acumulado * 100).toFixed(2)}%</div>
          <div><strong>Avance Mensual:</strong> {(obra.avance_mensual * 100).toFixed(2)}%</div>
        </div>
      </div>

      {/* Gráfico de Avances */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h3 className="text-xl font-semibold mb-4">Avance Acumulado: Real vs Esperado</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={obra.avances}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
            <Tooltip formatter={(value) => [(value * 100).toFixed(2) + '%']} />
            <Legend />
            <Bar dataKey="real" fill="#2F855A" name="Real" />
            <Bar dataKey="esperado" fill="#4299E1" name="Esperado" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Ampliaciones */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h3 className="text-xl font-semibold mb-4">Ampliaciones</h3>
        <ul className="list-disc pl-5">
          {obra.ampliaciones.length > 0 ? (
            obra.ampliaciones.map((amp, i) => <li key={i}>{amp}</li>)
          ) : (
            <li>No hay ampliaciones registradas.</li>
          )}
        </ul>
      </div>

      {/* Botones de secciones */}
      <div className="flex space-x-4">
        <button className="bg-primary text-white px-4 py-2 rounded">Aprobaciones</button>
        <button className="bg-primary text-white px-4 py-2 rounded">Plan/Curva</button>
        <button className="bg-primary text-white px-4 py-2 rounded">Avances</button>
        <button className="bg-primary text-white px-4 py-2 rounded">Ampliaciones estudiadas</button>
        <button className="bg-primary text-white px-4 py-2 rounded">Planos</button>
        <button className="bg-primary text-white px-4 py-2 rounded">Pliegos</button>
      </div>

      <button
        onClick={() => window.history.back()}
        className="mt-6 bg-dark text-light px-4 py-2 rounded hover:bg-gray-800"
      >
        ← Volver
      </button>
    </div>
  );
}