# MeshCore Puerto Rico — Configuración de Repeater / Room Server

**Guía para infraestructura fija (techos, torres, montañas, solar) — configuración desde la app Android / iOS**
Autor: WP4TZV · Malla: Puerto Rico (región US 902–928 MHz) · Firmware estable: **v1.18.0** · Última revisión: noviembre 2026

---

## 1. Resumen rápido

| Pregunta | Respuesta corta |
|---|---|
| ¿Quiero extender cobertura de la malla? | **Repeater** |
| ¿Un grupo necesita mensajes que queden guardados (club, CERT, evento, huracán)? | **Room Server** |
| ¿Puedo hacer un solo equipo Repeater + Room Server? | Se puede, pero **no se recomienda**. Usa dos equipos |
| ¿El nodo se va a mover (mochila, carro)? | **Companion**, nunca Repeater |
| ¿Ya hay un repeater fuerte en el mismo techo o cerro? | No pongas otro ahí; busca otro punto alto |
| ¿Dónde lo administro? | App MeshCore → **Contacts → repeater → Remote Management** |

> Regla de oro: **altura y energía estable valen más que potencia.** Un repeater en un cerro con línea de vista sirve más que diez en techos de urbanización.

---

## 2. Qué hace cada rol

| | **Repeater** | **Room Server** | **Companion** |
|---|---|---|---|
| Retransmite paquetes de otros | ✅ | ❌ (por defecto) | ❌ |
| Guarda mensajes para quien se conecte luego | ❌ | ✅ | ❌ |
| Se administra remoto desde la app | ✅ | ✅ | — |
| Lleva teléfono conectado | ❌ | ❌ | ✅ |
| Ubicación típica | Fija, en altura | Fija, con buena cobertura | Contigo |

Puntos importantes:

- Un **Room Server** funciona como un buzón/BBS: cuando un usuario hace login, recibe los mensajes que no ha visto (hasta 32 a la vez).
- Un Room Server **puede** activar "Repeat", pero la documentación oficial no lo recomienda: no tiene todas las funciones de administración del firmware Repeater. Mejor dos equipos separados.

---

## 3. Radio de la isla (igual en todos los nodos)

| Ajuste | Valor PR |
|---|---|
| Preset | **USA/Canada (Recommended)** |
| Frecuencia | 910.525 MHz |
| Bandwidth | 62.5 kHz |
| Spreading Factor | 7 |
| Coding Rate | 5 |
| Path hash | **2 bytes** |
| Firmware | **v1.18.0** (mínimo 1.14 para paths de 2 bytes) |

> Si el repeater no tiene exactamente la misma radio que los companions, **no se oyen**. Es la causa #1 de "no veo mi repeater".

---

## 4. Antes de empezar

### 4.1 Lo que necesitas
- Un **companion BLE** ya configurado para PR (ver `meshcore-companion-pr.md`) y conectado a la app.
- La app **MeshCore** (Liam Cottle) en Android o iOS, actualizada.
- El equipo que será repeater/room server, con **antena conectada antes de encenderlo**.

### 4.2 Hardware recomendado
| Uso | Equipo |
|---|---|
| Solar / sin mantenimiento | nRF52840: RAK4631 (WisBlock), SenseCAP Solar P1 Pro, Heltec T114 |
| Con luz AC | ESP32-S3: Heltec V3/V4, XIAO S3 + Wio-SX1262 |
| Antena | 915 MHz externa, cable corto de baja pérdida |

### 4.3 Diferencias Android vs iOS
La app es la misma en ambas plataformas y los menús son iguales. Solo cambian los permisos:

| | **Android** | **iOS** |
|---|---|---|
| Permiso para Bluetooth | "Dispositivos cercanos" (Android 12+) | "Bluetooth" |
| Permiso de ubicación | Necesario para mapa y posición | Necesario para mapa y posición |
| En segundo plano | Excluir la app de **Optimización de batería** para que no corte el BLE | Mantener la app **abierta** durante la administración remota; iOS puede pausar BLE en segundo plano |
| Temporizador de Remote Management | Igual en ambas: hay una espera de unos segundos antes del login; se puede quitar apoyando a los desarrolladores | |

---

## 5. Primer arranque (una sola vez)

1. **Flashear** desde una computadora con Chrome/Edge en <https://flasher.meshcore.io/>:
   - Escoge tu dispositivo → **Repeater** o **Room Server** → versión **v1.18.0**.
   - Marca **Erase** si es instalación nueva.
   - Si el flasher te deja escoger región, escoge **USA/Canada (Recommended)**.
2. Si el flasher **no** te dejó escoger el preset, haz la configuración inicial por USB en <https://config.meshcore.io/> (es una página con formularios, no consola): pon el preset USA/Canada, **cambia la contraseña de admin**, guarda y presiona **Send Advert**.
3. Desde aquí en adelante, **todo se hace desde el teléfono**.

> ⚠️ La contraseña de admin de fábrica es pública (`password`). Cámbiala en el primer acceso, sea por la web o por la app.

---

## 6. Configurar un Repeater desde la app (Android e iOS)

> Requisito: tu **companion** conectado a la app por Bluetooth y el repeater encendido cerca la primera vez (misma habitación está bien).

### 6.1 Encontrar el repeater
1. Abre la app → pestaña **Contacts**.
2. Si no aparece: en el repeater recién encendido, espera su advert, o en la app toca el ícono de **advert** (señal) para anunciarte y refresca.
3. El repeater aparece con un ícono de **torre/antena**.

### 6.2 Entrar a Remote Management
1. Toca el repeater → **Remote Management** (o el ícono de torre).
2. Espera el temporizador → **Continue**.
3. Escribe la **contraseña de admin** → **Login**.
4. Marca **Remember password** solo si el teléfono tiene bloqueo de pantalla.

### 6.3 Ajustes del Repeater

Dentro de Remote Management → **Settings**:

| Ajuste en la app | Valor recomendado PR | Nota |
|---|---|---|
| **Name** | `PR-<PUEBLO>-<SITIO>` (ej. `PR-SJU-Hatorey`, `PR-JAY-CerroPunta`) | Facilita leer trazas y mapas |
| **Latitude / Longitude** | Coordenadas del sitio | En tu casa, redondea a 3 decimales |
| **Owner info** | Indicativo + contacto (ej. `WP4TZV`) | Para que otros te localicen si hay problema |
| **Admin password** | Contraseña fuerte, única | Nunca dejar la de fábrica |
| **Guest password** | Una contraseña que compartas con la comunidad | Guest solo puede ver estadísticas |
| **Radio / Preset** | **USA/Canada (Recommended)** | Se reinicia al aplicar |
| **TX power** | 22 dBm (máximo típico SX1262) | Ver §10 si usas amplificador |
| **Advert interval** (local/zero-hop) | 240 min (4 h) | |
| **Flood advert interval** | 12 h | Más frecuente gasta airtime de toda la isla |
| **Path hash size** | 2 bytes | Si tu versión de la app lo muestra |
| **Repeat** | **On** | Es su trabajo |

Al terminar:
1. **Save**.
2. **Settings → Sync Clock** (la hora la toma del teléfono).
3. **Settings → Advert** para anunciar el repeater en la malla.

### 6.4 Perfil según ubicación (anti-colisión)

Los repeaters esperan un tiempo aleatorio antes de retransmitir para no chocar con sus vecinos. A más vecinos, más espera. Si tu versión de la app muestra los campos **TX delay / Direct TX delay / RX delay**, usa:

| Perfil PR | Ejemplos | Vecinos típicos | TX delay | Direct TX delay | RX delay |
|---|---|---|---|---|---|
| **Montaña / backbone** | Cerro Punta, Monte Jayuya, Maravilla, picos de El Yunque | 15+ | 2 | 2 | 3 |
| **Elevado** | Torres en lomas, edificios altos en Hato Rey/Condado | 10–20 | 1.5 | 1 | 3 |
| **Techo urbano** | Azotea de 2–4 pisos | 5–10 | 0.8 | 0.4 | 3 |
| **Local / bajo** | Balcón, interior | 1–3 | 0.3 | 0.1 | 3 |
| **Temporal** | Trípode en evento o emergencia | variable | 3 | 2.5 | 3 |

- Los valores de fábrica dejan pocas "ventanas" de espera; subirlos reduce colisiones.
- Si el firmware tiene **auto-ajuste** (autotune) activo, déjalo así: poner un valor a mano lo apaga.
- Revisa **Neighbours** después de una semana y ajusta el perfil si ves más o menos vecinos de lo esperado.

### 6.5 Regiones (opcional)
Desde la app puedes **descubrir y administrar regiones** del repeater (Remote Management → Settings → **Manage Regions**). Úsalo solo cuando la comunidad acuerde nombres de región para la isla; mientras tanto, déjalo como viene.

---

## 7. Configurar un Room Server desde la app (Android e iOS)

### 7.1 Administración
1. **Contacts** → toca el Room Server → **Remote Management** → contraseña de admin → **Login**.
2. **Settings**:

| Ajuste en la app | Valor recomendado | Nota |
|---|---|---|
| **Name** | `PR-<GRUPO>-Room` (ej. `PR-ARES-Room`, `PR-Yunque-Room`) | |
| **Latitude / Longitude** | Sitio del equipo | |
| **Owner info** | Contacto del administrador | |
| **Admin password** | Fuerte, única | |
| **Guest password** | La clave del grupo | **Nunca vacía** (ver abajo) |
| **Read-only** | Off = el grupo lee y escribe · On = boletín (todos leen) | |
| **Repeat** | **Off** | Usa un repeater aparte |
| **Radio / Preset** | **USA/Canada (Recommended)** | |

3. **Save** → **Sync Clock** → **Advert**.

> ⚠️ **Nunca dejes la Guest password vacía.** Hay un problema conocido: con guest en blanco, alguien que entra sin contraseña puede escribir aunque actives Read-only. Pon siempre una contraseña, aunque no la compartas.

### 7.2 Cómo se une un usuario al room
1. **Contacts** → toca el room (ícono de grupo/room).
2. Escribe la **guest password** del grupo → **Login**.
3. Se descargan los mensajes que no ha visto; desde ahí puede leer y publicar.

### 7.3 Usos en PR
- Club de radio, ARES/RACES, CERT municipal.
- Boletín durante huracanes: refugios, agua, estado de carreteras.
- Eventos: carreras, triatlones, actividades comunitarias.
- Coordinación entre los que mantienen repeaters.

---

## 8. Verificación

Desde tu companion, ya con el equipo instalado en su sitio:

| Prueba | Dónde en la app | Qué esperar |
|---|---|---|
| Aparece en contactos | **Contacts** | Ícono de torre (repeater) o room |
| Login remoto | Contacto → **Remote Management** | Entra con la contraseña de admin |
| Estado | Remote Management → **Status** | Batería, uptime, paquetes, errores |
| Vecinos | Remote Management → **Neighbours** | Otros repeaters que oye, con barra de señal |
| Ruta | Contacto → **Path trace** | El repeater aparece en la ruta |
| Mensajes de canal | Long-press en un mensaje del canal | Muestra qué repeaters lo retransmitieron |

---

## 9. Errores comunes

| Síntoma | Causa probable | Solución |
|---|---|---|
| No aparece en Contacts | Radio distinta al companion | Confirmar preset USA/Canada en ambos |
| Login falla | Contraseña equivocada o fuera de alcance | Acércate; verifica la contraseña |
| Hora incorrecta tras reinicio | Equipo sin reloj con batería | **Settings → Sync Clock** |
| Se desconecta durante la administración (iOS) | iOS pausa Bluetooth en segundo plano | Mantener la app abierta |
| Se desconecta durante la administración (Android) | Optimización de batería | Excluir la app de la optimización |
| Room permite escribir a cualquiera | Guest password vacía | Poner una guest password |
| Muchos errores en Status | Colisiones con vecinos | Subir el perfil de delay (§6.4) |

---

## 10. Energía y sitio

| Sitio | Recomendación |
|---|---|
| Montaña sin luz | nRF52 + panel solar + LiFePO4 o 18650 (≥ 3000 mAh c/u), gabinete IP65+, panel mirando al **sur** |
| Techo con luz | Batería de respaldo; en huracán la luz se va por días |
| Torre comercial | Permiso del dueño, protección contra descargas, equipo identificado |
| Temporal | Trípode o mástil telescópico, batería grande, perfil "Temporal" |

**FCC (902–928 MHz, §15.247):** máximo 30 dBm conducido y 36 dBm EIRP. Con 22 dBm y antenas de 3–8 dBi estás muy por debajo. Si usas un amplificador externo, suma la ganancia de la antena.

**Huracanes:** el valor de la malla en PR está en sobrevivir apagones largos. Dimensiona la batería para **varios días nublados**, no para una sola noche.

---

## 11. Checklist

- [ ] Firmware **v1.18.0**
- [ ] Contraseña de admin cambiada; guest password **no vacía**
- [ ] Preset **USA/Canada (Recommended)** en el repeater y en tu companion
- [ ] Path hash 2 bytes
- [ ] Nombre `PR-<PUEBLO>-<SITIO>`, coordenadas y owner info
- [ ] Advert 4 h / Flood advert 12 h
- [ ] Perfil de delay según ubicación (o autotune activo)
- [ ] **Sync Clock** y **Advert** hechos
- [ ] Room Server: Repeat **Off**, Read-only decidido
- [ ] Probado desde el companion: login, Status, Neighbours y Path trace
- [ ] Antena conectada **antes** de energizar
- [ ] Energía dimensionada para apagón largo

---

## 12. Fuentes

- [MeshCore — Releases (v1.18.0, 15 oct 2026)](https://github.com/meshcore-dev/MeshCore/releases)
- [MeshCore — FAQ (Room Server, administración remota)](https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md)
- [MeshCore — Referencia de comandos (contraseñas por defecto)](https://docs.meshcore.io/cli_commands)
- [Gulf Coast Mesh — Repeater Setup (pasos en la app)](https://dev-lameshsite.vercel.app/docs/meshcore-repeater-setup)
- [Puget Mesh — Remote Management](https://github.com/pugetmesh/pugetmesh.github.io/issues/52)
- [MichMesh — Perfiles de delay](https://michmesh.net/docs/MeshCore/Repeater-Setup)
- [MeshCore Issue #2123 — valores de delay](https://github.com/meshcore-dev/MeshCore/issues/2123)
- [MeshCore PR #2938 — Room Server sin guest password](https://github.com/meshcore-dev/MeshCore/pull/2938)
- [App MeshCore — changelog (regiones e identidad por Remote Management)](https://www.apkmirror.com/?p=12449508)
