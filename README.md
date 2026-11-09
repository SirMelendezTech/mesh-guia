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
4. Las listas con `- [ ]` se pueden marcar en la página. Lo marcado se guarda en el navegador de cada persona.

## Sin conexión

`sw.js` guarda la página y las guías después de la primera visita, para que se puedan abrir sin internet (en el campo, en un apagón). Solo funciona por HTTPS. Si cambias `sw.js`, sube el número de `VERSION` al principio del archivo.

También se puede instalar como app (`manifest.webmanifest` y los íconos `icon-*.png`). En Android y Chrome sale la opción "Instalar"; en iPhone, Compartir → "Añadir a pantalla de inicio". Si cambias el ícono, vuelve a generar los PNG desde `favicon.svg`.

Después de 3 minutos con la página abierta (sumando visitas, sin contar pestañas en segundo plano) sale un aviso abajo para instalarla. Si la persona toca "Ahora no", no vuelve a salir en 30 días. Ya instalada, no sale.

## Verla en tu computadora

```sh
python3 -m http.server
```

Abre http://localhost:8000. Desde `file://` no funciona, porque el navegador no deja leer los `.md`.

## Comunidad

- PRMSH: https://prmsh.com
- Discord, para dudas o preguntas: https://discord.gg/3v6rRhNRpD
- Mapa de la malla: https://malla.prmsh.com

Guías escritas por WP4TZV.

## Licencia

Las guías están bajo [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.es): puedes copiarlas, adaptarlas y compartirlas, también en talleres o con fines comerciales, si das crédito a WP4TZV y compartes tus cambios con la misma licencia. El texto legal está en [LICENSE](LICENSE).

El código (`index.html`, `sw.js`, `manifest.webmanifest`, `favicon.svg` y los íconos) está bajo la licencia MIT. Ver [LICENSE-CODIGO.txt](LICENSE-CODIGO.txt).
