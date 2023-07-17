async function checkTableExists(pool) {
  const connection = await pool.getConnection();
  try {
    await connection.execute("select * from fichaje_auto_conf");
  } catch (error) {
    console.log(error);
    await connection.execute(
      "CREATE TABLE `fichaje_auto_conf` (`id` INT NOT NULL AUTO_INCREMENT , `idUsuario` INT NOT NULL , `entradas` VARCHAR(50) NOT NULL , `salidas` VARCHAR(50) NOT NULL , `dias` VARCHAR(50) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;",
    );
  } finally {
    connection.release();
  }
}

async function create(pool, data) {
  try {
    let sqlExists =
      `SELECT * FROM fichaje_auto_conf WHERE idUsuario = ${data.idUsuario}`;
    const [existingUser] = await pool.query(sqlExists);
    console.log(existingUser[0]);
    if (existingUser[0]) {
      throw new Error("User with this userId already exists");
    }
    const columns = Object.keys(data).join(",");
    const values = Object.values(data)
      .map(() => "?")
      .join(",");
    const sql = `INSERT INTO fichaje_auto_conf (${columns}) VALUES (${values})`;
    const params = Object.values(data);
    const [result] = await pool.query(sql, params);
    return result.insertId;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function read(pool, table) {
  const connection = await pool.getConnection();
  try {
    let sql = `SELECT * FROM ${table}`;
    let params = [];
    const [rows] = await pool.query(sql, params);
    const ids = rows.map((row) => row.idUsuario);
    if (ids.length === 0) {
      return rows;
    }
    let sqlNombres =
      `SELECT nombre,codigo FROM usuarios_emas_platform WHERE codigo IN (${
        ids.join(
          ",",
        )
      })`;
    const [nombres] = await pool.query(sqlNombres);
    const usersWithName = rows.map(async (row) => {
      const nombre = nombres.find(
        (nombre) => nombre.codigo === row.idUsuario,
      );
      return { ...row, nombre: nombre.nombre };
    });
    return await Promise.all(usersWithName);
  } catch (error) {
    console.log(error);
    return [];
  } finally {
    connection.release();
  }
}

async function readByNombre(pool, nombre) {
  try {
    let sql =
      `SELECT codigo,nombre FROM usuarios_emas_platform WHERE nombre LIKE '%${nombre}%'`;
    const [rows] = await pool.query(sql);
    return rows;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function getProgramacionByCodigo(pool, codigo) {
  try {
    let sql = `SELECT * FROM fichaje_auto_conf WHERE idUsuario = ${codigo}`;
    const [rows] = await pool.query(sql);
    return rows[0];
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function update(pool, data, id) {
  try {
    const columns = Object.keys(data)
      .map((column) => `${column} = ?`)
      .join(",");
    const params = Object.values(data);
    const sql =
      `UPDATE fichaje_auto_conf SET ${columns} WHERE idUsuario = ${id}`;
    const [result] = await pool.query(sql, params);
    return (result).affectedRows > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function remove(pool, id) {
  try {
    const sql = `DELETE FROM fichaje_auto_conf WHERE idUsuario = ?`;
    const params = [id];
    const [result] = await pool.query(sql, params);
    return (result).affectedRows > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  checkTableExists,
  read,
  readByNombre,
  getProgramacionByCodigo,
  create,
  update,
  remove,
};
