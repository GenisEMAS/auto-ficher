async function getAutoConf(connection) {
  const [rows] = await connection.execute(`select * from fichaje_auto_conf`);

  return rows;
}

async function addFichaje(connection, codigo, fecha, tipo) {
  await connection.execute(
    `insert into fichajes (ID_USUARIO,FECHA_FICHAJE,SENTIDO,NOTA) values (${codigo},'${fecha}',${tipo},'')`
  );
}

module.exports = {
  getAutoConf,
  addFichaje,
};
