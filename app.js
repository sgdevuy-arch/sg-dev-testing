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

        <p>${tipo ? obtenerTexto(valor, tipo) : ""}</p>
    </div>
    `;
}

// =========================
// 📊 GENERAR MÉTRICAS REALES (SEMIREAL)
// =========================
async function generarMetricas(url) {

    const res = await fetch(url);
    const html = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const scripts = doc.querySelectorAll("script").length;
    const images = doc.querySelectorAll("img").length;
    const css = doc.querySelectorAll("link[rel='stylesheet']").length;

    // ⚡ PERFORMANCE
    let performance = 100 - (scripts * 3) - (images * 2) - (css * 2);
    performance = Math.max(0, performance);

    // 🔍 SEO
    let seo = 100;
    if (!doc.querySelector("title")) seo -= 30;
    if (!doc.querySelector("meta[name='description']")) seo -= 20;
    if (doc.querySelectorAll("h1").length !== 1) seo -= 20;
    seo = Math.max(0, seo);

    // ♿ ACCESIBILIDAD
    let missingAlt = 0;
    doc.querySelectorAll("img").forEach(img => {
        if (!img.alt || img.alt.trim() === "") missingAlt++;
    });

    let accessibility = Math.max(0, 100 - (missingAlt * 5));

    // 🧱 HTML
    let htmlScore = 100;
    if (!doc.querySelector("meta[charset]")) htmlScore -= 20;

    // 🎨 CSS
    let cssScore = Math.max(0, 100 - css * 10);

    // 🖼️ IMAGES
    let imagesScore = Math.max(0, 100 - images * 2);

    return {
        performance,
        seo,
        accessibility,
        html: htmlScore,
        css: cssScore,
        images: imagesScore,
        problemas: detectarProblemas(doc)
    };
}

// =========================
// ⚠️ DETECTAR PROBLEMAS REALES
// =========================
function detectarProblemas(doc) {

    let problemas = {
        seo: [],
        performance: [],
        accessibility: []
    };

    // ================= SEO =================
    const title = doc.querySelector("title");
    if (!title) {
        problemas.seo.push("❌ La página no tiene título (esto afecta Google y el posicionamiento)");
    }

    const desc = doc.querySelector("meta[name='description']");
    if (!desc) {
        problemas.seo.push("❌ Falta la descripción del sitio (Google no sabe de qué trata tu página)");
    }

    const h1 = doc.querySelectorAll("h1").length;
    if (h1 === 0) problemas.seo.push("❌ No hay título principal (H1)");
    if (h1 > 1) problemas.seo.push("⚠️ Hay más de un H1 (puede confundir a Google)");

    // ================= PERFORMANCE =================
    const images = doc.querySelectorAll("img").length;
    const scripts = doc.querySelectorAll("script").length;

    if (images > 10) {
        problemas.performance.push("⚠️ Muchas imágenes pueden hacer que la página cargue lenta");
    }

    if (scripts > 5) {
        problemas.performance.push("⚠️ Demasiados scripts pueden afectar la velocidad del sitio");
    }

    // ================= ACCESSIBILITY =================
    let missingAlt = 0;

    doc.querySelectorAll("img").forEach(img => {
        if (!img.alt || img.alt.trim() === "") missingAlt++;
    });

    if (missingAlt > 0) {
        problemas.accessibility.push(
            `❌ ${missingAlt} imágenes no tienen descripción (esto afecta a personas con discapacidad visual)`
        );
    }

    return problemas;
}
function generarRecomendaciones(data, problemas) {

    let r = [];

    // ================= PERFORMANCE =================
    if (data.performance < 60) {
        r.push("Tu sitio es lento. Reduce imágenes pesadas y elimina archivos innecesarios.");
    } else if (data.performance < 85) {
        r.push("Tu sitio está bien, pero podrías hacerlo más rápido optimizando imágenes.");
    } else {
        r.push("Tu sitio carga rápido. Buen trabajo.");
    }

    if (problemas.performance.length > 0) {
        r.push("Problemas detectados en rendimiento: revisa imágenes y scripts.");
    }

    // ================= SEO =================
    if (data.seo < 60) {
        r.push("Tu SEO es débil. Necesitas título, descripción y estructura correcta.");
    } else if (data.seo < 85) {
        r.push("Tu SEO es aceptable, pero puedes mejorar agregando más información para Google.");
    } else {
        r.push("Tu SEO está bien optimizado.");
    }

    if (problemas.seo.length > 0) {
        r.push("Google puede tener dificultades para entender tu página.");
    }

    // ================= ACCESIBILIDAD =================
    if (data.accessibility < 60) {
        r.push("Tu sitio tiene problemas de accesibilidad. Algunas personas no podrán usarlo bien.");
    } else if (data.accessibility < 85) {
        r.push("Tu accesibilidad es buena, pero puedes mejorar detalles como textos alternativos.");
    } else {
        r.push("Tu sitio es accesible.");
    }

    if (problemas.accessibility.length > 0) {
        r.push("Faltan descripciones en imágenes o estructura accesible.");
    }

    return r;
}

// =========================
// 🎯 CHARTS
// =========================
let charts = {};

function crearCircular(id, valor, color, label) {

    const canvas = document.getElementById(id);
    if (!canvas) return;

    if (charts[id]) charts[id].destroy();

    charts[id] = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: [label, "Restante"],
            datasets: [{
                data: [valor, 100 - valor],
                backgroundColor: [color, "#222"],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "70%",
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            }
        },
        plugins: [{
            id: "centerText",
            afterDraw(chart) {

                const { ctx, width, height } = chart;

                ctx.save();
                ctx.font = "bold 18px Arial";
                ctx.fillStyle = color;
                ctx.textAlign = "center";
                ctx.fillText(valor + "%", width / 2, height / 2 - 8);

                ctx.font = "12px Arial";
                ctx.fillStyle = "#ccc";
                ctx.fillText(label, width / 2, height / 2 + 12);

                ctx.restore();
            }
        }]
    });
}

// =========================
// 🚀 ANALIZADOR PRINCIPAL
// =========================
async function analizar() {

    let url = document.getElementById("urlInput").value.trim();
    if (!url) return alert("Ingresa una URL");

    const resultadoDiv = document.getElementById("resultado");
    const loader = document.getElementById("loader");
    const loaderTexto = document.getElementById("loaderTexto");

    loader.classList.remove("oculto");
    resultadoDiv.classList.add("oculto");

    try {

        const data = await generarMetricas(url);

        loader.classList.add("oculto");
        resultadoDiv.classList.remove("oculto");

        resultadoDiv.innerHTML = `
            <h2>📊 Resultado del análisis</h2>

            <div class="grid-resultados">
                ${crearCard("⚡ Performance", data.performance, "performance")}
                ${crearCard("🔍 SEO", data.seo, "seo")}
                ${crearCard("♿ Accesibilidad", data.accessibility, "accessibility")}
            </div>

            <h3 class="titulo-graficos">📊 Gráficos</h3>

            <div class="grid-graficos">
                <canvas id="chartPerformance"></canvas>
                <canvas id="chartSEO"></canvas>
                <canvas id="chartAccessibility"></canvas>
                <canvas id="chartHTML"></canvas>
                <canvas id="chartCSS"></canvas>
                <canvas id="chartImages"></canvas>
            </div>

            <div id="problemas"></div>
        `;

        setTimeout(() => {

            crearCircular("chartPerformance", data.performance, "#00ff88", "Performance");
            crearCircular("chartSEO", data.seo, "#ffc107", "SEO");
            crearCircular("chartAccessibility", data.accessibility, "#ff4d4d", "Accesibilidad");

            crearCircular("chartHTML", data.html, "#4dd2ff", "HTML");
            crearCircular("chartCSS", data.css, "#b84dff", "CSS");
            crearCircular("chartImages", data.images, "#ff884d", "Imágenes");

            const p = data.problemas;
            const recomendaciones = generarRecomendaciones(data, p);

document.getElementById("problemas").innerHTML = `
    <h3>⚠️ Problemas detectados</h3>

    <div class="problems-grid">

        <div>
            <h4>🔍 SEO</h4>
            <ul>
                ${p.seo.length ? p.seo.map(x => `<li>${x}</li>`).join("") : "<li>✔ Sin problemas SEO</li>"}
            </ul>
        </div>

        <div>
            <h4>⚡ Performance</h4>
            <ul>
                ${p.performance.length ? p.performance.map(x => `<li>${x}</li>`).join("") : "<li>✔ Buen rendimiento</li>"}
            </ul>
        </div>

        <div>
            <h4>♿ Accesibilidad</h4>
            <ul>
                ${p.accessibility.length ? p.accessibility.map(x => `<li>${x}</li>`).join("") : "<li>✔ Sin problemas</li>"}
            </ul>
        </div>

    </div>

    <div class="recomendaciones">
        <h3>💡 Recomendaciones</h3>
        <ul>
            ${recomendaciones.map(r => `<li>${r}</li>`).join("")}
        </ul>
    </div>
`;

        }, 200);

    } catch (err) {
        console.log(err);
        alert("Error: posible CORS o URL inválida");
    }
}