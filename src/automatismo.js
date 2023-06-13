const { checkTableExists } = require("./db");
const {
  getRandomizedDate,
  comprovarValores,
  comprovarHora,
} = require("./utils");
const { getAutoConf, addFichaje } = require("./sql");

async function empezarAutomatismo(pool) {
  console.log("Job started");
  const connection = await pool.getConnection();
  try {
    // Comprovar que la tabla fichaje_auto_conf existe sino crearla
    await checkTableExists(connection);

    const rows = await getAutoConf(connection);

    for (const row of rows) {
      const codigo = row.idUsuario;
      const entradas = row.entradas.split(",");
      const salidas = row.salidas.split(",");
      const dias = row.dias.split(",");

      // Comprovar que los valores son correctos
      const valido = comprovarValores(entradas, salidas, dias);
      if (!valido) {
        continue;
      }

      // Comprovar si el dia actual esta en la lista de dias a fichar
      const dia = new Date().getDay();
      const diaValido = dias.includes(dia.toString());
      if (!diaValido) {
        continue;
      }

      // Recorrer las entradas y salidas y añadir los fichajes
      for (let i = 0; i < entradas.length; i++) {
        const entrada = entradas[i];
        const salida = salidas[i];

        // Comprovar que las horas son validas
        const entradaValida = comprovarHora(entrada);
        const salidaValida = comprovarHora(salida);

        if (!entradaValida || !salidaValida) {
          continue;
        }

        // Añadir los fichajes
        const fechaEntrada = getRandomizedDate(entrada);
        const fechaSalida = getRandomizedDate(salida);

        await addFichaje(connection, codigo, fechaEntrada, 0);
        await addFichaje(connection, codigo, fechaSalida, 1);
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    connection.release();
  }

  console.log("Job finished");
}

module.exports = {
    empezarAutomatismo,
}