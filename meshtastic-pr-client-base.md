# Meshtastic Puerto Rico — Configuración de Nodo CLIENT_BASE

**Guía para nodos base personales (techo, ático, torre casera)**
Autor: WP4TZV · Malla: Puerto Rico (región US 902–928 MHz) · Firmware estable: **2.7.26** · Última revisión: noviembre 2026

---

## 1. Primero: ¿por qué marcar nodos como Favoritos?

En **CLIENT_BASE**, los favoritos **no son un adorno de la app: son lo que define el rol.**

Un nodo CLIENT_BASE trata los paquetes **desde o hacia sus nodos favoritos como si fuera un ROUTER**, y **todos los demás paquetes como un CLIENT normal**.

Eso significa:

| Si en el BASE… | Resultado |
|---|---|
| **No hay favoritos** | El nodo se comporta igual que un CLIENT. Pusiste CLIENT_BASE para nada. |
| **Están tus nodos personales** (handheld, nodo interior, carro) | Tu base retransmite con prioridad todo lo que entra y sale de ellos. Tus nodos débiles "salen" a la malla usando la antena del techo. |
| **Marcas a todo el mundo** como favorito | Conviertes tu base en un ROUTER de facto → más colisiones y congestión. **No lo hagas.** |

### Las 4 razones para usar favoritos

1. **Prioridad de retransmisión para tus nodos.** Tu handheld en Client Mute dentro de la casa, o tu nodo interior detrás de concreto, no llega lejos. El BASE en el techo recoge sus paquetes y los empuja a la malla con prioridad de router. Lo mismo pasa al revés: los mensajes dirigidos a tus nodos tienen prioridad al entrar.
2. **Zero-Cost Hops (firmware 2.7.11+).** Si tu BASE recibe un mensaje que viene de un **ROUTER o ROUTER_LATE que está en sus favoritos**, ese salto **no se gasta** (siempre que no sea el primer salto del mensaje). Marca como favoritos los routers de la comunidad que tu techo escucha directo, y los mensajes que bajan de la malla llegan a tu casa sin perder un salto. **Ojo:** entre dos CLIENT_BASE **no aplica**; el nodo anterior tiene que ser ROUTER o ROUTER_LATE.
3. **Tus nodos permanecen en la base de datos.** Cuando la NodeDB se llena, el firmware descarta nodos viejos; los favoritos se protegen de esa limpieza. Tu handheld no "desaparece" de tu base después de unos días fuera.
4. **Acceso rápido en la app.** Los favoritos aparecen arriba en la lista de nodos, útil para mensajes directos y traceroutes.

### ¿Qué marcar como favorito?

| Marca como favorito | No marques |
|---|---|
| ✅ Tus handhelds (Client / Client Mute) | ❌ Nodos al azar que ves en la lista |
| ✅ Tu nodo interior / escritorio | ❌ Todos los nodos de la isla |
| ✅ Nodo del carro | ❌ Nodos de prueba que ya no usas |
| ✅ Nodos de tu familia en la misma casa | ❌ Nodos móviles de desconocidos |
| ✅ Los **ROUTER / ROUTER_LATE** de la comunidad que tu techo escucha directo (zero-cost hop) | ❌ CLIENT_BASE de vecinos esperando zero-cost hop (no aplica) |

**Regla:** de 2 a 8 favoritos es lo normal para un base personal. Si tienes más de ~10, pregúntate si realmente son *tuyos* o de tu grupo inmediato.

---

## 2. Qué es CLIENT_BASE

| | CLIENT | **CLIENT_BASE** | ROUTER |
|---|---|---|---|
| Retransmite tráfico general | Sí, con lógica de cliente | Sí, con lógica de cliente | Sí, con prioridad |
| Retransmite tráfico de/para favoritos | Como cualquier paquete | **Con prioridad de router** | Con prioridad |
| Ahorra el salto al recibir de un ROUTER / ROUTER_LATE favorito | ❌ | ✅ | ✅ |
| Aparece en la lista de nodos | ✅ | ✅ | ✅ |
| Riesgo de congestionar la malla | Bajo | Bajo | Alto si está mal ubicado |
| Uso típico | Nodo general | **Techo / ático de tu casa** | Cima de montaña / torre alta coordinada |

CLIENT_BASE es el rol que Meshtastic recomienda para un nodo de techo o ático más fuerte que distribuye los mensajes de tus nodos más débiles, interiores o mal ubicados. Es el sustituto correcto de poner ROUTER en el techo de tu casa.

---

## 3. Firmware

| | Versión |
|---|---|
| **Recomendada (estable)** | **2.7.26** (`v2.7.26.54e0d8d`) |
| Mínima para Zero-Cost Hops | 2.7.11 |
| Mínima por seguridad | 2.6.11 (CVE-2025-52464, llaves X25519 duplicadas) |

Notas de la 2.7.26 relevantes para PR:
- **Refresca la hora desde GPS cada 30 minutos.** Ayuda con los relojes desfasados que se ven en la malla de PR (`malla.prmsh.com` / `meshview.prmsh.com`).
- Correcciones de hardware: LED de RX de LoRa, más soporte para módulos RAK, configs para Station G3, pin estándar de GPS en M3.

> Actualiza **todos** tus nodos (base y portátiles) a la misma versión estable. Los Zero-Cost Hops solo necesitan 2.7.11+ en el BASE y los routers (los clientes no necesitan cambios), pero mezclar versiones viejas puede causar problemas con los DMs (los DMs legacy no privados se eliminaron en la 2.7.15).

Actualizar: desde la app (Android/iOS, en dispositivos compatibles) o con el flasher web oficial `flasher.meshtastic.org` seleccionando la versión estable.

---

## 4. Cuándo usar CLIENT_BASE en Puerto Rico

### ✅ Úsalo cuando
- Tienes un nodo **fijo en el techo, ático o mástil** de tu casa, con antena exterior.
- Tienes **más de un nodo propio** (handheld, nodo interior, carro).
- Tu nodo de techo tiene **energía estable** (solar + batería o AC + UPS).
- Estás en zona residencial: Bayamón, Guaynabo, Carolina, Caguas, Ponce, Mayagüez, Arecibo, etc.

### ❌ No lo uses cuando
- Es un **portátil** → Client o Client Mute (ver guía de portátiles).
- Es un sitio de **infraestructura comunitaria** (cima de montaña, torre alta, línea de vista a media isla) → eso es terreno de ROUTER / ROUTER_LATE, **coordinado con la comunidad**.
- Solo tienes **un nodo** y no hay otros tuyos alrededor → CLIENT es suficiente.

### Contexto PR
La mayoría de los nodos costeros y de torre en PR están en CLIENT y la isla no tiene backbone. CLIENT_BASE en los techos es la forma correcta de que cada casa le dé salida a sus propios nodos sin poner ROUTERs mal ubicados. Y si tu techo escucha un ROUTER o ROUTER_LATE de la comunidad, márcalo como favorito para que los mensajes que vienen de él lleguen a tu casa sin gastar un salto (ver la guía `meshtastic-pr-router-router-late.md`).

---

## 5. Ubicación y hardware

- **Altura > potencia.** Sube la antena antes de subir la potencia (47 CFR §15.247 limita el EIRP en 902–928 MHz).
- Antena exterior omnidireccional de buena calidad, cable corto y de baja pérdida.
- Energía continua: solar con batería dimensionada para varios días nublados, o AC con UPS. Para huracanes, el base debe sobrevivir sin la red eléctrica.
- Caja a prueba de intemperie (salitre en zonas costeras).
- Si quieres usarlo como **gateway MQTT**, necesitas un nodo con WiFi (ESP32) o Ethernet. Los nRF52 no tienen WiFi.

---

## 6. Configuración en la app

> Conecta la app **al nodo BASE** por Bluetooth (no a tu portátil). Los nombres de menú pueden variar un poco según la versión de la app.

### 6.1 Valores recomendados

Valores para nodos **fijos**, tomados de las recomendaciones de PRMSH (https://meshtastic.prmsh.com/settings/).

| Sección | Ajuste | Valor |
|---|---|---|
| Device | **Role** | `Client Base` |
| Device | **Rebroadcast Mode** | `All` (por defecto) |
| Device | **Node Info Broadcast Interval** | 6 horas |
| LoRa | **Region** | `US` |
| LoRa | **Modem Preset** | El de la comunidad |
| LoRa | **Hop Limit / Number of Hops** | `3` (`4` solo si un nodo exterior bien conectado necesita el alcance extra) |
| LoRa | **TX Power** | `0` (máximo permitido) |
| LoRa | **OK to MQTT** | Encendido |
| Position | **Fixed Position** | Encendido (con las coordenadas del techo) |
| Position | **Smart Position** | Apagado |
| Position | **Position Broadcast Interval** | 12 horas |
| Position | **GPS Update Interval** | 6 horas |
| Position | **Position Flags** | Altitude ✅ · Altitude MSL ✅ · Speed ❌ · Heading ❌ · Sats in View ❌ · Geoidal Separation ✅ |
| Position | **Precisión en canal público** | Aproximada (no precisa) |
| Telemetry | **Device Metrics** | 6 horas |
| Telemetry | **Environment Metrics** | 6 horas |
| Telemetry | **Power Metrics** | 1 hora (si tiene sensor de energía, p. ej. solar) |
| Neighbor Info | **Enabled** + **Transmit Over LoRa** | Encendido · 11 horas |
| MQTT | **Map Report Interval** | 6 horas |
| Power | **Power Saving** | Apagado (el base debe estar siempre despierto) |

> **Hop limit:** `3` por defecto. **Nunca más de 5.**

### 6.2 Android

1. Conecta el nodo base por Bluetooth.
2. **Settings → Radio Configuration → Device** → **Role = Client Base**, **Node Info Broadcast = 3 horas** → **Save**.
3. **Settings → Radio Configuration → LoRa** → Region `US`, preset, **Hop Limit 3**, TX Power, **OK to MQTT** encendido → **Save**.
4. **Settings → Radio Configuration → Position** → activa **Fixed Position** y entra las coordenadas (o usa la del teléfono estando en el techo), apaga **Smart Position**, ajusta intervalos y **Position Flags** según la tabla → **Save**.
5. **Settings → Radio Configuration → Power** → **Power Saving** apagado → **Save**.
6. **Settings → Module Configuration → Telemetry** → Device y Environment 6 horas, Power 1 hora → **Save**.
7. **Settings → Module Configuration → Neighbor Info** → **Enabled** y **Transmit Over LoRa**, 11 horas → **Save**.
8. Espera el reinicio y verifica el rol en **Device**.

### 6.3 iOS / iPadOS / macOS

1. Conecta el nodo base por Bluetooth. Si tienes varios nodos, selecciona el base en **Configure**.
2. **Settings → Radio Configuration → Device** → **Device Role = Client Base**, **Node Info Broadcast Interval = Three Hours** → **Save**.
3. **Settings → LoRa** → Region `United States`, preset, **Number of Hops = 3**, Transmit Power, **OK to MQTT** encendido → **Save**.
4. **Settings → Position** → **Fixed Position** encendido, **Smart Position** apagado, intervalos y **Position Flags** según la tabla → **Save**.
5. **Settings → Power** → power saving apagado → **Save**.
6. **Settings → Module Configuration → Telemetry** → Device y Environment 6 horas, Power 1 hora → **Save**.
7. **Settings → Module Configuration → Neighbor Info** → **Enabled** y **Transmit Over LoRa**, 11 horas → **Save**.
8. Verifica el rol después del reinicio.

---

## 7. Marcar favoritos (paso a paso)

> ⚠️ Los favoritos se guardan **en el nodo al que estás conectado**. Para que el BASE dé prioridad a tus portátiles, tienes que estar **conectado al BASE** cuando los marques.

### 7.1 Android
1. Conecta la app al **nodo BASE**.
2. Pestaña **Nodes** → busca tu portátil (por short name o long name).
3. Toca el nodo → **Add to favorites** (estrella).
4. Repite para cada nodo tuyo.

### 7.2 iOS
1. Conecta la app al **nodo BASE**.
2. Pestaña **Nodes** → toca tu portátil.
3. Toca **Favorite** (estrella).
4. Repite para cada nodo tuyo.

### 7.3 Routers de la comunidad como favoritos (Zero-Cost Hops)
1. En la lista de nodos del BASE, busca los **ROUTER o ROUTER_LATE** que tu techo escucha **directo** (0 hops, buen SNR).
2. Conectado a **tu** base → márcalos como favoritos.
3. Tu BASE debe tener firmware **≥ 2.7.11** (recomendado 2.7.26).
4. Haz un **traceroute** antes y después para confirmar que se ahorra un salto.

Cómo funciona: cuando un mensaje llega a tu BASE desde un ROUTER o ROUTER_LATE que está en tus favoritos, ese salto no se gasta (excepto si es el primer salto del mensaje). **Entre dos CLIENT_BASE no aplica:** marcar el base de un vecino como favorito no ahorra saltos. Detalles en `meshtastic-pr-router-router-late.md`.

---

## 8. Administración remota del BASE desde Client / Client Mute

> **En resumen:**
> 1. Copias la llave de tu portátil.
> 2. La pegas en el BASE.
> 3. Desde ese momento puedes cambiar la configuración del BASE usando tu portátil, sin subir al techo.

### 8.1 ¿Para qué sirve?

Tu BASE está en el techo. Normalmente, para cambiarle algo tienes que conectarte a él por Bluetooth, y eso significa subir la escalera o estar muy cerca.

Con la **administración remota**, conectas el celular a tu **portátil** (el que cargas encima) y desde ahí le das instrucciones al BASE **por radio**. El BASE recibe la orden por la malla y la aplica.

Además, si tu BASE es un ESP32 y le activas el WiFi, **el Bluetooth se apaga** y ya no te puedes conectar directo. En ese caso, la administración remota es la manera más fácil de seguir cambiándole cosas.

### 8.2 Cómo funciona: la cerradura y las llaves

Piénsalo así:

- 🏠 **El BASE es una casa con cerradura.** Por defecto, solo acepta cambios de alguien que esté "adentro", o sea, conectado directo por Bluetooth o cable.
- 🔑 **Cada portátil tiene su propia llave**, que se crea sola cuando se instala el firmware. Se llama **Public Key**.
- 📋 **Tú le dices al BASE qué llaves abren la puerta.** Las pegas en los campos **Admin Key** del BASE. Caben **máximo 3 llaves**.
- 🚪 Cuando un portátil le manda una orden, el BASE revisa la llave. Si está en la lista, obedece. Si no, la ignora. Nadie más puede cambiarle la configuración por radio.
- ⚠️ **Si borras y reinstalas el firmware de un portátil, su llave cambia.** La llave vieja ya no existe y el BASE no reconoce la nueva hasta que la vuelvas a pegar. Por eso conviene tener **más de una llave autorizada**.

### 8.3 Palabras que vas a ver

| Palabra | Qué significa |
|---|---|
| **Public Key** | La "llave" de cada nodo. Es un texto largo que puedes copiar y compartir sin peligro. |
| **Private Key** | La otra mitad de la llave. **Nunca la compartas.** Solo guárdala como respaldo. |
| **Admin Key** | Los espacios en el BASE donde pegas las Public Keys que tienen permiso de administrarlo. |
| **Favorito** | Nodo marcado con estrella. En el BASE, sus mensajes pasan con prioridad. |
| **Hop (salto)** | Cada vez que un mensaje pasa de un nodo a otro. 0 hops = se hablan directo. |

### 8.4 ¿Funciona si mi portátil está en Client Mute?

**Sí.** Client Mute solo significa que tu portátil no repite mensajes *de otras personas*. Las órdenes de administración las **manda tu propio portátil**, así que salen normal.

- Lo ideal es hacerlo **desde la casa**, con el portátil hablando directo con el BASE. Es más rápido.
- También funciona **desde lejos** a través de la malla, pero es más lento.
- Marca **favoritos en las dos direcciones**: tu portátil como favorito en el BASE, y el BASE como favorito en tu portátil. Así tus mensajes tienen prioridad y el BASE siempre aparece arriba en tu lista.

### 8.5 ¿Cuáles 3 llaves autorizo?

| Llave | Nodo | Por qué |
|---|---|---|
| **#1** | Tu handheld principal | El que siempre cargas |
| **#2** | Tu nodo de la casa / escritorio | Siempre está en casa y en rango |
| **#3** | Un segundo handheld o nodo de pruebas | Respaldo: si pierdes o reinstalas el #1, no te quedas fuera |

**Guarda una copia de cada llave** en un lugar seguro, como una captura de pantalla completa o tu gestor de contraseñas.

### 8.6 Paso A — Copiar la llave de cada portátil

**Android**
1. Conecta la app al **portátil**.
2. **Settings → Security** → copia la **Public Key** completa.
3. Guárdala (notas seguras / gestor de contraseñas). Repite con cada portátil administrador.

**iOS / iPadOS / macOS**
1. Conecta la app al **portátil**.
2. **Settings → App Settings** → activa **Administration**.
3. **Settings → Radio Configuration → Security** → copia la **Public Key**.
4. Guárdala. Repite con cada portátil administrador.

### 8.7 Paso B — Autorizar las llaves en el BASE

Esto se hace **una sola vez, conectado directo al BASE** por Bluetooth o cable USB. Si tu BASE es ESP32, hazlo **antes de activar el WiFi**.

**Android**
1. Conecta la app al **BASE**.
2. **Settings → Security** → **Add** en **Admin Key** → pega la Public Key del portátil #1.
3. Repite para #2 y #3.
4. **Save**.

**iOS / iPadOS / macOS**
1. Conecta la app al **BASE**.
2. **Settings → App Settings** → activa **Administration**.
3. **Settings → Radio Configuration → Security** → pega la llave en **Primary Admin Key**, y las otras en los campos siguientes.
4. **Save**.

Deja **Legacy Admin Channel** apagado (ver 8.10).

### 8.8 Paso C — Administrar el BASE desde tu portátil

**Android**
1. Conecta la app a tu **portátil** (Client o Client Mute).
2. Pestaña **Nodes** → toca el **BASE** → pantalla de detalles.
3. Toca **Remote Administration** (ícono de engranaje).
4. Tienes acceso a toda la configuración de **Radio** y **Module** del BASE. Cambia lo necesario → **Save**.

**iOS / iPadOS / macOS**
1. Conecta la app a tu **portátil**.
2. **Settings** → en el selector **Configure Node**, escoge el BASE (aparece como **"Remote: <nombre>"**).
3. Cambia la configuración de Radio / Module → **Save**.

### 8.9 Consejos importantes

- ✅ **Haz una prueba primero** con algo que no afecte nada, como el intervalo de telemetría. Si el cambio se aplica, todo está funcionando.
- ⚠️ **No cambies a distancia la Region, el Modem Preset ni la clave (PSK) del canal principal.** Si algo sale mal, el BASE deja de "hablar" con tus portátiles y vas a tener que subir al techo para arreglarlo.
- 📍 **Haz los cambios desde la casa** siempre que puedas. Es más rápido y seguro.

### 8.10 Avanzado (opcional)

No necesitas nada de esto para que la administración remota funcione.

- **Legacy Admin Channel:** es un método viejo para nodos con firmware anterior a 2.5. Los nodos 2.5 o más nuevos no se pueden administrar así. **Déjalo apagado.**
- **Managed Mode:** bloquea los cambios por Bluetooth o cable, y solo deja cambiar la configuración a distancia. Para un BASE personal, **déjalo apagado**. Si algún día lo activas, primero confirma que la administración remota te funciona desde tus 3 llaves. Si no, te quedas fuera.
- **PIN del Bluetooth:** en el BASE, usa **Pairing Mode = Fixed PIN** con un PIN que no sea el de fábrica. Así nadie desde la calle se conecta a tu techo.
- **Respaldo de las llaves del BASE:** guarda también su Public Key y Private Key. Si reinstalas el firmware del BASE, puedes restaurarlas para que conserve su identidad, sus mensajes directos y su lista de favoritos.

---

## 9. Portátiles que trabajan con tu BASE

| Nodo | Rol | Favorito en el BASE | Admin Key en el BASE |
|---|---|---|---|
| Handheld principal en casa | **Client Mute** | ✅ | ✅ #1 |
| Nodo interior / escritorio | **Client Mute** | ✅ | ✅ #2 |
| Segundo handheld / banco de pruebas | **Client Mute** | ✅ | ✅ #3 (respaldo) |
| Nodo del carro (en la marquesina) | **Client Mute** | ✅ | Opcional |
| Handheld fuera de casa, zona remota | **Client** | ✅ (sigue siendo tuyo) | (el mismo #1) |

Ver la guía `meshtastic-pr-cliente-vs-mute.md` para cuándo cambiar los portátiles entre Client y Client Mute.

---

## 10. MQTT en el BASE (y aparecer en la web)

El base es el mejor lugar para un gateway MQTT: está siempre encendido y no depende del celular. Si tiene WiFi, además **sube los paquetes de los portátiles que escucha** (los que tienen **OK to MQTT** encendido), y así ellos también aparecen en **`malla.prmsh.com`** y **`meshview.prmsh.com`**.

| Ajuste | Valor |
|---|---|
| **OK to MQTT** (LoRa) | Encendido |
| Conexión | **WiFi o Ethernet del nodo** (Proxy to Client apagado) |
| Server Address / credenciales | Las que indique el operador de PRMSH, o el broker público `mqtt.meshtastic.org` |
| Root Topic | `msh/US/PR` |
| Encryption Enabled | Encendido |
| JSON Enabled | Apagado |
| Map Reporting | Encendido · 6 horas |
| Canal primario (LongFast) | Uplink ✅ · Downlink ❌ |
| Canal privado (PSK propio) | Uplink según el grupo · Downlink ❌ (salvo que lo coordines con el operador) |

> **Uplink sí, Downlink no:** es el valor seguro que recomienda PRMSH para un puente. Downlink sin zero-hop puede inundar la malla.

> En nodos ESP32, al activar **WiFi** el **Bluetooth se desactiva**. Configura todo por Bluetooth primero (incluyendo las Admin Keys), y deja WiFi para el final.

Los pasos en la app (Android/iOS) son los de la sección 7 de la guía de portátiles, con **Proxy to Client apagado**. Para verificar, busca tu BASE por short name o ID en `malla.prmsh.com` o `meshview.prmsh.com`.

---

## 11. Verificación

1. Desde tu **portátil**, haz un **traceroute** a un nodo lejano. Tu BASE debe aparecer como primer salto.
2. En el BASE, revisa que tus portátiles estén en la parte de arriba de la lista (favoritos).
3. Con un ROUTER / ROUTER_LATE de la comunidad como favorito: el traceroute desde ese router hacia tu BASE debe consumir un salto menos que antes.
4. Busca tu BASE en `malla.prmsh.com` o `meshview.prmsh.com`: debe aparecer con su posición y vecinos, y con la hora sincronizada (2.7.26 + GPS o NTP vía WiFi).

---

## 12. Errores comunes

- ❌ **CLIENT_BASE sin favoritos.** Es un CLIENT con otro nombre.
- ❌ **Marcar favoritos desde el portátil** en vez de desde el BASE. La prioridad la aplica el BASE, no el portátil.
- ❌ **Marcar a todos como favorito.** Se convierte en ROUTER y congestiona.
- ❌ **ROUTER en el techo de la casa.** Usa CLIENT_BASE.
- ❌ **Esperar zero-cost hops entre dos CLIENT_BASE.** Solo aplica cuando el nodo anterior es un ROUTER o ROUTER_LATE favorito.
- ❌ **Firmware mezclado** (base en 2.7.26, portátiles en 2.5.x). Actualiza todo.
- ❌ **Power saving encendido** en el base. Se duerme y deja de retransmitir.
- ❌ **Posición precisa del techo en el canal público con MQTT uplink.** Tu dirección queda en internet.
- ❌ **Hop limit de más de 5** "porque es infraestructura". Usa 3 (4 solo si hace falta).
- ❌ **OK to MQTT apagado.** Ni tu BASE ni otros gateways te suben, y no apareces en la web.
- ❌ **Downlink encendido** en el gateway sin coordinarlo con el operador.
- ❌ **Una sola Admin Key.** Si ese portátil se pierde o se reflashea, pierdes el remote admin.
- ❌ **Activar Managed Mode sin probar el remote admin.** Te quedas fuera del BASE.
- ❌ **Cambiar Region / preset / PSK del primario por remote admin** sin plan B. El BASE queda incomunicado.
- ❌ **Usar el Legacy Admin Channel** con nodos 2.5+. No funciona y es menos seguro.
- ❌ **Activar WiFi en el BASE (ESP32) antes de configurar las Admin Keys.** El Bluetooth se apaga y no puedes autorizar las llaves localmente.

---

## 13. Checklist

- [ ] Firmware **2.7.26** en el base y en todos tus nodos
- [ ] Role = **Client Base**
- [ ] Region `US`, preset de la comunidad, Hop Limit 3, **OK to MQTT** encendido
- [ ] Intervalos fijos de PRMSH: Node Info 6 h · Position 12 h · Telemetry 6 h · Neighbor Info 11 h · Map Report 6 h
- [ ] Posición fija, smart position apagado, intervalo largo
- [ ] Power saving apagado, energía con respaldo (solar/UPS)
- [ ] Antena exterior, cable corto, caja sellada
- [ ] **Favoritos marcados desde el BASE**: todos tus portátiles y nodos interiores
- [ ] ROUTER / ROUTER_LATE locales que escuchas directo marcados como favoritos (opcional, recomendado)
- [ ] Portátiles en casa en **Client Mute**
- [ ] Public Keys de 3 portátiles respaldadas
- [ ] **Admin Keys #1, #2 y #3** guardadas en el BASE (antes de activar WiFi)
- [ ] Legacy Admin Channel apagado · Managed Mode apagado
- [ ] Bluetooth del BASE con **Fixed PIN** propio
- [ ] Prueba de **Remote Administration** desde un portátil en Client Mute
- [ ] Respaldo de las llaves del BASE
- [ ] MQTT por WiFi/Ethernet si el base es gateway; Uplink ✅ / Downlink ❌; root `msh/US/PR`
- [ ] El BASE aparece en `malla.prmsh.com` / `meshview.prmsh.com`
- [ ] Traceroute desde un portátil confirma el BASE como primer salto

---

## Referencias

- PRMSH — Recommended Settings: https://meshtastic.prmsh.com/settings/
- Mapas web de la comunidad: `malla.prmsh.com` · `meshview.prmsh.com`
- Meshtastic — Configuration Tips (Roles): https://meshtastic.org/docs/configuration/tips/
- Meshtastic Blog — Choosing the Right Device Role: https://meshtastic.org/blog/choosing-the-right-device-role/
- Meshtastic — Device Config: https://meshtastic.org/docs/configuration/radio/device/
- Meshtastic — Position Config: https://meshtastic.org/docs/configuration/radio/position/
- Meshtastic — MQTT Integrations: https://meshtastic.org/docs/software/integrations/mqtt/
- Meshtastic Blog — Zero-Cost Hops for Favorite Routers: https://meshtastic.org/blog/zero-cost-hops-favorite-routers/
- Meshtastic — Remote Node Administration: https://meshtastic.org/docs/configuration/remote-admin/
- Meshtastic — Security Config: https://meshtastic.org/docs/configuration/radio/security/
- Meshtastic Firmware 2.7.26 release: https://github.com/meshtastic/firmware/releases/tag/v2.7.26.54e0d8d
- Meshtastic Firmware discussion #9541 (CLIENT_BASE vs ROUTER_LATE): https://github.com/meshtastic/firmware/discussions/9541

*73 de WP4TZV*
