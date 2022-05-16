const express = require('express');
const exphbs = require('express-handlebars');
const poll = require('./db/conn') // conectamos com o arquivo
const app = express();
const cors = require('cors')
const authorization = require('./authorization')
require('dotenv').config()
app.use(cors());
app.use(
  express.urlencoded({ // para pegarmos o bory

    extended: true,
  })
)

app.use(express.json()) // para pegar o bory em JSON
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.get('/', (req, res) => { // para renderizar a home;
  res.render('home')

})

//Todo - rotas============================

// //*DROP Banco de dados
// app.post('/DROP/DATABASE', authorization, async (req, res, next) => {

//   const drop_dataBase = req.body.drop_dataBase;

//   const sql = `DROP DATABASE ${drop_dataBase}`

//   poll.getConnection((error, conn) => {
//     if (error) {
//       return res.status(500).send({
//         error: error
//       })
//     }
//     conn.query(sql, (error, result, fields) => {
//       if (error) {
//         return res.status(500).send({
//           error: error
//         })
//       }
//       return res.status(200).send({
//         response: result
//       })
//     })
//   })
//   res.redirect('/')
//   next()
// });

app.post('/CREATE/TABLE', async (req, res, next) => {

  const table = req.body.table;
  console.log(table);
  const sql = `CREATE TABLE ${table} (ID INT PRIMARY KEY NOT NULL AUTO_INCREMENT);`

  poll.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error
      })
    }
    conn.query(sql, (error, result, fields) => {
      if (error) {
        return res.status(500).send({
          error: error
        })
      }
      return res.status(200).send({
        response: result
      })
    })

  })


})

//*Drop Tabela
app.post('/DROP/TABLE', async (req, res, next) => {

  const database = req.body.database;

  const sql = `DROP TABLE ${database}`

  poll.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error
      })
    }
    conn.query(sql, (error, result, fields) => {
      if (error) {
        return res.status(500).send({
          error: error
        })
      }
      return res.status(200).send({
        response: result
      })
    })
  })


});

//*Inserir coluna
app.post('/ADD/COLUN', async (req, res, next) => {

  const table = req.body.table;
  const colun = req.body.colun;
  const tipo_dado = req.body.tipo_dado;

  const sql = `ALTER TABLE ${table} ADD ${colun} ${tipo_dado}`

  poll.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error
      })
    }
    conn.query(sql, (error, result, fields) => {
      if (error) {
        return res.status(500).send({
          error: error
        })
      }
      return res.status(200).send({
        response: result
      })
    })
  })


});

//*Apagar coluna
app.post('/DROP/COLUN', async (req, res, next) => {

  const table = req.body.table;
  const colun = req.body.colun;

  const sql = `ALTER TABLE ${table} DROP COLUMN ${colun}`

  poll.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error
      })
    }
    conn.query(sql, (error, result, fields) => {
      if (error) {
        return res.status(500).send({
          error: error
        })
      }
      return res.status(200).send({
        response: result
      })
    })
  })


});

//*Modificar Nome da coluna
app.post('/MODF/COLUN', async (req, res, next) => {

  const table = req.body.table;
  const colun_modifica = req.body.colun_modifica;
  const nova_colun = req.body.nova_colun;
  const tipo_dado = req.body.tipo_dado;

  const sql = `ALTER TABLE ${table} CHANGE ${colun_modifica} ${nova_colun} ${tipo_dado};`

  poll.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error
      })
    }
    conn.query(sql, (error, result, fields) => {
      if (error) {
        return res.status(500).send({
          error: error
        })
      }
      return res.status(200).send({
        response: result
      })
    })
  })

});





//* resgatando dados especificos
app.get('/BUSCAR/ESPECF/', (req, res) => {

  const table = req.query['table']
  const colun = req.query['colun']
  const colun_especifico = req.query['colun_especifico']
  const dado = req.query['dado']

  const sql = `SELECT ${colun} FROM ${table} WHERE ${colun_especifico} = '${dado}'`


  poll.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error
      })
    }
    conn.query(sql, (error, result, fields) => {
      if (error) {
        return res.status(500).send({
          error: error
        })
      }
      return res.status(200).send({
        response: result
      })
    })
  })

})

//todo - Rotas principais


//* resgatando dados todos dados da coluna
app.get('/BUSCAR/', (req, res) => {

  const table = req.query['table']
  const sql = `SELECT * FROM ${table}`

  poll.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error
      })
    }
    conn.query(sql, (error, result, fields) => {
      if (error) {
        return res.status(500).send({
          error: error
        })
      }
      return res.status(200).send({
        response: result
      })
    })
  })
})

//*Input de dados
app.post('/INPUT/', (req, res, next) => {

  const table = req.body.table;
  const {
    colun1,
    colun2,
    colun3,
    colun4
  } = req.body;

  const {
    dado_input1,
    dado_input2,
    dado_input3,
    dado_input4
  } = req.body;

  const sql = `INSERT INTO ${table} (${colun1},${colun2},${colun3},${colun4}) VALUE ('${dado_input1}','${dado_input2}','${dado_input3}','${dado_input4}')`

  poll.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error
      })
    }
    conn.query(sql, (error, result, fields) => {
      if (error) {
        return res.status(500).send({
          error: error
        })
      }
      return res.status(200).send({
        response: result
      })
    })
  })

})

//*Voltar descrição da tabela
app.get('/DESC/TABLE', function (req, res) {

  const table = req.query['table']
  console.log(table)

  const sql = `DESC ${table}`

  poll.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error
      })
    }
    conn.query(sql, (error, result, fields) => {
      if (error) {
        return res.status(500).send({
          error: error
        })
      }
      return res.status(200).send({
        response: result
      })
    })
  })
})

app.delete('/DELETE/',
  function (req, res) {

    const table = req.body.table
    const {
      colun1,

    } = req.body;

    const {
      dado_input1,

    } = req.body;

    const sql = `DELETE FROM ${table} WHERE ${colun1}='${dado_input1}'`

    poll.getConnection((error, conn) => {
      if (error) {
        return res.status(500).send({
          error: error
        })
      }
      conn.query(sql, (error, result, fields) => {
        if (error) {
          return res.status(500).send({
            error: error
          })
        }
        return res.status(200).send({
          response: result
        })
      })
    })
  })

app.patch('/UPDATE/',
  function (req, res) {

    const table = req.body.table
    const {
      coluna_chave,
      dado_chave
    } = req.body;
    const {
      dado_ser_modification,
    } = req.body;

    const sql = `UPDATE ${table} SET ${coluna_chave} = '${dado_ser_modification}' WHERE ${coluna_chave} = '${dado_chave}';`

    poll.getConnection((error, conn) => {
      if (error) {
        return res.status(500).send({
          error: error
        })
      }
      conn.query(sql, (error, result, fields) => {
        if (error) {
          return res.status(500).send({
            error: error
          })
        }
        return res.status(200).send({
          response: result
        })
      })
    })
  })






app.listen(process.env.PORT_HTTP, () => {
  console.log("Servidor iniciado na porta")
});