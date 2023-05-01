const mysql = require("mysql2/promise");
var CronJob = require("cron").CronJob;
const format = require("date-fns/format");

function getRandomizedDate() {
  const fechaFichaje = new Date();
  const randomOffset = Math.floor(Math.random() * 11) - 5;
  fechaFichaje.setMinutes(fechaFichaje.getMinutes() + randomOffset);
  return format(fechaFichaje, "yyyy-MM-dd HH:mm:ss");
}

async function insertarFichaje(tipo) {
  console.log("Job started");

  const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    port: 33060,
    password: "2132",
    database: "emasplatform",
  });

  const connection = await pool.getConnection();

  try {
    const [rows, _] = await connection.execute(
      "select * from usuarios_emas_platform where auto = true"
    );

    for (let i = 0; i < rows.length; i++) {
      console.log(rows[i].codigo);
      const codigoUsuario = rows[i].codigo;
      const fechaFichaje = getRandomizedDate();
      await connection.execute(
        `insert into fichajes (ID_USUARIO,FECHA_FICHAJE,SENTIDO,NOTA) values (${codigoUsuario},'${fechaFichaje}',${tipo},'')`
      );
    }
  } catch (error) {
    console.log(error);
  } finally {
    connection.release();
  }

  console.log("Job finished");
}

var entrada = new CronJob(
  "* * * * * *",
  () => insertarFichaje(1),
  null,
  false,
  "Europe/Madrid"
);

var salida = new CronJob(
  "* * * * * *",
  () => insertarFichaje(0),
  null,
  false,
  "Europe/Madrid"
);

entrada.start();
salida.start();
