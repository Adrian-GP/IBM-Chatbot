// service.js
const AssistantV2 = require('ibm-watson/assistant/v2');

const { IamAuthenticator } = require('ibm-watson/auth');

const assistant = new AssistantV2({
    authenticator: new IamAuthenticator({ apikey: process.env.API_KEY }),
    url: 'https://gateway.watsonplatform.net/assistant/api/',
    version: '2018-09-19'
});


const Pool = require('pg').Pool
const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'chatbot-test',
    password: '1234',
    port: 5432,
})

var sessionId;
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
/*
const assistant = new watson.AssistantV1({
  username: process.env.WATSON_USERNAME,
  password: process.env.WATSON_PASSWORD,
  url:      process.env.WATSON_URL,
  version:  process.env.WATSON_VERSION
});*/



exports.getMessage = function (body) {
    console.log("HELLO THERE FRIEND");
    pool.query('INSERT INTO chatlogs (message, frombot, date, sessionid) VALUES ($1, $2, $3, $4)', [body.input, false, new Date().toISOString().slice(0, 19).replace('T', ' '), sessionId], (error, results) => {
        if (error) {
            console.log(error);
            console.error("No se pudo insertar")
        } else {
            console.log("Datos de usuario insertados con éxito");
        }

    })
    return new Promise((resolve, reject) => {
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
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(body);
                    let conf = 1;
                    let intent = "else"
                    if (response.result.output.intents.length > 0)
                        conf = response.result.output.intents[0].confidence;

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


/*exports.getMessage = body =>
new Promise((resolve, reject) => {
    assistant.message(
        {
            assistantId: process.env.ASSISTANT_ID,
            sessionId: sessionId,
            input: { text: body.input }
        },
        function (err, response) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log(body);
                console.log(response.result.output.generic[0].text);
                pool.query('INSERT INTO messages (message) VALUES ($1)', [response.result.output.generic[0].text], (error, results) => {
                    if (error) {
                        reject(error)
                    }
                    resolve(response);

                })

            }
        }
    );
});*/

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

