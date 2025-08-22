import React from "react";
// Se importa 'createRoot' para la nueva API de renderizado de React 18.
import { createRoot } from "react-dom/client";
// Se importa 'BrowserRouter' para habilitar el enrutamiento del lado del cliente.
import { BrowserRouter } from "react-router-dom";
// Se importa el componente principal de la aplicación.
import App from "./App.jsx";

// 1. Punto de entrada de la aplicación.
// 'document.getElementById("root")' obtiene el elemento del DOM donde se montará la aplicación.
// 'createRoot' crea una raíz de renderizado para renderizar la aplicación de React.
createRoot(document.getElementById("root")).render(
  // 2. Componentes de envoltura.
  // `React.StrictMode`: Es un componente de ayuda que detecta problemas potenciales en la aplicación durante el desarrollo.
  <React.StrictMode>
    {/* `BrowserRouter`: Envuelve toda la aplicación para habilitar
        el uso de los hooks y componentes de enrutamiento (como `Link`, `Route`, etc.) */}
    <BrowserRouter>
      {/* El componente principal 'App' que contiene la estructura
          y las rutas de la aplicación se renderiza aquí. */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);