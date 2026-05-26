function obtenerColor(score){

    if(score >= 90){

        return "#00ff88";
    }

    if(score >= 50){

        return "#ffc107";
    }

    return "#ff4d4d";
}

function crearCard(titulo, valor){

    return `

        <div class="card-score">

            <h3>${titulo}</h3>

            <div class="barra-fondo">

                <div 
                    class="barra"
                    style="
                        width:${valor}%;
                        background:${obtenerColor(valor)};
                    "
                ></div>

            </div>

            <p class="numero-score">
                ${valor}
            </p>

        </div>
    `;
}

async function analizar() {

    let url = document.getElementById("urlInput").value.trim();

    if(!url.startsWith("http://") && !url.startsWith("https://")){

        url = "https://" + url;
    }

    const resultadoDiv = document.getElementById("resultado");

    const loader = document.getElementById("loader");

    const loaderTexto = document.getElementById("loaderTexto");

    // MENSAJES DEL LOADER

    const mensajes = [

        "🔍 Analizando SEO...<br><small>→ Revisando meta etiquetas</small>",

        "🔍 Analizando SEO...<br><small>→ Verificando estructura HTML</small>",

        "⚡ Midiendo rendimiento...<br><small>→ Analizando carga de imágenes</small>",

        "⚡ Midiendo rendimiento...<br><small>→ Revisando scripts JavaScript</small>",

        "⚡ Midiendo rendimiento...<br><small>→ Calculando velocidad de carga</small>",

        "♿ Revisando accesibilidad...<br><small>→ Verificando contraste de colores</small>",

        "♿ Revisando accesibilidad...<br><small>→ Analizando navegación por teclado</small>",

        "📸 Generando preview del sitio...<br><small>→ Capturando screenshot</small>",

        "🛠 Ejecutando auditorías...<br><small>→ Aplicando buenas prácticas</small>",

        "🧠 Generando recomendaciones...<br><small>→ Preparando resultados</small>"
    ];

    let indice = 0;

    loaderTexto.innerHTML = mensajes[0];

    // CAMBIAR MENSAJES AUTOMÁTICAMENTE

    const intervalo = setInterval(() => {

        indice++;

        if(indice >= mensajes.length){

            indice = 0;
        }

        loaderTexto.innerHTML = mensajes[indice];

    }, 2000);

    // MOSTRAR LOADER

    loader.classList.remove("oculto");

    resultadoDiv.classList.add("oculto");

    resultadoDiv.innerHTML = "";

    try {

        const response = await fetch("https://sg-analyzer.onrender.com/analizar", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                url: url
            })
        });

        const data = await response.json();

        // DETENER MENSAJES

        clearInterval(intervalo);

        loaderTexto.innerHTML = "";

        // OCULTAR LOADER

        loader.classList.add("oculto");

        resultadoDiv.classList.remove("oculto");

        // MOSTRAR RESULTADOS

        resultadoDiv.innerHTML = `

            <h2 class="titulo-dashboard">
                📊 Análisis del Sitio
            </h2>

            <div class="preview-container">

                <img 
                    src="http://localhost:3000/screenshots/${data.screenshot}" 
                    class="preview-img"
                >

            </div>

            <div class="cards">

                ${crearCard("⚡ Performance", data.performance)}

                ${crearCard("🔍 SEO", data.seo)}

                ${crearCard("♿ Accesibilidad", data.accessibility)}

                ${crearCard("✅ Buenas prácticas", data.bestPractices)}

            </div>

            <div class="recomendaciones">

                <h3>💡 Recomendaciones</h3>

                ${data.recomendaciones.map(item => `
                    <p>${item}</p>
                `).join("")}

            </div>
        `;

    } catch (error) {

        clearInterval(intervalo);

        loaderTexto.innerHTML = "";

        loader.classList.add("oculto");

        resultadoDiv.classList.remove("oculto");

        resultadoDiv.innerHTML = "❌ Error analizando sitio";

        console.log(error);
    }
}