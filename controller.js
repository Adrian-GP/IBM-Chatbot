// controller.js
const getMessage = require('./service').getMessage;

exports.ask = (req, res, next) => {
  return getMessage(req.body)
    .then(output => {
      res.status(200);
      res.send(output);
    })
    .catch(next);
};

exports.initialize = (req, res, next) => {
    return getSession()
      .then(output => {
        res.status(200);
        res.send(output);
      })
      .catch(next);
  };