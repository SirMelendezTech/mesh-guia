# Meshtastic Puerto Rico — Configuración de Nodos CLIENT / CLIENT_MUTE

**Guía para nodos portátiles (handhelds, mochila, vehículo)**
Autor: WP4TZV · Malla: Puerto Rico (región US 902–928 MHz) · Firmware estable: **2.7.26** · Última revisión: noviembre 2026

---

## 1. Resumen rápido

| Pregunta | Respuesta corta |
|---|---|
| ¿Estoy cerca de un nodo mío más fuerte (techo, ático)? | **CLIENT_MUTE** |
| ¿Ando en grupo con varios nodos juntos? | **Uno en CLIENT**, el resto en **CLIENT_MUTE** |
| ¿Estoy en el área metro (San Juan, Bayamón, Carolina, Guaynabo) con buena cobertura? | **CLIENT_MUTE** |
| ¿Estoy en el campo, montaña o costa con pocos nodos alrededor? | **CLIENT** |
| ¿Hay apagón / huracán / infraestructura caída? | **CLIENT** (cada nodo cuenta) |
| ¿Nodo portátil en ROUTER o REPEATER? | **Nunca.** |

> Regla de oro: **si tu nodo no es el único puente entre otros nodos y la malla, no necesita retransmitir.** MUTE ahorra airtime y batería; CLIENT ayuda a cubrir huecos.

---

## 2. Qué hace cada rol

| | **CLIENT** | **CLIENT_MUTE** |
|---|---|---|
| Envía tus mensajes | ✅ | ✅ |
| Recibe mensajes | ✅ | ✅ |
| Retransmite paquetes de otros | ✅ (con lógica de prioridad por SNR) | ❌ Nunca |
| Aparece en la lista de nodos | ✅ | ✅ |
| Consumo de batería | Normal | Más bajo |
| Impacto en congestión | Suma airtime | Mínimo |
| Rol por defecto | ✅ | — |

Puntos importantes:

- Un nodo en **CLIENT_MUTE sigue siendo alcanzable**. Otros nodos (CLIENT, CLIENT_BASE, ROUTER) sí retransmiten *sus* paquetes. Lo único que deja de hacer es retransmitir los paquetes *de otros*.
- **CLIENT** no es "router lite": la firmware ya le da menos prioridad de retransmisión a nodos que escuchan con buena señal, así que en zonas densas un CLIENT generalmente no causa problemas graves — pero MUTE sigue siendo más limpio cuando hay varios nodos juntos.
- **CLIENT_BASE** es para tu nodo fijo de techo/ático: prioriza retransmitir hacia y desde tus nodos favoritos. Marca tus portátiles como *favoritos* en tu CLIENT_BASE y ponlos en MUTE cuando estés en casa.

---

## 3. Contexto de la malla en Puerto Rico

- **Región:** `US` (902–928 MHz). Respeta los límites de EIRP de 47 CFR §15.247 — más altura gana más que más potencia.
- **Preset:** usa el mismo modem preset que la comunidad local (por defecto `LONG_FAST`). Un preset distinto = no te escuchas con nadie. Confirma con el grupo antes de cambiarlo.
- **Topología:** PR no tiene un backbone real todavía; muchos nodos de torre/costa están en CLIENT. Eso significa que los portátiles en zonas rurales a veces **sí son el único eslabón** — ahí CLIENT tiene sentido.
- **Terreno:** la Cordillera Central, El Yunque y los valles del interior crean sombras de RF. Un portátil en la cima de una loma puede ser el puente entre alguien en el valle y la malla.
- **MQTT:** el tráfico de PR sube a MQTT con el root topic `msh/US/PR`. Para que tu nodo aparezca en los mapas web de la comunidad, configura MQTT como dice la sección 7.
- **Mapas web de la comunidad:** `malla.prmsh.com` y `meshview.prmsh.com`. Ahí ves nodos, vecinos, señal y uso del canal.
- **Valores recomendados de PRMSH:** https://meshtastic.prmsh.com/settings/ — esta guía usa esos valores.

---

## 4. Escenarios para nodos portátiles

### 4.1 En casa / oficina, cerca de tu nodo de techo → **CLIENT_MUTE**
Tu nodo de techo (CLIENT_BASE o CLIENT) ya cubre el área. Que el handheld también retransmita solo duplica paquetes y gasta batería.

### 4.2 Área metro densa (San Juan, Bayamón, Carolina, Caguas) → **CLIENT_MUTE**
Hay suficientes nodos fijos. Un portátil a nivel de calle retransmitiendo añade colisiones sin mejorar cobertura.

### 4.3 Grupo, caravana o evento (corrida, bicicleteada, triatlón, actividad de radioaficionados) → **1 CLIENT + resto MUTE**
- Escoge el nodo mejor posicionado (antena más alta, en el carro de apoyo, en la mochila del que va en la loma) como **CLIENT**.
- Todos los demás en **CLIENT_MUTE**.
- Diez nodos en CLIENT a 5 metros uno del otro = tormenta de retransmisiones.

### 4.4 Excursión / campo / montaña / costa remota → **CLIENT**
Ejemplos: Toro Negro, Cerro Punta, El Yunque, Bosque Seco de Guánica, Cabo Rojo, Vieques/Culebra.
Pocos nodos alrededor → cada retransmisión puede ser la que conecta a tu grupo con la malla.

### 4.5 Vehículo en movimiento → **depende de la zona**
- Autopista en área metro (PR-22, PR-52 cerca de SJ, PR-18): **CLIENT_MUTE**.
- Carreteras rurales del interior (PR-10, PR-143 Ruta Panorámica): **CLIENT** puede ayudar, pero ten en cuenta que un nodo en movimiento rápido es un relevo poco predecible.

### 4.6 Emergencia, huracán o apagón general → **CLIENT**
Cuando caen los nodos fijos por falta de energía, los portátiles se convierten en la malla. Cambia a CLIENT, baja la frecuencia de posición/telemetría para alargar batería y coordina en el canal acordado.

### 4.7 Varios nodos tuyos en la misma mochila / escritorio → **solo uno en CLIENT**
Ej.: T-Echo + T-Deck + nodo de pruebas. Uno en CLIENT (o CLIENT_BASE si es fijo), el resto en MUTE.

---

## 5. Diagrama de decisión

```
¿Es un nodo portátil?
 └─ Sí
     ├─ ¿Hay un nodo mío más fuerte cerca (casa/carro)?  → CLIENT_MUTE
     ├─ ¿Hay otros nodos del grupo a pocos metros?
     │     ├─ Soy el mejor posicionado                     → CLIENT
     │     └─ No                                          → CLIENT_MUTE
     ├─ ¿Estoy en zona densa (metro)?                      → CLIENT_MUTE
     ├─ ¿Zona remota / pocos nodos / emergencia?           → CLIENT
     └─ ¿Duda?                                             → CLIENT (default), revisa la lista
                                                              de vecinos y SNR; si ves muchos
                                                              nodos directos (0 hops) → MUTE
```

Indicador práctico: en la app, si ves **más de 5–6 nodos a 0 hops** con buen SNR, tu portátil no está aportando cobertura — ponlo en MUTE.

---

## 6. Configuración en la app (Android e iOS)

> Requisito: el nodo debe estar **conectado por Bluetooth** a la app. Los nombres de menú pueden variar un poco según la versión de la app; las secciones (Device, LoRa, Position) son las mismas en ambas plataformas.

### 6.1 Valores de los dos perfiles

Valores para nodos **móviles**, tomados de las recomendaciones de PRMSH (https://meshtastic.prmsh.com/settings/).

| Sección | Ajuste (como aparece en la app) | Perfil A — **Client** | Perfil B — **Client Mute** |
|---|---|---|---|
| Device | **Role** | `Client` | `Client Mute` |
| Device | **Node Info Broadcast Interval** | 3 horas | 3 horas |
| LoRa | **Region** | `US` | `US` |
| LoRa | **Modem Preset** | El de la comunidad | El de la comunidad |
| LoRa | **Number of Hops / Hop Limit** | `3` | `3` (hasta `5` solo si estás en el borde de la malla) |
| LoRa | **TX Power** | `0` (máximo permitido) | `0` (máximo permitido) |
| LoRa | **OK to MQTT** | Encendido | Encendido |
| Position | **Smart Position / Smart Broadcast** | Encendido | Encendido |
| Position | **Smart Broadcast Minimum Distance** | 100 m | 100 m |
| Position | **Smart Broadcast Minimum Interval** | 60 s | 60 s |
| Position | **Position Broadcast Interval** | 1 hora | 1 hora |
| Position | **GPS Update Interval** | 5 min | 5 min |
| Position | **Fixed Position** | Apagado | Apagado |
| Position | **Position Flags** | Altitude ✅ · Altitude MSL ✅ · Speed ✅ · Heading ✅ · Sats in View ✅ · Geoidal Separation ❌ | Igual |
| Telemetry | **Device Metrics** | 1 hora | 1 hora |
| Telemetry | **Environment Metrics** | 1 hora | 1 hora |
| Neighbor Info | **Enabled** + **Transmit Over LoRa** | Encendido · 4 horas | Encendido · 4 horas |
| MQTT | **Map Report Interval** | 1 hora | 1 hora |

> **Hop limit:** `3` por defecto. Solo en el borde de la malla puedes subir hasta `5`. **Nunca más de 5.**

Firmware recomendada: **2.7.26 estable** (`v2.7.26.54e0d8d`). Mínimo absoluto 2.6.11 (corrige CVE-2025-52464, llaves X25519 duplicadas). Se puede actualizar desde la misma app en dispositivos compatibles o con `flasher.meshtastic.org`.

### 6.2 Android

1. Abre la app **Meshtastic** y conecta tu nodo (pestaña de conexión → selecciona el radio por Bluetooth).
2. Ve a **Settings** (ícono de engranaje).
3. En **Radio Configuration**:
   - **Device** → **Role** → `Client` o `Client Mute`.
     **Node Info Broadcast** → 3 horas (10800 s). Toca **Save**.
   - **LoRa** → verifica **Region = US**, **Modem Preset**, **Hop Limit = 3**, **TX Power**, **OK to MQTT**. Toca **Save**.
   - **Position** → activa **Smart Position**, ajusta **Minimum Distance**, **Minimum Interval**, **Broadcast Interval**, **GPS Update Interval** y **Position Flags** según la tabla. Deja **Fixed Position** apagado. Toca **Save**.
4. En **Module Configuration**:
   - **Telemetry** → Device y Environment cada 1 hora → **Save**.
   - **Neighbor Info** → **Enabled** y **Transmit Over LoRa** encendidos, intervalo 4 horas → **Save**.
   - **MQTT** → ver sección 7.
5. El nodo reinicia después de guardar. Espera a que reconecte y confirma el rol en **Settings → Radio Configuration → Device**.

### 6.3 iOS / iPadOS / macOS

1. Abre la app **Meshtastic** y conecta tu nodo en la pestaña **Bluetooth / Connect**.
2. Ve a la pestaña **Settings**.
3. En **Radio Configuration** (en versiones anteriores aparece como **Device Configuration**):
   - **Device** → **Device Role** → `Client` o `Client Mute`.
     **Node Info Broadcast Interval** → *Three Hours*. Toca **Save**.
   - **LoRa** → **Region = United States**, **Modem Preset**, **Number of Hops = 3**, **Transmit Power**, **OK to MQTT**. Toca **Save**.
   - **Position** → activa **Smart Position**, ajusta **Minimum Distance**, **Minimum Interval**, **Broadcast Interval**, **GPS Update Interval** y **Position Flags** según la tabla. **Fixed Position** apagado. Toca **Save**.
4. En **Module Configuration**:
   - **Telemetry** → Device y Environment cada 1 hora → **Save**.
   - **Neighbor Info** → **Enabled** y **Transmit Over LoRa** encendidos, intervalo 4 horas → **Save**.
   - **MQTT** → ver sección 7.
5. Si tienes más de un nodo, primero selecciona el correcto en la sección **Configure** antes de cambiar nada.
6. Después de reiniciar, verifica el rol en **Settings → Device**.

### 6.4 Cambio rápido de rol en el campo

Solo cambia **un ajuste**; el resto del perfil se queda igual:

- **Android:** Settings → Radio Configuration → **Device** → **Role** → Save
- **iOS:** Settings → Radio Configuration → **Device** → **Device Role** → Save

Saliendo de casa a zona remota → `Client`. Regresando a casa / zona metro → `Client Mute`.

### 6.5 Favoritos en tu nodo base (CLIENT_BASE)

Si tienes un nodo de techo en **Client Base**, conéctate a ese nodo y marca tus portátiles como favoritos:

- **Android:** pestaña **Nodes** → toca el nodo portátil → **Add to favorites** (estrella).
- **iOS:** pestaña **Nodes** → toca el nodo portátil → **Favorite** (estrella).

Así el base les da prioridad de retransmisión cuando estás en casa con el portátil en MUTE.

---

## 7. MQTT y los mapas web de PRMSH

Los mapas web de la comunidad, **`malla.prmsh.com`** y **`meshview.prmsh.com`**, muestran los nodos cuyos paquetes llegan a MQTT con el root topic `msh/US/PR`. Si tu nodo no llega a MQTT, no aparece.

### 7.1 Dos formas de aparecer en la web

| Forma | Qué haces | Cuándo sirve |
|---|---|---|
| **A. Otro gateway te sube** | Enciende **OK to MQTT** (en LoRa). Cualquier gateway que te escuche (por ejemplo, un CLIENT_BASE con WiFi) sube tus paquetes. | Siempre. Es lo **mínimo para todos**. Sin esto, nadie te sube aunque te escuche. |
| **B. Tu propio nodo sube** | Activa el módulo **MQTT** con **Proxy to Client** (usa el internet del celular). | Cuando ningún gateway te escucha, o para enviar **Map Reports** (tu punto en el mapa con tu información). |

> El **Map Report** solo lo envía tu propio nodo, así que necesita la forma B (módulo MQTT encendido).

### 7.2 Valores recomendados de PRMSH

| Ajuste | Valor |
|---|---|
| **OK to MQTT** (LoRa) | **Encendido** |
| **Uplink** (por canal) | **Encendido** |
| **Downlink** (por canal) | **Apagado** (lo seguro para un puente) |
| **Root Topic** | `msh/US/PR` |
| **Map Report Interval** | 1 hora (móvil) |

Fuente: https://meshtastic.prmsh.com/settings/

### 7.3 Valores del módulo MQTT (forma B)

| Ajuste en la app | Valor |
|---|---|
| **Enabled** | Encendido |
| **Server Address** | El broker que indique el operador de PRMSH, o el público `mqtt.meshtastic.org` |
| **Username / Password** | Los del operador de PRMSH, o en el público `meshdev` / `large4cats` |
| **Encryption Enabled** | Encendido |
| **JSON Enabled** | Apagado |
| **TLS Enabled** | Encendido (broker público) / según el broker de PRMSH |
| **Root Topic** | `msh/US/PR` |
| **Proxy to Client** | Encendido |
| **Map Reporting** | Encendido · cada 1 hora |

> Las credenciales de un broker privado son del operador. **No las publiques ni las compartas** en chats o repositorios.

### 7.4 Uplink / Downlink por canal

| Canal | Uplink | Downlink | Precisión de posición |
|---|---|---|---|
| Primario (LongFast) | ✅ | ❌ | Aproximada (no precisa) |
| Privado del grupo (PSK propio) | Según acuerde el grupo | ❌ (salvo que lo coordines con el operador) | La que acuerde el grupo |

> ⚠️ **¿Por qué Downlink apagado?** Downlink baja mensajes de internet a la radio. Si un broker no aplica la política **zero-hop**, esos mensajes se repiten por toda la malla con los saltos completos y la congestionan. Uplink solo sube; no afecta la malla.

### 7.5 Android

1. Conecta el nodo por Bluetooth.
2. **Settings → Radio Configuration → LoRa** → **OK to MQTT** encendido → **Save**.
3. **Settings → Module Configuration → MQTT**:
   - Activa **MQTT Enabled**.
   - Llena **Address**, **Username**, **Password** y **Root Topic = msh/US/PR**.
   - **Encryption Enabled** encendido, **JSON** apagado, **TLS** según la tabla.
   - Activa **Proxy to Client**.
   - Activa **Map Reporting**, intervalo 1 hora.
   - Toca **Save**.
4. **Settings → Channels** → toca el canal primario → **Uplink Enabled** encendido, **Downlink Enabled** apagado → **Save**.
5. Verifica: en la pantalla de MQTT aparece el estado del proxy en el teléfono (activo/inactivo). Ahí mismo lo puedes apagar sin tocar la configuración del radio.

### 7.6 iOS / iPadOS / macOS

1. Conecta el nodo por Bluetooth.
2. **Settings → LoRa** → **OK to MQTT** encendido → **Save**.
3. **Settings → Module Configuration → MQTT**:
   - Activa **Enabled**.
   - Llena **Address**, **Username**, **Password** y **Root Topic = msh/US/PR**.
   - **Encryption Enabled** encendido, **JSON** apagado, **TLS** según la tabla.
   - Activa **Proxy to Client**.
   - Activa **Map Reporting**, intervalo 1 hora.
   - Toca **Save**.
4. **Settings → Channels** → selecciona el canal primario → **Uplink Enabled** encendido, **Downlink Enabled** apagado → **Save**.
5. Verifica el estado: debe decir **Uplink Only**.

### 7.7 ¿Qué uso según dónde estoy?

| Situación | OK to MQTT | Módulo MQTT + Proxy |
|---|---|---|
| En casa, tu CLIENT_BASE es gateway | ✅ | Opcional (solo para Map Report) |
| Zona metro con gateways cerca | ✅ | Opcional |
| Campo / montaña sin gateways cerca | ✅ | ✅ si tienes señal celular y quieres aparecer en el mapa |
| Vieques, Culebra o fuera de PR, sin malla alrededor | ✅ | ✅ |

**Proxy to Client** gasta data y batería del celular, y la app tiene que estar abierta o en segundo plano con el radio conectado. Si un gateway fijo ya te escucha, puedes apagarlo.

### 7.8 Verifica que apareces en la web

1. Abre **`malla.prmsh.com`** o **`meshview.prmsh.com`**.
2. Busca tu nodo por **short name**, **long name** o **ID** (`!xxxxxxxx`).
3. Puede tardar hasta el próximo Node Info o Map Report (hasta 1 hora con los valores de esta guía).
4. Si no apareces, revisa en este orden:
   - **OK to MQTT** encendido.
   - **Root Topic** exactamente `msh/US/PR`.
   - **Uplink** encendido en el canal primario.
   - **Proxy to Client** activo en la app (si usas la forma B).
   - Que algún gateway te escuche (si usas solo la forma A).

---

## 8. Errores comunes

- ❌ **Portátil en ROUTER / REPEATER / ROUTER_LATE.** Esos roles son para nodos fijos, elevados y con energía permanente. En un handheld causan colisiones y rutas que desaparecen cuando te mueves. (REPEATER además está deprecado desde firmware 2.7.11.)
- ❌ **Hop limit en más de 5** "para llegar más lejos". Multiplica el tráfico en toda la isla. Usa 3; solo en el borde de la malla, hasta 5.
- ❌ **Todos los nodos del grupo en CLIENT** en una actividad.
- ❌ **Posición cada 30 s sin smart broadcast.** Gasta airtime y batería.
- ❌ **Dejar MUTE puesto al salir al campo.** Antes de salir de excursión, cámbialo a CLIENT.
- ❌ **Preset distinto al de la comunidad.** Quedas aislado sin darte cuenta.
- ❌ **Downlink encendido** sin coordinarlo con el operador. Sin zero-hop, inunda la malla.
- ❌ **OK to MQTT apagado** y luego preguntar por qué no apareces en malla.prmsh.com / meshview.prmsh.com.
- ❌ **Posición precisa en el canal público con uplink.** Tu ubicación exacta termina en internet.

---

## 9. Checklist antes de salir

- [ ] Firmware **2.7.26** estable
- [ ] Región `US`, preset igual al de la comunidad
- [ ] Rol correcto según el escenario (sección 4)
- [ ] Hop limit = 3 (máximo 5 en el borde de la malla)
- [ ] Smart position: 100 m / 60 s · Position 1 h · Telemetry 1 h · Neighbor Info 4 h
- [ ] Canales: primario público + canal privado del grupo (si aplica)
- [ ] Batería cargada / power bank
- [ ] Antena bien conectada (nunca transmitir sin antena)
- [ ] **OK to MQTT** encendido; Uplink ✅ / Downlink ❌; root `msh/US/PR`
- [ ] Proxy to Client si no hay gateway cerca y quieres aparecer en el mapa
- [ ] Al regresar a casa: volver a **CLIENT_MUTE**

---

## Referencias

- PRMSH — Recommended Settings: https://meshtastic.prmsh.com/settings/
- Mapas web de la comunidad: `malla.prmsh.com` · `meshview.prmsh.com`
- Meshtastic — Configuration Tips (Roles): https://meshtastic.org/docs/configuration/tips/
- Meshtastic Blog — Choosing the Right Device Role: https://meshtastic.org/blog/choosing-the-right-device-role/
- Meshtastic — Position Config: https://meshtastic.org/docs/configuration/radio/position/
- Meshtastic Android — Radio & User Settings: https://meshtastic.org/docs/software/android/user/settings-radio-user/
- Meshtastic Apple — Settings: https://meshtastic.org/docs/software/apple/user/settings/
- Meshtastic — MQTT Module Config: https://meshtastic.org/docs/configuration/module/mqtt/
- Meshtastic — MQTT Integrations (public server, zero-hop): https://meshtastic.org/docs/software/integrations/mqtt/
- Meshtastic Android — MQTT: https://meshtastic.org/docs/software/android/user/mqtt/
- Meshtastic Apple — MQTT: https://meshtastic.org/docs/software/apple/user/mqtt/

*73 de WP4TZV*
