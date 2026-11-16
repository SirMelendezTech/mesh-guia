/* Calculadora de repetidores MeshCore: la vista #/calculadora de Mesh PR.
   - index.html llama a MeshCalc.render() cuando la ruta es #/calculadora.
   - Todo se calcula en el navegador. Lo que la persona escribe va en el enlace
     (#/calculadora?rol=…&vecinos=…), así puede recargar sin perderlo y compartirlo.
     Ese texto va después del #, así que no llega al servidor.
   - Los valores por densidad salen del white paper de cdme.sh (rev. 1.1, §9.4.2). */
"use strict";
window.MeshCalc = (() => {
  const PARAMS = ["txdelay", "direct.txdelay", "rxdelay"];
  const READ = PARAMS.map((p) => "get " + p);
  const QUERY = ["neighbors", ...READ];
  const MAX_AGE = 14 * 24 * 60 * 60;
  const DEFAULTS = [0.5, 0.3, 0];
  const MAXIMUMS = [2, 2, 20];
  /* fila = cantidad de vecinos que cuentan (0 a 12 o más): [txdelay, direct.txdelay, rxdelay] */
  const TABLE = [
    [1.0, 0.4, 2], [1.1, 0.5, 2], [1.2, 0.6, 3], [1.2, 0.6, 3],
    [1.3, 0.7, 3], [1.4, 0.7, 3], [1.5, 0.7, 4], [1.6, 0.8, 4],
    [1.7, 0.8, 4], [1.8, 0.8, 5], [1.9, 0.9, 6], [2.0, 0.9, 7],
    ["2.1–2.5", 0.9, 8]
  ];
  const DEMO = [
    "Cerro Gordo  SNR: 6.5 dB  heard: 2h15m ago",
    "Torre Bayamón  SNR: 3.25 dB  heard: 1d4h ago",
    "Azotea Caguas  SNR: -2.3 dB  heard: 51s ago",
    "A1B2C3D4  SNR: 0.0 dB  heard: 6140h2m ago"
  ].join("\n");
  const UNITS = { d: 86400, h: 3600, m: 60, s: 1 };
  const UNIT_NAMES = { d: "d", h: "h", m: "min", s: "s" };
  const decimal = /^[+-]?(?:\d+(?:[.,]\d+)?|[.,]\d+)$/;
  const rawNeighbor = /^([0-9a-f]{8})\s*:\s*(\d+)\s*:\s*([+-]?\d+)$/i;
  const textNeighbor = /^(.+?)\s+SNR\s*:\s*([+-]?(?:\d+(?:[.,]\d+)?|[.,]\d+))\s*dB\s+(?:heard|escuchado)\s*:\s*(.+)$/i;
  const ROLES = {
    local: "Cobertura local: da señal a Companions cerca",
    link: "Enlace: conecta con otros repeaters lejos",
    mixed: "Las dos cosas"
  };
  const TESTS = { channel: "canal", direct: "directo" };
  const ROUTE_TEXT = {
    unknown: "No confirmaste la ruta. La comparación muestra lo que llegó, pero los mensajes pudieron tomar otro camino.",
    same: "Confirmaste que las dos rondas pasaron por el repeater por la misma ruta.",
    changed: "La ruta cambió o no pasó por el repeater. Repite la prueba antes de culpar o dar crédito al ajuste."
  };
  const nf = new Intl.NumberFormat("es-PR", { maximumFractionDigits: 2 });
  const fmt = (v) => nf.format(v);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const toNumber = (v) => decimal.test(v) ? Number(v.replace(",", ".")) : NaN;

  /* ---------- lectura de la lista de vecinos ---------- */
  function parseAge(input) {
    const age = input.toLowerCase().trim().replace(/^hace\s+|\s+ago$/g, "").trim();
    if (/^(?:just now|now|ahora|ahora mismo)$/.test(age)) return 0;
    if (!/^(?:\d+\s*[dhms]\s*)+$/.test(age)) return NaN;
    let seconds = 0;
    const seen = new Set();
    for (const [, n, unit] of age.matchAll(/(\d+)\s*([dhms])/g)) {
      if (seen.has(unit)) return NaN;
      seen.add(unit);
      seconds += Number(n) * UNITS[unit];
    }
    return seconds;
  }

  function parseNeighbors(input) {
    const found = new Map();
    const invalid = [];
    let duplicates = 0, cliBytes = 0, rawCount = 0, confirmedEmpty = false;
    input.split(/\r?\n/).forEach((source, index) => {
      const line = source.trim().replace(/^(?:->|>)\s*/, "").replace(/−/g, "-");
      if (!line || /^neighbors$/i.test(line)) return;
      if (/^-none-$/i.test(line)) { confirmedEmpty = true; return; }
      const raw = line.match(rawNeighbor);
      const pretty = raw ? null : line.match(textNeighbor);
      const name = (raw?.[1] ?? pretty?.[1] ?? "").trim();
      const snr = raw ? Number(raw[3]) / 4 : Number(pretty?.[2].replace(",", "."));
      const age = raw ? Number(raw[2]) : parseAge(pretty?.[3] ?? "");
      if (!name || !Number.isFinite(snr) || !Number.isSafeInteger(age)) { invalid.push(index + 1); return; }
      if (raw) { rawCount++; cliBytes += line.length + 1; }
      const key = name.toLowerCase().replace(/\s+/g, " ");
      const prev = found.get(key);
      if (prev) duplicates++;
      if (!prev || age < prev.age) found.set(key, { name, snr, age });
    });
    return { neighbors: [...found.values()], invalid, duplicates, rawCount, cliBytes, confirmedEmpty };
  }

  function assess(n) {
    const reasons = [];
    if (n.snr <= 0) reasons.push("señal de 0 dB o menos");
    if (n.age > MAX_AGE) reasons.push("hace más de 14 días");
    return { ...n, reasons };
  }

  function recommend(role, count) {
    const reference = TABLE[Math.min(count, TABLE.length - 1)];
    const density = count < 4 ? "Baja" : count < 9 ? "Media" : count < 11 ? "Alta" : "Regional";
    let proposed = [Math.min(2, Number.parseFloat(reference[0])), reference[1], reference[2]];
    let why = "Para un enlace entre repeaters, el punto de partida sale de la tabla de densidad del white paper (§9.4.2). Prueba la entrega antes de dejarlo fijo.";
    if (role === "local") {
      proposed = DEFAULTS;
      why = "Para cobertura local, empieza con los valores de fábrica de MeshCore. Con rxdelay en 0, el repeater atiende enseguida los mensajes débiles que quizá solo él escucha.";
      if (count >= 4) why += " Oye varios repeaters: mide la entrega de canal antes de probar un txdelay más alto.";
    } else if (role === "mixed") {
      proposed[2] = 0;
      why = "Para un repeater que hace las dos cosas, las esperas de retransmisión siguen la tabla de densidad y rxdelay se queda en 0 para no perder la cobertura local.";
    }
    return { reference, density, proposed, why };
  }

  const ageLabel = (s) => {
    if (s === 0) return "ahora";
    const parts = [];
    for (const [u, size] of Object.entries(UNITS)) {
      const n = Math.floor(s / size);
      if (n) parts.push(n + " " + UNIT_NAMES[u]);
      s %= size;
    }
    return parts.slice(0, 2).join(" ");
  };
  const show = (v, i) => typeof v === "number" && i < 2 && Number.isInteger(v) ? v.toFixed(1) : String(v);
  const setCommands = (values) => PARAMS.map((p, i) => `set ${p} ${values[i]}`);

  /* ---------- plantilla ---------- */
  const cmdList = (id, label) => `<ul class="cmd-list" id="${id}" aria-label="${label}"></ul>`;
  const anchor = (id, text) => `<a class="anchor" href="#/calculadora#${id}" aria-label="Copiar enlace a la sección ${text}" title="Copiar enlace a esta sección">#</a>`;
  function stage(type, n, legend, guide) {
    const base = `calc-${type}-${n}`;
    return `<fieldset>
      <legend>${legend}</legend>
      <p class="calc-hint" id="${base}-hint">${guide}</p>
      <div class="calc-samples">
        <div><label for="${base}-sent">Enviados por A</label>
          <input id="${base}-sent" inputmode="numeric" autocomplete="off" aria-describedby="${base}-hint"></div>
        <div><label for="${base}-received">Recibidos por B</label>
          <input id="${base}-received" inputmode="numeric" autocomplete="off" aria-describedby="${base}-hint"></div>
      </div>
    </fieldset>`;
  }
  function testGroup(type) {
    const ack = type === "direct" ? `<details>
        <summary>Tiempo de confirmación (opcional)</summary>
        <div>
          <p class="calc-hint" id="calc-ack-hint">Cuando un mensaje directo llega, B devuelve una confirmación (ACK). Si tu app muestra cuánto tardó, anota el tiempo típico de cada ronda, en segundos.</p>
          <div class="calc-samples">
            <div><label for="calc-ack-1">Antes</label><input id="calc-ack-1" inputmode="decimal" autocomplete="off" aria-describedby="calc-ack-hint"></div>
            <div><label for="calc-ack-2">Después</label><input id="calc-ack-2" inputmode="decimal" autocomplete="off" aria-describedby="calc-ack-hint"></div>
          </div>
          <p class="calc-status" id="calc-ack-out" aria-live="polite"></p>
        </div>
      </details>` : "";
    return `<div id="calc-${type}" class="calc-test" hidden>
      ${stage(type, 1, "Ronda 1: con los ajustes de ahora",
        "A envía 10 mensajes numerados (R1-01 a R1-10), unos segundos aparte. Si B recibió 7, escribe 10 y 7.")}
      ${stage(type, 2, "Ronda 2: después de cambiar un ajuste",
        "Aplica y verifica un solo ajuste. Repite desde los mismos lugares con R2-01 a R2-10. Si B recibió 9, escribe 10 y 9.")}
      <div class="calc-result">
        <h3>Resultado</h3>
        <p id="calc-${type}-out" aria-live="polite"></p>
        <p class="calc-hint">Si un mensaje llega dos veces, cuéntalo una vez. Si no llegó ninguno, escribe 0.</p>
      </div>
      ${ack}
    </div>`;
  }

  const TEMPLATE = `<div class="doc mc calc">
  <div class="doc-bar">
    <a class="back" href="#/">Todas las guías</a>
    <span class="tag">MeshCore</span>
    <span class="actions"><button class="icon-btn" type="button" data-calc-share>Compartir enlace</button></span>
  </div>
  <h1>Calculadora de repetidores</h1>
  <p class="calc-lead">Pega la lista de vecinos de tu repeater MeshCore. Te damos los valores de espera para probar, los comandos listos para copiar y una prueba sencilla para ver si ayudaron.</p>
  <details class="calc-help">
    <summary>¿Qué son estos ajustes?</summary>
    <div>
      <p>Cuando dos repeaters retransmiten el mismo mensaje a la vez, chocan y nadie lo recibe. Para evitarlo, cada uno espera un tiempo al azar antes de retransmitir. Mientras más vecinos tiene, más espacio necesita.</p>
      <dl class="calc-terms">
        <dt><code>txdelay</code></dt><dd>Cuánto espera antes de retransmitir mensajes de canal (los que llegan a todos).</dd>
        <dt><code>direct.txdelay</code></dt><dd>Lo mismo, para mensajes directos entre dos personas.</dd>
        <dt><code>rxdelay</code></dt><dd>Espera antes de atender lo que recibe, para dar prioridad a las señales fuertes. En 0 no espera.</dd>
      </dl>
      <p>Necesitas acceso de administrador al repeater. Si no lo tienes, igual puedes calcular y compartir el enlace con quien lo administra.</p>
    </div>
  </details>

  <section aria-labelledby="datos">
    <h2 id="datos">1. Datos del repeater ${anchor("datos", "Datos del repeater")}</h2>
    <form id="calc-form" novalidate>
      <div class="calc-field">
        <label for="calc-role">¿Para qué sirve este repeater?</label>
        <select id="calc-role">
          ${Object.entries(ROLES).map(([v, t]) => `<option value="${v}">${t}</option>`).join("")}
        </select>
      </div>
      <div class="calc-field">
        <label for="calc-neighbors">Lista de vecinos</label>
        <span class="calc-hint" id="calc-formats">Una línea por vecino con nombre o ID, SNR y cuándo se escuchó. También sirve la respuesta del comando <code>neighbors</code>. Si el repeater no tiene vecinos, escribe <code>-none-</code>.</span>
        <textarea id="calc-neighbors" spellcheck="false" autocapitalize="off" autocomplete="off" wrap="off" rows="6"
          aria-describedby="calc-formats calc-error" placeholder="Cerro Gordo  SNR: 6.5 dB  heard: 2h15m ago&#10;A1B2C3D4:312:26"></textarea>
        <p id="calc-error" class="calc-error" role="alert"></p>
      </div>
      <div class="calc-actions">
        <button class="icon-btn primary" type="submit">Calcular ajustes</button>
        <button class="icon-btn" type="button" id="calc-demo">Probar con un ejemplo</button>
      </div>
    </form>
    <details>
      <summary>Cómo sacar la lista de vecinos</summary>
      <div>
        <p>Usa un Companion que llegue al repeater por radio. Abre el contacto del repeater que vas a ajustar.</p>
        <ul>
          <li><strong>App MeshCore:</strong> toca <strong>Manage</strong> e inicia sesión como administrador. Ve a <strong>Settings → Neighbours</strong> y usa la vista de lista. Los comandos se envían en <strong>Command Line</strong>.</li>
          <li><strong>MeshMonitor:</strong> escoge tu fuente <strong>Companion</strong>, abre el contacto y toca <strong>Get Neighbours</strong>. Los comandos se envían en <strong>Remote administration</strong>.</li>
        </ul>
        <p>El comando <code>neighbors</code> muestra hasta 8 vecinos y la respuesta puede salir cortada. Si crees que faltan, usa la vista de lista o <strong>Get Neighbours</strong>.</p>
        <p>Estos comandos leen la lista y los valores de ahora. Envía uno a la vez:</p>
        ${cmdList("calc-collect", "Comandos para leer los datos")}
      </div>
    </details>
    <details id="calc-current">
      <summary>Guardar los valores de ahora (opcional)</summary>
      <div>
        <p class="calc-hint" id="calc-current-hint">Escribe lo que respondieron los tres <code>get</code>. Te damos los comandos para volver a esos valores si algo sale mal.</p>
        <div class="calc-three">
          <div><label for="calc-old-0"><code>txdelay</code></label><input id="calc-old-0" inputmode="decimal" autocomplete="off" placeholder="0.5" aria-describedby="calc-current-hint calc-current-status"></div>
          <div><label for="calc-old-1"><code>direct.txdelay</code></label><input id="calc-old-1" inputmode="decimal" autocomplete="off" placeholder="0.3" aria-describedby="calc-current-hint calc-current-status"></div>
          <div><label for="calc-old-2"><code>rxdelay</code></label><input id="calc-old-2" inputmode="decimal" autocomplete="off" placeholder="0" aria-describedby="calc-current-hint calc-current-status"></div>
        </div>
        <p id="calc-current-status" class="calc-status" aria-live="polite"></p>
        <div id="calc-restore-wrap" hidden>
          <p>Para volver atrás, envía estos:</p>
          ${cmdList("calc-restore", "Comandos para volver a los valores de antes")}
        </div>
      </div>
    </details>
  </section>

  <section id="calc-results" aria-labelledby="ajustes" hidden>
    <h2 id="ajustes" tabindex="-1">2. Ajustes para probar ${anchor("ajustes", "Ajustes para probar")}</h2>
    <p id="calc-why"></p>
    <div class="radio-strip">
      <dl aria-label="Resumen de vecinos">
        <div><dt>Vecinos que cuentan</dt><dd id="calc-count"></dd></div>
        <div><dt>No cuentan</dt><dd id="calc-excluded"></dd></div>
        <div><dt>Densidad</dt><dd id="calc-density"></dd></div>
      </dl>
    </div>
    <div id="calc-warnings" class="calc-warn" hidden></div>
    <dl class="calc-values" id="calc-values"></dl>
    <p class="calc-hint">Durante la prueba, deja igual el resto del radio de la red, incluido el coding rate. Los valores del white paper son una referencia experimental.</p>
    <details>
      <summary>Ver qué vecinos cuentan y por qué</summary>
      <div id="calc-neighbor-table"></div>
    </details>

    <h3>Cómo aplicarlos</h3>
    <ol>
      <li>Abre <strong>Command Line</strong> (app MeshCore) o <strong>Remote administration</strong> (MeshMonitor) con sesión de administrador.</li>
      <li>Copia un comando <code>set</code>, pégalo y envíalo. Espera la respuesta del repeater.</li>
      <li>Envía su <code>get</code> para confirmar el valor. Si el <code>set</code> no respondió, revisa con <code>get</code> antes de repetirlo.</li>
      <li>Cambia un ajuste a la vez y haz la prueba de abajo. Así sabes cuál ayudó.</li>
    </ol>
    <h3>Aplicar</h3>
    ${cmdList("calc-apply", "Comandos para aplicar los ajustes")}
    <h3>Confirmar</h3>
    ${cmdList("calc-verify", "Comandos para confirmar los ajustes")}
    <div class="calc-share">
      <p>¿Quieres que otra persona revise o aplique estos ajustes? El enlace abre la calculadora con tu lista ya puesta.</p>
      <button class="icon-btn" type="button" data-calc-share>Compartir enlace</button>
    </div>
  </section>

  <section aria-labelledby="prueba">
    <h2 id="prueba">3. Prueba de campo (opcional) ${anchor("prueba", "Prueba de campo")}</h2>
    <p>Comprueba si el cambio hizo que lleguen más mensajes. Necesitas dos Companions en lugares fijos: <strong>A envía</strong> y <strong>B cuenta lo que recibió</strong>. Escoge lugares donde los mensajes tengan que pasar por el repeater. Si pruebas cobertura local, busca un sitio donde la señal suele ser débil.</p>
    <div class="calc-field">
      <label for="calc-test-type">¿Qué ajuste vas a probar?</label>
      <select id="calc-test-type" aria-describedby="calc-test-hint">
        <option value="channel">txdelay o rxdelay, con mensajes de canal</option>
        <option value="direct">direct.txdelay, con mensajes directos</option>
      </select>
      <p class="calc-hint" id="calc-test-hint"></p>
    </div>
    ${testGroup("channel")}
    ${testGroup("direct")}
    <details>
      <summary>Comprobar la ruta (opcional)</summary>
      <div>
        <p>Si tu app enseña por dónde pasó cada mensaje, mira si el repeater sale en las dos rondas. En MeshMonitor, <strong>Trace Path</strong> también enseña la ruta entre los dos lugares.</p>
        <label for="calc-route">¿Pudiste comprobar la ruta?</label>
        <select id="calc-route">
          <option value="unknown">No la comprobé</option>
          <option value="same">Sí, pasó por el repeater igual en las dos rondas</option>
          <option value="changed">Cambió o no pasó por el repeater</option>
        </select>
      </div>
    </details>
    <p id="calc-route-status" class="calc-status" aria-live="polite"></p>
  </section>

  <section aria-labelledby="fuentes">
    <h2 id="fuentes">Fuentes ${anchor("fuentes", "Fuentes")}</h2>
    <ul>
      <li><a href="https://cdme.sh/repeaters/radio-tuning-whitepaper" target="_blank" rel="noopener">White paper de ajuste de radio, revisión 1.1</a>. Sección 6.3 para el límite de 14 días y 9.4.2 para los valores por densidad.</li>
      <li><a href="https://docs.meshcore.io/cli_commands/" target="_blank" rel="noopener">Comandos de MeshCore</a> y <a href="https://docs.domca.nl/en/cli/neighbors/" target="_blank" rel="noopener">formato de la respuesta de <code>neighbors</code></a>. El máximo de <code>txdelay</code> es 2.</li>
      <li><a href="https://wiki.samesh.au/meshcore/repeater-settings" target="_blank" rel="noopener">Perfiles de repeaters de SA Mesh</a>, que recomiendan <code>rxdelay 0</code> para cobertura local.</li>
      <li><a href="https://meshcore.cz/en:navody:repeater" target="_blank" rel="noopener">Administración remota desde la app MeshCore</a> y <a href="https://meshcore.cz/en:zacinam:tipy" target="_blank" rel="noopener">vecinos desde la app</a>.</li>
      <li><a href="https://meshmonitor.org/features/meshcore" target="_blank" rel="noopener">MeshMonitor para MeshCore</a>.</li>
    </ul>
    <p class="calc-hint">Todo se calcula en tu teléfono o computadora. Lo que escribes solo sale de aquí si compartes el enlace.</p>
  </section>
</div>`;

  /* ---------- vista ---------- */
  let root = null;
  let ui = null;
  let urlTimer;
  const routes = { channel: "unknown", direct: "unknown" };
  const $ = (id) => root.querySelector("#" + id);
  /* Solo cambia el texto si es otro: así las regiones aria-live no repiten lo mismo con cada tecla. */
  const say = (id, text) => { const el = $(id); if (el.textContent !== text) el.textContent = text; };
  let lastToast = "";
  /* VoiceOver no repite un aviso idéntico al anterior; un espacio duro invisible lo hace distinto. */
  const notify = (text) => { if (text === lastToast) text += "\u00A0"; lastToast = text; ui.toast(text); };
  const val = (id) => $(id).value.trim();

  function renderCommands(list, commands) {
    list.replaceChildren(...commands.map((cmd) => {
      const li = document.createElement("li");
      const code = document.createElement("code");
      code.textContent = cmd;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "icon-btn copy-btn";
      btn.textContent = "Copiar";
      btn.setAttribute("aria-label", "Copiar " + cmd);
      btn.dataset.cmd = cmd;
      li.append(code, btn);
      return li;
    }));
  }

  async function copyCommand(btn) {
    const cmd = btn.dataset.cmd;
    if (await ui.copyText(cmd)) { notify("Copiado: " + cmd); return; }
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(btn.previousElementSibling);
    sel?.removeAllRanges();
    sel?.addRange(range);
    notify("No se pudo copiar. El comando quedó seleccionado: cópialo a mano.");
  }

  function renderValues(proposed, reference) {
    const meaning = ["Mensajes de canal", "Mensajes directos", "Prioridad a señales fuertes"];
    $("calc-values").innerHTML = PARAMS.map((p, i) => `<div>
      <dt><code>${p}</code><span>${meaning[i]}</span></dt>
      <dd><strong>${esc(show(proposed[i], i))}</strong><small>White paper: ${esc(show(reference[i], i))}</small></dd>
    </div>`).join("");
  }

  function renderNeighborTable(list) {
    const box = $("calc-neighbor-table");
    if (!list.length) { box.innerHTML = `<p>El repeater dijo que no tiene vecinos.</p>`; return; }
    const rows = [...list].sort((a, b) => a.age - b.age).map((n) => `<tr>
      <td>${esc(n.name)}</td><td>${fmt(n.snr)} dB</td><td>hace ${esc(ageLabel(n.age))}</td>
      <td class="${n.reasons.length ? "calc-no" : "calc-yes"}">${n.reasons.length ? "No: " + esc(new Intl.ListFormat("es").format(n.reasons)) : "Sí"}</td>
    </tr>`).join("");
    box.innerHTML = `<div class="table-wrap" tabindex="0" role="region" aria-label="Vecinos">
      <table><thead><tr><th scope="col">Vecino</th><th scope="col">SNR</th><th scope="col">Escuchado</th><th scope="col">¿Cuenta?</th></tr></thead>
      <tbody>${rows}</tbody></table></div>
      <p class="calc-hint">Cuentan los vecinos directos con SNR mayor de 0 dB escuchados en los últimos 14 días.</p>`;
  }

  function calculate({ moveFocus = true } = {}) {
    const p = parseNeighbors($("calc-neighbors").value);
    let error = "";
    if (p.confirmedEmpty && (p.neighbors.length || p.invalid.length)) {
      error = "Pusiste -none- junto con otras líneas. Pega la respuesta de una sola consulta.";
    } else if (!p.neighbors.length && !p.confirmedEmpty) {
      error = p.invalid.length
        ? `No reconocimos ningún vecino. Revisa el formato de la línea ${p.invalid.slice(0, 8).join(", ")}. Cada línea necesita nombre, SNR y cuándo se escuchó.`
        : "Pega la lista de vecinos, o escribe -none- si el repeater no tiene.";
    }
    say("calc-error", error);
    $("calc-neighbors").setAttribute("aria-invalid", String(Boolean(error)));
    $("calc-results").hidden = Boolean(error);
    if (error) { if (moveFocus) $("calc-neighbors").focus(); return; }

    const assessed = p.neighbors.map(assess);
    const count = assessed.filter((n) => !n.reasons.length).length;
    const role = $("calc-role").value;
    const { reference, density, proposed, why } = recommend(role, count);
    const notes = [];
    if (p.invalid.length) {
      notes.push(`Saltamos ${p.invalid.length} ${p.invalid.length === 1 ? "línea" : "líneas"} con formato que no reconocimos (${p.invalid.slice(0, 8).join(", ")}${p.invalid.length > 8 ? ", …" : ""}). El conteo podría estar incompleto.`);
    }
    if (p.duplicates) notes.push(`Hay ${p.duplicates} ${p.duplicates === 1 ? "nombre repetido" : "nombres repetidos"}. Usamos la lectura más reciente. Si dos nodos se llaman igual, usa sus ID.`);
    if (p.rawCount >= 8 || p.cliBytes >= 110) notes.push("La respuesta de neighbors puede estar cortada. Get Neighbours en MeshMonitor o la vista de lista enseñan la tabla completa.");
    if (!count) notes.push("Ningún vecino cuenta en esta lectura. Si el repeater se reinició hace poco, consulta otra vez cuando lleguen anuncios nuevos.");
    if (count >= 12 && role !== "local") notes.push("Con 12 vecinos o más, el white paper sugiere txdelay 2.1–2.5. El comando usa 2.0, el máximo que acepta MeshCore.");
    $("calc-count").textContent = count;
    $("calc-excluded").textContent = assessed.length - count;
    $("calc-density").textContent = density;
    $("calc-why").textContent = why;
    $("calc-warnings").hidden = !notes.length;
    $("calc-warnings").replaceChildren(...notes.map((t) => Object.assign(document.createElement("p"), { textContent: t })));
    renderValues(proposed, reference);
    renderCommands($("calc-apply"), setCommands(proposed));
    renderNeighborTable(assessed);
    if (moveFocus) {
      $("ajustes").focus({ preventScroll: true });
      $("ajustes").scrollIntoView({ block: "start" });
    }
  }

  function updateRestore() {
    const raw = [0, 1, 2].map((i) => val("calc-old-" + i));
    const nums = raw.map(toNumber);
    const errors = [];
    raw.forEach((r, i) => {
      const bad = Boolean(r) && !(nums[i] >= 0 && nums[i] <= MAXIMUMS[i]);
      $("calc-old-" + i).setAttribute("aria-invalid", String(bad));
      if (bad) errors.push(`${PARAMS[i]} va de 0 a ${MAXIMUMS[i]}.`);
    });
    const complete = nums.every(Number.isFinite) && !errors.length;
    renderCommands($("calc-restore"), complete ? setCommands(nums) : []);
    say("calc-current-status", errors.join(" ") || (raw.some(Boolean) && !complete ? "Faltan valores: escribe los tres." : ""));
    $("calc-restore-wrap").hidden = !complete;
  }

  /* ---------- prueba de campo ---------- */
  function readSample(type, n) {
    const sent = val(`calc-${type}-${n}-sent`);
    const got = val(`calc-${type}-${n}-received`);
    const entered = Boolean(sent || got);
    if (entered && (!sent || !got)) return { entered, pending: true };
    const total = Number(sent), arrived = Number(got);
    const valid = /^\d+$/.test(sent) && /^\d+$/.test(got) && Number.isSafeInteger(total) && total > 0 && arrived <= total;
    return { entered, valid, total, arrived, percent: 100 * arrived / total };
  }

  function compare(type) {
    const a = readSample(type, 1), b = readSample(type, 2);
    const done = a.valid && b.valid;
    let text = "Escribe los enviados y recibidos de las dos rondas para ver la comparación.";
    if ([a, b].some((s) => s.entered && !s.valid && !s.pending)) {
      text = "Usa números enteros. Envía al menos un mensaje, y los recibidos no pueden ser más que los enviados.";
    } else if (done) {
      const delta = Number((b.percent - a.percent).toFixed(2));
      const rate = (s) => `${s.arrived} de ${s.total} (${fmt(s.percent)} %)`;
      text = `Ronda 1: ${rate(a)}. Ronda 2: ${rate(b)}. Diferencia: ${delta > 0 ? "+" : ""}${fmt(delta)} puntos. `;
      text += delta > 0 ? "En la segunda ronda llegaron más. Repite la prueba otro día para ver si se mantiene."
        : delta < 0 ? "En la segunda ronda llegaron menos. Si se repite, vuelve al valor de antes."
        : "Llegó la misma proporción en las dos rondas.";
      if (a.total !== b.total) text += " Para comparar mejor, envía la misma cantidad en las dos rondas.";
    }
    say(`calc-${type}-out`, text);
    return done;
  }

  function ackSummary() {
    const raw = [val("calc-ack-1"), val("calc-ack-2")];
    if (!raw[0] && !raw[1]) return "";
    const nums = raw.map(toNumber);
    if (raw.some((r, i) => r && !(nums[i] >= 0))) return "Escribe los tiempos en segundos, por ejemplo 2.5.";
    if (!raw[0] || !raw[1]) return "Escribe los dos tiempos para compararlos.";
    return `Confirmación típica: ${fmt(nums[0])} s antes, ${fmt(nums[1])} s después.`;
  }

  function updateTest() {
    const type = $("calc-test-type").value;
    $("calc-channel").hidden = type !== "channel";
    $("calc-direct").hidden = type !== "direct";
    $("calc-test-hint").textContent = type === "channel"
      ? "En la app MeshCore, envía desde un canal que los dos Companions tengan."
      : "En el Companion A, abre el contacto de B y envía mensajes directos.";
    $("calc-route").value = routes[type];
    const done = compare(type);
    say("calc-ack-out", ackSummary());
    say("calc-route-status", done ? ROUTE_TEXT[routes[type]] : "");
  }

  /* ---------- enlace con el estado ---------- */
  function serialize() {
    const s = new URLSearchParams();
    const text = $("calc-neighbors").value.trim();
    if (text) s.set("vecinos", text);
    if (text || $("calc-role").value !== "local") s.set("rol", $("calc-role").value);
    const old = [0, 1, 2].map((i) => val("calc-old-" + i));
    if (old.some(Boolean)) s.set("antes", old.join(","));
    const type = $("calc-test-type").value;
    if (type !== "channel") s.set("prueba", TESTS[type]);
    for (const t of Object.keys(TESTS)) {
      const counts = [1, 2].flatMap((n) => [val(`calc-${t}-${n}-sent`), val(`calc-${t}-${n}-received`)]);
      if (counts.some(Boolean)) s.set(TESTS[t], counts.join(","));
      if (routes[t] !== "unknown") s.set("ruta-" + TESTS[t], routes[t]);
    }
    const ack = [val("calc-ack-1"), val("calc-ack-2")];
    if (ack.some(Boolean)) s.set("ack", ack.join(","));
    return s.toString();
  }
  const linkFor = (q) => location.origin + location.pathname + "#/calculadora" + (q ? "?" + q : "");

  function syncUrl() {
    clearTimeout(urlTimer);
    if (!root?.isConnected) return;
    const q = serialize();
    const target = "#/calculadora" + (q ? "?" + q : "");
    if (location.hash !== target) history.replaceState(history.state, "", target);
  }
  const syncSoon = () => { clearTimeout(urlTimer); urlTimer = setTimeout(syncUrl, 400); };

  function restore(query) {
    const s = new URLSearchParams(query);
    const pick = (k, allowed) => allowed.includes(s.get(k)) ? s.get(k) : null;
    $("calc-role").value = pick("rol", Object.keys(ROLES)) || "local";
    $("calc-neighbors").value = s.get("vecinos") || "";
    (s.get("antes") || "").split(",").slice(0, 3).forEach((v, i) => { $("calc-old-" + i).value = v.trim(); });
    const byName = Object.fromEntries(Object.entries(TESTS).map(([k, v]) => [v, k]));
    $("calc-test-type").value = byName[s.get("prueba")] || "channel";
    for (const [t, name] of Object.entries(TESTS)) {
      const c = (s.get(name) || "").split(",");
      [1, 2].forEach((n, j) => {
        $(`calc-${t}-${n}-sent`).value = (c[j * 2] || "").trim();
        $(`calc-${t}-${n}-received`).value = (c[j * 2 + 1] || "").trim();
      });
      routes[t] = pick("ruta-" + name, Object.keys(ROUTE_TEXT)) || "unknown";
    }
    const ack = (s.get("ack") || "").split(",");
    $("calc-ack-1").value = (ack[0] || "").trim();
    $("calc-ack-2").value = (ack[1] || "").trim();
    if (s.has("antes")) $("calc-current").open = true;
  }

  async function share() {
    const q = serialize();
    syncUrl();
    const url = linkFor(q);
    const coarse = matchMedia("(pointer: coarse)").matches;
    if (navigator.share && coarse) {
      try { await navigator.share({ title: "Calculadora de repetidores · Mesh PR", url }); return; }
      catch (e) { if (e && e.name === "AbortError") return; }
    }
    const ok = await ui.copyText(url);
    notify(!ok ? "No se pudo copiar. Copia el enlace de la barra de direcciones."
      : q.includes("vecinos=") ? "Enlace copiado. Incluye tu lista de vecinos."
      : "Enlace copiado.");
  }

  function render(container, query, helpers) {
    ui = helpers;
    container.innerHTML = TEMPLATE;
    root = container.querySelector(".calc");
    renderCommands($("calc-collect"), QUERY);
    renderCommands($("calc-verify"), READ);
    restore(query);
    updateRestore();
    updateTest();
    if ($("calc-neighbors").value.trim()) calculate({ moveFocus: false });

    $("calc-form").addEventListener("submit", (e) => { e.preventDefault(); calculate(); syncUrl(); });
    $("calc-demo").addEventListener("click", () => {
      $("calc-neighbors").value = DEMO;
      calculate();
      syncUrl();
    });
    $("calc-role").addEventListener("change", () => {
      if (!$("calc-results").hidden) calculate({ moveFocus: false });
      syncSoon();
    });
    $("calc-neighbors").addEventListener("input", () => {
      // con resultados a la vista, se recalculan mientras se edita la lista
      if (!$("calc-results").hidden || $("calc-error").textContent) calculate({ moveFocus: false });
      syncSoon();
    });
    root.querySelectorAll("[id^=calc-old-]").forEach((el) => el.addEventListener("input", () => { updateRestore(); syncSoon(); }));
    $("calc-test-type").addEventListener("change", () => { updateTest(); syncSoon(); });
    $("calc-route").addEventListener("change", () => { routes[$("calc-test-type").value] = $("calc-route").value; updateTest(); syncSoon(); });
    root.querySelectorAll(".calc-test").forEach((el) => el.addEventListener("input", () => { updateTest(); syncSoon(); }));
    root.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-cmd]");
      if (btn) { copyCommand(btn); return; }
      if (e.target.closest("[data-calc-share]")) share();
    });
  }

  return {
    render,
    /* estado actual como query (sin "?"), para que el router sepa si un enlace trae otro estado */
    query: () => (root?.isConnected ? serialize() : null),
    syncUrl
  };
})();
