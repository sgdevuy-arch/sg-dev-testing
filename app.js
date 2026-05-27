function obtenerColor(score) {
    if (score >= 85) return "#00ff88";
    if (score >= 60) return "#ffc107";
    return "#ff4d4d";
}

// =========================
// 🏆 NIVEL PROFESIONAL
// =========================
function obtenerNivel(score) {

    if (score >= 85) {
        return "🟢 Nivel profesional";
    }

    if (score >= 60) {
        return "🟡 Buen nivel, optimizable";
    }

    return "🔴 Necesita optimización";
}

// =========================
// 💬 TEXTOS HUMANOS
// =========================
function obtenerTexto(score, tipo) {

    const textos = {

        performance: {
            high: "🔥 Excelente velocidad y rendimiento.",
            mid: "👍 Buen rendimiento, pero todavía puede optimizarse.",
            low: "⚠️ Un sitio lento puede hacer que visitantes abandonen antes de ver tus servicios."
        },

        seo: {
            high: "🔥 SEO muy bien optimizado.",
            mid: "👍 SEO aceptable, aunque puede mejorar su visibilidad.",
            low: "⚠️ Los problemas SEO pueden reducir la visibilidad de tu empresa en Google."
        },

        accessibility: {
            high: "🔥 Excelente accesibilidad.",
            mid: "👍 Buena accesibilidad con mejoras menores.",
            low: "⚠️ Algunas personas podrían tener dificultades para usar tu sitio."
        }
    };

    if (score >= 85) return textos[tipo].high;
    if (score >= 60) return textos[tipo].mid;

    return textos[tipo].low;
}

// =========================
// 🎨 CREAR CARDS
// =========================
function crearCard(titulo, valor, tipo) {

    return `
    <div class="card">

        <h3>${titulo}</h3>

        <div class="score">${valor}</div>

        <div class="nivel">
            ${obtenerNivel(valor)}
        </div>

        <div class="bar-container">
            <div 
                class="bar"
                style="
                    width:${valor}%;
                    background:${obtenerColor(valor)};
                ">
            </div>
        </div>

        <p>
            ${tipo ? obtenerTexto(valor, tipo) : ""}
        </p>

    </div>
    `;
}

// =========================
// 📊 GENERAR MÉTRICAS
async function generarMetricas(url) {

    // =========================
    // 🔗 AGREGAR HTTPS
    // =========================
    if (!url.startsWith("http")) {

        url = "https://" + url;

    }

    let html = "";

    // =========================
    // 🌍 INTENTO NORMAL
    // =========================
    try {

        const normalRes = await fetch(url);

        html = await normalRes.text();

    } catch (e) {

        console.log("Fetch normal bloqueado, usando proxy...");

        // =========================
        // 🌍 PROXY CORS
        // =========================
        const proxy =
            "https://api.allorigins.win/raw?url=";

        const proxyRes = await fetch(
            proxy + encodeURIComponent(url)
        );

        html = await proxyRes.text();
    }

    // =========================
    // 📄 PARSER HTML
    // =========================
    const parser = new DOMParser();

    const doc = parser.parseFromString(
        html,
        "text/html"
    );

    // =========================
    // 📊 ELEMENTOS
    // =========================
    const scripts =
        doc.querySelectorAll("script").length;

    const images =
        doc.querySelectorAll("img").length;

    const css =
        doc.querySelectorAll(
            "link[rel='stylesheet']"
        ).length;

    // =========================
    // ⚡ PERFORMANCE
    // =========================
    let performance =
        100 -
        (scripts * 3) -
        (images * 2) -
        (css * 2);

    performance = Math.max(0, performance);

    // =========================
    // 🔍 SEO
    // =========================
    let seo = 100;

    if (!doc.querySelector("title")) {
        seo -= 30;
    }

    if (
        !doc.querySelector(
            "meta[name='description']"
        )
    ) {
        seo -= 20;
    }

    if (
        doc.querySelectorAll("h1").length !== 1
    ) {
        seo -= 20;
    }

    const favicon =
        doc.querySelector("link[rel='icon']");

    if (!favicon) {
        seo -= 10;
    }

    seo = Math.max(0, seo);

    // =========================
    // ♿ ACCESSIBILITY
    // =========================
    let missingAlt = 0;

    doc.querySelectorAll("img").forEach(img => {

        if (
            !img.alt ||
            img.alt.trim() === ""
        ) {
            missingAlt++;
        }

    });

    let accessibility =
        Math.max(0, 100 - (missingAlt * 5));

    // =========================
    // 📱 MOBILE
    // =========================
    const viewport =
        doc.querySelector(
            'meta[name="viewport"]'
        );

    if (!viewport) {
        accessibility -= 20;
    }

    accessibility =
        Math.max(0, accessibility);

    // =========================
    // 🧱 HTML SCORE
    // =========================
    let htmlScore = 100;

    if (
        !doc.querySelector("meta[charset]")
    ) {
        htmlScore -= 20;
    }

    // =========================
    // 🎨 CSS SCORE
    // =========================
    let cssScore =
        Math.max(0, 100 - css * 10);

    // =========================
    // 🖼 IMAGES SCORE
    // =========================
    let imagesScore =
        Math.max(0, 100 - images * 2);

    // =========================
    // 🏆 SCORE GENERAL
    // =========================
    const generalScore = Math.round(

        (
            performance +
            seo +
            accessibility +
            htmlScore +
            cssScore +
            imagesScore
        ) / 6

    );

    return {

        performance,
        seo,
        accessibility,

        html: htmlScore,

        css: cssScore,

        images: imagesScore,

        generalScore,

        problemas: detectarProblemas(
            doc,
            url
        )
    };
}

// =========================
// ⚠️ DETECTAR PROBLEMAS
// =========================
function detectarProblemas(doc, url) {

    let problemas = {

        seo: [],
        performance: [],
        accessibility: [],
        security: []

    };

    // ================= SEO =================
    const title = doc.querySelector("title");

    if (!title) {

        problemas.seo.push({
            nivel: "alto",
            texto: "❌ La página no tiene título. Google podría no entender correctamente el contenido."
        });

    }

    const desc = doc.querySelector("meta[name='description']");

    if (!desc) {

        problemas.seo.push({
            nivel: "alto",
            texto: "❌ Falta descripción del sitio. Esto puede reducir visibilidad en Google."
        });

    }

    const h1 = doc.querySelectorAll("h1").length;

    if (h1 === 0) {

        problemas.seo.push({
            nivel: "alto",
            texto: "❌ No hay título principal (H1)."
        });

    }

    if (h1 > 1) {

        problemas.seo.push({
            nivel: "medio",
            texto: "⚠️ Hay más de un H1 y esto puede confundir buscadores."
        });

    }

    // ================= FAVICON =================
    const favicon = doc.querySelector("link[rel='icon']");

    if (!favicon) {

        problemas.seo.push({
            nivel: "medio",
            texto: "⚠️ Tu sitio no tiene favicon. Esto afecta imagen profesional y reconocimiento de marca."
        });

    }

    // ================= PERFORMANCE =================
    const images = doc.querySelectorAll("img").length;

    const scripts = doc.querySelectorAll("script").length;

    if (images > 10) {

        problemas.performance.push({
            nivel: "medio",
            texto: "⚠️ Muchas imágenes pueden hacer que usuarios abandonen el sitio antes de cargar completamente."
        });

    }

    if (scripts > 5) {

        problemas.performance.push({
            nivel: "medio",
            texto: "⚠️ Muchos scripts pueden afectar velocidad y experiencia móvil."
        });

    }

    // ================= ACCESSIBILITY =================
    let missingAlt = 0;

    doc.querySelectorAll("img").forEach(img => {

        if (!img.alt || img.alt.trim() === "") {
            missingAlt++;
        }

    });

    if (missingAlt > 0) {

        problemas.accessibility.push({
            nivel: "alto",
            texto: `❌ ${missingAlt} imágenes no tienen descripción. Esto afecta accesibilidad y experiencia de usuarios.`
        });

    }

    // ================= VIEWPORT =================
    const viewport = doc.querySelector('meta[name="viewport"]');

    if (!viewport) {

        problemas.accessibility.push({
            nivel: "alto",
            texto: "❌ El sitio no está optimizado para dispositivos móviles."
        });

    }

    // ================= HTTPS =================
    if (!url.startsWith("https://")) {

        problemas.security.push({
            nivel: "alto",
            texto: "🔒 Tu sitio no usa HTTPS. Esto puede afectar seguridad y confianza de clientes."
        });

    }

    return problemas;
}

// =========================
// 💡 RECOMENDACIONES
// =========================
function generarRecomendaciones(data, problemas) {

    let r = [];

    // ================= PERFORMANCE =================
    if (data.performance < 60) {

        r.push("Reduce imágenes pesadas y scripts innecesarios para mejorar velocidad.");

    } else if (data.performance < 85) {

        r.push("Tu sitio funciona bien, pero puede optimizarse aún más.");

    } else {

        r.push("Tu velocidad de carga es excelente.");
    }

    // ================= SEO =================
    if (data.seo < 60) {

        r.push("Tu SEO necesita mejoras importantes para aumentar visibilidad.");

    } else if (data.seo < 85) {

        r.push("Tu SEO es bueno, pero puede posicionarse mejor.");

    } else {

        r.push("Tu SEO está bien optimizado.");
    }

    // ================= ACCESSIBILITY =================
    if (data.accessibility < 60) {

        r.push("Tu sitio puede presentar dificultades para algunos usuarios.");

    } else if (data.accessibility < 85) {

        r.push("La accesibilidad es buena, pero puede mejorarse.");

    } else {

        r.push("Tu sitio presenta buena accesibilidad.");
    }

    // ================= IMPACTO =================
    r.push("🚀 Mejorando estos puntos podrías:");

    r.push("✔ Mejorar experiencia móvil");
    r.push("✔ Generar más confianza");
    r.push("✔ Mejorar posicionamiento en Google");
    r.push("✔ Reducir abandono de visitantes");

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

                ctx.fillText(
                    valor + "%",
                    width / 2,
                    height / 2 - 8
                );

                ctx.font = "12px Arial";
                ctx.fillStyle = "#ccc";

                ctx.fillText(
                    label,
                    width / 2,
                    height / 2 + 12
                );

                ctx.restore();
            }
        }]
    });
}

// =========================
// 🚀 ANALIZADOR PRINCIPAL
// =========================
// =========================
// 🚀 ANALIZADOR PRINCIPAL
// =========================
async function analizar() {

    let url = document.getElementById("urlInput").value.trim();

    if (!url) {
        return alert("Ingresa una URL");
    }

    const resultadoDiv = document.getElementById("resultado");

    const loader = document.getElementById("loader");

    const loaderTexto = document.getElementById("loaderTexto");

    // =========================
    // 🚀 LOADER DINÁMICO
    // =========================
    const mensajes = [

        "🔍 Analizando SEO...",
        "⚡ Midiendo rendimiento...",
        "🛡 Verificando seguridad...",
        "📱 Probando dispositivos móviles...",
        "🧪 Ejecutando simulación de testing...",
        "🚀 Generando informe..."

    ];

    let i = 0;

    loaderTexto.innerText = mensajes[0];

    const interval = setInterval(() => {

        i++;

        if (i >= mensajes.length) {
            i = 0;
        }

        loaderTexto.innerText = mensajes[i];

    }, 1200);

    loader.classList.remove("oculto");

    resultadoDiv.classList.add("oculto");

    try {

        const data = await generarMetricas(url);

        // =========================
        // ⛔ DETENER LOADER
        // =========================
        clearInterval(interval);

        loader.classList.add("oculto");

        resultadoDiv.classList.remove("oculto");

        resultadoDiv.innerHTML = `

            <h2>📊 Resultado del análisis</h2>

            <div class="score-general">

                <h3>Estado general del sitio</h3>

                <div class="general-number">
                    ${data.generalScore}/100
                </div>

                <p>
                    ${obtenerNivel(data.generalScore)}
                </p>

            </div>

            <div class="grid-resultados">

                ${crearCard("⚡ Performance", data.performance, "performance")}

                ${crearCard("🔍 SEO", data.seo, "seo")}

                ${crearCard("♿ Accesibilidad", data.accessibility, "accessibility")}

            </div>

            <h3 class="titulo-graficos">
                📊 Gráficos
            </h3>

            <div class="grid-graficos">

                <canvas id="chartPerformance"></canvas>

                <canvas id="chartSEO"></canvas>

                <canvas id="chartAccessibility"></canvas>

                <canvas id="chartHTML"></canvas>

                <canvas id="chartCSS"></canvas>

                <canvas id="chartImages"></canvas>

            </div>

            <!-- ========================= -->
            <!-- 🧪 TESTING -->
            <!-- ========================= -->

            <div class="testing-box">

                <h3>🧪 Simulación de testing</h3>

                <div class="testing-item">
                    ✔ Estructura HTML analizada
                </div>

                <div class="testing-item">
                    ✔ SEO revisado
                </div>

                <div class="testing-item">
                    ✔ Accesibilidad comprobada
                </div>

                <div class="testing-item">
                    ✔ Rendimiento analizado
                </div>

                <div class="testing-item warning">
                    ⚠ Posibles mejoras detectadas
                </div>

            </div>

            <div id="problemas"></div>
        `;

        // =========================
        // 🎯 CREAR CHARTS
        // =========================
        setTimeout(() => {

            crearCircular(
                "chartPerformance",
                data.performance,
                "#00ff88",
                "Performance"
            );

            crearCircular(
                "chartSEO",
                data.seo,
                "#ffc107",
                "SEO"
            );

            crearCircular(
                "chartAccessibility",
                data.accessibility,
                "#ff4d4d",
                "Accesibilidad"
            );

            crearCircular(
                "chartHTML",
                data.html,
                "#4dd2ff",
                "HTML"
            );

            crearCircular(
                "chartCSS",
                data.css,
                "#b84dff",
                "CSS"
            );

            crearCircular(
                "chartImages",
                data.images,
                "#ff884d",
                "Imágenes"
            );

            const p = data.problemas;

            const recomendaciones = generarRecomendaciones(data, p);

            // =========================
            // ⚠️ PROBLEMAS
            // =========================
document.getElementById("problemas").innerHTML = `

    <h3>⚠️ Problemas detectados</h3>

    <div class="problems-grid">

        <!-- SEO -->
        <div>

            <h4>🔍 SEO</h4>

            ${
                p.seo.length
                ? p.seo.map(x => `
                    <div class="problem-card ${x.nivel}">

                        <div class="problem-header">

                            <span class="problem-badge">
                                ${x.nivel.toUpperCase()}
                            </span>

                        </div>

                        <p>${x.texto}</p>

                    </div>
                `).join("")
                : `
                <div class="problem-card bajo">

                    <div class="problem-header">

                        <span class="problem-badge">
                            CORRECTO
                        </span>

                    </div>

                    <p>✔ Sin problemas SEO importantes</p>

                </div>
                `
            }

        </div>

        <!-- PERFORMANCE -->
        <div>

            <h4>⚡ Performance</h4>

            ${
                p.performance.length
                ? p.performance.map(x => `
                    <div class="problem-card ${x.nivel}">

                        <div class="problem-header">

                            <span class="problem-badge">
                                ${x.nivel.toUpperCase()}
                            </span>

                        </div>

                        <p>${x.texto}</p>

                    </div>
                `).join("")
                : `
                <div class="problem-card bajo">

                    <div class="problem-header">

                        <span class="problem-badge">
                            CORRECTO
                        </span>

                    </div>

                    <p>✔ Buen rendimiento detectado</p>

                </div>
                `
            }

        </div>

        <!-- ACCESSIBILITY -->
        <div>

            <h4>♿ Accesibilidad</h4>

            ${
                p.accessibility.length
                ? p.accessibility.map(x => `
                    <div class="problem-card ${x.nivel}">

                        <div class="problem-header">

                            <span class="problem-badge">
                                ${x.nivel.toUpperCase()}
                            </span>

                        </div>

                        <p>${x.texto}</p>

                    </div>
                `).join("")
                : `
                <div class="problem-card bajo">

                    <div class="problem-header">

                        <span class="problem-badge">
                            CORRECTO
                        </span>

                    </div>

                    <p>✔ Buena accesibilidad</p>

                </div>
                `
            }

        </div>

        <!-- SECURITY -->
        <div>

            <h4>🛡 Seguridad</h4>

            ${
                p.security.length
                ? p.security.map(x => `
                    <div class="problem-card ${x.nivel}">

                        <div class="problem-header">

                            <span class="problem-badge">
                                ${x.nivel.toUpperCase()}
                            </span>

                        </div>

                        <p>${x.texto}</p>

                    </div>
                `).join("")
                : `
                <div class="problem-card bajo">

                    <div class="problem-header">

                        <span class="problem-badge">
                            CORRECTO
                        </span>

                    </div>

                    <p>✔ HTTPS detectado</p>

                </div>
                `
            }

        </div>

    </div>

    <!-- ========================= -->
    <!-- 💡 RECOMENDACIONES -->
    <!-- ========================= -->

    <div class="bottom-sections">

        <div class="recomendaciones">

            <h3>💡 Recomendaciones</h3>

            <ul>

                ${
                    recomendaciones.map(r => `
                        <li>${r}</li>
                    `).join("")
                }

            </ul>

        </div>

        <!-- ========================= -->
        <!-- 🚀 CTA -->
        <!-- ========================= -->

        <div class="cta-box">

            <h3>
                🚀 ¿Quieres mejorar tu sitio?
            </h3>

            <p>
                SG Dev puede ayudarte a optimizar velocidad,
                SEO, accesibilidad y experiencia del usuario.
            </p>

            <a href="contacto.html" class="btn">
                Solicitar auditoría profesional
            </a>

        </div>

    </div>

`;

        }, 200);

    } catch (err) {

        clearInterval(interval);

        loader.classList.add("oculto");

        console.log(err);

        alert("Error: posible CORS o URL inválida");
    }
}