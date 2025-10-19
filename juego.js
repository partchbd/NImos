// --- DATOS DEL JUEGO PERSONALIZADOS (¡EDITA ESTO!) ---
const preguntas = [
    {
        pregunta: "¿Qué campeón MOBA me enseñaste a usar y ahora es mi favorito?",
        opciones: ["Ashe", "Jhin", "Lux", "Zed"],
        respuestaCorrecta: "Lux" // 👈 ¡Personaliza esta respuesta!
    },
    {
        pregunta: "Si tuvieras que elegir una época de la historia para vivir, ¿cuál sería?",
        opciones: ["Antiguo Egipto", "Edad Media", "El Renacimiento", "Futuro Distópico"],
        respuestaCorrecta: "El Renacimiento" // 👈 ¡Personaliza esta respuesta!
    },
    {
        pregunta: "Nuestro chiste interno favorito involucra a...",
        opciones: ["Un pato", "Una tostadora", "El número 42", "Un fantasma"],
        respuestaCorrecta: "Un pato" 
    },
    {
        pregunta: "¿Cuál fue el primer lugar al que fuimos juntos?",
        opciones: ["Parque Central", "Cafetería 'El Buen Rollo'", "Un cine", "La biblioteca"],
        respuestaCorrecta: "Cafetería 'El Buen Rollo'" 
    },
    {
        pregunta: "Para una misión secreta, ¿qué objeto histórico me llevaría?",
        opciones: ["La espada Excalibur", "El Libro de los Muertos", "La Piedra Rosetta", "Un mapa antiguo"],
        respuestaCorrecta: "La Piedra Rosetta"
    }
    // ¡Añade más preguntas aquí para que el juego sea más largo y personal!
];

// --- VARIABLES GLOBALES DEL JUEGO ---
let vidaNexo = 100;
let preguntaActualIndex = 0;
const danoPorError = 25; // Cada error quita 25 de vida (permite 4 errores antes de perder)

// Elementos del DOM (conexión con el HTML)
const nexoVidaEl = document.getElementById('nexo-vida');
const textoPreguntaEl = document.getElementById('texto-pregunta');
const opcionesContenedorEl = document.getElementById('contenedor-opciones');
const mensajeResultadoEl = document.getElementById('mensaje-resultado');


// --- LÓGICA DEL JUEGO ---

/**
 * Muestra la pregunta actual en la interfaz y crea los botones de opción.
 */
function mostrarPregunta() {
    // Si ya respondimos todas las preguntas, el jugador gana
    if (preguntaActualIndex >= preguntas.length) {
        terminarJuego("victoria");
        return;
    }

    const preguntaData = preguntas[preguntaActualIndex];
    
    // 1. Actualiza el texto de la pregunta
    textoPreguntaEl.textContent = `Pregunta ${preguntaActualIndex + 1} / ${preguntas.length}: ${preguntaData.pregunta}`;
    
    // 2. Limpia opciones anteriores y mensajes
    opcionesContenedorEl.innerHTML = ''; 
    mensajeResultadoEl.textContent = '';
    mensajeResultadoEl.className = ''; // Limpia las clases de color (victoria/derrota)

    // 3. Crea los botones para cada opción
    preguntaData.opciones.forEach(opcionTexto => {
        const botonOpcion = document.createElement('div');
        botonOpcion.classList.add('opcion');
        botonOpcion.textContent = opcionTexto;
        
        // Asigna el evento de clic que llama a la función de manejo de respuesta
        botonOpcion.addEventListener('click', () => manejarRespuesta(opcionTexto, preguntaData.respuestaCorrecta));
        
        opcionesContenedorEl.appendChild(botonOpcion);
    });
}

/**
 * Procesa la respuesta del jugador, actualiza la vida del Nexo y avanza.
 */
function manejarRespuesta(respuestaSeleccionada, respuestaCorrecta) {
    // Deshabilita los botones temporalmente después del clic
    document.querySelectorAll('.opcion').forEach(btn => btn.style.pointerEvents = 'none');

    if (respuestaSeleccionada === respuestaCorrecta) {
        // --- RESPUESTA CORRECTA ---
        mensajeResultadoEl.textContent = "✅ ¡Estrategia Maestra! Respuesta correcta. ¡Sigue avanzando!";
        mensajeResultadoEl.classList.add('mensaje-victoria');
        
        // Pasa a la siguiente pregunta después de un breve retraso
        setTimeout(() => {
            preguntaActualIndex++;
            mostrarPregunta();
        }, 1500); 

    } else {
        // --- RESPUESTA INCORRECTA (DAÑO AL NEXO) ---
        vidaNexo -= danoPorError;
        nexoVidaEl.textContent = `Vida del Nexo: ${vidaNexo}`;
        
        // Actualiza el estilo de alerta del Nexo en el HTML
        if (vidaNexo <= 50) {
            nexoVidaEl.classList.add('alerta');
        }
        
        mensajeResultadoEl.textContent = `❌ ¡Fallo Crítico! El Nexo pierde ${danoPorError} de vida. La respuesta correcta era: ${respuestaCorrecta}`;
        mensajeResultadoEl.classList.add('mensaje-derrota');

        if (vidaNexo <= 0) {
            terminarJuego("derrota");
        } else {
            // Pasa a la siguiente pregunta a pesar del error
            setTimeout(() => {
                preguntaActualIndex++;
                mostrarPregunta();
            }, 3000); // Da más tiempo para que el jugador vea la respuesta correcta
        }
    }
}

/**
 * Termina el juego y muestra un mensaje final de dedicatoria.
 */
function terminarJuego(resultado) {
    opcionesContenedorEl.innerHTML = ''; 
    
    if (resultado === "victoria") {
        textoPreguntaEl.textContent = "🏆 ¡VICTORIA ABSOLUTA! Has defendido el Nexo con una estrategia impecable.";
        nexoVidaEl.textContent = "Vida del Nexo: ASEGURADO (100%)";
        nexoVidaEl.classList.remove('alerta');
        
        // Mensaje de regalo/dedicatoria personal
        mensajeResultadoEl.innerHTML = `
            <h2 class="mensaje-victoria">🎉 ¡Felicidades! Este juego es solo una pequeña muestra de cuánto valoro tu inteligencia e ingenio. ¡Eres la mejor estrategia! 🎉</h2>
            
        `;

    } else { // Derrota (vidaNexo <= 0)
        textoPreguntaEl.textContent = "☠️ ¡DERROTA! El Nexo ha caído. Los enemigos fueron demasiados.";
        nexoVidaEl.textContent = "Vida del Nexo: 0 (DESTRUIDO)";
        nexoVidaEl.classList.add('destruido'); // Aplica el estilo de "destruido"
        
        mensajeResultadoEl.innerHTML = `
            <h2 class="mensaje-derrota">¡No te preocupes! En la próxima partida (la próxima vez que te vea) ganaremos juntos.</h2>
            <button onclick="window.location.reload()" class="opcion" style="margin-top: 25px; cursor: pointer;">Intentar de Nuevo</button>
        `;
    }
}

// --- INICIAR EL JUEGO AL CARGAR LA PÁGINA ---
document.addEventListener('DOMContentLoaded', mostrarPregunta);