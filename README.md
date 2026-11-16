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

Herramientas

- [Calculadora de repetidores](https://guia.prmsh.com/#/calculadora): pega la lista de vecinos de un repeater MeshCore y te da `txdelay`, `direct.txdelay` y `rxdelay` para probar, con los comandos y una prueba de campo

## Calculadora de repetidores

Pega la lista de vecinos de un repeater MeshCore y te da los tiempos de espera, los comandos y una prueba para comparar antes y después. Está en español e inglés y funciona sin conexión.

Lo que escribes se guarda en el enlace (`#/calculadora?rol=…&vecinos=…`), así que puedes recargar sin perderlo y compartirlo con quien administra el repeater. Ese texto va después del `#`, así que no llega al servidor. Cada sección tiene su propio enlace (`#/calculadora#prueba`) para citarla.

## Sin conexión y como app

El sitio guarda la página, las guías y la calculadora después de la primera visita, para que abran sin internet (en el campo, en un apagón).

También se puede instalar como app. En Android y Chrome sale la opción "Instalar"; en iPhone, Compartir → "Añadir a pantalla de inicio". Después de 3 minutos con la página abierta (sumando visitas) sale un aviso para instalarla. Con "Ahora no" no vuelve a salir en 30 días.

## Contribuir

Para corregir o añadir una guía, verla en tu computadora o abrir un PR, lee [CONTRIBUTING.md](CONTRIBUTING.md).

## Comunidad

- PRMSH: https://prmsh.com
- Discord, para dudas o preguntas: https://discord.gg/3v6rRhNRpD
- Mapa de la malla: https://malla.prmsh.com

Guías escritas por WP4TZV.

## Licencia

Las guías están bajo [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.es): puedes copiarlas, adaptarlas y compartirlas, también en talleres o con fines comerciales, si das crédito a WP4TZV y compartes tus cambios con la misma licencia. El texto legal está en [LICENSE](LICENSE).

El código (`index.html`, `calculadora.js`, `sw.js`, `manifest.webmanifest`, `favicon.svg` y los íconos) está bajo la licencia MIT. Ver [LICENSE-CODIGO.txt](LICENSE-CODIGO.txt).
