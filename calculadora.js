/* Calculadora de repetidores MeshCore: la vista #/calculadora de Mesh PR.
   - index.html llama a MeshCalc.render() cuando la ruta es #/calculadora.
   - Todo se calcula en el navegador. Lo que la persona escribe va en el enlace
     (#/calculadora?rol=…&vecinos=…), así puede recargar sin perderlo y compartirlo.
     Ese texto va después del #, así que no llega al servidor.
   - Español e inglés: los textos están en STR. El idioma va en el enlace (idioma=en)
     y se recuerda en el navegador.
   - Los valores por densidad salen del white paper de cdme.sh (rev. 1.1, §9.4.2).
     Si cambias TABLE, cambia también la tabla de §6.4 en meshcore-repeater-roomserver-pr.md. */
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
  const ROLE_IDS = ["local", "link", "mixed"];
  const TESTS = { channel: "canal", direct: "directo" };
  const ROUTE_IDS = ["unknown", "same", "changed"];
  const LANG_KEY = "meshpr-calc-lang";

  /* ---------- textos ---------- */
  const STR = {
    es: {
      htmlLang: "es-PR",
      docTitle: "Calculadora de repetidores · Mesh PR",
      back: "Todas las guías",
      otherLang: "English",
      otherLangCode: "en",
      otherLangLabel: "Read this calculator in English",
      share: "Compartir enlace",
      title: "Calculadora de repetidores",
      lead: "Pega la lista de vecinos de tu repeater MeshCore. Te damos los valores de espera para probar, los comandos listos para copiar y una prueba sencilla para ver si ayudaron.",
      helpSummary: "¿Qué son estos ajustes?",
      helpWhy: "Cuando dos repeaters retransmiten el mismo mensaje a la vez, chocan y nadie lo recibe. Para evitarlo, cada uno espera un tiempo al azar antes de retransmitir. Mientras más vecinos tiene, más espacio necesita.",
      terms: [
        "Cuánto espera antes de retransmitir mensajes de canal (los que llegan a todos).",
        "Lo mismo, para mensajes directos entre dos personas.",
        "Espera antes de atender lo que recibe, para dar prioridad a las señales fuertes. En 0 no espera."
      ],
      helpAdmin: "Necesitas acceso de administrador al repeater. Si no lo tienes, igual puedes calcular y compartir el enlace con quien lo administra.",
      hData: "1. Datos del repeater",
      roleLabel: "¿Para qué sirve este repeater?",
      roles: {
        local: "Cobertura local: da señal a Companions cerca",
        link: "Enlace: conecta con otros repeaters lejos",
        mixed: "Las dos cosas"
      },
      neighborsLabel: "Lista de vecinos",
      formats: "Una línea por vecino con nombre o ID, SNR y cuándo se escuchó. También sirve la respuesta del comando <code>neighbors</code>. Si el repeater no tiene vecinos, escribe <code>-none-</code>.",
      calculate: "Calcular ajustes",
      demo: "Probar con un ejemplo",
      collectSummary: "Cómo sacar la lista de vecinos",
      collectIntro: "Usa un Companion que llegue al repeater por radio. Abre el contacto del repeater que vas a ajustar.",
      collectApp: "<strong>App MeshCore:</strong> toca <strong>Manage</strong> e inicia sesión como administrador. Ve a <strong>Settings → Neighbours</strong> y usa la vista de lista. Los comandos se envían en <strong>Command Line</strong>.",
      collectMonitor: "<strong>MeshMonitor:</strong> escoge tu fuente <strong>Companion</strong>, abre el contacto y toca <strong>Get Neighbours</strong>. Los comandos se envían en <strong>Remote administration</strong>.",
      collectNote: "El comando <code>neighbors</code> muestra hasta 8 vecinos y la respuesta puede salir cortada. Si crees que faltan, usa la vista de lista o <strong>Get Neighbours</strong>.",
      collectCmds: "Estos comandos leen la lista y los valores de ahora. Envía uno a la vez:",
      collectAria: "Comandos para leer los datos",
      currentSummary: "Guardar los valores de ahora (opcional)",
      currentHint: "Escribe lo que respondieron los tres <code>get</code>. Te damos los comandos para volver a esos valores si algo sale mal.",
      restoreIntro: "Para volver atrás, envía estos:",
      restoreAria: "Comandos para volver a los valores de antes",
      hResults: "2. Ajustes para probar",
      statsAria: "Resumen de vecinos",
      statCount: "Vecinos que cuentan",
      statExcluded: "No cuentan",
      statDensity: "Densidad",
      radioNote: "Durante la prueba, deja igual el resto del radio de la red, incluido el coding rate. Los valores del white paper son una referencia experimental.",
      neighborDetails: "Ver qué vecinos cuentan y por qué",
      applyHow: "Cómo aplicarlos",
      applySteps: [
        "Abre <strong>Command Line</strong> (app MeshCore) o <strong>Remote administration</strong> (MeshMonitor) con sesión de administrador.",
        "Copia un comando <code>set</code>, pégalo y envíalo. Espera la respuesta del repeater.",
        "Envía su <code>get</code> para confirmar el valor. Si el <code>set</code> no respondió, revisa con <code>get</code> antes de repetirlo.",
        "Cambia un ajuste a la vez y haz la prueba de abajo. Así sabes cuál ayudó."
      ],
      applyH: "Aplicar",
      applyAria: "Comandos para aplicar los ajustes",
      verifyH: "Confirmar",
      verifyAria: "Comandos para confirmar los ajustes",
      shareIntro: "¿Quieres que otra persona revise o aplique estos ajustes? El enlace abre la calculadora con tu lista ya puesta.",
      hTest: "3. Prueba de campo (opcional)",
      testIntro: "Comprueba si el cambio hizo que lleguen más mensajes. Necesitas dos Companions en lugares fijos: <strong>A envía</strong> y <strong>B cuenta lo que recibió</strong>. Escoge lugares donde los mensajes tengan que pasar por el repeater. Si pruebas cobertura local, busca un sitio donde la señal suele ser débil.",
      testType: "¿Qué ajuste vas a probar?",
      typeChannel: "txdelay o rxdelay, con mensajes de canal",
      typeDirect: "direct.txdelay, con mensajes directos",
      hintChannel: "En la app MeshCore, envía desde un canal que los dos Companions tengan.",
      hintDirect: "En el Companion A, abre el contacto de B y envía mensajes directos.",
      round1: "Ronda 1: con los ajustes de ahora",
      round1Guide: "A envía 10 mensajes numerados (R1-01 a R1-10), unos segundos aparte. Si B recibió 7, escribe 10 y 7.",
      round2: "Ronda 2: después de cambiar un ajuste",
      round2Guide: "Aplica y verifica un solo ajuste. Repite desde los mismos lugares con R2-01 a R2-10. Si B recibió 9, escribe 10 y 9.",
      sent: "Enviados por A",
      received: "Recibidos por B",
      resultH: "Resultado",
      resultHint: "Si un mensaje llega dos veces, cuéntalo una vez. Si no llegó ninguno, escribe 0.",
      ackSummary: "Tiempo de confirmación (opcional)",
      ackHint: "Cuando un mensaje directo llega, B devuelve una confirmación (ACK). Si tu app muestra cuánto tardó, anota el tiempo típico de cada ronda, en segundos.",
      before: "Antes",
      after: "Después",
      routeSummary: "Comprobar la ruta (opcional)",
      routeIntro: "Si tu app enseña por dónde pasó cada mensaje, mira si el repeater sale en las dos rondas. En MeshMonitor, <strong>Trace Path</strong> también enseña la ruta entre los dos lugares.",
      routeLabel: "¿Pudiste comprobar la ruta?",
      routeOptions: {
        unknown: "No la comprobé",
        same: "Sí, pasó por el repeater igual en las dos rondas",
        changed: "Cambió o no pasó por el repeater"
      },
      routeText: {
        unknown: "No confirmaste la ruta. La comparación muestra lo que llegó, pero los mensajes pudieron tomar otro camino.",
        same: "Confirmaste que las dos rondas pasaron por el repeater por la misma ruta.",
        changed: "La ruta cambió o no pasó por el repeater. Repite la prueba antes de culpar o dar crédito al ajuste."
      },
      hSources: "Fuentes",
      sources: [
        '<a href="https://cdme.sh/repeaters/radio-tuning-whitepaper" target="_blank" rel="noopener">White paper de ajuste de radio, revisión 1.1</a>. Sección 6.3 para el límite de 14 días y 9.4.2 para los valores por densidad.',
        '<a href="https://docs.meshcore.io/cli_commands/" target="_blank" rel="noopener">Comandos de MeshCore</a> y <a href="https://docs.domca.nl/en/cli/neighbors/" target="_blank" rel="noopener">formato de la respuesta de <code>neighbors</code></a>. El máximo de <code>txdelay</code> es 2.',
        '<a href="https://wiki.samesh.au/meshcore/repeater-settings" target="_blank" rel="noopener">Perfiles de repeaters de SA Mesh</a>, que recomiendan <code>rxdelay 0</code> para cobertura local.',
        '<a href="https://meshcore.cz/en:navody:repeater" target="_blank" rel="noopener">Administración remota desde la app MeshCore</a> y <a href="https://meshcore.cz/en:zacinam:tipy" target="_blank" rel="noopener">vecinos desde la app</a>.',
        '<a href="https://meshmonitor.org/features/meshcore" target="_blank" rel="noopener">MeshMonitor para MeshCore</a>.'
      ],
      privacy: "Todo se calcula en tu teléfono o computadora. Lo que escribes solo sale de aquí si compartes el enlace.",
      anchorLabel: "Copiar enlace a la sección {name}",
      anchorTitle: "Copiar enlace a esta sección",
      anchorCopied: "Enlace a la sección copiado",
      anchorFailed: "No se pudo copiar el enlace",
      copy: "Copiar",
      copyLabel: "Copiar {cmd}",
      copied: "Copiado: {cmd}",
      copyFailed: "No se pudo copiar. El comando quedó seleccionado: cópialo a mano.",
      meanings: ["Mensajes de canal", "Mensajes directos", "Prioridad a señales fuertes"],
      reference: "White paper: {value}",
      weak: "señal de 0 dB o menos",
      stale: "hace más de 14 días",
      density: { low: "Baja", medium: "Media", high: "Alta", regional: "Regional" },
      whyLink: "Para un enlace entre repeaters, el punto de partida sale de la tabla de densidad del white paper (§9.4.2). Prueba la entrega antes de dejarlo fijo.",
      whyLocal: "Para cobertura local, empieza con los valores de fábrica de MeshCore. Con rxdelay en 0, el repeater atiende enseguida los mensajes débiles que quizá solo él escucha.",
      whyLocalDense: "Oye varios repeaters: mide la entrega de canal antes de probar un txdelay más alto.",
      whyMixed: "Para un repeater que hace las dos cosas, las esperas de retransmisión siguen la tabla de densidad y rxdelay se queda en 0 para no perder la cobertura local.",
      errInconsistent: "Pusiste -none- junto con otras líneas. Pega la respuesta de una sola consulta.",
      errUnrecognized: "No reconocimos ningún vecino. Revisa el formato de la línea {lines}. Cada línea necesita nombre, SNR y cuándo se escuchó.",
      errEmpty: "Pega la lista de vecinos, o escribe -none- si el repeater no tiene.",
      noteInvalid: (n, lines) => `Saltamos ${n} ${n === 1 ? "línea" : "líneas"} con formato que no reconocimos (${lines}). El conteo podría estar incompleto.`,
      noteDuplicates: (n) => `Hay ${n} ${n === 1 ? "nombre repetido" : "nombres repetidos"}. Usamos la lectura más reciente. Si dos nodos se llaman igual, usa sus ID.`,
      noteTruncated: "La respuesta de neighbors puede estar cortada. Get Neighbours en MeshMonitor o la vista de lista enseñan la tabla completa.",
      noteNone: "Ningún vecino cuenta en esta lectura. Si el repeater se reinició hace poco, consulta otra vez cuando lleguen anuncios nuevos.",
      noteTxLimit: "Con 12 vecinos o más, el white paper sugiere txdelay 2.1–2.5. El comando usa 2.0, el máximo que acepta MeshCore.",
      noNeighbors: "El repeater dijo que no tiene vecinos.",
      tableAria: "Vecinos",
      tableHead: ["Vecino", "SNR", "Escuchado", "¿Cuenta?"],
      ago: "hace {age}",
      now: "ahora",
      yes: "Sí",
      no: "No: {reasons}",
      tableHint: "Cuentan los vecinos directos con SNR mayor de 0 dB escuchados en los últimos 14 días.",
      restoreRange: "{name} va de 0 a {max}.",
      restoreIncomplete: "Faltan valores: escribe los tres.",
      testWaiting: "Escribe los enviados y recibidos de las dos rondas para ver la comparación.",
      testInvalid: "Usa números enteros. Envía al menos un mensaje, y los recibidos no pueden ser más que los enviados.",
      testRate: "{got} de {sent} ({pct} %)",
      testResult: "Ronda 1: {a}. Ronda 2: {b}. Diferencia: {delta} puntos.",
      testMore: "En la segunda ronda llegaron más. Repite la prueba otro día para ver si se mantiene.",
      testFewer: "En la segunda ronda llegaron menos. Si se repite, vuelve al valor de antes.",
      testSame: "Llegó la misma proporción en las dos rondas.",
      testBatch: "Para comparar mejor, envía la misma cantidad en las dos rondas.",
      ackInvalid: "Escribe los tiempos en segundos, por ejemplo 2.5.",
      ackIncomplete: "Escribe los dos tiempos para compararlos.",
      ackResult: "Confirmación típica: {a} s antes, {b} s después.",
      shareFailed: "No se pudo copiar. Copia el enlace de la barra de direcciones.",
      shareWithList: "Enlace copiado. Incluye tu lista de vecinos.",
      shareCopied: "Enlace copiado."
    },
    en: {
      htmlLang: "en",
      docTitle: "Repeater Calculator · Mesh PR",
      back: "All guides",
      otherLang: "Español",
      otherLangCode: "es",
      otherLangLabel: "Ver esta calculadora en español",
      share: "Share link",
      title: "Repeater Calculator",
      lead: "Paste your MeshCore repeater’s neighbor list. You get delay settings to try, commands ready to copy, and a simple test to see whether they helped.",
      helpSummary: "What are these settings?",
      helpWhy: "When two repeaters retransmit the same message at the same time, the packets collide and nobody gets it. To avoid that, each repeater waits a random time before retransmitting. The more neighbors it has, the more room it needs.",
      terms: [
        "How long it waits before retransmitting channel messages (the ones everyone gets).",
        "The same, for direct messages between two people.",
        "A wait before handling what it receives, so strong signals go first. At 0 it doesn’t wait."
      ],
      helpAdmin: "You need admin access to the repeater. If you don’t have it, you can still calculate and share the link with whoever runs it.",
      hData: "1. Repeater details",
      roleLabel: "What does this repeater do?",
      roles: {
        local: "Local coverage: serves nearby Companions",
        link: "Link: connects to distant repeaters",
        mixed: "Both"
      },
      neighborsLabel: "Neighbor list",
      formats: "One line per neighbor with its name or ID, SNR and when it was last heard. The reply from the <code>neighbors</code> command also works. If the repeater has no neighbors, enter <code>-none-</code>.",
      calculate: "Calculate settings",
      demo: "Try an example",
      collectSummary: "How to get the neighbor list",
      collectIntro: "Use a Companion that can reach the repeater over radio. Open the contact for the repeater you want to tune.",
      collectApp: "<strong>MeshCore app:</strong> tap <strong>Manage</strong> and log in as admin. Go to <strong>Settings → Neighbours</strong> and use the list view. Send commands in <strong>Command Line</strong>.",
      collectMonitor: "<strong>MeshMonitor:</strong> pick your <strong>Companion</strong> source, open the contact and tap <strong>Get Neighbours</strong>. Send commands in <strong>Remote administration</strong>.",
      collectNote: "The <code>neighbors</code> command shows up to 8 neighbors and the reply may be cut off. If you think some are missing, use the list view or <strong>Get Neighbours</strong>.",
      collectCmds: "These commands read the list and the current settings. Send one at a time:",
      collectAria: "Commands to read the data",
      currentSummary: "Save the current settings (optional)",
      currentHint: "Enter what the three <code>get</code> commands returned. You get the commands to go back to those values if something goes wrong.",
      restoreIntro: "To go back, send these:",
      restoreAria: "Commands to restore the previous settings",
      hResults: "2. Settings to try",
      statsAria: "Neighbor summary",
      statCount: "Neighbors that count",
      statExcluded: "Don’t count",
      statDensity: "Density",
      radioNote: "During the test, keep the rest of the network’s radio settings the same, including the coding rate. The white paper values are an experimental reference.",
      neighborDetails: "See which neighbors count and why",
      applyHow: "How to apply them",
      applySteps: [
        "Open <strong>Command Line</strong> (MeshCore app) or <strong>Remote administration</strong> (MeshMonitor) with an admin session.",
        "Copy a <code>set</code> command, paste it and send it. Wait for the repeater’s reply.",
        "Send its <code>get</code> to confirm the value. If the <code>set</code> got no reply, check with <code>get</code> before sending it again.",
        "Change one setting at a time and run the test below. That way you know which one helped."
      ],
      applyH: "Apply",
      applyAria: "Commands to apply the settings",
      verifyH: "Confirm",
      verifyAria: "Commands to confirm the settings",
      shareIntro: "Want someone else to review or apply these settings? The link opens the calculator with your list already filled in.",
      hTest: "3. Field test (optional)",
      testIntro: "Check whether the change got more messages through. You need two Companions at fixed spots: <strong>A sends</strong> and <strong>B counts what it received</strong>. Pick spots where messages have to go through the repeater. For local coverage, pick a place where the signal is usually weak.",
      testType: "Which setting are you testing?",
      typeChannel: "txdelay or rxdelay, with channel messages",
      typeDirect: "direct.txdelay, with direct messages",
      hintChannel: "In the MeshCore app, send from a channel both Companions have.",
      hintDirect: "On Companion A, open B’s contact and send direct messages.",
      round1: "Round 1: with the current settings",
      round1Guide: "A sends 10 numbered messages (R1-01 to R1-10), a few seconds apart. If B received 7, enter 10 and 7.",
      round2: "Round 2: after changing one setting",
      round2Guide: "Apply and confirm just one setting. Repeat from the same spots with R2-01 to R2-10. If B received 9, enter 10 and 9.",
      sent: "Sent by A",
      received: "Received by B",
      resultH: "Result",
      resultHint: "If a message arrives twice, count it once. If none arrived, enter 0.",
      ackSummary: "Acknowledgment time (optional)",
      ackHint: "When a direct message arrives, B sends back an acknowledgment (ACK). If your app shows how long it took, write down the typical time for each round, in seconds.",
      before: "Before",
      after: "After",
      routeSummary: "Check the path (optional)",
      routeIntro: "If your app shows the path each message took, check that the repeater appears in both rounds. In MeshMonitor, <strong>Trace Path</strong> also shows the path between the two spots.",
      routeLabel: "Were you able to check the path?",
      routeOptions: {
        unknown: "I didn’t check it",
        same: "Yes, same path through the repeater in both rounds",
        changed: "It changed or skipped the repeater"
      },
      routeText: {
        unknown: "You didn’t confirm the path. The comparison shows what arrived, but messages may have taken another route.",
        same: "You confirmed that both rounds went through the repeater on the same path.",
        changed: "The path changed or skipped the repeater. Repeat the test before blaming or crediting the setting."
      },
      hSources: "Sources",
      sources: [
        '<a href="https://cdme.sh/repeaters/radio-tuning-whitepaper" target="_blank" rel="noopener">Radio tuning white paper, revision 1.1</a>. Section 6.3 for the 14-day limit and 9.4.2 for the settings by density.',
        '<a href="https://docs.meshcore.io/cli_commands/" target="_blank" rel="noopener">MeshCore commands</a> and <a href="https://docs.domca.nl/en/cli/neighbors/" target="_blank" rel="noopener"><code>neighbors</code> reply format</a>. The maximum for <code>txdelay</code> is 2.',
        '<a href="https://wiki.samesh.au/meshcore/repeater-settings" target="_blank" rel="noopener">SA Mesh repeater profiles</a>, which recommend <code>rxdelay 0</code> for local coverage.',
        '<a href="https://meshcore.cz/en:navody:repeater" target="_blank" rel="noopener">Remote administration in the MeshCore app</a> and <a href="https://meshcore.cz/en:zacinam:tipy" target="_blank" rel="noopener">neighbors in the app</a>.',
        '<a href="https://meshmonitor.org/features/meshcore" target="_blank" rel="noopener">MeshMonitor for MeshCore</a>.'
      ],
      privacy: "Everything is calculated on your phone or computer. What you enter only leaves it if you share the link.",
      anchorLabel: "Copy link to the {name} section",
      anchorTitle: "Copy link to this section",
      anchorCopied: "Section link copied",
      anchorFailed: "Couldn’t copy the link",
      copy: "Copy",
      copyLabel: "Copy {cmd}",
      copied: "Copied: {cmd}",
      copyFailed: "Couldn’t copy. The command is selected: copy it by hand.",
      meanings: ["Channel messages", "Direct messages", "Strong signals first"],
      reference: "White paper: {value}",
      weak: "signal of 0 dB or less",
      stale: "more than 14 days ago",
      density: { low: "Low", medium: "Medium", high: "High", regional: "Regional" },
      whyLink: "For a link between repeaters, the starting point comes from the white paper’s density table (§9.4.2). Test delivery before keeping it.",
      whyLocal: "For local coverage, start with the MeshCore defaults. With rxdelay at 0, the repeater handles right away the weak messages that only it may hear.",
      whyLocalDense: "It hears several repeaters: measure channel delivery before trying a higher txdelay.",
      whyMixed: "For a repeater that does both, the retransmit delays follow the density table and rxdelay stays at 0 to keep local coverage.",
      errInconsistent: "You entered -none- along with other lines. Paste the reply from a single query.",
      errUnrecognized: "No neighbors recognized. Check the format on line {lines}. Each line needs a name, SNR and when it was heard.",
      errEmpty: "Paste the neighbor list, or enter -none- if the repeater has none.",
      noteInvalid: (n, lines) => `Skipped ${n} ${n === 1 ? "line" : "lines"} with a format we didn’t recognize (${lines}). The count may be incomplete.`,
      noteDuplicates: (n) => `${n} ${n === 1 ? "name appears" : "names appear"} more than once. We used the latest reading. If two nodes share a name, use their IDs.`,
      noteTruncated: "The neighbors reply may be cut off. Get Neighbours in MeshMonitor or the list view show the full table.",
      noteNone: "No neighbors count in this reading. If the repeater restarted recently, check again after new adverts arrive.",
      noteTxLimit: "With 12 or more neighbors, the white paper suggests txdelay 2.1–2.5. The command uses 2.0, the maximum MeshCore accepts.",
      noNeighbors: "The repeater reported no neighbors.",
      tableAria: "Neighbors",
      tableHead: ["Neighbor", "SNR", "Heard", "Counts?"],
      ago: "{age} ago",
      now: "just now",
      yes: "Yes",
      no: "No: {reasons}",
      tableHint: "Direct neighbors count if their SNR is above 0 dB and they were heard in the last 14 days.",
      restoreRange: "{name} goes from 0 to {max}.",
      restoreIncomplete: "Missing values: enter all three.",
      testWaiting: "Enter the sent and received counts for both rounds to see the comparison.",
      testInvalid: "Use whole numbers. Send at least one message, and received can’t be more than sent.",
      testRate: "{got} of {sent} ({pct}%)",
      testResult: "Round 1: {a}. Round 2: {b}. Difference: {delta} points.",
      testMore: "More arrived in the second round. Repeat the test another day to see if it holds.",
      testFewer: "Fewer arrived in the second round. If it happens again, go back to the previous value.",
      testSame: "The same share arrived in both rounds.",
      testBatch: "For a fairer comparison, send the same number in both rounds.",
      ackInvalid: "Enter the times in seconds, for example 2.5.",
      ackIncomplete: "Enter both times to compare them.",
      ackResult: "Typical acknowledgment: {a} s before, {b} s after.",
      shareFailed: "Couldn’t copy. Copy the link from the address bar.",
      shareWithList: "Link copied. It includes your neighbor list.",
      shareCopied: "Link copied."
    }
  };

  let lang = (() => { try { return localStorage.getItem(LANG_KEY) === "en" ? "en" : "es"; } catch { return "es"; } })();
  const S = () => STR[lang];
  const fill = (text, vars = {}) => text.replace(/\{(\w+)\}/g, (_, k) => vars[k]);
  const t = (key, vars) => fill(S()[key], vars);
  const fmt = (v) => new Intl.NumberFormat(S().htmlLang, { maximumFractionDigits: 2 }).format(v);
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
    if (n.snr <= 0) reasons.push(t("weak"));
    if (n.age > MAX_AGE) reasons.push(t("stale"));
    return { ...n, reasons };
  }

  function recommend(role, count) {
    const reference = TABLE[Math.min(count, TABLE.length - 1)];
    const density = S().density[count < 4 ? "low" : count < 9 ? "medium" : count < 11 ? "high" : "regional"];
    let proposed = [Math.min(2, Number.parseFloat(reference[0])), reference[1], reference[2]];
    let why = t("whyLink");
    if (role === "local") {
      proposed = DEFAULTS;
      why = t("whyLocal");
      if (count >= 4) why += " " + t("whyLocalDense");
    } else if (role === "mixed") {
      proposed[2] = 0;
      why = t("whyMixed");
    }
    return { reference, density, proposed, why };
  }

  const ageLabel = (s) => {
    if (s === 0) return t("now");
    const parts = [];
    for (const [u, size] of Object.entries(UNITS)) {
      const n = Math.floor(s / size);
      if (n) parts.push(n + " " + UNIT_NAMES[u]);
      s %= size;
    }
    return t("ago", { age: parts.slice(0, 2).join(" ") });
  };
  const show = (v, i) => typeof v === "number" && i < 2 && Number.isInteger(v) ? v.toFixed(1) : String(v);
  const setCommands = (values) => PARAMS.map((p, i) => `set ${p} ${values[i]}`);

  /* ---------- plantilla ---------- */
  const cmdList = (id, label) => `<ul class="cmd-list" id="${id}" aria-label="${esc(label)}"></ul>`;
  const anchor = (id, name) => `<a class="anchor" href="#/calculadora#${id}" aria-label="${esc(t("anchorLabel", { name }))}" title="${esc(t("anchorTitle"))}">#</a>`;
  const heading = (id, key, extra = "") => {
    const text = S()[key];
    return `<h2 id="${id}"${extra}>${text} ${anchor(id, text.replace(/^\d\.\s*/, ""))}</h2>`;
  };
  function stage(type, n) {
    const base = `calc-${type}-${n}`;
    return `<fieldset>
      <legend>${t("round" + n)}</legend>
      <p class="calc-hint" id="${base}-hint">${t("round" + n + "Guide")}</p>
      <div class="calc-samples">
        <div><label for="${base}-sent">${t("sent")}</label>
          <input id="${base}-sent" inputmode="numeric" autocomplete="off" aria-describedby="${base}-hint"></div>
        <div><label for="${base}-received">${t("received")}</label>
          <input id="${base}-received" inputmode="numeric" autocomplete="off" aria-describedby="${base}-hint"></div>
      </div>
    </fieldset>`;
  }
  function testGroup(type) {
    const ack = type === "direct" ? `<details>
        <summary>${t("ackSummary")}</summary>
        <div>
          <p class="calc-hint" id="calc-ack-hint">${t("ackHint")}</p>
          <div class="calc-samples">
            <div><label for="calc-ack-1">${t("before")}</label><input id="calc-ack-1" inputmode="decimal" autocomplete="off" aria-describedby="calc-ack-hint"></div>
            <div><label for="calc-ack-2">${t("after")}</label><input id="calc-ack-2" inputmode="decimal" autocomplete="off" aria-describedby="calc-ack-hint"></div>
          </div>
          <p class="calc-status" id="calc-ack-out" aria-live="polite"></p>
        </div>
      </details>` : "";
    return `<div id="calc-${type}" class="calc-test" hidden>
      ${stage(type, 1)}
      ${stage(type, 2)}
      <div class="calc-result">
        <h3>${t("resultH")}</h3>
        <p id="calc-${type}-out" aria-live="polite"></p>
        <p class="calc-hint">${t("resultHint")}</p>
      </div>
      ${ack}
    </div>`;
  }

  function template() {
    const s = S();
    const oldInput = (i, placeholder) => `<div><label for="calc-old-${i}"><code>${PARAMS[i]}</code></label><input id="calc-old-${i}" inputmode="decimal" autocomplete="off" placeholder="${placeholder}" aria-describedby="calc-current-hint calc-current-status"></div>`;
    return `<div class="doc mc calc" lang="${s.htmlLang}">
  <div class="doc-bar">
    <a class="back" href="#/">${s.back}</a>
    <span class="tag">MeshCore</span>
    <span class="actions">
      <button class="icon-btn" type="button" id="calc-lang" lang="${s.otherLangCode}" aria-label="${esc(s.otherLangLabel)}">${s.otherLang}</button>
      <button class="icon-btn" type="button" data-calc-share>${s.share}</button>
    </span>
  </div>
  <h1>${s.title}</h1>
  <p class="calc-lead">${s.lead}</p>
  <details class="calc-help">
    <summary>${s.helpSummary}</summary>
    <div>
      <p>${s.helpWhy}</p>
      <dl class="calc-terms">${PARAMS.map((p, i) => `<dt><code>${p}</code></dt><dd>${s.terms[i]}</dd>`).join("")}</dl>
      <p>${s.helpAdmin}</p>
    </div>
  </details>

  <section aria-labelledby="datos">
    ${heading("datos", "hData")}
    <form id="calc-form" novalidate>
      <div class="calc-field">
        <label for="calc-role">${s.roleLabel}</label>
        <select id="calc-role">${ROLE_IDS.map((v) => `<option value="${v}">${s.roles[v]}</option>`).join("")}</select>
      </div>
      <div class="calc-field">
        <label for="calc-neighbors">${s.neighborsLabel}</label>
        <span class="calc-hint" id="calc-formats">${s.formats}</span>
        <textarea id="calc-neighbors" spellcheck="false" autocapitalize="off" autocomplete="off" wrap="off" rows="6"
          aria-describedby="calc-formats calc-error" placeholder="Cerro Gordo  SNR: 6.5 dB  heard: 2h15m ago&#10;A1B2C3D4:312:26"></textarea>
        <p id="calc-error" class="calc-error" role="alert"></p>
      </div>
      <div class="calc-actions">
        <button class="icon-btn primary" type="submit">${s.calculate}</button>
        <button class="icon-btn" type="button" id="calc-demo">${s.demo}</button>
      </div>
    </form>
    <details>
      <summary>${s.collectSummary}</summary>
      <div>
        <p>${s.collectIntro}</p>
        <ul><li>${s.collectApp}</li><li>${s.collectMonitor}</li></ul>
        <p>${s.collectNote}</p>
        <p>${s.collectCmds}</p>
        ${cmdList("calc-collect", s.collectAria)}
      </div>
    </details>
    <details id="calc-current">
      <summary>${s.currentSummary}</summary>
      <div>
        <p class="calc-hint" id="calc-current-hint">${s.currentHint}</p>
        <div class="calc-three">${oldInput(0, "0.5")}${oldInput(1, "0.3")}${oldInput(2, "0")}</div>
        <p id="calc-current-status" class="calc-status" aria-live="polite"></p>
        <div id="calc-restore-wrap" hidden>
          <p>${s.restoreIntro}</p>
          ${cmdList("calc-restore", s.restoreAria)}
        </div>
      </div>
    </details>
  </section>

  <section id="calc-results" aria-labelledby="ajustes" hidden>
    ${heading("ajustes", "hResults", ' tabindex="-1"')}
    <p id="calc-why"></p>
    <div class="radio-strip">
      <dl aria-label="${esc(s.statsAria)}">
        <div><dt>${s.statCount}</dt><dd id="calc-count"></dd></div>
        <div><dt>${s.statExcluded}</dt><dd id="calc-excluded"></dd></div>
        <div><dt>${s.statDensity}</dt><dd id="calc-density"></dd></div>
      </dl>
    </div>
    <div id="calc-warnings" class="calc-warn" hidden></div>
    <dl class="calc-values" id="calc-values"></dl>
    <p class="calc-hint">${s.radioNote}</p>
    <details>
      <summary>${s.neighborDetails}</summary>
      <div id="calc-neighbor-table"></div>
    </details>
    <h3>${s.applyHow}</h3>
    <ol>${s.applySteps.map((step) => `<li>${step}</li>`).join("")}</ol>
    <h3>${s.applyH}</h3>
    ${cmdList("calc-apply", s.applyAria)}
    <h3>${s.verifyH}</h3>
    ${cmdList("calc-verify", s.verifyAria)}
    <div class="calc-share">
      <p>${s.shareIntro}</p>
      <button class="icon-btn" type="button" data-calc-share>${s.share}</button>
    </div>
  </section>

  <section aria-labelledby="prueba">
    ${heading("prueba", "hTest")}
    <p>${s.testIntro}</p>
    <div class="calc-field">
      <label for="calc-test-type">${s.testType}</label>
      <select id="calc-test-type" aria-describedby="calc-test-hint">
        <option value="channel">${s.typeChannel}</option>
        <option value="direct">${s.typeDirect}</option>
      </select>
      <p class="calc-hint" id="calc-test-hint"></p>
    </div>
    ${testGroup("channel")}
    ${testGroup("direct")}
    <details>
      <summary>${s.routeSummary}</summary>
      <div>
        <p>${s.routeIntro}</p>
        <label for="calc-route">${s.routeLabel}</label>
        <select id="calc-route">${ROUTE_IDS.map((v) => `<option value="${v}">${s.routeOptions[v]}</option>`).join("")}</select>
      </div>
    </details>
    <p id="calc-route-status" class="calc-status" aria-live="polite"></p>
  </section>

  <section aria-labelledby="fuentes">
    ${heading("fuentes", "hSources")}
    <ul>${s.sources.map((src) => `<li>${src}</li>`).join("")}</ul>
    <p class="calc-hint">${s.privacy}</p>
  </section>
</div>`;
  }

  /* ---------- vista ---------- */
  let container = null;
  let root = null;
  let ui = null;
  let urlTimer;
  let routes = { channel: "unknown", direct: "unknown" };
  const $ = (id) => root.querySelector("#" + id);
  const val = (id) => $(id).value.trim();
  /* Solo cambia el texto si es otro: así las regiones aria-live no repiten lo mismo con cada tecla. */
  const say = (id, text) => { const el = $(id); if (el.textContent !== text) el.textContent = text; };
  let lastToast = "";
  /* VoiceOver no repite un aviso idéntico al anterior; un espacio duro invisible lo hace distinto. */
  const notify = (text) => { if (text === lastToast) text += " "; lastToast = text; ui.toast(text); };

  function renderCommands(list, commands) {
    list.replaceChildren(...commands.map((cmd) => {
      const li = document.createElement("li");
      const code = document.createElement("code");
      code.textContent = cmd;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "icon-btn copy-btn";
      btn.textContent = t("copy");
      btn.setAttribute("aria-label", t("copyLabel", { cmd }));
      btn.dataset.cmd = cmd;
      li.append(code, btn);
      return li;
    }));
  }

  async function copyCommand(btn) {
    const cmd = btn.dataset.cmd;
    if (await ui.copyText(cmd)) { notify(t("copied", { cmd })); return; }
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(btn.previousElementSibling);
    sel?.removeAllRanges();
    sel?.addRange(range);
    notify(t("copyFailed"));
  }

  function renderValues(proposed, reference) {
    $("calc-values").innerHTML = PARAMS.map((p, i) => `<div>
      <dt><code>${p}</code><span>${S().meanings[i]}</span></dt>
      <dd><strong>${esc(show(proposed[i], i))}</strong><small>${esc(t("reference", { value: show(reference[i], i) }))}</small></dd>
    </div>`).join("");
  }

  function renderNeighborTable(list) {
    const box = $("calc-neighbor-table");
    if (!list.length) { box.innerHTML = `<p>${t("noNeighbors")}</p>`; return; }
    const listFmt = new Intl.ListFormat(S().htmlLang);
    const rows = [...list].sort((a, b) => a.age - b.age).map((n) => `<tr>
      <td>${esc(n.name)}</td><td>${fmt(n.snr)} dB</td><td>${esc(ageLabel(n.age))}</td>
      <td class="${n.reasons.length ? "calc-no" : "calc-yes"}">${n.reasons.length ? esc(t("no", { reasons: listFmt.format(n.reasons) })) : t("yes")}</td>
    </tr>`).join("");
    box.innerHTML = `<div class="table-wrap" tabindex="0" role="region" aria-label="${esc(t("tableAria"))}">
      <table><thead><tr>${S().tableHead.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead>
      <tbody>${rows}</tbody></table></div>
      <p class="calc-hint">${t("tableHint")}</p>`;
  }

  function calculate({ moveFocus = true } = {}) {
    const p = parseNeighbors($("calc-neighbors").value);
    let error = "";
    if (p.confirmedEmpty && (p.neighbors.length || p.invalid.length)) {
      error = t("errInconsistent");
    } else if (!p.neighbors.length && !p.confirmedEmpty) {
      error = p.invalid.length ? t("errUnrecognized", { lines: p.invalid.slice(0, 8).join(", ") }) : t("errEmpty");
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
    if (p.invalid.length) notes.push(S().noteInvalid(p.invalid.length, p.invalid.slice(0, 8).join(", ") + (p.invalid.length > 8 ? ", …" : "")));
    if (p.duplicates) notes.push(S().noteDuplicates(p.duplicates));
    if (p.rawCount >= 8 || p.cliBytes >= 110) notes.push(t("noteTruncated"));
    if (!count) notes.push(t("noteNone"));
    if (count >= 12 && role !== "local") notes.push(t("noteTxLimit"));
    $("calc-count").textContent = count;
    $("calc-excluded").textContent = assessed.length - count;
    $("calc-density").textContent = density;
    $("calc-why").textContent = why;
    $("calc-warnings").hidden = !notes.length;
    $("calc-warnings").replaceChildren(...notes.map((text) => Object.assign(document.createElement("p"), { textContent: text })));
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
      if (bad) errors.push(t("restoreRange", { name: PARAMS[i], max: MAXIMUMS[i] }));
    });
    const complete = nums.every(Number.isFinite) && !errors.length;
    renderCommands($("calc-restore"), complete ? setCommands(nums) : []);
    say("calc-current-status", errors.join(" ") || (raw.some(Boolean) && !complete ? t("restoreIncomplete") : ""));
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
    let text = t("testWaiting");
    if ([a, b].some((s) => s.entered && !s.valid && !s.pending)) {
      text = t("testInvalid");
    } else if (done) {
      const delta = Number((b.percent - a.percent).toFixed(2));
      const rate = (s) => t("testRate", { got: s.arrived, sent: s.total, pct: fmt(s.percent) });
      text = t("testResult", { a: rate(a), b: rate(b), delta: (delta > 0 ? "+" : "") + fmt(delta) });
      text += " " + t(delta > 0 ? "testMore" : delta < 0 ? "testFewer" : "testSame");
      if (a.total !== b.total) text += " " + t("testBatch");
    }
    say(`calc-${type}-out`, text);
    return done;
  }

  function ackSummary() {
    const raw = [val("calc-ack-1"), val("calc-ack-2")];
    if (!raw[0] && !raw[1]) return "";
    const nums = raw.map(toNumber);
    if (raw.some((r, i) => r && !(nums[i] >= 0))) return t("ackInvalid");
    if (!raw[0] || !raw[1]) return t("ackIncomplete");
    return t("ackResult", { a: fmt(nums[0]), b: fmt(nums[1]) });
  }

  function updateTest() {
    const type = $("calc-test-type").value;
    $("calc-channel").hidden = type !== "channel";
    $("calc-direct").hidden = type !== "direct";
    say("calc-test-hint", t(type === "channel" ? "hintChannel" : "hintDirect"));
    $("calc-route").value = routes[type];
    const done = compare(type);
    say("calc-ack-out", ackSummary());
    say("calc-route-status", done ? S().routeText[routes[type]] : "");
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
    for (const k of Object.keys(TESTS)) {
      const counts = [1, 2].flatMap((n) => [val(`calc-${k}-${n}-sent`), val(`calc-${k}-${n}-received`)]);
      if (counts.some(Boolean)) s.set(TESTS[k], counts.join(","));
      if (routes[k] !== "unknown") s.set("ruta-" + TESTS[k], routes[k]);
    }
    const ack = [val("calc-ack-1"), val("calc-ack-2")];
    if (ack.some(Boolean)) s.set("ack", ack.join(","));
    if (lang === "en") s.set("idioma", "en");
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
    $("calc-role").value = pick("rol", ROLE_IDS) || "local";
    $("calc-neighbors").value = s.get("vecinos") || "";
    (s.get("antes") || "").split(",").slice(0, 3).forEach((v, i) => { $("calc-old-" + i).value = v.trim(); });
    const byName = Object.fromEntries(Object.entries(TESTS).map(([k, v]) => [v, k]));
    $("calc-test-type").value = byName[s.get("prueba")] || "channel";
    routes = { channel: "unknown", direct: "unknown" };
    for (const [k, name] of Object.entries(TESTS)) {
      const c = (s.get(name) || "").split(",");
      [1, 2].forEach((n, j) => {
        $(`calc-${k}-${n}-sent`).value = (c[j * 2] || "").trim();
        $(`calc-${k}-${n}-received`).value = (c[j * 2 + 1] || "").trim();
      });
      routes[k] = pick("ruta-" + name, ROUTE_IDS) || "unknown";
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
    if (navigator.share && matchMedia("(pointer: coarse)").matches) {
      try { await navigator.share({ title: t("docTitle"), url }); return; }
      catch (e) { if (e && e.name === "AbortError") return; }
    }
    const ok = await ui.copyText(url);
    notify(!ok ? t("shareFailed") : q.includes("vecinos=") ? t("shareWithList") : t("shareCopied"));
  }

  async function copySectionLink(link) {
    const h = link.getAttribute("href");
    const ok = await ui.copyText(location.origin + location.pathname + h);
    notify(t(ok ? "anchorCopied" : "anchorFailed"));
    const target = $(h.slice(h.lastIndexOf("#") + 1));
    target.scrollIntoView({ block: "start" });
    if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
    target.focus({ preventScroll: true });
  }

  /* Cambia de idioma sin perder lo escrito: guarda el estado, vuelve a pintar y lo restaura. */
  function switchLanguage() {
    const openDetails = [...root.querySelectorAll("details")].map((d) => d.open);
    lang = lang === "en" ? "es" : "en";
    try { localStorage.setItem(LANG_KEY, lang); } catch {}
    const q = serialize();
    draw(q);
    root.querySelectorAll("details").forEach((d, i) => { if (openDetails[i]) d.open = true; });
    syncUrl();
    document.title = t("docTitle");
    $("calc-lang").focus();
  }

  function draw(query) {
    container.innerHTML = template();
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
    $("calc-lang").addEventListener("click", switchLanguage);
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
      const link = e.target.closest(".anchor");
      if (link) {
        // copia el enlace a la sección sin cambiar la dirección, para no perder lo escrito
        e.preventDefault();
        e.stopPropagation();
        copySectionLink(link);
        return;
      }
      if (e.target.closest("[data-calc-share]")) share();
    });
  }

  function render(target, query, helpers) {
    ui = helpers;
    container = target;
    const requested = new URLSearchParams(query).get("idioma");
    // el idioma del enlace manda; si no trae, se usa el que la persona escogió antes
    if (requested === "en" || requested === "es") lang = requested;
    draw(query);
  }

  return {
    render,
    /* título de la pestaña en el idioma actual */
    title: () => t("docTitle"),
    /* estado actual como query (sin "?"), para que el router sepa si un enlace trae otro estado */
    query: () => (root?.isConnected ? serialize() : null),
    syncUrl
  };
})();
