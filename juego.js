// --- DATOS DEL JUEGO PERSONALIZADOS (¡EDITA ESTO!) ---
const preguntas = [
    {
        pregunta: "¿Que sigue_ AMOR DE MIS AMORES?",
        opciones: ["Si dejaste de quererme", "Jhin", "Lux", "Zed"],
        respuestaCorrecta: "Lux" 
    },
    {
        pregunta: "Si tuvieras que elegir un pais para vivir, ahi ¿cuál sería?",
        opciones: ["ninguno", "india", "corea del norte", "venezuela"],
        respuestaCorrecta: "ninguno"
    },
    {
        pregunta: "escoge la carita triste.",
        opciones: [":C", "NO", "Por que?", "Tal vez"],
        respuestaCorrecta: ":C" 
    },
    {
        pregunta: "¿Cuanto es 2 + 2 ?",
        opciones: ["1", "4", "7", "jeje"],
        respuestaCorrecta: "4" 
    },
    {
        pregunta: "cual esta bien escrito?",
        opciones: ["El joven, cuyo talento era notorio para todos, ganó el premio literario este año.", "El joven cuyo talento era notorio para todos, ganó el premio literario este año.", "El joven, cuyo talento era notorio para todos ganó, el premio literario este año.", "El joven que su talento era notorio para todos, ganó el premio literario este año."],
        respuestaCorrecta: "La Piedra Rosetta"
    }
];

// --- VARIABLES GLOBALES DEL JUEGO ---
let vidaNexo = 100;
let preguntaActualIndex = 0;
const danoPorError = 25; 

// Elementos del DOM (conexión con el HTML)
const nexoVidaEl = document.getElementById('nexo-vida');
const textoPreguntaEl = document.getElementById('texto-pregunta');
const opcionesContenedorEl = document.getElementById('contenedor-opciones');
const mensajeResultadoEl = document.getElementById('mensaje-resultado');

// --- NUEVO ELEMENTO PARA EL MENSAJE DE TERROR ---
let mensajeTerrorEl; 
let audioStatic; // Variable global para el audio de estática

// --- LÓGICA DEL JUEGO ---

/**
 * Muestra la pregunta actual en la interfaz y crea los botones de opción.
 */
function mostrarPregunta() {
    if (preguntaActualIndex >= preguntas.length) {
        terminarJuego("victoria");
        return;
    }

    const preguntaData = preguntas[preguntaActualIndex];
    
    textoPreguntaEl.textContent = `Pregunta ${preguntaActualIndex + 1} / ${preguntas.length}: ${preguntaData.pregunta}`;
    
    opcionesContenedorEl.innerHTML = ''; 
    mensajeResultadoEl.textContent = '';
    mensajeResultadoEl.className = ''; 

    preguntaData.opciones.forEach(opcionTexto => {
        const botonOpcion = document.createElement('div');
        botonOpcion.classList.add('opcion');
        botonOpcion.textContent = opcionTexto;
        
        botonOpcion.addEventListener('click', () => manejarRespuesta(opcionTexto, preguntaData.respuestaCorrecta));
        
        opcionesContenedorEl.appendChild(botonOpcion);
    });
}

/**
 * Procesa la respuesta del jugador, actualiza la vida del Nexo y avanza.
 */
function manejarRespuesta(respuestaSeleccionada, respuestaCorrecta) {
    document.querySelectorAll('.opcion').forEach(btn => btn.style.pointerEvents = 'none');

    if (respuestaSeleccionada === respuestaCorrecta) {
        mensajeResultadoEl.textContent = "✅ ¡Estrategia Maestra! Respuesta correcta. ¡Sigue avanzando!";
        mensajeResultadoEl.classList.add('mensaje-victoria');
        
        setTimeout(() => {
            preguntaActualIndex++;
            mostrarPregunta();
        }, 1500); 

    } else {
        vidaNexo -= danoPorError;
        nexoVidaEl.textContent = `Vida del Nexo: ${vidaNexo}`;
        
        if (vidaNexo <= 50) {
            nexoVidaEl.classList.add('alerta');
        }
        
        mensajeResultadoEl.textContent = `❌ ¡Fallo Crítico! El Nexo pierde ${danoPorError} de vida. La respuesta correcta era: ${respuestaCorrecta}`;
        mensajeResultadoEl.classList.add('mensaje-derrota');

        if (vidaNexo <= 0) {
            terminarJuego("derrota");
        } else {
            setTimeout(() => {
                preguntaActualIndex++;
                mostrarPregunta();
            }, 3000); 
        }
    }
}

/**
 * Termina el juego (Victoria o Derrota).
 */
/**
 * Termina el juego (Victoria o Derrota).
 */
function terminarJuego(resultado) {
    // Ocultar la interfaz normal del juego
    document.querySelector('h1').style.display = 'none';
    nexoVidaEl.style.display = 'none';
    opcionesContenedorEl.innerHTML = ''; 
    textoPreguntaEl.style.display = 'none';
    mensajeResultadoEl.style.display = 'none';
    document.body.style.backgroundColor = 'black'; // Fondo negro inmediatamente

    if (resultado === "victoria") {
        // 💥 CAMBIO: Inicia la secuencia de terror inmediatamente
        iniciarSecuenciaTerror(); 
    } 
    else { // Derrota (vidaNexo <= 0)
        document.body.innerHTML = `
            <div style="text-align: center; color: #ff0000; padding-top: 100px;">
                <h1>☠️ ¡DERROTA! El Nexo ha caído. Los enemigos fueron demasiados.</h1>
                <p>¡No te preocupes! En la próxima partida ganamos.</p>
                <button onclick="window.location.reload()" style="background-color: #e94560; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 1.1em; margin-top: 20px;">Intentar de Nuevo</button>
            </div>
        `;
    }
}// <-- ¡Esta llave cierra la función terminarJuego!

// --- NUEVAS FUNCIONES PARA LA SECUENCIA DE TERROR ---

/**
 * Inicia la secuencia de terror con glitch y texto que se escribe.
 */
/**
 * Inicia la secuencia de terror con glitch y texto que se escribe.
 */
function iniciarSecuenciaTerror() {
    
    // 💥 NUEVA LÍNEA CRUCIAL: Limpia todo el contenido del body (incluyendo el mensaje de victoria)
    document.body.innerHTML = '';
    
    // 1. Iniciar sonido de estática (en loop)
    audioStatic = new Audio('static_sound.mp3'); 
    audioStatic.loop = true;
    audioStatic.volume = 0.5;
    audioStatic.play().catch(e => console.log("No se pudo reproducir audio estático: " + e)); 

    // 2. Crear un elemento para el mensaje de terror
    mensajeTerrorEl = document.createElement('p');
    mensajeTerrorEl.style.color = '#00ff00';
    mensajeTerrorEl.style.fontFamily = 'monospace';
    mensajeTerrorEl.style.fontSize = '2em';
    mensajeTerrorEl.style.position = 'absolute';
    mensajeTerrorEl.style.top = '50%';
    mensajeTerrorEl.style.left = '50%';
    mensajeTerrorEl.style.transform = 'translate(-50%, -50%)';
    mensajeTerrorEl.style.whiteSpace = 'pre';
    document.body.appendChild(mensajeTerrorEl);

    // 3. Iniciar el efecto de glitch CSS
    document.body.classList.add('glitch-effect');

    // 4. Iniciar la escritura del texto con tu mensaje personalizado
    const textoAterrorizante = "Hola...\njejejeje.\nesto fue una prueba,\nte gusto?.\n:3.";
    escribirTextoLentamente(textoAterrorizante, 0);
}


/**
 * Escribe el texto caracter por caracter con sonido de escritura.
 */
function escribirTextoLentamente(texto, index) { // <-- ¡Solo una definición!
    if (index < texto.length) {
        mensajeTerrorEl.textContent += texto.charAt(index);
        
        // Creamos el audio aquí
        if (texto.charAt(index) !== ' ') {
            const typeSound = new Audio('type_sound.mp3'); 
            typeSound.volume = 0.2; 
            typeSound.play().catch(e => console.log("No se pudo reproducir audio type: " + e));
        }

        setTimeout(() => {
            escribirTextoLentamente(texto, index + 1);
        }, 100); 
    } else { 
        // Cuando el texto termina, pausamos la estática
        setTimeout(() => {
            if (audioStatic) {
                audioStatic.pause(); 
            }
        }, 5000); 
    }
} // <-- Cierre de escribirTextoLentamente

// --- INICIAR EL JUEGO AL CARGAR LA PÁGINA ---
document.addEventListener('DOMContentLoaded', mostrarPregunta);