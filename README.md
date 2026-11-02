# Mesh PR: guías de nodos

Guías para configurar nodos Meshtastic y MeshCore en la malla de Puerto Rico (región US, 902–928 MHz).

Página: https://guia.prmsh.com

## Guías

Meshtastic

- [CLIENT / CLIENT_MUTE](meshtastic-pr-cliente-vs-mute.md): nodos portátiles
- [CLIENT_BASE](meshtastic-pr-client-base.md): nodo base en casa o techo
- [ROUTER / ROUTER_LATE](meshtastic-pr-router-router-late.md): infraestructura en cerros y torres

MeshCore

- [Companion](meshcore-companion-pr.md): nodos portátiles
- [Repeater / Room Server](meshcore-repeater-roomserver-pr.md): infraestructura fija

## Añadir o editar una guía

Las guías son archivos `.md` en la raíz del repo. `index.html` los muestra en el navegador, así que no hace falta compilar nada.

1. Sube el `.md` nuevo a la raíz. En GitHub Pages aparece solo en "Otras guías".
2. Para que tenga su celda en la tabla de la portada, añádelo a `ROLES` en `index.html` con su proyecto, lugar y descripción.
3. Los valores de radio de la portada están en `RADIO`, en el mismo archivo. El firmware se lee de la línea `Firmware estable: **…**` de cada guía.

## Verla en tu computadora

```sh
python3 -m http.server
```

Abre http://localhost:8000. Desde `file://` no funciona, porque el navegador no deja leer los `.md`.

## Comunidad

- PRMSH: https://prmsh.com
- Mapa de la malla: https://malla.prmsh.com

Guías escritas por WP4TZV.
