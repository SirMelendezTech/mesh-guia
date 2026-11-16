# Cómo contribuir

Gracias por ayudar con las guías de la malla de Puerto Rico. Puedes aportar aunque nunca hayas usado GitHub.

## Antes de empezar

- **Un error, un dato viejo o algo que no se entiende:** escríbelo en el [Discord de la comunidad](https://discord.gg/3v6rRhNRpD) o abre un *issue* en GitHub. Con eso basta: no hace falta que lo arregles tú.
- **Cambiar una recomendación** (un rol, un preset, valores de radio, tiempos de espera): coméntalo primero en el Discord. Esos valores tienen que ser iguales en toda la isla, y la comunidad decide.
- **Arreglar una errata o mejorar una explicación:** puedes ir directo a un *pull request* (PR).

## Editar una guía desde el navegador

La forma más fácil, sin instalar nada:

1. Abre la guía en GitHub (por ejemplo, `meshcore-companion-pr.md`) y toca el lápiz (**Edit this file**).
2. Haz el cambio. La pestaña **Preview** enseña cómo se va a ver.
3. Abajo, escribe en una línea qué cambiaste y toca **Propose changes**. GitHub crea tu copia y el PR.

Cuando el PR se acepta, el sitio se actualiza solo en unos minutos.

## Cómo escribir

Las guías son para gente de cualquier nivel, a veces leyendo en el campo desde el teléfono.

- Español de Puerto Rico, de tú. Oraciones cortas y verbos simples: "toca", "abre", "escoge".
- Primero lo que la persona hace; después el porqué, si hace falta.
- Usa las palabras de [GLOSSARY.md](GLOSSARY.md): una sola palabra por cada cosa, en todas las guías.
- Usa el nombre que sale en la app tal cual: **Settings → Neighbours**, `CLIENT_MUTE`, `txdelay`.
- Pasos en lista numerada solo si van en orden. Si no, lista con guiones.
- Nombres de roles, comandos y valores literales van entre comillas invertidas: `ROUTER_LATE`, `set txdelay 1.2`.
- Si un valor sale de una fuente (documentación oficial, white paper), enlázala.

## Formato de una guía

Cada guía es un archivo `.md` en la raíz del repo. Empieza así, porque la página lee estas líneas:

```markdown
# Nodos Companion de MeshCore en Puerto Rico

Para nodos portátiles: en la mano, en la mochila o en el carro.

- Autor: WP4TZV
- Malla: Puerto Rico, región US (902–928 MHz)
- Firmware estable: **v1.18.0**
- Última revisión: noviembre 2026
```

- El `#` es el título. La página le quita "Meshtastic —" o "MeshCore —" del principio.
- `Firmware estable: **…**` sale en la portada y arriba de cada guía. Déjalo en negritas.
- Cada `##` es una sección del índice. Su enlace sale del texto del título: si cambias un título, se rompen los enlaces que la gente ya compartió. Cámbialo solo si hace falta.
- Para enlazar otra guía, usa su archivo: `[Companion](meshcore-companion-pr.md)` o `meshcore-companion-pr.md#seccion`. Para la calculadora: `[calculadora de repetidores](#/calculadora)`.
- Las listas con `- [ ]` se pueden marcar en la página. Lo marcado se guarda en el teléfono de cada persona.

## Añadir una guía nueva

1. Sube el `.md` a la raíz con el formato de arriba. En el sitio aparece solo en "Otras guías".
2. Para que tenga su celda en la tabla de la portada, añádelo a `ROLES` en `index.html` con su proyecto, lugar y descripción.
3. Si es un documento del repo y no una guía, añade su nombre a `NOT_GUIDES` en `index.html` para que no salga en el sitio.

Los valores de radio de la portada están en `RADIO`, en `index.html`.

## La calculadora de repetidores

Está en `calculadora.js` y se abre en `#/calculadora`.

- **Textos:** van en `STR`, en español (`es`) y en inglés (`en`). Si añades o cambias un texto, hazlo en los dos idiomas.
- **Valores por vecinos:** salen de `TABLE` y son los mismos de la tabla de §6.4 en `meshcore-repeater-roomserver-pr.md`. Si cambias uno, cambia el otro en el mismo PR.
- **Enlaces compartidos:** lo que la persona escribe va en el enlace (`#/calculadora?rol=…&vecinos=…`). No cambies los nombres de esos parámetros, porque los enlaces que ya se compartieron dejarían de funcionar.

## Verlo en tu computadora

```sh
python3 -m http.server
```

Abre http://localhost:8000. Desde `file://` no funciona, porque el navegador no deja leer los `.md`.

Antes de abrir el PR, mira la página en tema claro y oscuro (botón arriba a la derecha) y en ancho de teléfono.

## Sin conexión

`sw.js` guarda la página, las guías y la calculadora para que se abran sin internet. Si cambias la lista `CORE` o la lógica de `sw.js`, sube el número de `VERSION` al principio del archivo. Un archivo nuevo que tenga que funcionar sin conexión va en `CORE`. Para cambiar solo el texto de una guía no hace falta tocar `sw.js`.

Si cambias el ícono, vuelve a generar los PNG (`icon-*.png`, `apple-touch-icon.png`) desde `favicon.svg`.

## Pull requests

- Un tema por PR. Es más fácil de revisar y de deshacer.
- Título en español que diga qué cambia, por ejemplo "Actualizar firmware estable de MeshCore a v1.19".
- La descripción sale con una plantilla (`.github/pull_request_template.md`): llena qué cambia, la evidencia y el riesgo. Si cambia un valor, enlaza la fuente; si cambia algo visual, añade una captura.
- Trabaja en una rama, no en `main`. El sitio se publica cuando el PR se une a `main`.

## Licencia

Al contribuir, aceptas que tu aporte se publique con la licencia del repo:

- Guías (`.md`): [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.es).
- Código (`index.html`, `calculadora.js`, `sw.js`, `manifest.webmanifest`, `favicon.svg` y los íconos): MIT. Ver [LICENSE-CODIGO.txt](LICENSE-CODIGO.txt).
