// src/pages/DetalleObra.js

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

export default function DetalleObra() {
  const { id } = useParams();
  const [obra, setObra] = useState(null);

  useEffect(() => {
    fetch('/data/obras-detalladas.json')
      .then(res => res.json())
      .then(data => {
        const obraEncontrada = data.find(o => o.id_obra === id);
        setObra(obraEncontrada);
      });
  }, [id]);

  if (!obra) return <div className="p-8">Cargando detalle de obra...</div>;

  // Datos para el gráfico (solo si hay avances)
  const datosGrafico = obra.avances.length > 0 ? obra.avances : [];

  return (
    <div className="container mx-auto px-8 py-8">
      {/* Encabezado */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{obra.nombre}</h1>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <strong>ID:</strong> {obra.id_obra}<br />
            <strong>Barrio:</strong> {obra.barrio}
          </div>
          <div>
            <strong>Contratista:</strong> {obra.contratista}<br />
            <strong>LP/CD:</strong> {obra.lp_cd || "No asignado"}
          </div>
          <div>
            <strong>Fecha de Inicio:</strong> {obra.fecha_inicio?.split(' ')[0]}<br />
            <strong>Fecha de Fin Contractual:</strong> {obra.fecha_fin_original?.split(' ')[0]}
          </div>
          <div>
            <strong>Avance Acumulado:</strong> {(obra.avance_acumulado * 100).toFixed(2)}% <br />
            <strong>Avance Mensual:</strong> {(obra.avance_mensual * 100).toFixed(2)}% <br />
            <strong>Fecha de Última Medición:</strong> {obra.fecha_avance}
          </div>
        </div>
      </div>

    {/* Gráfico de Avances */}
{datosGrafico.length > 0 && (
  <div className="bg-white p-6 rounded shadow mb-8">
    <h2 className="text-2xl font-semibold mb-4">
      COMPARATIVA ENTRE PLAN DE TRABAJOS OFERTA, ENVOLVENTES DE PLIEGO Y AVANCE REAL
    </h2>
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={datosGrafico} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="mes"
          label={{ value: 'Meses', position: 'insideBottomRight', offset: -5 }}
          tickFormatter={(value) => value.toFixed(0)}
        />
        <YAxis tickFormatter={(value) => `${(value * 100).toFixed(2)}%`} />
        <Tooltip formatter={(value) => [(value * 100).toFixed(2) + '%']} />
        <Legend />

        {/* Envolvente Mínima */}
        <Line
          type="monotone"
          dataKey="minima"
          stroke="#2F855A"
          name="Mínima"
          dot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
          activeDot={{ r: 8, stroke: '#fff', strokeWidth: 3 }}
          strokeDasharray="3 3"
        />

        {/* Envolvente Máxima */}
        <Line
          type="monotone"
          dataKey="maxima"
          stroke="#2F855A"
          name="Máxima"
          dot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
          activeDot={{ r: 8, stroke: '#fff', strokeWidth: 3 }}
          strokeDasharray="3 3"
        />

        {/* Esperado */}
        <Line
          type="monotone"
          dataKey="esperado"
          stroke="#4299E1"
          name="Esperado"
          dot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
          activeDot={{ r: 8, stroke: '#fff', strokeWidth: 3 }}
        />

        {/* Real con etiquetas en negro */}
        <Line
          type="monotone"
          dataKey="real"
          stroke="#FF5733"
          name="Real"
          dot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
          activeDot={{ r: 8, stroke: '#fff', strokeWidth: 3 }}
        >
          <LabelList
            dataKey="real"
            content={({ x, y, value }) => (
              <text
                x={x}
                y={y}
                dx={-10}
                dy={-5}
                fill="black" // Color del texto en negro
              >
                {`${(value * 100).toFixed(2)}%`}
              </text>
            )}
          />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  </div>
)}


      {/* Ampliaciones */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">Ampliaciones</h2>
        <ul className="list-disc pl-5 space-y-2">
          {obra.ampliaciones.length > 0 ? (
            obra.ampliaciones.map((amp, i) => <li key={i} className="text-gray-700">{amp}</li>)
          ) : (
            <li className="text-gray-500">No hay ampliaciones registradas.</li>
          )}
        </ul>
      </div>

      {/* Secciones */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-6">Documentos y Secciones</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button className="bg-primary text-white py-3 px-4 rounded hover:bg-green-700 transition">
            Aprobaciones
          </button>
          <button className="bg-primary text-white py-3 px-4 rounded hover:bg-green-700 transition">
            Plan/Curva
          </button>
          <button className="bg-primary text-white py-3 px-4 rounded hover:bg-green-700 transition">
            Avances
          </button>
          <button className="bg-primary text-white py-3 px-4 rounded hover:bg-green-700 transition">
            Ampliaciones estudiadas
          </button>
          <button className="bg-primary text-white py-3 px-4 rounded hover:bg-green-700 transition">
            Planos
          </button>
          <button className="bg-primary text-white py-3 px-4 rounded hover:bg-green-700 transition">
            Pliegos
          </button>
        </div>
      </div>

      {/* Botón volver */}
      <button
        onClick={() => window.history.back()}
        className="mt-6 bg-dark text-light px-6 py-2 rounded hover:bg-gray-800"
      >
        ← Volver
      </button>
    </div>
  );
}