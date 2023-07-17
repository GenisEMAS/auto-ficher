const format = require("date-fns/format");

function getRandomizedDate(time) {
  const [hora, minuto] = time.split(":");
  const fechaFichaje = new Date();
  fechaFichaje.setHours(hora);
  fechaFichaje.setMinutes(minuto);
  const randomOffset = Math.floor(Math.random() * 11) - 5;
  fechaFichaje.setMinutes(fechaFichaje.getMinutes() + randomOffset);
  return format(fechaFichaje, "yyyy-MM-dd HH:mm:ss");
}

function comprovarValores(entradas, salidas, dias) {
  if (entradas.length === 0) {
    console.log("No hay entradas");
    return false;
  }

  if (entradas.length !== salidas.length) {
    console.log("Entradas y salidas no son parejas");
    return false;
  }

  if (dias.length === 0) {
    console.log("No hay días");
    return false;
  }

  return true;
}

function comprovarHora(hora) {
  if (hora < 0 || hora > 23) {
    console.log("Hora no válida");
    return false;
  }
  return true;
}

module.exports = {
  getRandomizedDate,
  comprovarValores,
  comprovarHora,
};
