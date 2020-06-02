// service.js

// Se importa la clase de AssistantV2 desde el paquete de ibm-watson
const AssistantV2 = require('ibm-watson/assistant/v2');

// Se importa la clase de IamAuthenticator desde el paquete de ibm-watson
const { IamAuthenticator } = require('ibm-watson/auth');

/* Se instancia el asistente utilizando como autentificador una instancia de IamAuthenticator
pasando como parámetro el api key contenido en el archivo .env */
const assistant = new AssistantV2({
    authenticator: new IamAuthenticator({ apikey: process.env.API_KEY }),
    url: 'https://gateway.watsonplatform.net/assistant/api/',
    version: '2018-09-19'
});

// Se importa la clase de pool del módulo de PostgreSQL de NodeJS
const Pool = require('pg').Pool

// Se instancia una nueva pool con las conexiones
// Con pool nos referimos a un cache de las conexiones de la base de datos para ser reutilizada en los queries cuando sea necesario.
const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'chatbot-test',
    password: '1234',
    port: 5432,
})

/* Función para crear la sesión inicial.
La sesión es importante para que el chatbot sepa distinguir entre distintas conversaciones y usuarios
y de esta manera mantener el contexto del flujo de la conversación */


var sessionId; // Se declara la variable en la que se guardará la sesión

/* La clase AssistantV2 tiene una funciónla cual crea la sesión
DOCUMENTACIÓN: https://cloud.ibm.com/apidocs/assistant/assistant-v2?code=node#create-a-session */
assistant.createSession(
    {
        assistantId: process.env.ASSISTANT_ID || '{assistant_id}',
    },
    function (error, response) {
        if (error) {
            console.log(error);
        } else {
            sessionId = response.result.session_id
            console.log(response.result.session_id);
        }
    }
);

// Función de getMessage
exports.getMessage = function (body) {
    // Se guarda en la base de datos el input del usuario, si lo mandó el bot o no, la fecha y el identificador de la sesión.
    pool.query('INSERT INTO chatlogs (message, frombot, date, sessionid) VALUES ($1, $2, $3, $4)', [body.input, false, new Date().toISOString().slice(0, 19).replace('T', ' '), sessionId], (error, results) => {
        if (error) {
            console.log(error);
            console.error("No se pudo insertar")
        } else {
            console.log("Datos de usuario insertados con éxito");
        }

    })
    // Se regresa una promesa una vez que el asistente regrese al cliente su respuesta.
    return new Promise((resolve, reject) => {
        /*
        Se le envía:
        - ID del asistente, contenido en el .env
        - el ID de la sesión para que el chatbot sepa con quién está hablando
        - El input que el usuario le envió, ejemplo: "Hola", "Estoy buscando una camiseta"
        - OPCIONAL: Una variable de contexto, como se muestra en el ejemplo
        DOCUMENTACIÓN: https://cloud.ibm.com/apidocs/assistant/assistant-v2?code=node#send-user-input-to-assistant-stateful */
        assistant.message(
            {
                assistantId: process.env.ASSISTANT_ID,
                sessionId: sessionId,
                input: { text: body.input },
                context: {
                    skills: {
                        'main skill': {
                            'user_defined': {
                                'priceProduct': '$128.00 pesos'
                            }
                        }
                    }
                }
            },
            function (err, response) {

                // Si hubo error al enviar el mensaje entra aquí
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    // Si no hubo error entra aquí.
                    console.log(body);
                    let conf = 1;
                    let intent = "else"
                    console.log(response.result.output)
                    if (response.result.output.intents.length > 0)
                        conf = response.result.output.intents[0].confidence;
                    
                    // En este query se guarda en la base de datos la respuesta que el chatbot envió de regreso al cliente.
                    pool.query('INSERT INTO chatlogs (message, frombot, date, sessionid, responsetime, confidence, intent) VALUES ($1, $2, $3, $4, $5, $6, $7)', [response.result.output.generic[0].text, true, new Date(response.headers.date).toISOString().slice(0, 19).replace('T', ' '), sessionId, parseFloat(response.headers["x-response-time"].substring(0, response.headers["x-response-time"].indexOf("m"))), conf, intent], (error, results) => {
                        if (error) {
                            reject(error)
                        }
                        resolve(response);

                    })

                }
            }
        );
    });
}

// Función para obtener una sesión, actualmente no está en uso.
exports.getSession = () =>
    new Promise((resolve, reject) => {
        assistant.createSession(
            {
                assistantId: process.env.ASSISTANT_ID || '{assistant_id}',
            },
            function (error, response) {
                if (error) {
                    reject(error)
                } else {
                    resolve(response)
                }
            }
        );
    });

