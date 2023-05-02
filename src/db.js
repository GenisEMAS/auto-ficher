const mysql = require("mysql2/promise");

async function connectarDB() {
  const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    port: 3306,
    password: "localhost",
    database: "emasplatform",
  });

  return await pool.getConnection();
}

async function checkTableExists(connection) {
  try {
    await connection.execute("select * from fichaje_auto_conf");
  } catch (error) {
    console.log(error);
    await connection.execute(
      "CREATE TABLE `emasplatform`.`fichaje_auto_conf` (`id` INT NOT NULL AUTO_INCREMENT , `idUsuario` INT NOT NULL , `entradas` VARCHAR(50) NOT NULL , `salidas` VARCHAR(50) NOT NULL , `dias` VARCHAR(50) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;"
    );
  }
}

module.exports = {
  connectarDB,
  checkTableExists,
};
