// src/pages/Barrios.js
const barrios = [
  "Barrio 15",
  "Barrio 20",
  "Barrio Orma",
  "Barrio Playón Chacarita",
  "Barrio La Madrid",
  "Barrio Padre Mujica",
  "Barrio Carrillo",
  "Barrio Varios"
];

export default function Barrios() {
  return (
    <div className="container mx-auto px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Barrios con Obras</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {barrios.map((barrio, index) => (
          <div key={index} className="bg-white p-6 rounded shadow hover:shadow-lg transition cursor-pointer">
            <h2 className="text-xl font-semibold">{barrio}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}