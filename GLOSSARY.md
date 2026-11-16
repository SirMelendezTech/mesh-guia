# Mesh PR

Guías y herramientas para configurar nodos Meshtastic y MeshCore en la malla de Puerto Rico. Este glosario fija qué palabra usar para cada cosa en las guías y en la calculadora.

## La malla

**Malla**:
El conjunto de nodos de un mismo proyecto que se escuchan entre sí en la isla. Hay dos mallas, una de Meshtastic y otra de MeshCore, que no se hablan entre sí.
_Avoid_: mesh, red de la isla

**Proyecto**:
Meshtastic o MeshCore: dos firmwares distintos e incompatibles, cada uno con su malla, sus roles y su app.
_Avoid_: plataforma, red, protocolo

**Nodo**:
Un radio LoRa con firmware Meshtastic o MeshCore.
_Avoid_: dispositivo, equipo, radio (para el nodo completo)

**Radio de la isla**:
Los valores de radio que tienen que ser iguales en todos los nodos de una malla para que se escuchen: región, preset, frecuencia, bandwidth, spreading factor, coding rate y path hash.
_Avoid_: configuración LoRa, parámetros de radio

**Preset**:
Un conjunto de valores de radio con nombre, como `LONG_FAST` o USA/Canada (Recommended).
_Avoid_: modo, perfil

**Firmware estable**:
La versión de firmware que la guía recomienda para la isla, aunque haya una más nueva.
_Avoid_: última versión, firmware recomendado

**Airtime**:
El tiempo que un nodo ocupa el canal de radio mientras transmite. Es limitado y lo comparte toda la malla.
_Avoid_: tiempo de aire, uso del canal

## Lugares y roles

**Lugar**:
Dónde va a estar el nodo: Portátil, Casa o techo propio, o Cerro, torre o techo alto. Junto con el proyecto, decide el rol.
_Avoid_: ubicación, tipo de instalación

**Rol**:
Cómo se comporta un nodo en la malla, sobre todo si retransmite y cuándo. Se escribe tal como sale en la app.
_Avoid_: modo, tipo de nodo

**Companion**:
Rol de MeshCore para el nodo que se usa desde el teléfono por BLE, USB o WiFi. No retransmite.
_Avoid_: cliente, nodo personal

**Repeater**:
Rol de MeshCore para un nodo fijo que retransmite para extender la cobertura. No se usa para chatear.
_Avoid_: repetidor, repetidora, nodo repetidor

**Room Server**:
Rol de MeshCore para un nodo fijo que guarda los mensajes de un grupo para quien se conecte después.
_Avoid_: servidor, sala

**CLIENT**:
Rol de Meshtastic para un nodo portátil que retransmite.

**CLIENT_MUTE**:
Rol de Meshtastic para un nodo portátil que no retransmite, para ahorrar airtime y batería.

**CLIENT_BASE**:
Rol de Meshtastic para el nodo base personal, que retransmite con prioridad lo que va y viene de sus favoritos.

**ROUTER**:
Rol de Meshtastic para infraestructura fija con buena línea de vista, que retransmite antes que los demás.

**ROUTER_LATE**:
Rol de Meshtastic para infraestructura fija que retransmite después de los demás, para llenar huecos de cobertura.

**Favorito**:
Un nodo marcado en la lista de favoritos de otro nodo de Meshtastic. Cambia cómo lo trata `CLIENT_BASE` y si su salto cuenta.
_Avoid_: nodo preferido, contacto favorito

## Mensajes

**Retransmitir**:
Volver a transmitir un mensaje recibido para que llegue más lejos.
_Avoid_: repetir, rebotar, reenviar

**Salto**:
Cada vez que un nodo retransmite un mensaje. El ajuste que los limita es Hop limit.
_Avoid_: hop (en el texto corrido)

**Flood**:
La forma de retransmitir en la que cada nodo que recibe un mensaje lo vuelve a enviar, hasta el límite de saltos.
_Avoid_: inundación, broadcast

**Mensaje de canal**:
Un mensaje para todos los que tienen el mismo canal. Viaja por flood.
_Avoid_: broadcast, mensaje público, mensaje de grupo

**Mensaje directo**:
Un mensaje para un solo contacto. En MeshCore sigue una ruta fija cuando ya se conoce.
_Avoid_: DM, mensaje privado

**Advert**:
El mensaje con que un nodo de MeshCore se anuncia para que los demás lo conozcan. Puede ser zero-hop (solo los vecinos) o flood.
_Avoid_: anuncio, beacon

**Colisión**:
Cuando dos nodos transmiten a la vez en el mismo canal y ninguno de los dos mensajes se recibe.
_Avoid_: interferencia, choque

## Ajuste de un Repeater

**Vecino**:
Otro repeater que un Repeater escucha directo, sin saltos de por medio. En la app es la pantalla Neighbours.
_Avoid_: nodo cercano, neighbour (en el texto corrido)

**Vecino que cuenta**:
Un vecino con SNR mayor de 0 dB que se escuchó en los últimos 14 días. Solo estos deciden los tiempos de espera.
_Avoid_: vecino válido, vecino activo

**Densidad**:
Cuántos vecinos que cuentan tiene un Repeater: baja (0 a 3), media (4 a 8), alta (9 a 10) o regional (11 o más).
_Avoid_: congestión, carga

**Función**:
Para qué sirve un Repeater: cobertura local, enlace o las dos cosas.
_Avoid_: rol (que es Repeater), perfil, tipo

**Cobertura local**:
La función de un Repeater que da señal a Companions cerca.
_Avoid_: acceso, cobertura de zona

**Enlace**:
La función de un Repeater que conecta con otros repeaters lejos.
_Avoid_: backbone, troncal

**Tiempos de espera**:
Los tres ajustes que deciden cuánto espera un Repeater: `txdelay` (antes de retransmitir mensajes de canal), `direct.txdelay` (antes de retransmitir mensajes directos) y `rxdelay` (antes de atender lo recibido, para dar prioridad a las señales fuertes).
_Avoid_: delays, retrasos, valores de espera

**Prueba de campo**:
La comparación de cuántos mensajes llegan antes y después de cambiar un ajuste, con un Companion A que envía y un Companion B que cuenta.
_Avoid_: test, prueba de alcance

**Ronda**:
Una tanda de mensajes numerados dentro de una prueba de campo: la ronda 1 con los ajustes de antes y la ronda 2 después del cambio.
_Avoid_: tanda, lote, batch
