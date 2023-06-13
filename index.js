const CronJob = require("cron").CronJob;
const mysql = require("mysql2/promise");
const cors = require('cors');
const { empezarAutomatismo } = require("./src/automatismo");
const { read, readByNombre, getProgramacionByCodigo, create, remove, update } = require("./src/db");
const express = require('express');
const bodyParser = require("body-parser");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "D3v3#2021",
  port: 3306,
  database: "emasplatform",
});

const app = express();
const port = 3002;

app.use(cors());
app.use(bodyParser.json())

const job = new CronJob(
  "* * * * * *",
  () => {},//empezarAutomatismo(pool),
  null,
  false,
  "Europe/Madrid"
);

job.start();

console.log("Job scheduled, running correctly...");

app.get('/', async (_, res) => {
  res.status(200).send(await read(pool, 'fichaje_auto_conf'))
})

app.get('/:nombre', async (req, res) => {
  const { nombre } = req.params;
  res.status(200).send(await readByNombre(pool, nombre))
})

app.get('/programacion/:codigo', async (req, res) => {
  const { codigo } = req.params;
  res.status(200).send(await getProgramacionByCodigo(pool, codigo))
})

app.post('/', async (req, res) => {
  res.status(201).send(await create(pool, req.body))
})

app.put('/:id', async (req, res) => {
  res.status(200).send(await update(pool, req.body, req.params.id))
})

app.delete('/:codigo', async (req, res) => {
  const { codigo } = req.params;
  res.status(200).send(await remove(pool, codigo))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));