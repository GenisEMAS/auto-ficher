const CronJob = require("cron").CronJob;
const mysql = require("mysql2/promise");
const cors = require("cors");
const { empezarAutomatismo } = require("./src/automatismo");
const {
  checkTableExists,
  read,
  readByNombre,
  getProgramacionByCodigo,
  create,
  remove,
  update,
} = require("./src/db");
const express = require("express");
const bodyParser = require("body-parser");

require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: "D3v3#2021",
  port: process.env.DB_PORT,
  database: process.env.DB_DB,
});

// Comprovar que la tabla fichaje_auto_conf existe sino crearla
checkTableExists(pool);

const app = express();
const port = process.env.APP_PORT;

app.use(cors());
app.use(bodyParser.json());

// Cada dia a las 12AM
const job = new CronJob(
  "0 0 * * * *",
  () => empezarAutomatismo(pool),
  null,
  false,
  "Europe/Madrid",
);

job.start();

console.log("Job scheduled, running correctly...");

app.get("/", async (_, res) => {
  res.status(200).send(await read(pool, "fichaje_auto_conf"));
});

app.get("/:nombre", async (req, res) => {
  const { nombre } = req.params;
  res.status(200).send(await readByNombre(pool, nombre));
});

app.get("/programacion/:codigo", async (req, res) => {
  const { codigo } = req.params;
  res.status(200).send(await getProgramacionByCodigo(pool, codigo));
});

app.post("/", async (req, res) => {
  const results = await create(pool, req.body);
  res.status(201).send({ id: results.insertId });
});

app.put("/:id", async (req, res) => {
  res.status(200).send(await update(pool, req.body, req.params.id));
});

app.delete("/:codigo", async (req, res) => {
  const { codigo } = req.params;
  res.status(200).send(await remove(pool, codigo));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
