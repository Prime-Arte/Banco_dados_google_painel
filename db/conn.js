//* este metodos ele reutiliza as query ja utilizadas e tras autonomia e rapidez,
//* ela facilita a conexao e fechas as rotas nao utilizadas

const mysql = require('mysql') // puxamos os dados do banco
require('dotenv').config()

const pool = mysql.createPool({ // toda a conexao com o banco de dados
  connectionLimit: 50, // mantemos 10 conexões
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE

})



module.exports = pool
