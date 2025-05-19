const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const respuesta = document.getElementById("respuesta");
const textarea = document.getElementById("textarea-elementos");
const botonIniciar = document.getElementById("iniciar");
const botonReiniciar = document.getElementById("reiniciar");
const overlayText = document.getElementById("overlay-text");

let elementos = [];
let coloresBase = ["#ff9999", "#99ff99", "#9999ff", "#ffff99", "#cc99ff", "#ffcc99"];
let anguloInicio = 0;
let girando = false;
let ocultos = new Set();

function actualizarElementos() {
    elementos = textarea.value
        .split("\n")
        .map(e => e.trim())
        .filter(e => e.length > 0 && !ocultos.has(e));
}

function dibujarRuleta() {
    const radio = canvas.width / 2;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const numSectores = elementos.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numSectores; i++) {
        const anguloInicioSector = anguloInicio + (i * 2 * Math.PI) / numSectores;
        const anguloFinSector = anguloInicio + ((i + 1) * 2 * Math.PI) / numSectores;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radio, anguloInicioSector, anguloFinSector);
        ctx.closePath();
        ctx.fillStyle = coloresBase[i % coloresBase.length];
        ctx.fill();

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((anguloInicioSector + anguloFinSector) / 2);
        ctx.fillStyle = "black";
        ctx.font = "bold 22px sans-serif";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(elementos[i], radio - 22, 0);
        ctx.restore();
    }
}

function girarRuleta() {
    if (girando || elementos.length === 0) return;
    overlayText.style.display = "none";
    girando = true;
    let velocidad = Math.random() * 0.2 + 0.25;
    let vueltas = Math.floor(Math.random() * 3 + 5);
    let total = vueltas * 2 * Math.PI;
    let rotado = 0;

    function animar() {
        if (rotado < total) {
            rotado += velocidad;
            anguloInicio += velocidad;
            dibujarRuleta();
            requestAnimationFrame(animar);
        } else {
            girando = false;
            anguloInicio = anguloInicio % (2 * Math.PI);
            const sectorSeleccionado = Math.floor((elementos.length * ((2 * Math.PI - (anguloInicio % (2 * Math.PI))) % (2 * Math.PI))) / (2 * Math.PI));
            const seleccionado = elementos[sectorSeleccionado];
            respuesta.textContent = seleccionado;
        }
    }
    animar();
}

textarea.addEventListener("input", () => {
    actualizarElementos();
    dibujarRuleta();
});

canvas.addEventListener("click", girarRuleta);
botonIniciar.addEventListener("click", girarRuleta);
botonReiniciar.addEventListener("click", () => {
    ocultos.clear();
    actualizarElementos();
    respuesta.textContent = "RESPUESTA";
    overlayText.style.display = "block";
    dibujarRuleta();
});

document.addEventListener("keydown", e => {
    if (e.code === "Space") {
        girarRuleta();
    } else if (e.key.toLowerCase() === "s") {
        if (respuesta.textContent !== "RESPUESTA") {
            ocultos.add(respuesta.textContent);
            const lineas = textarea.value.split("\n");
            textarea.value = lineas.map(l => l.trim() === respuesta.textContent ? `# ${l}` : l).join("\n");
            respuesta.textContent = "RESPUESTA";
            actualizarElementos();
            dibujarRuleta();
        }
    } else if (e.key.toLowerCase() === "r") {
        botonReiniciar.click();
    } else if (e.key.toLowerCase() === "e") {
        textarea.focus();
    } else if (e.key.toLowerCase() === "f") {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
});

// Inicialización
actualizarElementos();
dibujarRuleta();