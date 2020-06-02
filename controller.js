// controller.js

// Se importa la función de getMessage de ./service.js
const getMessage = require('./service').getMessage;

// Se exporta a ./index.js la función de ask.
exports.ask = (req, res, next) => {
  return getMessage(req.body)
    .then(output => {
      res.status(200);
      res.send(output);
    })
    .catch(next);
};

// Se exporta a ./index.js la función de initialize.
// No tiene funcionamiento por ahora.
exports.initialize = (req, res, next) => {
    return getSession()
      .then(output => {
        res.status(200);
        res.send(output);
      })
      .catch(next);
  };