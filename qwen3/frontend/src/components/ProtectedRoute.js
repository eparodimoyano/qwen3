// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';

export default function ProtectedRoute({ children }) {
  const user = auth.currentUser;

  if (!user) {
    // Si no hay usuario, redirige al login
    return <Navigate to="/" />;
  }

  // Si hay usuario, muestra el contenido
  return children;
}