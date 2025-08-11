// src/pages/Barrios.js
import { Link } from 'react-router-dom';

const barrios = [
"BARRIO 20",
"BARRIO VARIOS",
"BARRIO RIVERA IGUAZU",
"BARRIO RODRIGO BUENO",
"BARRIO PLAYON CHACARITA",
"BARRIO ALVARADO",
"BARRIO ORMA",
"BARRIO ZAVALETA",
"BARRIO CARRILLO",
"BARRIO 15",
"BARRIO PADRE RICARDELLI 1-11-14",  
"BARRIO 21-24"

];

export default function Barrios() {
  return (
    <div className="container mx-auto px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Barrios con Obras</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {barrios.map((barrio) => (
          <Link
            key={barrio}
            to={`/barrio/${barrio}`}
            className="bg-white p-6 rounded shadow hover:shadow-lg transition text-center"
          >
            <h2 className="text-xl font-semibold">{barrio}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}