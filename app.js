function obtenerColor(score) {
    if (score >= 80) return "#00ff88";
    if (score >= 50) return "#ffc107";
    return "#ff4d4d";
}

function crearCard(titulo, valor, texto) {
    return `
    <div class="card">

        <h3>${titulo}</h3>

        <div class="score">${valor}</div>

        <div class="bar-container">
            <div class="bar" style="width:${valor}%; background:${obtenerColor(valor)};"></div>
        </div>

        <p>${texto}</p>

    </div>
    `;
}

function getComentario(tipo, score) {

    if (tipo === "performance") {
        if (score >= 80) return "🔥 Excelente rendimiento del sitio";
        if (score >= 60) return "👍 Buen rendimiento, mejorable";
        return "⚠️ Rendimiento bajo, optimizar recursos";
    }

    if (tipo === "seo") {
        if (score >= 80) return "🔥 SEO bien optimizado";
        if (score >= 60) return "👍 SEO aceptable";
        return "⚠️ SEO débil";
    }

    if (tipo === "accessibility") {
        if (score >= 80) return "🔥 Buena accesibilidad";
        if (score >= 60) return "👍 Accesibilidad media";
        return "⚠️ Problemas de accesibilidad";
    }

    return "";
}

function analizar() {

    let url = document.getElementById("urlInput").value.trim();

    if (!url.startsWith("http")) {
        url = "https://" + url;
    }

    const resultadoDiv = document.getElementById("resultado");

    resultadoDiv.innerHTML = "🔍 Analizando sitio...";

    setTimeout(() => {

        // 🎲 simulación realista
        const performance = Math.floor(Math.random() * 35) + 65;
        const seo = Math.floor(Math.random() * 35) + 60;
        const accessibility = Math.floor(Math.random() * 30) + 70;
        const bestPractices = Math.floor(Math.random() * 30) + 70;

        resultadoDiv.innerHTML = `
        <h2>📊 Resultado del análisis</h2>

        <div class="grid-resultados">

            ${crearCard("⚡ Performance", performance, getComentario("performance", performance))}

            ${crearCard("🔍 SEO", seo, getComentario("seo", seo))}

            ${crearCard("♿ Accesibilidad", accessibility, getComentario("accessibility", accessibility))}

            ${crearCard("🛠 Best Practices", bestPractices, "Buenas prácticas generales del sitio")}

        </div>

        <div class="recomendaciones">
            <h3>💡 Recomendaciones</h3>
            <p>⚡ Optimizar imágenes</p>
            <p>🔍 Mejorar meta tags</p>
            <p>♿ Revisar accesibilidad</p>
            <p>🚀 Reducir scripts innecesarios</p>
        </div>
        `;

    }, 1200);
}