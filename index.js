// index.js

// Archivo principal del proyecto de NodeJS para el chatbot

// Se manda llamar al módulo dotenv para hacer uso de archivos .env.
require('dotenv').config();

// Se manda llamar a express para inicializar la app.
const express = require('express');

// Inicio de configuración de Body-parser.
const bodyParser = require('body-parser'),
  DEFAULT_BODY_SIZE_LIMIT = 1024 * 1024 * 10,
  DEFAULT_PARAMETER_LIMIT = 10000;


const bodyParserJsonConfig = () => ({
  parameterLimit: DEFAULT_PARAMETER_LIMIT,
  limit: DEFAULT_BODY_SIZE_LIMIT
});
// Fin de configuración de body-parser.

// Se declara una aplicación de la mano con el framework Express.
const app = express();

// Se importan las funciones de ask e initialize desde ./controller.js
const { ask, initialize } = require('./controller');

// Se le indica a express que se utilizará body-parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json(bodyParserJsonConfig()));

// Se definen las rutas que utilizará el servidor.
app.get('/', (req, res) => res.send('Node.JS with PostgreSQL and IBM Chatbot'))

// Ruta ejemplo: http://localhost:3000/ask
// Funcion: ask
// Descripción: Manda un mensaje del usuario al chatbot, y envía el response al cliente.
// Tipo: POST
app.post('/ask', ask)

// Ruta ejemplo: http://localhost:3000/api/session
// Funcion: initialize
// Descripción: Genera una nueva session y lo regresa al cliente.
// Tipo: GET
app.get('/api/session', initialize);


// El servidor se queda esperando requests en el puerto 3000
app.listen(3000, () => console.log('Listening on port 3000'))