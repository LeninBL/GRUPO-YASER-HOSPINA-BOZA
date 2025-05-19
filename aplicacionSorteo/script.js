const participantesInput = document.getElementById("participantes");
const cantidadInput = document.getElementById("cantidad");
const modoRadios = document.getElementsByName("modo");
const resultados = document.getElementById("resultados");
const acciones = document.getElementById("acciones");
const labelCantidad = document.getElementById("labelCantidad");
const contador = document.getElementById("contador");
const errorCantidad = document.getElementById("errorCantidad");

// Actualizar contador de participantes
participantesInput.addEventListener("input", function () {
  const lineas = this.value.split("\n").filter((n) => n.trim());
  contador.textContent = `${lineas.length}/100 participantes`;
  if (lineas.length > 100) {
    contador.style.color = "red";
  } else {
    contador.style.color = "";
  }
});

// Actualizar etiqueta según radio seleccionado
modoRadios.forEach((r) => {
  r.addEventListener("change", () => {
    labelCantidad.textContent =
      r.value === "equipos"
        ? "Cantidad de Equipos:"
        : "Participantes por Equipo:";
    cantidadInput.min = r.value === "equipos" ? "1" : "2";
    if (r.value === "por_equipo") {
      cantidadInput.value = "5";
    }
  });
});

// Validar cantidad
cantidadInput.addEventListener("input", function () {
  const modo = Array.from(modoRadios).find((r) => r.checked).value;
  if (modo === "por_equipo" && this.value < 2) {
    errorCantidad.textContent = "Mínimo 2 participantes por equipo";
  } else {
    errorCantidad.textContent = "";
  }
});

function limpiarTodo() {
  participantesInput.value = "";
  cantidadInput.value = "";
  document.getElementById("titulo").value = "";
  resultados.innerHTML = "";
  acciones.style.display = "none";
  contador.textContent = "0/100 participantes";
  contador.style.color = "";
  errorCantidad.textContent = "";
}

function generarEquipos() {
  const nombres = participantesInput.value
    .trim()
    .split("\n")
    .filter((n) => n.trim())
    .map((n) => n.trim().slice(0, 50));
  const cantidad = parseInt(cantidadInput.value);
  const modo = Array.from(modoRadios).find((r) => r.checked).value;
  const titulo = document.getElementById("titulo").value.trim();

  // Validaciones
  if (nombres.length === 0) {
    alert("Por favor, ingresa al menos un participante.");
    return;
  }

  if (nombres.length > 100) {
    alert("Máximo 100 participantes permitidos.");
    return;
  }

  if (isNaN(cantidad) || cantidad < 1) {
    alert("Por favor, ingresa un número válido.");
    return;
  }

  if (modo === "por_equipo" && cantidad < 2) {
    alert("Mínimo 2 participantes por equipo.");
    return;
  }

  // Barajar aleatoriamente (Fisher-Yates shuffle)
  for (let i = nombres.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nombres[i], nombres[j]] = [nombres[j], nombres[i]];
  }

  let equipos = [];

  if (modo === "equipos") {
    for (let i = 0; i < cantidad; i++) equipos.push([]);
    nombres.forEach((nombre, i) => {
      equipos[i % cantidad].push(nombre);
    });
  } else {
    const numEquipos = Math.ceil(nombres.length / cantidad);
    for (let i = 0; i < numEquipos; i++) equipos.push([]);
    nombres.forEach((nombre, i) => {
      equipos[Math.floor(i / cantidad)].push(nombre);
    });
  }

  mostrarResultados(equipos, titulo);
}

function mostrarResultados(equipos, titulo) {
  resultados.innerHTML = "";
  if (titulo) resultados.innerHTML += `<h2>${titulo}</h2>`;

  equipos.forEach((grupo, idx) => {
    const div = document.createElement("div");
    div.className = "equipo";
    div.innerHTML = `<h3>Equipo ${idx + 1}</h3><ul>${grupo
      .map((p) => `<li>${p}</li>`)
      .join("")}</ul>`;
    resultados.appendChild(div);
  });

  acciones.style.display = "flex";
  resultados.scrollIntoView({ behavior: "smooth" });
}

function copiarAPortapapeles() {
  const temp = document.createElement("textarea");
  temp.value = resultados.innerText;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);
  alert("Resultados copiados al portapapeles.");
}

function copiarColumnas() {
  const equipos = document.querySelectorAll(".equipo ul");
  let columnas = [];

  equipos.forEach((ul, idx) => {
    const nombres = Array.from(ul.children).map((li) => li.textContent);
    nombres.forEach((nombre, i) => {
      if (!columnas[i]) columnas[i] = [];
      columnas[i][idx] = nombre;
    });
  });

  const texto = columnas
    .map((fila) => fila.map((n) => n || "").join("\t"))
    .join("\n");
  const temp = document.createElement("textarea");
  temp.value = texto;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);
  alert("Equipos copiados por columnas (formato para Excel).");
}

function descargarComoJPG() {
  // Crear un canvas manualmente para simular html2canvas
  alert(
    "Descarga como JPG no disponible en esta versión sin librerías.\n\nUse la función de copiar y pegue en un editor de imágenes."
  );
}
