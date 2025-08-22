import axios from 'axios';
import Cookies from 'js-cookie';

// 1. Creación de una instancia de Axios

// Se crea una instancia personalizada de Axios para la comunicación con la API.
// Esto permite centralizar la configuración (como la URL base) y los interceptores,
// evitando que tengas que repetir la misma configuración en cada llamada.
const client = axios.create({
  // Se define la URL base de tu API de Django.
  // Todas las peticiones hechas con 'client' usarán esta URL como prefijo.
  baseURL: 'http://127.0.0.1:8000/api', 
});

// 2. Interceptor de solicitudes (Request Interceptor)

// Esta es una función que se ejecuta antes de que cada petición HTTP sea enviada.
// Es el lugar ideal para modificar la configuración de la petición, como añadir headers
// de seguridad o de autenticación.
client.interceptors.request.use(function (config) {
  // Se obtiene el token CSRF de la cookie que Django envía al navegador.
  // La librería 'js-cookie' simplifica el acceso a las cookies.
  const csrfToken = Cookies.get('csrftoken');
  
  // Se verifica si el token existe.
  if (csrfToken) {
    // Si el token está presente, se añade al encabezado de la petición.
    // El nombre del encabezado ('X-CSRFToken') es un estándar que Django
    // espera para validar la autenticidad de la solicitud.
    config.headers['X-CSRFToken'] = csrfToken;
  }
  
  // Se retorna la configuración modificada para que Axios continúe con la petición.
  return config;
}, function (error) {
  // Si ocurre un error al procesar la petición (por ejemplo, un error de red),
  // se rechaza la promesa, permitiendo que el error sea capturado
  // por los bloques 'catch' en el código de la aplicación.
  return Promise.reject(error);
});

// 3. Interceptor de respuestas (Response Interceptor)
// Esta función se ejecuta cada vez que se recibe una respuesta de la API,
// justo antes de que el resultado se pase a la función que hizo la llamada.
client.interceptors.response.use(
  // Si la respuesta es exitosa (código 2xx), se retorna directamente el cuerpo
  // de la respuesta (res.data). Esto simplifica el código de la aplicación,
  // ya que no tendrás que usar '.data' en cada respuesta.
  (res) => res.data,
  
  // Si la respuesta es un error (código 4xx o 5xx), se rechaza la promesa
  // con el objeto de error. Esto permite que el error sea manejado
  // de forma centralizada en los bloques 'catch' del código de la aplicación.
  (err) => Promise.reject(err)
);

// 4. Exporta la instancia de axios configurada para usarla en otros módulos (como api/tickets.js)
export default client;