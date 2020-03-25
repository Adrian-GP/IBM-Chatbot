const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'chatbot-test',
  password: '1234',
  port: 5432,
})

const createMessage = (request, response) => {
    const { name, email } = request.body
  
    pool.query('INSERT INTO messages (message) VALUES ($1, $2)', [name, email], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Message added with ID: ${result.insertId}`)
    })
  }

  module.exports = {
    createUser
  }