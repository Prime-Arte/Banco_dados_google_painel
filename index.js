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

//Todo - rotas===========================

// //*DROP Banco de dados
app.post('/CRIAR/DATABASE', authorization, async (req, res, next) => {

  const criar_dataBase = req.body.criar_dataBase;

  const sql = `CREATE DATABASE ${criar_dataBase}`

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

app.post('/DROP/DATABASE', authorization, async (req, res, next) => {

  const drop_dataBase = req.body.drop_dataBase;

  const sql = `DROP DATABASE ${drop_dataBase}`

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
      return res.status(200)

    })
  })
});


app.post('/CREATE/TABLE', async (req, res, next) => {

  const database = req.body.database
  const table = req.body.table;
  console.log(table);
  const sql = `CREATE TABLE ${database}.${table} (ID INT PRIMARY KEY NOT NULL AUTO_INCREMENT);`

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
app.post('/DROP/TABLE', authorization, async (req, res, next) => {

  const database = req.body.database
  const table = req.body.table;

  const sql = `DROP TABLE ${database}.${table}`

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

  const database = req.body.database
  const table = req.body.table;
  const colun = req.body.colun;
  const tipo_dado = req.body.tipo_dado;

  const sql = `ALTER TABLE ${database}.${table} ADD (${colun} ${tipo_dado})`

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

  const database = req.body.database
  const table = req.body.table;
  const colun = req.body.colun;

  const sql = `ALTER TABLE ${database}.${table} DROP COLUMN ${colun}`

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

  const database = req.body.database
  const table = req.body.table;
  const colun_modifica = req.body.colun_modifica;
  const nova_colun = req.body.nova_colun;
  const tipo_dado = req.body.tipo_dado;

  const sql = `ALTER TABLE ${database}.${table} CHANGE ${colun_modifica} ${nova_colun} ${tipo_dado};`

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

  const database = req.query["database"]
  const table = req.query["table"]
  const colun = req.query["colun"]
  const colun_especifico = req.query["colun_especifico"]
  const dado = req.query["dado"]

  const sql = `SELECT ${database}.${table} FROM ${colun} WHERE ${colun_especifico} = '${dado}'`


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

  const database = req.query["database"]
  const table = req.query["table"]
  const sql = `SELECT * FROM ${database}.${table}`

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
      let dados_response = []
      for (var i = 0; i < result.length; ++i) {
        dados_response.push(
          Object.entries(result[i])

        )
      }
      return res.status(200).send({
        response: dados_response,

      })
    })
  })
})
app.get('/BUSCA/FILTRO', (req, res) => {

  const database = req.query["database"]
  const table = req.query["table"]
  const data = req.query["data"]


  const sql = `SELECT * FROM ${database}.${table} WHERE ID = ${data};`

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
        response: result,

      })
    })
  })
})

//* resgatando dados todos dados da coluna
app.get('/BUSCAR/COLUN', (req, res) => {

  const database = req.query["database"]
  const table = req.query["table"]
  const colun = req.query["colun"]

  const sql = `SELECT ${colun} FROM ${database}.${table};`

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
      let dados_response = []
      for (var i = 0; i < result.length; ++i) {

        dados_response.push(
          Object.values(result[i])
        )
      }

      return res.status(200).send(
        dados_response
      )
    })
  })
})

//*Input de dados
app.post('/INPUT/', (req, res, next) => {

  const database = req.body.database;
  const table = req.body.table;
  const colun = req.body.colun;
  // const b = colun.replace(/'/g, '');
  const data = req.body.data;
  //const c = data.replace(/'/g, '');
  console.log(colun, data)

  const sql = `INSERT INTO ${database}.${table} (${colun}) VALUE ('${data}')`
  console.log(sql)


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

//*Voltar descri????o da tabela
app.get('/DESC/TABLE/', function (req, res) {

  const database = req.query["database"]
  const table = req.query["table"]
  console.log(table)



  const sql = `DESC ${database}.${table}`

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
        response: result,
        data: table,
        database: database
      })
    })
  })
})

app.delete('/DELETE/',
  function (req, res) {

    const database = req.body.database
    const table = req.body.table
    const {
      colun,
      id,
      data

    } = req.body;


    const sql = `DELETE FROM ${database}.${table} WHERE ${colun}='${data}' AND ID = ${id}`;
    console.log(sql)
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

    const database = req.body.database
    const table = req.body.table
    const {
      dado_chave,
      colun,
      dado_ser_modification
    } = req.body;

    const sql = `UPDATE ${database}.${table} SET  ${colun}='${dado_ser_modification}' WHERE ID='${dado_chave}';`
    console.log(sql)
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


app.get('/TABELAS',
  function (req, res) {

    const database = req.query["database"]
    console.log(database)
    let sql = `SHOW TABLES IN ${database};`


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
        let dados_response = []
        for (var i = 0; i < result.length; ++i) {

          dados_response.push({
            table: Object.values(result[i])[0]
          })
        }
        return res.status(200).send(
          dados_response
        )
      })
    })
  })

app.get('/BANCOS',
  function (req, res) {

    let sql = 'SHOW schemas;'

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

app.post('/RENAME/TABLE',
  function (req, res) {

    const database = req.body.database
    const antiga_table = req.body.antiga_table
    const nova_table = req.body.nova_table

    let sql = `RENAME TABLE ${database}.${antiga_table} TO ${database}.${nova_table};`

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


app.patch('/updata/JSON', function (req, res) {

  const data_base = `${req.body.dados[0].base.database}.${req.body.dados[0].base.table}`

  const data = req.body.dados[0].valor
  const seletor = (Object.entries(data).length / 2 - 1)
  const up = Object.entries(data)
  console.log(up)

  poll.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error
      })
    } else {

      switch (seletor) {
        case 1:

          conn.query(`UPDATE ${data_base} SET ${up[2][1]}='${up[3][1]}' WHERE ID='${up[1][1]}'`, (error, result) => {

            if (error) {
              return res.status(500).send({
                error: error
              })
            }
            return res.status(200).send({
              response: result
            })
          })
          break;
        case 2:

          conn.query(`UPDATE ${data_base} SET ${up[2][1]}='${up[3][1]}',${up[4][1]}='${up[5][1]}' WHERE ID='${up[1][1]}'`, (error, result) => {
            if (error) {
              return res.status(500).send({
                error: error
              })
            }
            return res.status(200).send({
              response: result
            })
          })

          break;
        case 3:
          conn.query(`UPDATE ${data_base} SET ${up[2][1]}='${up[3][1]}',${up[4][1]}='${up[5][1]}', ${up[6][1]}='${up[7][1]}' WHERE ID='${up[1][1]}'`, (error, result) => {
            if (error) {
              return res.status(500).send({
                error: error
              })
            }
            return res.status(200).send({
              response: result
            })
          })

          break;
        case 4:

          conn.query(`UPDATE ${data_base} SET ${up[2][1]}='${up[3][1]}',${up[4][1]}='${up[5][1]}', ${up[6][1]}='${up[7][1]}' ,${up[8][1]}='${up[9][1]}' WHERE ID='${up[1][1]}'`, (error, result) => {
            if (error) {
              return res.status(500).send({
                error: error
              })
            }
            return res.status(200).send({
              response: result
            })
          })
          break;
        case 5:
          conn.query(`UPDATE ${data_base} SET ${up[2][1]}='${up[3][1]}',${up[4][1]}='${up[5][1]}', ${up[6][1]}='${up[7][1]}' ,${up[8][1]}='${up[9][1]},${up[10][1]}='${up[11][1]}' WHERE ID='${up[1][1]}'`, (error, result) => {
            if (error) {
              return res.status(500).send({
                error: error
              })
            }
            return res.status(200).send({
              response: result
            })
          })

          break;
        case 6:
          conn.query(`UPDATE ${data_base} SET ${up[2][1]}='${up[3][1]}',${up[4][1]}='${up[5][1]}', ${up[6][1]}='${up[7][1]}' ,${up[8][1]}='${up[9][1]},${up[10][1]}='${up[11][1]},${up[12][1]}='${up[13][1]}' WHERE ID='${up[1][1]}'`, (error, result) => {
            if (error) {
              return res.status(500).send({
                error: error
              })
            }
            return res.status(200).send({
              response: result
            })
          })

          break;
        case 7:
          conn.query(`UPDATE ${data_base} SET ${up[2][1]}='${up[3][1]}',${up[4][1]}='${up[5][1]}', ${up[6][1]}='${up[7][1]}' ,${up[8][1]}='${up[9][1]}',${up[10][1]}='${up[11][1]}',${up[12][1]}='${up[13][1]}',${up[14][1]}='${up[15][1]}' WHERE ID='${up[1][1]}'`, (error, result) => {
            if (error) {
              return res.status(500).send({
                error: error
              })
            }
            return res.status(200).send({
              response: result
            })
          })

          break;

        case 8:

          conn.query(`UPDATE ${data_base} SET ${up[2][1]}='${up[3][1]}',${up[4][1]}='${up[5][1]}', ${up[6][1]}='${up[7][1]}' ,${up[8][1]}='${up[9][1]}',${up[10][1]}='${up[11][1]}',${up[12][1]}'='${up[13][1]}',${up[14][1]}='${up[15][1]}',${up[16][1]}='${up[17][1]}' WHERE ID='${up[1][1]}'`, (error, result) => {
            if (error) {
              return res.status(500).send({
                error: error
              })
            }
            return res.status(200).send({
              response: result
            })
          })

          break;
        case 9:

          conn.query(`UPDATE ${data_base} SET ${up[2][1]}='${up[3][1]}',${up[4][1]}='${up[5][1]}', ${up[6][1]}='${up[7][1]}' ,${up[8][1]}='${up[9][1]}',${up[10][1]}='${up[11][1]}',${up[12][1]}='${up[13][1]}',${up[14][1]}='${up[15][1]}',${up[16][1]}='${up[17][1]}',${up[18][1]}='${up[19][1]}' WHERE ID='${up[1][1]}'`, (error, result) => {
            if (error) {
              return res.status(500).send({
                error: error
              })
            }
            return res.status(200).send({
              response: result
            })
          })

          break;
        case 10:

          conn.query(`UPDATE ${data_base} SET ${up[2][1]}='${up[3][1]}',${up[4][1]}='${up[5][1]}', ${up[6][1]}='${up[7][1]}' ,${up[8][1]}='${up[9][1]}',${up[10][1]}='${up[11][1]}',${up[12][1]}='${up[13][1]}',${up[14][1]}='${up[15][1]}',${up[16][1]}='${up[17][1]}',${up[18][1]}='${up[19][1]}',${up[20][1]}='${up[21][1]}' WHERE ID='${up[1][1]}'`, (error, result) => {
            if (error) {
              return res.status(500).send({
                error: error
              })
            }
            return res.status(200).send({
              response: result
            })
          })

          break;
        case 11:

          conn.query(`UPDATE ${data_base} SET ${up[2][1]}='${up[3][1]}',${up[4][1]}='${up[5][1]}', ${up[6][1]}='${up[7][1]}' ,${up[8][1]}='${up[9][1]}',${up[10][1]}='${up[11][1]}',${up[12][1]}='${up[13][1]}',${up[14][1]}='${up[15][1]}',${up[16][1]}='${up[17][1]}',${up[18][1]}='${up[19][1]}',${up[20][1]}='${up[21][1]}',${up[22][1]}='${up[23
          ][1]}' WHERE ID='${up[1][1]}'`, (error, result) => {
            if (error) {
              return res.status(500).send({
                error: error
              })
            }
            return res.status(200).send({
              response: result
            })
          })

          break;
        case 12:

          conn.query(`UPDATE ${data_base} SET ${up[2][1]}='${up[3][1]}',${up[4][1]}='${up[5][1]}', ${up[6][1]}='${up[7][1]}' ,${up[8][1]}='${up[9][1]}',${up[10][1]}='${up[11][1]}',${up[12][1]}='${up[13][1]}',${up[14][1]}='${up[15][1]}',${up[16][1]}='${up[17][1]}',${up[18][1]}='${up[19][1]}',${up[20][1]}='${up[21][1]}',${up[22][1]}='${up[23][1]}',${up[24][1]}='${up[25][1]}' WHERE ID='${up[1][1]}'`, (error, result) => {
            if (error) {
              return res.status(500).send({
                error: error
              })
            }
            return res.status(200).send({
              response: result
            })
          })

          break;
        case 13:

          conn.query(`UPDATE ${data_base} SET ${up[2][1]}='${up[3][1]}',${up[4][1]}='${up[5][1]}', ${up[6][1]}='${up[7][1]}' ,${up[8][1]}='${up[9][1]}',${up[10][1]}='${up[11][1]}',${up[12][1]}='${up[13][1]}',${up[14][1]}='${up[15][1]}',${up[16][1]}='${up[17][1]}',${up[18][1]}='${up[19][1]}',${up[20][1]}='${up[21][1]}',${up[22][1]}='${up[23][1]}',${up[24][1]}='${up[25][1]}',${up[26][1]}='${up[27][1]}' WHERE ID='${up[1][1]}'`, (error, result) => {
            if (error) {
              return res.status(500).send({
                error: error
              })
            }
            return res.status(200).send({
              response: result
            })
          })

          break;
        case 14:

          conn.query(`UPDATE ${data_base} SET ${up[2][1]}='${up[3][1]}',${up[4][1]}='${up[5][1]}', ${up[6][1]}='${up[7][1]}' ,${up[8][1]}='${up[9][1]}',${up[10][1]}='${up[11][1]}',${up[12][1]}='${up[13][1]}',${up[14][1]}='${up[15][1]}',${up[16][1]}='${up[17][1]}',${up[18][1]}='${up[19][1]}',${up[20][1]}='${up[21][1]}',${up[22][1]}='${up[23][1]}',${up[24][1]}='${up[25][1]}',${up[26][1]}='${up[27][1]}',${up[28][1]}='${up[29][1]}' WHERE ID='${up[1][1]}'`, (error, result) => {
            if (error) {
              return res.status(500).send({
                error: error
              })
            }
            return res.status(200).send({
              response: result
            })
          })

          break;
        case 15:

          conn.query(`UPDATE ${data_base} SET ${up[2][1]}='${up[3][1]}',${up[4][1]}='${up[5][1]}', ${up[6][1]}='${up[7][1]}' ,${up[8][1]}='${up[9][1]}',${up[10][1]}='${up[11][1]}',${up[12][1]}='${up[13][1]}',${up[14][1]}='${up[15][1]}',${up[16][1]}='${up[17][1]}',${up[18][1]}='${up[19][1]}',${up[20][1]}='${up[21][1]}',${up[22][1]}='${up[23][1]}',${up[24][1]}='${up[25][1]}',${up[26][1]}='${up[27][1]}',${up[28][1]}='${up[29][1]}',${up[30][1]}='${up[31][1]}' WHERE ID='${up[1][1]}'`, (error, result) => {
            if (error) {
              return res.status(500).send({
                error: error
              })
            }
            return res.status(200).send({
              response: result
            })
          })
        case 16:

          conn.query(`UPDATE ${data_base} SET ${up[2][1]}='${up[3][1]}',${up[4][1]}='${up[5][1]}', ${up[6][1]}='${up[7][1]}' ,${up[8][1]}='${up[9][1]}',${up[10][1]}='${up[11][1]}',${up[12][1]}='${up[13][1]}',${up[14][1]}='${up[15][1]}',${up[16][1]}='${up[17][1]}',${up[18][1]}='${up[19][1]}',${up[20][1]}='${up[21][1]}',${up[22][1]}='${up[23][1]}',${up[24][1]}='${up[25][1]}',${up[26][1]}='${up[27][1]}',${up[28][1]}='${up[29][1]}',${up[30][1]}='${up[31][1]}',${up[32][1]}='${up[33][1]}' WHERE ID='${up[1][1]}'`, (error, result) => {
            if (error) {
              return res.status(500).send({
                error: error
              })
            }
            return res.status(200).send({
              response: result
            })
          })

          break;

        case 17:

          conn.query(`UPDATE ${data_base} SET ${up[2][1]}='${up[3][1]}',${up[4][1]}='${up[5][1]}', ${up[6][1]}='${up[7][1]}' ,${up[8][1]}='${up[9][1]}',${up[10][1]}='${up[11][1]}',${up[12][1]}='${up[13][1]}',${up[14][1]}='${up[15][1]}',${up[16][1]}='${up[17][1]}',${up[18][1]}='${up[19][1]}',${up[20][1]}='${up[21][1]}',${up[22][1]}='${up[23][1]}',${up[24][1]}='${up[25][1]}',${up[26][1]}='${up[27][1]}',${up[28][1]}='${up[29][1]}',${up[30][1]}='${up[31][1]}',${up[32][1]}='${up[33][1]}',${up[34][1]}='${up[35][1]}' WHERE ID='${up[1][1]}'`, (error, result) => {
            if (error) {
              return res.status(500).send({
                error: error
              })
            }
            return res.status(200).send({
              response: result
            })
          })

          break;
        case 18:

          conn.query(`UPDATE ${data_base} SET ${up[2][1]}='${up[3][1]}',${up[4][1]}='${up[5][1]}', ${up[6][1]}='${up[7][1]}' ,${up[8][1]}='${up[9][1]}',${up[10][1]}='${up[11][1]}',${up[12][1]}='${up[13][1]}',${up[14][1]}='${up[15][1]}',${up[16][1]}='${up[17][1]}',${up[18][1]}='${up[19][1]}',${up[20][1]}='${up[21][1]}',${up[22][1]}='${up[23][1]}',${up[24][1]}='${up[25][1]}',${up[26][1]}='${up[27][1]}',${up[28][1]}='${up[29][1]}',${up[30][1]}='${up[31][1]}',${up[32][1]}='${up[33][1]}',${up[34][1]}='${up[35][1]}',${up[36][1]}='${up[37][1]}' WHERE ID='${up[1][1]}'`, (error, result) => {
            if (error) {
              return res.status(500).send({
                error: error
              })
            }
            return res.status(200).send({
              response: result
            })
          })

          break;
        case 19:

          conn.query(`UPDATE ${data_base} SET ${up[2][1]}='${up[3][1]}',${up[4][1]}='${up[5][1]}', ${up[6][1]}='${up[7][1]}' ,${up[8][1]}='${up[9][1]}',${up[10][1]}='${up[11][1]}',${up[12][1]}='${up[13][1]}',${up[14][1]}='${up[15][1]}',${up[16][1]}='${up[17][1]}',${up[18][1]}='${up[19][1]}',${up[20][1]}='${up[21][1]}',${up[22][1]}='${up[23][1]}',${up[24][1]}='${up[25][1]}',${up[26][1]}='${up[27][1]}',${up[28][1]}='${up[29][1]}',${up[30][1]}='${up[31][1]}',${up[32][1]}='${up[33][1]}',${up[34][1]}='${up[35][1]}',${up[36][1]}='${up[37][1]}',${up[38][1]}='${up[39][1]}' WHERE ID='${up[1][1]}'`, (error, result) => {
            if (error) {
              return res.status(500).send({
                error: error
              })
            }
            return res.status(200).send({
              response: result
            })
          })

          break;
        case 20:

          conn.query(`UPDATE ${data_base} SET ${up[2][1]}='${up[3][1]}',${up[4][1]}='${up[5][1]}', ${up[6][1]}='${up[7][1]}' ,${up[8][1]}='${up[9][1]}',${up[10][1]}='${up[11][1]}',${up[12][1]}='${up[13][1]}',${up[14][1]}='${up[15][1]}',${up[16][1]}='${up[17][1]}',${up[18][1]}='${up[19][1]}',${up[20][1]}='${up[21][1]}',${up[22][1]}='${up[23][1]}',${up[24][1]}='${up[25][1]}',${up[26][1]}='${up[27][1]}',${up[28][1]}='${up[29][1]}',${up[30][1]}='${up[31][1]}',${up[32][1]}='${up[33][1]}',${up[34][1]}='${up[35][1]}',${up[36][1]}='${up[37][1]}',${up[38][1]}='${up[39][1]}',${up[40][1]}='${up[41][1]}' WHERE ID='${up[1][1]}'`, (error, result) => {
            if (error) {
              return res.status(500).send({
                error: error
              })
            }
            return res.status(200).send({
              response: result
            })
          })

          break;
        case 21:

          conn.query(`UPDATE ${data_base} SET ${up[2][1]}='${up[3][1]}',${up[4][1]}='${up[5][1]}', ${up[6][1]}='${up[7][1]}' ,${up[8][1]}='${up[9][1]}',${up[10][1]}='${up[11][1]}',${up[12][1]}='${up[13][1]}',${up[14][1]}='${up[15][1]}',${up[16][1]}='${up[17][1]}',${up[18][1]}='${up[19][1]}',${up[20][1]}='${up[21][1]}',${up[22][1]}='${up[23][1]}',${up[24][1]}='${up[25][1]}',${up[26][1]}='${up[27][1]}',${up[28][1]}='${up[29][1]}',${up[30][1]}='${up[31][1]}',${up[32][1]}='${up[33][1]}',${up[34][1]}='${up[35][1]}',${up[36][1]}='${up[37][1]}',${up[38][1]}='${up[39][1]}',${up[40][1]}='${up[41][1]}',${up[42][1]}='${up[43][1]}' WHERE ID='${up[1][1]}'`, (error, result) => {
            if (error) {
              return res.status(500).send({
                error: error
              })
            }
            return res.status(200).send({
              response: result
            })
          })

          break;
        case 22:

          conn.query(`UPDATE ${data_base} SET ${up[2][1]}='${up[3][1]}',${up[4][1]}='${up[5][1]}', ${up[6][1]}='${up[7][1]}' ,${up[8][1]}='${up[9][1]}',${up[10][1]}='${up[11][1]}',${up[12][1]}='${up[13][1]}',${up[14][1]}='${up[15][1]}',${up[16][1]}='${up[17][1]}',${up[18][1]}='${up[19][1]}',${up[20][1]}='${up[21][1]}',${up[22][1]}='${up[23][1]}',${up[24][1]}='${up[25][1]}',${up[26][1]}='${up[27][1]}',${up[28][1]}='${up[29][1]}',${up[30][1]}='${up[31][1]}',${up[32][1]}='${up[33][1]}',${up[34][1]}='${up[35][1]}',${up[36][1]}='${up[37][1]}',${up[38][1]}='${up[39][1]}',${up[40][1]}='${up[41][1]}',${up[42][1]}='${up[43][1]}',${up[44][1]}='${up[45][1]}' WHERE ID='${up[1][1]}'`, (error, result) => {
            if (error) {
              return res.status(500).send({
                error: error
              })
            }
            return res.status(200).send({
              response: result
            })
          })

          break;
        case 23:

          conn.query(`UPDATE ${data_base} SET ${up[2][1]}='${up[3][1]}',${up[4][1]}='${up[5][1]}', ${up[6][1]}='${up[7][1]}' ,${up[8][1]}='${up[9][1]}',${up[10][1]}='${up[11][1]}',${up[12][1]}='${up[13][1]}',${up[14][1]}='${up[15][1]}',${up[16][1]}='${up[17][1]}',${up[18][1]}='${up[19][1]}',${up[20][1]}='${up[21][1]}',${up[22][1]}='${up[23][1]}',${up[24][1]}='${up[25][1]}',${up[26][1]}='${up[27][1]}',${up[28][1]}='${up[29][1]}',${up[30][1]}='${up[31][1]}',${up[32][1]}='${up[33][1]}',${up[34][1]}='${up[35][1]}',${up[36][1]}='${up[37][1]}',${up[38][1]}='${up[39][1]}',${up[40][1]}='${up[41][1]}',${up[42][1]}='${up[43][1]}',${up[44][1]}='${up[45][1]}',${up[46][1]}='${up[47][1]}' WHERE ID='${up[1][1]}'`, (error, result) => {
            if (error) {
              return res.status(500).send({
                error: error
              })
            }
            return res.status(200).send({
              response: result
            })
          })

          break;
        case 24:

          conn.query(`UPDATE ${data_base} SET ${up[2][1]}='${up[3][1]}',${up[4][1]}='${up[5][1]}', ${up[6][1]}='${up[7][1]}' ,${up[8][1]}='${up[9][1]}',${up[10][1]}='${up[11][1]}',${up[12][1]}='${up[13][1]}',${up[14][1]}='${up[15][1]}',${up[16][1]}='${up[17][1]}',${up[18][1]}='${up[19][1]}',${up[20][1]}='${up[21][1]}',${up[22][1]}='${up[23][1]}',${up[24][1]}='${up[25][1]}',${up[26][1]}='${up[27][1]}',${up[28][1]}='${up[29][1]}',${up[30][1]}='${up[31][1]}',${up[32][1]}='${up[33][1]}',${up[34][1]}='${up[35][1]}',${up[36][1]}='${up[37][1]}',${up[38][1]}='${up[39][1]}',${up[40][1]}='${up[41][1]}',${up[42][1]}='${up[43][1]}',${up[44][1]}='${up[45][1]}',${up[46][1]}='${up[47][1]}',${up[48][1]}='${up[49][1]}' WHERE ID='${up[1][1]}'`, (error, result) => {
            if (error) {
              return res.status(500).send({
                error: error
              })
            }
            return res.status(200).send({
              response: result
            })
          })

          break;
        case 25:

          conn.query(`UPDATE ${data_base} SET  ${up[2][1]}='${up[3][1]}',${up[4][1]}='${up[5][1]}', ${up[6][1]}='${up[7][1]}' ,${up[8][1]}='${up[9][1]}',${up[10][1]}='${up[11][1]}',${up[12][1]}='${up[13][1]}',${up[14][1]}='${up[15][1]}',${up[16][1]}='${up[17][1]}',${up[18][1]}='${up[19][1]}',${up[20][1]}='${up[21][1]}',${up[22][1]}='${up[23][1]}',${up[24][1]}='${up[25][1]}',${up[26][1]}='${up[27][1]}',${up[28][1]}='${up[29][1]}',${up[30][1]}='${up[31][1]}',${up[32][1]}='${up[33][1]}',${up[34][1]}='${up[35][1]}',${up[36][1]}='${up[37][1]}',${up[38][1]}='${up[39][1]}',${up[40][1]}='${up[41][1]}',${up[42][1]}='${up[43][1]}',${up[44][1]}='${up[45][1]}',${up[46][1]}='${up[47][1]}',${up[48][1]}='${up[49][1]}',${up[50][1]}='${up[51][1]}' WHERE ID='${up[1][1]}'`, (error, result) => {
            if (error) {
              return res.status(500).send({
                error: error
              })
            }
            return res.status(200).send({
              response: result
            })
          })
          break;

      }

    }
  })
})





app.listen(process.env.PORT_HTTP, () => {
  console.log("Servidor iniciado na porta")
});