const util = require('util')
const mysql = require('mysql')


const pool = mysql.createPool({
  connectionLimit: 50,
  host: 'dx-chatgpt.ceczuripokti.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'dartexon',
  database: 'dx-chatgpt'
})

// Ping database to check for common exception errors.
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Database connection was closed.')
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
        console.log('Database has too many connections.')
    }
    if (err.code === 'ECONNREFUSED') {
        console.log('Database connection was refused.')
    }
  }

  if (connection) connection.release()

  return
})

// Promisify for Node.js async/await.
pool.query = util.promisify(pool.query)

module.exports = pool