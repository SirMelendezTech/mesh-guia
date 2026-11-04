# Nodo CLIENT_BASE de Meshtastic en Puerto Rico

Para tu nodo base personal: en el techo, en el ático o en una torre casera.

- Autor: WP4TZV
- Malla: Puerto Rico, región US (902–928 MHz)
- Firmware estable: **2.7.26**
- Última revisión: noviembre 2026

## 1. Primero, los favoritos

En CLIENT_BASE, los favoritos son los que definen cómo se comporta el rol.

Un nodo CLIENT_BASE trata los paquetes que vienen de sus favoritos, o que van hacia ellos, como si fuera un ROUTER. Todos los demás paquetes los trata como un CLIENT normal.

| Si en el BASE… | Pasa esto |
|---|---|
| No hay favoritos | El nodo se comporta igual que un CLIENT, y CLIENT_BASE no te sirvió de nada |
| Están tus nodos personales (portátil, nodo interior, carro) | Tu base retransmite con prioridad todo lo que entra y sale de ellos. Tus nodos débiles llegan a la malla usando la antena del techo |
| Marcas a todo el mundo como favorito | Tu base termina funcionando como un ROUTER, con más colisiones y más congestión. No lo hagas |

### Para qué sirven los favoritos

1. **Prioridad para tus nodos.** Tu portátil en Client Mute dentro de la casa, o tu nodo interior detrás del concreto, no llega lejos. El BASE en el techo recoge sus paquetes y los pasa a la malla con prioridad de router. Al revés pasa lo mismo: los mensajes para tus nodos entran con prioridad.
2. **Zero-Cost Hops (firmware 2.7.11 o más nuevo).** Si tu BASE recibe un mensaje de un ROUTER o ROUTER_LATE que tiene en favoritos, ese salto no se cuenta, siempre que no sea el primer salto del mensaje. Marca como favoritos los routers de la comunidad que tu techo escucha directo, y los mensajes que bajan de la malla llegan a tu casa sin perder un salto. Esto no aplica entre dos CLIENT_BASE: el nodo anterior tiene que ser ROUTER o ROUTER_LATE.
3. **Tus nodos se quedan en la base de datos.** Cuando la NodeDB se llena, el firmware borra los nodos más viejos, pero a los favoritos no los toca. Tu portátil no desaparece de tu base después de unos días fuera.
4. **Los tienes a mano en la app.** Los favoritos salen arriba en la lista de nodos, y eso ayuda para los mensajes directos y los traceroutes.

### Qué marcar como favorito

| Márcalos | No los marques |
|---|---|
| Tus portátiles (Client o Client Mute) | Nodos al azar que ves en la lista |
| Tu nodo interior o de escritorio | Todos los nodos de la isla |
| El nodo del carro | Nodos de prueba que ya no usas |
| Los nodos de tu familia en la misma casa | Nodos móviles de desconocidos |
| Los ROUTER y ROUTER_LATE de la comunidad que tu techo escucha directo (zero-cost hop) | El CLIENT_BASE de un vecino, esperando un zero-cost hop (no aplica) |

Para un base personal, lo normal son de 2 a 8 favoritos. Si tienes más de 10, revisa si de verdad son tuyos o de tu grupo inmediato.

## 2. Qué es CLIENT_BASE

| | CLIENT | CLIENT_BASE | ROUTER |
|---|---|---|---|
| Retransmite el tráfico general | Sí, como cliente | Sí, como cliente | Sí, con prioridad |
| Retransmite el tráfico de y para sus favoritos | Como cualquier otro paquete | Con prioridad de router | Con prioridad |
| No cuenta el salto cuando recibe de un ROUTER o ROUTER_LATE favorito | No | Sí | Sí |
| Aparece en la lista de nodos | Sí | Sí | Sí |
| Riesgo de congestionar la malla | Bajo | Bajo | Alto si está mal ubicado |
| Uso típico | Nodo general | El techo o el ático de tu casa | La cima de una montaña o una torre alta, coordinado con la comunidad |

CLIENT_BASE es el rol que recomienda Meshtastic para un nodo de techo o ático que reparte los mensajes de tus nodos más débiles, interiores o mal ubicados. Es lo que se debe usar en vez de poner un ROUTER en el techo de tu casa.

## 3. Firmware

| | Versión |
|---|---|
| Recomendado (estable) | **2.7.26** (`v2.7.26.54e0d8d`) |
| Mínimo para Zero-Cost Hops | 2.7.11 |
| Mínimo por seguridad | 2.6.11 (CVE-2025-52464, llaves X25519 duplicadas) |

Lo que trae la 2.7.26 que importa en PR:

- Corrige la hora desde el GPS cada 30 minutos. Eso ayuda con los relojes atrasados o adelantados que se ven en la malla de PR (`malla.prmsh.com` y `meshview.prmsh.com`).
- Arreglos de hardware: el LED de RX de LoRa, más soporte para módulos RAK, configuraciones para el Station G3 y el pin estándar de GPS en el M3.

Actualiza todos tus nodos, base y portátiles, a la misma versión estable. Los Zero-Cost Hops solo necesitan 2.7.11 o más nuevo en el BASE y en los routers (los clientes no necesitan nada), pero mezclar versiones viejas puede dar problemas con los mensajes directos, porque los DMs legacy sin cifrado se eliminaron en la 2.7.15.

Para actualizar: desde la app (Android o iOS, en equipos compatibles) o con el instalador web oficial, `flasher.meshtastic.org`, escogiendo la versión estable.

## 4. Cuándo usar CLIENT_BASE en Puerto Rico

Úsalo cuando:

- Tienes un nodo fijo en el techo, el ático o un mástil de tu casa, con antena exterior.
- Tienes más de un nodo tuyo (portátil, nodo interior, carro).
- Tu nodo de techo tiene energía estable: solar con batería, o corriente con UPS.
- Vives en una zona residencial: Bayamón, Guaynabo, Carolina, Caguas, Ponce, Mayagüez, Arecibo, etc.

No lo uses cuando:

- Es un portátil. Para eso están Client y Client Mute (ver la guía de portátiles).
- Es un sitio de infraestructura de la comunidad (cima de montaña, torre alta, línea de vista a media isla). Eso le toca a ROUTER o ROUTER_LATE, coordinado con la comunidad.
- Tienes un solo nodo y no hay otros tuyos alrededor. Con CLIENT basta.

### Lo particular de Puerto Rico

La mayoría de los nodos de costa y de torre en PR están en CLIENT, y la isla no tiene backbone. Un CLIENT_BASE en cada techo es la forma correcta de que cada casa le dé salida a sus propios nodos sin poner ROUTERs mal ubicados. Si tu techo escucha un ROUTER o ROUTER_LATE de la comunidad, márcalo como favorito para que los mensajes que vienen de él lleguen a tu casa sin gastar un salto (ver la guía `meshtastic-pr-router-router-late.md`).

## 5. Ubicación y hardware

- **La altura vale más que la potencia.** Sube la antena antes de subir la potencia; además, 47 CFR §15.247 limita el EIRP en 902–928 MHz.
- Usa una antena exterior omnidireccional de buena calidad, con cable corto y de baja pérdida.
- La energía tiene que ser continua: solar con una batería que aguante varios días nublados, o corriente con UPS. En un huracán, el base tiene que seguir funcionando sin la red eléctrica.
- Usa una caja a prueba de intemperie (cerca de la costa, el salitre daña los equipos).
- Si lo quieres usar como gateway MQTT, necesitas un nodo con WiFi (ESP32) o Ethernet. Los nRF52 no tienen WiFi.

## 6. Configuración en la app

Conecta la app por Bluetooth al nodo BASE, no a tu portátil. Los nombres de los menús cambian un poco según la versión de la app.

### 6.1 Valores recomendados

Valores para nodos fijos, tomados de las recomendaciones de PRMSH (https://meshtastic.prmsh.com/settings/).

| Sección | Ajuste | Valor |
|---|---|---|
| Device | Role | `Client Base` |
| Device | Rebroadcast Mode | `All` (el de fábrica) |
| Device | Node Info Broadcast Interval | 6 horas |
| LoRa | Region | `US` |
| LoRa | Modem Preset | El de la comunidad |
| LoRa | Hop Limit / Number of Hops | `3` (`4` solo si un nodo de afuera, bien conectado, necesita el alcance extra) |
| LoRa | TX Power | `0` (el máximo permitido) |
| LoRa | OK to MQTT | Encendido |
| Position | Fixed Position | Encendido, con las coordenadas del techo |
| Position | Smart Position | Apagado |
| Position | Position Broadcast Interval | 12 horas |
| Position | GPS Update Interval | 6 horas |
| Position | Position Flags | Encendidos: Altitude, Altitude MSL, Geoidal Separation. Apagados: Speed, Heading, Sats in View |
| Position | Precisión en el canal público | Aproximada, no exacta |
| Telemetry | Device Metrics | 6 horas |
| Telemetry | Environment Metrics | 6 horas |
| Telemetry | Power Metrics | 1 hora (si tiene sensor de energía, por ejemplo en un equipo solar) |
| Neighbor Info | Enabled y Transmit Over LoRa | Encendidos, cada 11 horas |
| MQTT | Map Report Interval | 6 horas |
| Power | Power Saving | Apagado (el base tiene que estar siempre despierto) |

**Hop limit:** `3` por defecto, y nunca más de 5.

### 6.2 Android

1. Conecta el nodo base por Bluetooth.
2. Settings → Radio Configuration → Device → Role = Client Base y Node Info Broadcast = 6 horas → Save.
3. Settings → Radio Configuration → LoRa → Region `US`, el preset, Hop Limit 3, TX Power y OK to MQTT encendido → Save.
4. Settings → Radio Configuration → Position → activa Fixed Position y entra las coordenadas (o usa las del teléfono mientras estás en el techo), apaga Smart Position y ajusta los intervalos y los Position Flags según la tabla → Save.
5. Settings → Radio Configuration → Power → Power Saving apagado → Save.
6. Settings → Module Configuration → Telemetry → Device y Environment cada 6 horas, Power cada 1 hora → Save.
7. Settings → Module Configuration → Neighbor Info → Enabled y Transmit Over LoRa, cada 11 horas → Save.
8. Espera el reinicio y confirma el rol en Device.

### 6.3 iOS, iPadOS y macOS

1. Conecta el nodo base por Bluetooth. Si tienes varios nodos, escoge el base en Configure.
2. Settings → Radio Configuration → Device → Device Role = Client Base y Node Info Broadcast Interval = Six Hours → Save.
3. Settings → LoRa → Region `United States`, el preset, Number of Hops = 3, Transmit Power y OK to MQTT encendido → Save.
4. Settings → Position → Fixed Position encendido, Smart Position apagado, y los intervalos y Position Flags según la tabla → Save.
5. Settings → Power → Power Saving apagado → Save.
6. Settings → Module Configuration → Telemetry → Device y Environment cada 6 horas, Power cada 1 hora → Save.
7. Settings → Module Configuration → Neighbor Info → Enabled y Transmit Over LoRa, cada 11 horas → Save.
8. Confirma el rol después del reinicio.

## 7. Marcar favoritos, paso a paso

**Los favoritos se guardan en el nodo al que estás conectado.** Para que el BASE les dé prioridad a tus portátiles, tienes que estar conectado al BASE cuando los marques.

### 7.1 Android

1. Conecta la app al nodo BASE.
2. En la pestaña Nodes, busca tu portátil por short name o long name.
3. Tócalo y luego toca Add to favorites (la estrella).
4. Repite con cada nodo tuyo.

### 7.2 iOS

1. Conecta la app al nodo BASE.
2. En la pestaña Nodes, toca tu portátil.
3. Toca Favorite (la estrella).
4. Repite con cada nodo tuyo.

### 7.3 Routers de la comunidad como favoritos (Zero-Cost Hops)

1. En la lista de nodos del BASE, busca los ROUTER o ROUTER_LATE que tu techo escucha directo (0 hops y buen SNR).
2. Conectado a tu base, márcalos como favoritos.
3. Tu BASE tiene que tener firmware 2.7.11 o más nuevo (se recomienda 2.7.26).
4. Haz un traceroute antes y otro después para confirmar que se ahorra un salto.

Cómo funciona: cuando a tu BASE le llega un mensaje desde un ROUTER o ROUTER_LATE que tiene en favoritos, ese salto no se cuenta, salvo que sea el primer salto del mensaje. Entre dos CLIENT_BASE no funciona: marcar el base de un vecino como favorito no ahorra saltos. Los detalles están en `meshtastic-pr-router-router-late.md`.

## 8. Administrar el BASE a distancia desde tu portátil

En pocas palabras:

1. Copias la llave de tu portátil.
2. La pegas en el BASE.
3. Desde ese momento puedes cambiar la configuración del BASE usando tu portátil, sin subir al techo.

### 8.1 Para qué sirve

Tu BASE está en el techo. Normalmente, para cambiarle algo tienes que conectarte a él por Bluetooth, y eso quiere decir subir la escalera o estar muy cerca.

Con la administración remota, conectas el celular a tu portátil (el que cargas encima) y desde ahí le das instrucciones al BASE por radio. El BASE recibe la orden por la malla y la aplica.

Además, si tu BASE es un ESP32 y le activas el WiFi, se apaga el Bluetooth y ya no te puedes conectar directo. En ese caso, la administración remota es la forma más fácil de seguir haciéndole cambios.

### 8.2 Cómo funciona: la cerradura y las llaves

- **El BASE es como una casa con cerradura.** De fábrica, solo acepta cambios de alguien que esté "adentro", o sea, conectado directo por Bluetooth o por cable.
- **Cada portátil tiene su propia llave**, que se crea sola al instalar el firmware. Se llama Public Key.
- **Tú le dices al BASE qué llaves abren la puerta.** Las pegas en los campos Admin Key del BASE. Caben 3 llaves como máximo.
- Cuando un portátil le manda una orden, el BASE revisa la llave. Si está en la lista, la cumple; si no, la ignora. Nadie más puede cambiarle la configuración por radio.
- **Si borras y reinstalas el firmware de un portátil, su llave cambia.** La llave vieja deja de existir, y el BASE no reconoce la nueva hasta que la vuelvas a pegar. Por eso conviene tener más de una llave autorizada.

### 8.3 Palabras que vas a ver

| Palabra | Qué quiere decir |
|---|---|
| Public Key | La llave de cada nodo. Es un texto largo que puedes copiar y compartir sin peligro |
| Private Key | La otra mitad de la llave. No la compartas nunca; guárdala solo como respaldo |
| Admin Key | Los espacios del BASE donde pegas las Public Keys que pueden administrarlo |
| Favorito | Un nodo marcado con la estrella. En el BASE, sus mensajes pasan con prioridad |
| Hop (salto) | Cada vez que un mensaje pasa de un nodo a otro. 0 hops quiere decir que se hablan directo |

### 8.4 ¿Funciona si mi portátil está en Client Mute?

Sí. Client Mute solo quiere decir que tu portátil no repite los mensajes de otras personas. Las órdenes de administración las envía tu propio portátil, así que salen normal.

- Lo ideal es hacerlo desde la casa, con el portátil hablando directo con el BASE. Es más rápido.
- También funciona desde lejos, a través de la malla, pero tarda más.
- Marca los favoritos en las dos direcciones: tu portátil como favorito en el BASE, y el BASE como favorito en tu portátil. Así tus mensajes tienen prioridad y el BASE siempre sale arriba en tu lista.

### 8.5 Qué 3 llaves autorizar

| Llave | Nodo | Por qué |
|---|---|---|
| 1 | Tu portátil principal | Es el que siempre cargas |
| 2 | Tu nodo de la casa o del escritorio | Siempre está en casa y al alcance |
| 3 | Un segundo portátil o un nodo de pruebas | De respaldo: si pierdes o reinstalas el primero, no te quedas fuera |

Guarda una copia de cada llave en un lugar seguro: una captura de pantalla completa o tu gestor de contraseñas.

### 8.6 Paso A: copia la llave de cada portátil

**Android**

1. Conecta la app al portátil.
2. En Settings → Security, copia la Public Key completa.
3. Guárdala en tus notas seguras o en tu gestor de contraseñas. Repite con cada portátil que vaya a administrar el BASE.

**iOS, iPadOS y macOS**

1. Conecta la app al portátil.
2. En Settings → App Settings, activa Administration.
3. En Settings → Radio Configuration → Security, copia la Public Key.
4. Guárdala. Repite con cada portátil que vaya a administrar el BASE.

### 8.7 Paso B: autoriza las llaves en el BASE

Esto se hace una sola vez, conectado directo al BASE por Bluetooth o por cable USB. Si tu BASE es un ESP32, hazlo antes de activar el WiFi.

**Android**

1. Conecta la app al BASE.
2. En Settings → Security, toca Add en Admin Key y pega la Public Key del portátil 1.
3. Repite con el 2 y el 3.
4. Toca Save.

**iOS, iPadOS y macOS**

1. Conecta la app al BASE.
2. En Settings → App Settings, activa Administration.
3. En Settings → Radio Configuration → Security, pega la primera llave en Primary Admin Key y las otras en los campos siguientes.
4. Toca Save.

Deja Legacy Admin Channel apagado (ver 8.10).

### 8.8 Paso C: administra el BASE desde tu portátil

**Android**

1. Conecta la app a tu portátil (en Client o Client Mute).
2. En la pestaña Nodes, toca el BASE para abrir sus detalles.
3. Toca Remote Administration (el ícono de engranaje).
4. Tienes acceso a toda la configuración de Radio y de Module del BASE. Cambia lo que necesites y toca Save.

**iOS, iPadOS y macOS**

1. Conecta la app a tu portátil.
2. En Settings, en el selector Configure Node, escoge el BASE (sale como "Remote: <nombre>").
3. Cambia la configuración de Radio o de Module y toca Save.

### 8.9 Antes de cambiar algo a distancia

- **Prueba primero con algo que no afecte nada**, como el intervalo de telemetría. Si el cambio se aplica, todo funciona.
- **No cambies a distancia la Region, el Modem Preset ni la clave (PSK) del canal primario.** Si algo sale mal, el BASE deja de hablar con tus portátiles y vas a tener que subir al techo a arreglarlo.
- **Haz los cambios desde la casa** siempre que puedas. Es más rápido y más seguro.

### 8.10 Avanzado (opcional)

Nada de esto hace falta para que la administración remota funcione.

- **Legacy Admin Channel:** es un método viejo para nodos con firmware anterior a 2.5. Los nodos con 2.5 o más nuevo no se pueden administrar así. Déjalo apagado.
- **Managed Mode:** bloquea los cambios por Bluetooth o cable y solo deja cambiar la configuración a distancia. En un BASE personal, déjalo apagado. Si algún día lo activas, confirma antes que la administración remota te funciona con tus 3 llaves; si no, te quedas fuera.
- **PIN del Bluetooth:** en el BASE, usa Pairing Mode = Fixed PIN con un PIN distinto al de fábrica. Así nadie se conecta a tu techo desde la calle.
- **Respaldo de las llaves del BASE:** guarda también su Public Key y su Private Key. Si reinstalas el firmware del BASE, puedes restaurarlas para que conserve su identidad, sus mensajes directos y su lista de favoritos.

## 9. Los portátiles que trabajan con tu BASE

| Nodo | Rol | Favorito en el BASE | Admin Key en el BASE |
|---|---|---|---|
| Portátil principal, en casa | Client Mute | Sí | Sí, la 1 |
| Nodo interior o de escritorio | Client Mute | Sí | Sí, la 2 |
| Segundo portátil o banco de pruebas | Client Mute | Sí | Sí, la 3 (respaldo) |
| Nodo del carro, en la marquesina | Client Mute | Sí | Opcional |
| Portátil fuera de casa, en zona remota | Client | Sí (sigue siendo tuyo) | La misma 1 |

En la guía `meshtastic-pr-cliente-vs-mute.md` está cuándo cambiar los portátiles entre Client y Client Mute.

## 10. MQTT en el BASE (y salir en la web)

El base es el mejor sitio para un gateway MQTT: está siempre encendido y no depende del celular. Si tiene WiFi, además sube los paquetes de los portátiles que escucha (los que tienen OK to MQTT encendido), y así ellos también salen en `malla.prmsh.com` y `meshview.prmsh.com`.

| Ajuste | Valor |
|---|---|
| OK to MQTT (en LoRa) | Encendido |
| Conexión | El WiFi o el Ethernet del nodo (Proxy to Client apagado) |
| Server Address y credenciales | Las que indique el operador de PRMSH, o el broker público `mqtt.meshtastic.org` |
| Root Topic | `msh/US/PR` |
| Encryption Enabled | Encendido |
| JSON Enabled | Apagado |
| Map Reporting | Encendido, cada 6 horas |
| Canal primario (LongFast) | Uplink encendido, Downlink apagado |
| Canal privado (con PSK propio) | Uplink según el grupo; Downlink apagado, salvo que lo coordines con el operador |

Uplink encendido y Downlink apagado es la configuración segura que recomienda PRMSH para un puente. Un Downlink sin zero-hop puede inundar la malla.

En los nodos ESP32, al encender el WiFi se apaga el Bluetooth. Configura todo por Bluetooth primero, incluidas las Admin Keys, y deja el WiFi para el final.

Los pasos en la app (Android e iOS) son los de la sección 7 de la guía de portátiles, pero con Proxy to Client apagado. Para comprobarlo, busca tu BASE por short name o ID en `malla.prmsh.com` o `meshview.prmsh.com`.

## 11. Verificación

1. Desde tu portátil, haz un traceroute a un nodo lejano. Tu BASE debe salir como el primer salto.
2. En el BASE, revisa que tus portátiles estén arriba en la lista (como favoritos).
3. Si marcaste un ROUTER o ROUTER_LATE de la comunidad como favorito, el traceroute desde ese router hasta tu BASE debe usar un salto menos que antes.
4. Busca tu BASE en `malla.prmsh.com` o `meshview.prmsh.com`. Debe salir con su posición, sus vecinos y la hora correcta (2.7.26 con GPS, o NTP por WiFi).

## 12. Errores comunes

- **CLIENT_BASE sin favoritos.** Es un CLIENT con otro nombre.
- **Marcar los favoritos desde el portátil** en vez de desde el BASE. La prioridad la aplica el BASE, no el portátil.
- **Marcar a todo el mundo como favorito.** Se convierte en un ROUTER y congestiona.
- **Poner un ROUTER en el techo de la casa.** Usa CLIENT_BASE.
- **Esperar zero-cost hops entre dos CLIENT_BASE.** Solo pasa cuando el nodo anterior es un ROUTER o ROUTER_LATE favorito.
- **Mezclar firmware** (el base en 2.7.26 y los portátiles en 2.5.x). Actualiza todo.
- **Dejar Power Saving encendido en el base.** Se duerme y deja de retransmitir.
- **Compartir la posición exacta del techo en el canal público con uplink a MQTT.** Tu dirección queda en internet.
- **Subir el hop limit a más de 5 "porque es infraestructura".** Usa 3, o 4 solo si hace falta.
- **Dejar OK to MQTT apagado.** Ni tu BASE ni otros gateways suben tus paquetes, y no sales en la web.
- **Encender Downlink en el gateway** sin coordinarlo con el operador.
- **Autorizar una sola Admin Key.** Si ese portátil se pierde o se reinstala, pierdes la administración remota.
- **Activar Managed Mode sin haber probado la administración remota.** Te quedas fuera del BASE.
- **Cambiar la Region, el preset o la PSK del canal primario a distancia** sin un plan B. El BASE queda incomunicado.
- **Usar el Legacy Admin Channel** con nodos 2.5 o más nuevos. No funciona y es menos seguro.
- **Encender el WiFi del BASE (ESP32) antes de configurar las Admin Keys.** Se apaga el Bluetooth y ya no puedes autorizar las llaves de cerca.

## 13. Checklist

- [ ] Firmware 2.7.26 en el base y en todos tus nodos
- [ ] Role = Client Base
- [ ] Region `US`, el preset de la comunidad, Hop Limit 3 y OK to MQTT encendido
- [ ] Intervalos de PRMSH para nodos fijos: Node Info 6 h, posición 12 h, telemetría 6 h, Neighbor Info 11 h, Map Report 6 h
- [ ] Posición fija, Smart Position apagado e intervalo largo
- [ ] Power Saving apagado y energía con respaldo (solar o UPS)
- [ ] Antena exterior, cable corto y caja sellada
- [ ] Favoritos marcados desde el BASE: todos tus portátiles y nodos interiores
- [ ] Los ROUTER y ROUTER_LATE cercanos que escuchas directo, marcados como favoritos (opcional, pero recomendado)
- [ ] Los portátiles en Client Mute cuando están en casa
- [ ] Las Public Keys de 3 portátiles respaldadas
- [ ] Admin Keys 1, 2 y 3 guardadas en el BASE (antes de encender el WiFi)
- [ ] Legacy Admin Channel apagado y Managed Mode apagado
- [ ] El Bluetooth del BASE con un Fixed PIN propio
- [ ] Administración remota probada desde un portátil en Client Mute
- [ ] Respaldo de las llaves del BASE
- [ ] MQTT por WiFi o Ethernet si el base es gateway; Uplink encendido y Downlink apagado; root topic `msh/US/PR`
- [ ] El BASE sale en `malla.prmsh.com` o `meshview.prmsh.com`
- [ ] Un traceroute desde un portátil muestra el BASE como primer salto

## Referencias

- PRMSH, valores recomendados: https://meshtastic.prmsh.com/settings/
- Mapas web de la comunidad: `malla.prmsh.com` y `meshview.prmsh.com`
- Meshtastic, consejos de configuración (roles): https://meshtastic.org/docs/configuration/tips/
- Blog de Meshtastic, cómo escoger el rol: https://meshtastic.org/blog/choosing-the-right-device-role/
- Meshtastic, configuración del dispositivo: https://meshtastic.org/docs/configuration/radio/device/
- Meshtastic, configuración de posición: https://meshtastic.org/docs/configuration/radio/position/
- Meshtastic, integraciones MQTT: https://meshtastic.org/docs/software/integrations/mqtt/
- Blog de Meshtastic, Zero-Cost Hops con routers favoritos: https://meshtastic.org/blog/zero-cost-hops-favorite-routers/
- Meshtastic, administración remota de nodos: https://meshtastic.org/docs/configuration/remote-admin/
- Meshtastic, configuración de seguridad: https://meshtastic.org/docs/configuration/radio/security/
- Firmware 2.7.26 de Meshtastic: https://github.com/meshtastic/firmware/releases/tag/v2.7.26.54e0d8d
- Firmware de Meshtastic, discusión #9541 (CLIENT_BASE frente a ROUTER_LATE): https://github.com/meshtastic/firmware/discussions/9541

*73 de WP4TZV*
