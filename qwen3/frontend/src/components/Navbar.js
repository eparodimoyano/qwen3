// src/components/Navbar.js
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-dark text-light p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="/images/logo.png" alt="Logo" className="h-20" />
          <span className="text-xl font-bold">Gestión de Obras</span>
        </div>
        <div className="space-x-6">
          <Link to="/barrios" className="hover:text-primary transition">Inicio</Link>
          <Link to="/barrios" className="hover:text-primary transition">Barrios</Link>
          <button className="bg-primary hover:bg-green-700 px-4 py-2 rounded transition">Cerrar sesión</button>
        </div>
      </div>
    </nav>
  );
}