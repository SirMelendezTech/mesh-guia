# AGENTS.md

Sitio estático sin build. `index.html` lee los `.md` de la raíz y los muestra en el navegador (marked + DOMPurify). `calculadora.js` es la vista `#/calculadora`. GitHub Pages publica `main` en https://guia.prmsh.com.

Lee [CONTRIBUTING.md](CONTRIBUTING.md) antes de escribir texto de una guía, añadir una guía o abrir un PR: tiene el estilo de escritura, el formato de guía y el flujo de PR.

## Contratos

Romper uno de estos rompe el sitio o enlaces que la gente ya compartió.

- **Guías:** cada `.md` de la raíz sale en el sitio como guía, salvo los que lista `NOT_GUIDES` en `index.html` (README, AGENTS, CONTRIBUTING, CLAUDE, GLOSSARY). Un `.md` nuevo que sea del repo y no una guía va en esa lista.
- **Encabezado de guía:** `loadDoc()` en `index.html` lee con regex el `# título`, `Autor:`, `Firmware estable: **x**` y `Última revisión:`. Mantén ese formato.
- **Anclas:** el id de cada sección sale del texto del `##` (`slug()`). Antes de cambiar un título, busca enlaces a esa ancla en el repo.
- **Enlaces internos:** a otra guía, con el archivo (`otra.md#seccion`), que `enhance()` reescribe; a una vista, con `#/calculadora`.
- **Calculadora:** `TABLE` en `calculadora.js` y la tabla de §6.4 en `meshcore-repeater-roomserver-pr.md` tienen los mismos valores. Cambia las dos juntas.
- **Calculadora:** `STR.es` y `STR.en` tienen las mismas claves. Cada texto nuevo va en los dos idiomas.
- **Calculadora:** los parámetros del enlace (`rol`, `vecinos`, `antes`, `prueba`, `canal`, `directo`, `ruta-canal`, `ruta-directo`, `ack`, `idioma`) son públicos. Añade parámetros nuevos; deja los existentes con su nombre y formato.
- **Sin conexión:** sube `VERSION` en `sw.js` cuando cambies `CORE` o la lógica del service worker. Un archivo nuevo que deba abrir sin internet va en `CORE`.
- **Colores:** cada token de `:root` tiene su valor oscuro en los dos bloques: `@media (prefers-color-scheme: dark)` y `:root[data-theme="dark"]`.

## Verificar

No hay tests ni build.

- `node --check calculadora.js && node --check sw.js`. El script de `index.html` es inline: extráelo a un archivo temporal y pásale `node --check`.
- `python3 -m http.server` y abre http://localhost:8000. Desde `file://` no carga los `.md`.
- Revisa tema claro y oscuro, ancho de 360 px y navegación con teclado.

## Idioma

- Texto visible: español de Puerto Rico, sencillo y de tú (detalle en CONTRIBUTING.md). La calculadora también en inglés.
- Palabras: usa el término de [GLOSSARY.md](GLOSSARY.md) para cada concepto en el texto visible (guías y calculadora). Si un concepto nuevo no está, añádelo ahí.
- Mensajes de commit: una oración en inglés con qué cambia (mira `git log`). Títulos de PR: en español.
