// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ← Importamos autenticación

// Configuración de Firebase (copiada de la consola)
const firebaseConfig = {
  apiKey: "AIzaSyBXz9WQ-YxSYRlEI3s7ngWcpvBc_p2qnKc",
  authDomain: "ecpm-obras.firebaseapp.com",
  projectId: "ecpm-obras",
  storageBucket: "ecpm-obras.firebasestorage.app",
  messagingSenderId: "717747725398",
  appId: "1:717747725398:web:4b966c28ee946be0e647f7"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa y exporta el servicio de autenticación
export const auth = getAuth(app);

// Exporta la app si necesitas otros servicios en el futuro
export default app;