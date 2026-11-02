# MeshCore Puerto Rico — Configuración de Nodos Companion

**Guía para nodos portátiles (handhelds, mochila, vehículo)**
Autor: WP4TZV · Malla: Puerto Rico (región US 902–928 MHz) · Firmware estable: **v1.18.0** · Última revisión: noviembre 2026

---

## 1. Resumen rápido

| Parámetro | Valor PR | Notas |
|---|---|---|
| Preset en la app | **USA/Canada (Recommended)** | PR está en la banda ISM 902–928 MHz de EE.UU. |
| Frecuencia | **910.525 MHz** | |
| Bandwidth | **62.5 kHz** | Preset "narrow" adoptado a finales de 2025 |
| Spreading Factor | **7** | |
| Coding Rate | **5** (4/5) | |
| Path hash size | **2 bytes** | App → Settings → Experimental → Default Path Hash Size |
| TX power | Máximo que soporte el radio (típico 22 dBm en SX1262) | Ver §6 para baterías |
| Firmware | **Companion** (BLE, USB o WiFi según el caso) | Nunca Repeater en un portable |

> Si la comunidad MeshCore de PR publica un preset regional propio, ese sustituye esta tabla. Mientras tanto, todos (companions **y** repeaters) deben estar en el preset USA/Canada para que la isla sea una sola malla.

---

## 2. Por qué estos valores

- **910.525 / 62.5 kHz / SF7 / CR5** es el preset recomendado USA/Canada. Muchas regiones migraron de SF11/250 kHz a este perfil "narrow" porque mejora la entrega de mensajes: menos airtime por paquete = menos colisiones.
- **SF7 parece "corto"**, pero en MeshCore el alcance lo dan los **repeaters fijos en altura**, no el companion. Con 62.5 kHz de BW se recupera parte de la sensibilidad que se pierde al bajar el SF.
- **Path hash de 2 bytes:** con 1 byte solo hay 256 IDs posibles; dos repeaters chocan con frecuencia y las trazas/rutas se vuelven ambiguas. 2 bytes = 65,536 IDs y hasta 32 saltos en flood. Repeaters en firmware ≥ 1.14 reenvían cualquier tamaño; los más viejos descartan paquetes de 2–3 bytes, así que conviene que los repeaters de la isla estén actualizados.
- **Coding Rate:** LoRa manda el CR en el header explícito, así que un CR distinto no rompe la comunicación, pero mantén CR5 para consistencia (algunas redes, como Florida, usan CR8 en repeaters).

### Contexto PR
- Topografía: la **Cordillera Central** y **El Yunque** parten la isla en sombras de RF. Un companion en el valle depende de que haya un repeater con línea de vista.
- Zonas urbanas de concreto ("RF bunkers"): dentro de casa el companion casi no sale. Ventana, balcón o antena externa hacen una diferencia enorme.
- Viniendo de Meshtastic: un **Companion ≈ CLIENT_MUTE**. No retransmite nada. Toda la retransmisión la hacen Repeaters (y Room Servers).

---

## 3. Variantes de firmware Companion

El firmware Companion se flashea en una de tres variantes de transporte hacia el cliente:

| Variante | Cliente | Usar cuando | Evitar cuando |
|---|---|---|---|
| **BLE** | App iOS/Android | Uso diario a pie, en el carro, hiking. El caso por defecto para portables | Necesitas logging continuo en una PC |
| **USB (serial)** | Web app (app.meshcore.nz), `meshcore-cli`, `meshcore.js` | Carro con laptop/tablet, estación de mesa, scripts, debugging, nodo pegado a una Pi | Vas caminando |
| **WiFi (TCP :5000)** | App en la misma LAN, `meshcore-cli`, integraciones | Nodo fijo en casa/oficina accesible desde varios dispositivos; base de operaciones en emergencia con un router local | Portables con batería (WiFi del ESP32 consume mucho) |

**Hardware:**
- **nRF52840** (RAK4631, T1000-E, T-Echo, Wio Tracker L1): mejor opción para portables BLE — consumo muy bajo.
- **ESP32-S3** (Heltec V3/V4, XIAO S3 + Wio-SX1262): sirve, pero gasta más batería. Ideal para la variante WiFi o USB.

---

## 4. Configuración paso a paso (app)

1. **Flashear** con <https://flasher.meshcore.io/> → dispositivo → **Companion** (BLE/USB/WiFi) → 915 MHz. En el primer flasheo usa *Erase*.
2. **Conectar** desde la app (BLE) o la web app (USB/WiFi).
3. **Nombre del nodo:** algo identificable, ej. `WP4TZV-T1000` o `SirPedro📟`. El nombre viaja en los adverts.
4. **Radio:** Settings → Radio → preset **USA/Canada (Recommended)**. Confirma: 910.525 / 62.5 / SF7 / CR5.
5. **Path hash:** Settings → Experimental Settings → **Default Path Hash Size = 2 Bytes** → cerrar y reabrir la app.
6. **TX power:** máximo del radio salvo que la batería sea crítica (§6).
7. **Ubicación:**
   - Portable con GPS: compártela solo si quieres aparecer en mapas; puedes dejarla apagada y compartir manual.
   - Sin GPS: deja lat/lon en blanco en portables (una posición fija en un portable es engañosa).
8. **Contactos:** activa auto-agregar repeaters; para usuarios, decide si auto-agregar o manual (en zonas con mucha actividad, manual evita llenar la lista).
9. **Canales:** `Public` viene por defecto. Canales regionales tipo hashtag (ej. `#puertorico`, `#test`) — usa los que la comunidad local haya acordado.
10. **Advert inicial:** envía un **Flood Advert** una vez para que la red te conozca. Después, usa Zero-hop (§5).

---

## 5. Adverts en movimiento

| Tipo | Alcance | Cuándo |
|---|---|---|
| **Zero-hop advert** | Solo nodos que te oyen directo | Llegaste a un sitio nuevo y quieres que los repeaters cercanos te vean |
| **Flood advert** | Toda la malla vía repeaters | Primera vez en la red, o cambiaste de región (ej. de San Juan a Mayagüez) y necesitas que te encuentren |

Regla: **no** envíes flood adverts repetidos mientras manejas. Cada flood ocupa airtime en todos los repeaters de la isla.

---

## 6. Cuándo usar cada modo en nodos portables

### 6.1 Escenarios

| Escenario | Firmware | Modo de red | Notas |
|---|---|---|---|
| **Día a día en área metro** (San Juan, Bayamón, Carolina) | Companion **BLE** | Malla pública (preset USA/Canada) | Hay repeaters; tú solo envías/recibes |
| **En el carro** | Companion **BLE** o **USB** | Malla pública | Antena externa en el techo (magnética 915 MHz) mejora muchísimo. USB si llevas laptop/tablet con web app |
| **Hiking con repeaters a la vista** (Yunque, Toro Negro con cobertura) | Companion **BLE** | Malla pública | nRF52 preferido. Zero-hop advert al llegar a un mirador |
| **Hiking / campamento sin cobertura de repeaters** (cuevas, cañones, Mona, cayos) | Companion **BLE** | **Off-grid (client repeat)** | Solo dentro del grupo; ver §6.2 |
| **Emergencia / huracán con infraestructura caída** | Companion **BLE** en los portables; **WiFi** o **USB** en la base | Pública si los repeaters (solares) siguen vivos; **Off-grid** si no | Coordinen antes qué frecuencia off-grid usarán |
| **Evento / carrera / triatlón (staff)** | Companion **BLE** | Pública si hay repeater en el área; si no, off-grid o un repeater temporal en trípode | Un repeater temporal es mejor que muchos clients repitiendo |
| **Estación en casa / oficina** | Companion **WiFi** o **USB** | Malla pública | Si quieres aportar cobertura, flashea un **Repeater** aparte en el techo |
| **Gateway / observador MQTT** | — | — | Eso es un Repeater con bridge MQTT u observer, no un Companion |

### 6.2 Off-grid (client repeat)

Desde las versiones de 2026 existe el modo **Off-grid / client repeat**, configurado como un tipo de *Region* con su propia configuración de radio.

- **Qué hace:** el companion **sí** retransmite paquetes, como un repeater pequeño. Útil para un grupo sin infraestructura (SAR, hiking remoto, emergencia).
- **Restricción clave:** solo permite **frecuencias reservadas para off-grid**, distintas a la malla pública. Así no se contaminan las rutas de la red pública si alguien se olvida el modo puesto.
- **Cómo:** App → Manage Regions → New → tipo **Off-grid** → escoger frecuencia reservada → *Set as Home*. Para volver: seleccionar el perfil de red público (`MeshCore.915`) / región comodín `*`.
- **Todos los del grupo** deben estar en la misma región off-grid (misma frecuencia).

**Usar off-grid cuando:**
- No hay repeaters alcanzables y el grupo necesita relevo entre sí.
- El grupo está disperso en terreno quebrado (líneas de cuadrillas, cañones, búsqueda y rescate).

**No usar off-grid cuando:**
- Hay un repeater público al alcance — usa la malla pública.
- Vas a regresar a zona urbana: **sal del modo off-grid antes**.
- Es para "tener más alcance" en el día a día. Para eso se instala un repeater fijo.

### 6.3 Regla de oro para portables

> **Un portable nunca se flashea como Repeater.** Un repeater que se mueve crea rutas que dejan de existir y degrada la malla para todos. Si quieres aportar cobertura, instala un repeater fijo, en altura y con energía estable.

---

## 7. Energía en portables

| Situación | Recomendación |
|---|---|
| Uso normal | TX power máximo, GPS solo si lo necesitas |
| Batería larga (campamento, emergencia) | Apaga GPS (en ESP32 es el mayor consumo extra), reduce brillo/pantalla, usa nRF52 |
| ESP32 con batería | Evita la variante WiFi; prefiere BLE |
| Carro | Alimenta por USB del vehículo; antena externa |

---

## 8. Checklist antes de salir

- [ ] Firmware Companion actualizado (y repeaters de la zona en ≥ 1.14 si usas hash de 2 bytes)
- [ ] Preset USA/Canada: 910.525 / 62.5 / SF7 / CR5
- [ ] Path hash = 2 bytes
- [ ] Antena conectada **antes** de encender (transmitir sin antena puede dañar el SX1262)
- [ ] Nombre del nodo y canales configurados
- [ ] Batería cargada; GPS según necesidad
- [ ] Si la actividad es remota: región off-grid creada y acordada con el grupo
- [ ] Al regresar: volver a la red pública

---

## 9. Fuentes

- [MeshCore — repositorio oficial](https://github.com/meshcore-dev/MeshCore)
- [MeshCore FAQ — cambio a preset narrow (commit)](https://google.18789066745.workers.dev/meshcore-dev/MeshCore/commit/86225cd24acd83ac84c03491a2a0db733280ca7a)
- [Spokane Mesh — migración a 910.525 / SF7 / BW62.5 / CR5](https://groups.google.com/g/spokanemeshnet/c/9861SZsRXNs)
- [Blog MeshCore — Off-grid (client repeat) Mode, feb 2026](https://blog.meshcore.io/2026/02/13/off-grid-client-repeat-mode)
- [Blog MeshCore — Path hash multibyte y loop detection, mar 2026](https://blog.meshcore.io/2026/03/06/path-diagnostics-improvements)
- [MeshCore CLI — `path.hash.mode` (PR #1968)](https://github.com/meshcore-dev/MeshCore/pull/1968/files)
- [Florida Mesh — Node Configuration](https://areyoumeshingwith.us/docs/meshcore/configuration/)
- [MeshCore Western Australia — migración a 2 bytes](https://meshcorewestaus.pages.dev/)
