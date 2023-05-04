const mysql = require("mysql2/promise");

async function connectarDB() {
  const pool = mysql.createPool({
    host: "containers-us-west-166.railway.app",
    user: "root",
    password: "1A9kDiYpWxhRYlBcA398",
    port: 7094,
    database: "railway",
  });

  return await pool.getConnection();
}

async function checkTableExists(connection) {
  try {
    await connection.execute("select * from fichaje_auto_conf");
  } catch (error) {
    console.log(error);
    await connection.execute(
      "CREATE TABLE `fichaje_auto_conf` (`id` INT NOT NULL AUTO_INCREMENT , `idUsuario` INT NOT NULL , `entradas` VARCHAR(50) NOT NULL , `salidas` VARCHAR(50) NOT NULL , `dias` VARCHAR(50) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;"
    );
  }
}

module.exports = {
  connectarDB,
  checkTableExists,
};
