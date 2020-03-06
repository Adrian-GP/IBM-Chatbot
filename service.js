// service.js
const AssistantV2 = require('ibm-watson/assistant/v2');

const { IamAuthenticator } = require('ibm-watson/auth');

const assistant = new AssistantV2({
    authenticator: new IamAuthenticator({ apikey: process.env.API_KEY }),
    url: 'https://gateway.watsonplatform.net/assistant/api/',
    version: '2018-09-19'
});

var sessionId;
assistant.createSession(
    {
        assistantId: process.env.ASSISTANT_ID || '{assistant_id}',
    },
    function (error, response) {
        if (error) {
            reject(error)
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



exports.getMessage = body =>
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
                    resolve(response);
                }
            }
        );
    });

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

