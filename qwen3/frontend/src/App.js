// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Barrios from './pages/Barrios';
import ObrasPorBarrio from './pages/ObrasPorBarrio';
import DetalleObra from './pages/DetalleObra';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <>
        <Navbar />
        <div className="pt-4">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/barrios"
              element={
                <ProtectedRoute>
                  <Barrios />
                </ProtectedRoute>
              }
            />
            <Route
              path="/barrio/:barrio"
              element={
                <ProtectedRoute>
                  <ObrasPorBarrio />
                </ProtectedRoute>
              }
            />
            <Route
              path="/obra/:id"
              element={
                <ProtectedRoute>
                  <DetalleObra />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </>
    </Router>
  );
}

export default App;
