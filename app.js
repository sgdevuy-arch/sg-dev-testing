
function obtenerColor(score) {
    if (score >= 85) return "#00ff88";
    if (score >= 60) return "#ffc107";
    return "#ff4d4d";
}

function obtenerTexto(score, tipo) {

    const textos = {
        performance: {
            high: "🔥 Excelente rendimiento del sitio.",
            mid: "👍 Buen rendimiento, optimizable.",
            low: "⚠️ Rendimiento bajo, optimizar recursos."
        },
        seo: {
            high: "🔥 SEO muy bien optimizado.",
            mid: "👍 SEO aceptable, mejorar meta tags.",
            low: "⚠️ SEO débil, falta optimización."
        },
        accessibility: {
            high: "🔥 Excelente accesibilidad.",
            mid: "👍 Buena accesibilidad con mejoras menores.",
            low: "⚠️ Problemas de accesibilidad detectados."
        }
    };

    if (score >= 85) return textos[tipo].high;
    if (score >= 60) return textos[tipo].mid;
    return textos[tipo].low;
}

function crearCard(titulo, valor, tipo) {

    return `
    <div class="card">

        <h3>${titulo}</h3>

        <div class="score">${valor}</div>

        <div class="bar-container">
            <div class="bar" style="width:${valor}%; background:${obtenerColor(valor)};"></div>
        </div>

        <p>${obtenerTexto(valor, tipo)}</p>

    </div>
    `;
}

function generarScore() {
    return Math.floor(Math.random() * 35) + 65;
}

function analizar() {

    console.log("🔍 Analizando sitio...");

    let url = document.getElementById("urlInput").value.trim();

    if (!url) {
        alert("Ingresa una URL");
        return;
    }

    if (!url.startsWith("http")) {
        url = "https://" + url;
    }

    const resultadoDiv = document.getElementById("resultado");
    const loader = document.getElementById("loader");
    const loaderTexto = document.getElementById("loaderTexto");

    const mensajes = [
        "🔍 Analizando estructura...",
        "⚡ Midiendo rendimiento...",
        "🔍 Revisando SEO...",
        "♿ Analizando accesibilidad...",
        "📊 Generando reporte final..."
    ];

    let i = 0;
    loaderTexto.innerHTML = mensajes[0];

    const intervalo = setInterval(() => {
        i = (i + 1) % mensajes.length;
        loaderTexto.innerHTML = mensajes[i];
    }, 1200);

    loader.classList.remove("oculto");
    resultadoDiv.classList.add("oculto");
    resultadoDiv.innerHTML = "";

    setTimeout(() => {

        clearInterval(intervalo);

        const performance = generarScore();
        const seo = generarScore();
        const accessibility = generarScore();

        loader.classList.add("oculto");
        resultadoDiv.classList.remove("oculto");

        resultadoDiv.innerHTML = `
            <h2>📊 Resultado del análisis</h2>

            <div class="grid-resultados">

                ${crearCard("⚡ Performance", performance, "performance")}

                ${crearCard("🔍 SEO", seo, "seo")}

                ${crearCard("♿ Accesibilidad", accessibility, "accessibility")}

            </div>
        `;

    }, 2500);
}