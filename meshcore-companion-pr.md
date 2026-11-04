# Nodos Companion de MeshCore en Puerto Rico

Para nodos portátiles: en la mano, en la mochila o en el carro.

- Autor: WP4TZV
- Malla: Puerto Rico, región US (902–928 MHz)
- Firmware estable: **v1.18.0**
- Última revisión: noviembre 2026

## 1. Resumen rápido

| Parámetro | Valor en PR | Notas |
|---|---|---|
| Preset en la app | USA/Canada (Recommended) | PR usa la banda ISM de 902–928 MHz de EE.UU. |
| Frecuencia | 910.525 MHz | |
| Bandwidth | 62.5 kHz | Preset "narrow", adoptado a finales de 2025 |
| Spreading factor | 7 | |
| Coding rate | 5 (4/5) | |
| Path hash size | 2 bytes | App → Settings → Experimental → Default Path Hash Size |
| TX power | El máximo del radio (22 dBm en un SX1262) | Para ahorrar batería, ver §7 |
| Firmware | Companion (BLE, USB o WiFi) | Un portable nunca lleva firmware Repeater |

Todos los nodos de la isla, companions y repeaters, tienen que usar el preset USA/Canada para que haya una sola malla. Si la comunidad MeshCore de PR publica un preset regional propio, ese reemplaza esta tabla.

## 2. Por qué estos valores

- **910.525 MHz, 62.5 kHz, SF7, CR5** es el preset recomendado para USA/Canada. Muchas regiones dejaron SF11 con 250 kHz y pasaron a este perfil "narrow" porque entrega más mensajes: cada paquete ocupa menos tiempo en el aire y hay menos colisiones.
- **SF7 parece poco alcance**, pero en MeshCore el alcance lo dan los repeaters fijos en lugares altos, no el companion. El bandwidth de 62.5 kHz recupera parte de la sensibilidad que se pierde con un SF más bajo.
- **Path hash de 2 bytes.** Con 1 byte hay solo 256 IDs posibles, así que dos repeaters terminan con el mismo ID a menudo y las rutas se confunden. Con 2 bytes hay 65,536 IDs y se permiten hasta 32 saltos en flood. Los repeaters con firmware 1.14 o más nuevo reenvían cualquier tamaño de hash; los más viejos descartan los paquetes de 2 y 3 bytes. Por eso conviene que los repeaters de la isla estén al día.
- **Coding rate.** LoRa envía el CR en el encabezado del paquete, así que un CR distinto no corta la comunicación. Aun así, usa CR5 para que todos estén iguales. Algunas redes, como la de Florida, usan CR8 en los repeaters.

### Lo particular de Puerto Rico

- La Cordillera Central y El Yunque dejan zonas de sombra de radio. Un companion en un valle depende de que haya un repeater con línea de vista.
- El concreto bloquea mucho la señal. Dentro de la casa el companion casi no sale; en la ventana, en el balcón o con una antena externa la diferencia es grande.
- Si vienes de Meshtastic: un Companion se parece a un CLIENT_MUTE. No retransmite nada. Las retransmisiones las hacen los Repeaters y los Room Servers.

## 3. Variantes del firmware Companion

El firmware Companion viene en tres variantes, según cómo se conecta a tu teléfono o computadora:

| Variante | Se conecta con | Úsala cuando | Evítala cuando |
|---|---|---|---|
| BLE | La app de iOS o Android | Uso diario a pie, en el carro o de hiking. Es la normal para portables | Necesitas guardar registros en una computadora todo el tiempo |
| USB (serial) | La web app (app.meshcore.nz), `meshcore-cli`, `meshcore.js` | Carro con laptop o tablet, estación de mesa, scripts, depuración, nodo conectado a una Raspberry Pi | Vas caminando |
| WiFi (TCP, puerto 5000) | La app en la misma red local, `meshcore-cli`, integraciones | Nodo fijo en casa u oficina que usan varios equipos; base de operaciones en una emergencia con un router local | Portables con batería, porque el WiFi del ESP32 consume mucho |

Hardware:

- **nRF52840** (RAK4631, T1000-E, T-Echo, Wio Tracker L1): la mejor opción para portables BLE, porque consume muy poco.
- **ESP32-S3** (Heltec V3/V4, XIAO S3 con Wio-SX1262): funciona, pero gasta más batería. Va mejor con la variante WiFi o USB.

## 4. Configuración paso a paso en la app

1. **Instala el firmware** desde <https://flasher.meshcore.io/>: escoge tu dispositivo, luego Companion (BLE, USB o WiFi) y 915 MHz. La primera vez usa *Erase*.
2. **Conéctate** desde la app (BLE) o desde la web app (USB o WiFi).
3. **Ponle nombre al nodo**, algo que te identifique, como `WP4TZV-T1000` o `SirPedro📟`. El nombre viaja en los adverts.
4. **Radio:** Settings → Radio → preset USA/Canada (Recommended). Confirma que diga 910.525 / 62.5 / SF7 / CR5.
5. **Path hash:** Settings → Experimental Settings → Default Path Hash Size = 2 Bytes. Después cierra la app y vuelve a abrirla.
6. **TX power:** el máximo del radio, a menos que necesites estirar la batería (§7).
7. **Ubicación:**
   - Portable con GPS: compártela solo si quieres salir en los mapas. Puedes dejarla apagada y compartirla a mano cuando haga falta.
   - Portable sin GPS: deja la latitud y longitud en blanco. Una posición fija en algo que se mueve confunde a los demás.
8. **Contactos:** activa que los repeaters se añadan solos. Para los usuarios, escoge si se añaden solos o a mano; donde hay mucha actividad, a mano evita que la lista se llene.
9. **Canales:** `Public` viene por defecto. Para canales regionales con hashtag (por ejemplo `#puertorico` o `#test`), usa los que haya acordado la comunidad.
10. **Primer advert:** envía un Flood Advert una vez para que la red te conozca. De ahí en adelante usa Zero-hop (§5).

## 5. Adverts en movimiento

| Tipo | A quién llega | Cuándo usarlo |
|---|---|---|
| Zero-hop advert | Solo a los nodos que te oyen directo | Llegaste a un sitio nuevo y quieres que los repeaters cercanos te vean |
| Flood advert | A toda la malla, a través de los repeaters | Es tu primera vez en la red, o cambiaste de zona (por ejemplo, de San Juan a Mayagüez) y necesitas que te encuentren |

No envíes flood adverts uno tras otro mientras guías. Cada uno ocupa tiempo de aire en todos los repeaters de la isla.

## 6. Qué modo usar con un portable

### 6.1 Escenarios

| Escenario | Firmware | Red | Notas |
|---|---|---|---|
| Día a día en el área metro (San Juan, Bayamón, Carolina) | Companion BLE | Malla pública (preset USA/Canada) | Hay repeaters; tu nodo solo envía y recibe |
| En el carro | Companion BLE o USB | Malla pública | Una antena magnética de 915 MHz en el techo mejora mucho la señal. USB si llevas laptop o tablet con la web app |
| Hiking con repeaters a la vista (El Yunque, Toro Negro con cobertura) | Companion BLE | Malla pública | Mejor con nRF52. Envía un zero-hop advert al llegar a un mirador |
| Hiking o campamento sin repeaters (cuevas, cañones, Mona, cayos) | Companion BLE | Off-grid (client repeat) | Solo dentro del grupo; ver §6.2 |
| Emergencia o huracán sin infraestructura | Companion BLE en los portables; WiFi o USB en la base | La pública si los repeaters solares siguen funcionando; off-grid si no | Acuerden antes qué frecuencia off-grid van a usar |
| Evento, carrera o triatlón (personal de apoyo) | Companion BLE | La pública si hay un repeater en la zona; si no, off-grid o un repeater temporal en trípode | Un repeater temporal funciona mejor que muchos companions repitiendo |
| Estación en casa u oficina | Companion WiFi o USB | Malla pública | Si quieres aportar cobertura, instala aparte un Repeater en el techo |
| Gateway u observador MQTT | No aplica | No aplica | Eso es un Repeater con puente MQTT u observer, no un Companion |

### 6.2 Off-grid (client repeat)

Las versiones de 2026 tienen el modo Off-grid, también llamado client repeat. Se configura como un tipo de *Region* con su propia configuración de radio.

- **Qué hace:** el companion sí retransmite paquetes, como un repeater pequeño. Sirve para un grupo sin infraestructura: búsqueda y rescate, hiking en zonas remotas, emergencias.
- **Límite importante:** solo deja usar frecuencias reservadas para off-grid, distintas de las de la malla pública. Así, si alguien se olvida el modo puesto, no ensucia las rutas de la red pública.
- **Cómo activarlo:** App → Manage Regions → New → tipo Off-grid → escoge una frecuencia reservada → *Set as Home*. Para volver, selecciona el perfil de la red pública (`MeshCore.915`) o la región comodín `*`.
- Todo el grupo tiene que estar en la misma región off-grid, con la misma frecuencia.

Usa off-grid cuando:

- No llegas a ningún repeater y el grupo necesita pasarse los mensajes entre sí.
- El grupo está regado en terreno quebrado: cuadrillas, cañones, búsqueda y rescate.

No lo uses cuando:

- Tienes un repeater público al alcance. En ese caso usa la malla pública.
- Vas de regreso a la zona urbana. Sal del modo off-grid antes de llegar.
- Lo quieres para tener más alcance en el día a día. Para eso se instala un repeater fijo.

### 6.3 Un portable nunca es Repeater

Un repeater que se mueve crea rutas que luego desaparecen, y eso empeora la malla para todos. Si quieres aportar cobertura, instala un repeater fijo, en un sitio alto y con energía estable.

## 7. Energía en portables

| Situación | Qué hacer |
|---|---|
| Uso normal | TX power al máximo; GPS solo si lo necesitas |
| Necesitas que la batería dure (campamento, emergencia) | Apaga el GPS (en un ESP32 es lo que más gasta), baja el brillo de la pantalla y usa un nRF52 si puedes |
| ESP32 con batería | Evita la variante WiFi; usa BLE |
| Carro | Aliméntalo por el USB del carro y usa una antena externa |

## 8. Checklist antes de salir

- [ ] Firmware Companion al día (y los repeaters de la zona en 1.14 o más nuevo si usas hash de 2 bytes)
- [ ] Preset USA/Canada: 910.525 / 62.5 / SF7 / CR5
- [ ] Path hash en 2 bytes
- [ ] Antena conectada antes de encender (transmitir sin antena puede dañar el SX1262)
- [ ] Nombre del nodo y canales configurados
- [ ] Batería cargada; GPS encendido o apagado según lo que vayas a hacer
- [ ] Si vas a una zona remota: región off-grid creada y acordada con el grupo
- [ ] Al regresar: de vuelta en la red pública

## 9. Fuentes

- [MeshCore: repositorio oficial](https://github.com/meshcore-dev/MeshCore)
- [MeshCore: preguntas frecuentes](https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md)
- [Spokane Mesh: migración a 910.525 / SF7 / BW62.5 / CR5](https://groups.google.com/g/spokanemeshnet/c/9861SZsRXNs)
- [Blog de MeshCore: modo Off-grid (client repeat), febrero 2026](https://blog.meshcore.io/2026/02/13/off-grid-client-repeat-mode)
- [Blog de MeshCore: path hash de varios bytes y detección de lazos, marzo 2026](https://blog.meshcore.io/2026/03/06/path-diagnostics-improvements)
- [MeshCore CLI: `path.hash.mode` (PR #1968)](https://github.com/meshcore-dev/MeshCore/pull/1968/files)
- [Florida Mesh: configuración de nodos](https://areyoumeshingwith.us/docs/meshcore/configuration/)
- [MeshCore Western Australia: migración a 2 bytes](https://meshcorewestaus.pages.dev/)
