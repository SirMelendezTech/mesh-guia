# Repeater y Room Server de MeshCore en Puerto Rico

Para infraestructura fija (techos, torres, montañas, equipos solares), configurada desde la app de Android o iOS.

- Autor: WP4TZV
- Malla: Puerto Rico, región US (902–928 MHz)
- Firmware estable: **v1.18.0**
- Última revisión: noviembre 2026

## 1. Resumen rápido

| Pregunta | Respuesta corta |
|---|---|
| ¿Quiero extender la cobertura de la malla? | Repeater |
| ¿Un grupo necesita mensajes que queden guardados (club, CERT, evento, huracán)? | Room Server |
| ¿Puedo usar un solo equipo como Repeater y Room Server? | Se puede, pero no se recomienda. Usa dos equipos |
| ¿El nodo se va a mover (mochila, carro)? | Companion, nunca Repeater |
| ¿Ya hay un repeater fuerte en el mismo techo o cerro? | No pongas otro ahí; busca otro punto alto |
| ¿Dónde se administra? | App MeshCore → Contacts → el repeater → Remote Management |

La altura y la energía estable valen más que la potencia. Un repeater en un cerro con línea de vista sirve más que diez en techos de urbanización.

## 2. Qué hace cada rol

| | Repeater | Room Server | Companion |
|---|---|---|---|
| Retransmite paquetes de otros | Sí | No (por defecto) | No |
| Guarda mensajes para quien se conecte después | No | Sí | No |
| Se administra a distancia desde la app | Sí | Sí | No aplica |
| Lleva un teléfono conectado | No | No | Sí |
| Dónde suele estar | Fijo, en un sitio alto | Fijo, con buena cobertura | Contigo |

- Un Room Server funciona como un buzón o un BBS: cuando alguien entra, recibe los mensajes que no ha visto, hasta 32 a la vez.
- Un Room Server puede activar "Repeat", pero la documentación oficial no lo recomienda porque no tiene todas las funciones de administración del firmware Repeater. Es mejor tener dos equipos separados.

## 3. Radio de la isla (igual en todos los nodos)

| Ajuste | Valor en PR |
|---|---|
| Preset | USA/Canada (Recommended) |
| Frecuencia | 910.525 MHz |
| Bandwidth | 62.5 kHz |
| Spreading factor | 7 |
| Coding rate | 5 |
| Path hash | 2 bytes |
| Firmware | **v1.18.0** (1.14 como mínimo para rutas de 2 bytes) |

Si el repeater no tiene exactamente la misma configuración de radio que los companions, no se oyen. Es la razón más común detrás de "no veo mi repeater".

## 4. Antes de empezar

### 4.1 Lo que necesitas

- Un companion BLE configurado para PR (ver `meshcore-companion-pr.md`) y conectado a la app.
- La app MeshCore (de Liam Cottle) en Android o iOS, actualizada.
- El equipo que va a ser repeater o room server, con la antena conectada antes de encenderlo.

### 4.2 Hardware recomendado

| Uso | Equipo |
|---|---|
| Solar, sin mantenimiento | nRF52840: RAK4631 (WisBlock), SenseCAP Solar P1 Pro, Heltec T114 |
| Con electricidad de la casa | ESP32-S3: Heltec V3/V4, XIAO S3 con Wio-SX1262 |
| Antena | Externa de 915 MHz, con cable corto de baja pérdida |

### 4.3 Android y iOS

La app y sus menús son iguales en las dos plataformas. Lo que cambia son los permisos:

| | Android | iOS |
|---|---|---|
| Permiso de Bluetooth | "Dispositivos cercanos" (Android 12 o más nuevo) | "Bluetooth" |
| Permiso de ubicación | Hace falta para el mapa y la posición | Hace falta para el mapa y la posición |
| En segundo plano | Saca la app de la optimización de batería para que no corte el Bluetooth | Deja la app abierta mientras administras el equipo; iOS puede pausar el Bluetooth en segundo plano |

En las dos plataformas, Remote Management hace esperar unos segundos antes de entrar. Esa espera desaparece si apoyas a los desarrolladores de la app.

## 5. Primer arranque (una sola vez)

1. **Instala el firmware** desde una computadora con Chrome o Edge en <https://flasher.meshcore.io/>:
   - Escoge tu dispositivo, luego Repeater o Room Server, y la versión v1.18.0.
   - Marca *Erase* si es una instalación nueva.
   - Si el instalador te deja escoger la región, escoge USA/Canada (Recommended).
2. Si el instalador no te dejó escoger el preset, haz la configuración inicial por USB en <https://config.meshcore.io/>. Es una página con formularios, no una consola. Pon el preset USA/Canada, cambia la contraseña de admin, guarda y presiona Send Advert.
3. Desde aquí en adelante todo se hace desde el teléfono.

**La contraseña de admin de fábrica es pública (`password`).** Cámbiala la primera vez que entres, sea por la web o por la app.

## 6. Configurar un Repeater desde la app (Android e iOS)

Antes de empezar, conecta tu companion a la app por Bluetooth. La primera vez, el repeater tiene que estar encendido cerca; en la misma habitación está bien.

### 6.1 Encontrar el repeater

1. Abre la app y ve a la pestaña Contacts.
2. Si no aparece, espera a que el repeater recién encendido envíe su advert, o toca en la app el ícono de advert (el de señal) para anunciarte y refresca.
3. El repeater aparece con un ícono de torre.

### 6.2 Entrar a Remote Management

1. Toca el repeater y luego Remote Management (o el ícono de torre).
2. Espera que termine el temporizador y toca Continue.
3. Escribe la contraseña de admin y toca Login.
4. Marca Remember password solo si tu teléfono tiene bloqueo de pantalla.

### 6.3 Ajustes del Repeater

Dentro de Remote Management, en Settings:

| Ajuste en la app | Valor recomendado en PR | Nota |
|---|---|---|
| Name | `PR-<PUEBLO>-<SITIO>` (por ejemplo `PR-SJU-Hatorey` o `PR-JAY-CerroPunta`) | Así es más fácil leer rutas y mapas |
| Latitude / Longitude | Las coordenadas del sitio | Si está en tu casa, redondea a 3 decimales |
| Owner info | Tu indicativo y un contacto (por ejemplo `WP4TZV`) | Para que te encuentren si hay un problema |
| Admin password | Una contraseña fuerte que no uses en otro sitio | Nunca dejes la de fábrica |
| Guest password | Una contraseña que compartas con la comunidad | Con guest solo se ven estadísticas |
| Radio / Preset | USA/Canada (Recommended) | El equipo se reinicia al aplicarlo |
| TX power | 22 dBm (el máximo normal de un SX1262) | Si usas un amplificador, ver §10 |
| Advert interval (local, zero-hop) | 240 min (4 h) | |
| Flood advert interval | 12 h | Más seguido gasta tiempo de aire en toda la isla |
| Path hash size | 2 bytes | Si tu versión de la app lo muestra |
| Repeat | On | Es su trabajo |

Al terminar:

1. Toca Save.
2. Ve a Settings → Sync Clock. La hora se toma del teléfono.
3. Ve a Settings → Advert para anunciar el repeater en la malla.

### 6.4 Tiempos de espera según la ubicación

Antes de retransmitir, cada repeater espera un tiempo al azar para no chocar con sus vecinos. Mientras más vecinos tenga, más debe esperar. Si tu versión de la app muestra los campos TX delay, Direct TX delay y RX delay, usa:

| Perfil en PR | Ejemplos | Vecinos típicos | TX delay | Direct TX delay | RX delay |
|---|---|---|---|---|---|
| Montaña o backbone | Cerro Punta, Monte Jayuya, Maravilla, picos de El Yunque | 15 o más | 2 | 2 | 3 |
| Elevado | Torres en lomas, edificios altos en Hato Rey o Condado | 10–20 | 1.5 | 1 | 3 |
| Techo urbano | Azotea de 2 a 4 pisos | 5–10 | 0.8 | 0.4 | 3 |
| Local o bajo | Balcón, interior | 1–3 | 0.3 | 0.1 | 3 |
| Temporal | Trípode en un evento o una emergencia | Varía | 3 | 2.5 | 3 |

- Los valores de fábrica dejan pocas ventanas de espera. Subirlos reduce las colisiones.
- Si el firmware tiene el ajuste automático (autotune) activado, déjalo así. Poner un valor a mano lo apaga.
- Revisa Neighbours después de una semana y cambia de perfil si ves más o menos vecinos de lo esperado.

### 6.5 Regiones (opcional)

Desde la app puedes descubrir y administrar las regiones del repeater en Remote Management → Settings → Manage Regions. Úsalo solo cuando la comunidad acuerde nombres de región para la isla. Mientras tanto, déjalo como viene.

## 7. Configurar un Room Server desde la app (Android e iOS)

### 7.1 Administración

1. En Contacts, toca el Room Server, luego Remote Management, escribe la contraseña de admin y toca Login.
2. En Settings:

| Ajuste en la app | Valor recomendado | Nota |
|---|---|---|
| Name | `PR-<GRUPO>-Room` (por ejemplo `PR-ARES-Room` o `PR-Yunque-Room`) | |
| Latitude / Longitude | Donde está el equipo | |
| Owner info | El contacto de quien lo administra | |
| Admin password | Fuerte, que no uses en otro sitio | |
| Guest password | La clave del grupo | Nunca la dejes vacía (ver abajo) |
| Read-only | Off: el grupo lee y escribe. On: funciona como boletín y todos solo leen | |
| Repeat | Off | Usa un repeater aparte |
| Radio / Preset | USA/Canada (Recommended) | |

3. Toca Save, luego Sync Clock y luego Advert.

**Nunca dejes la Guest password vacía.** Hay un problema conocido: si guest está en blanco, quien entra sin contraseña puede escribir aunque actives Read-only. Pon siempre una contraseña, aunque no la compartas.

### 7.2 Cómo entra un usuario al room

1. En Contacts, toca el room (tiene ícono de grupo).
2. Escribe la guest password del grupo y toca Login.
3. Se descargan los mensajes que no ha visto. Desde ahí puede leer y publicar.

### 7.3 Para qué se usa en PR

- Clubes de radio, ARES/RACES, CERT municipal.
- Boletín durante huracanes: refugios, agua, estado de las carreteras.
- Eventos: carreras, triatlones, actividades de la comunidad.
- Coordinación entre quienes mantienen repeaters.

## 8. Verificación

Desde tu companion, con el equipo ya instalado en su sitio:

| Prueba | Dónde en la app | Qué debe pasar |
|---|---|---|
| Aparece en los contactos | Contacts | Sale con ícono de torre (repeater) o de room |
| Entrada remota | El contacto → Remote Management | Entras con la contraseña de admin |
| Estado | Remote Management → Status | Ves batería, tiempo encendido, paquetes y errores |
| Vecinos | Remote Management → Neighbours | Ves otros repeaters que oye, con su barra de señal |
| Ruta | El contacto → Path trace | El repeater aparece en la ruta |
| Mensajes del canal | Mantén presionado un mensaje del canal | Muestra qué repeaters lo retransmitieron |

## 9. Errores comunes

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| No aparece en Contacts | Radio distinta a la del companion | Confirma el preset USA/Canada en los dos |
| No te deja entrar | Contraseña equivocada o estás fuera de alcance | Acércate y revisa la contraseña |
| Hora incorrecta después de reiniciar | El equipo no tiene reloj con batería | Settings → Sync Clock |
| Se desconecta mientras lo administras (iOS) | iOS pausa el Bluetooth en segundo plano | Deja la app abierta |
| Se desconecta mientras lo administras (Android) | Optimización de batería | Saca la app de la optimización |
| Cualquiera puede escribir en el room | Guest password vacía | Pon una guest password |
| Muchos errores en Status | Colisiones con los vecinos | Sube el perfil de espera (§6.4) |

## 10. Energía y sitio

| Sitio | Qué hacer |
|---|---|
| Montaña sin electricidad | nRF52 con panel solar y batería LiFePO4 o 18650 (3000 mAh o más cada una), caja IP65 o mejor, panel mirando al sur |
| Techo con electricidad | Batería de respaldo; en un huracán la luz se va por días |
| Torre comercial | Permiso del dueño, protección contra rayos, equipo identificado |
| Temporal | Trípode o mástil telescópico, batería grande, perfil "Temporal" |

**FCC (902–928 MHz, §15.247):** el máximo es 30 dBm conducidos y 36 dBm EIRP. Con 22 dBm y antenas de 3 a 8 dBi quedas muy por debajo. Si usas un amplificador externo, suma también la ganancia de la antena.

**Huracanes:** lo que hace valiosa la malla en PR es que siga funcionando durante apagones largos. Calcula la batería para varios días nublados seguidos, no para una sola noche.

## 11. Checklist

- [ ] Firmware v1.18.0
- [ ] Contraseña de admin cambiada; guest password puesta
- [ ] Preset USA/Canada (Recommended) en el repeater y en tu companion
- [ ] Path hash en 2 bytes
- [ ] Nombre `PR-<PUEBLO>-<SITIO>`, coordenadas y owner info
- [ ] Advert cada 4 h y flood advert cada 12 h
- [ ] Tiempos de espera según la ubicación (o autotune activado)
- [ ] Sync Clock y Advert hechos
- [ ] Room Server: Repeat en Off y Read-only decidido
- [ ] Probado desde el companion: Login, Status, Neighbours y Path trace
- [ ] Antena conectada antes de darle energía
- [ ] Energía calculada para un apagón largo

## 12. Fuentes

- [MeshCore: versiones publicadas (v1.18.0, 15 de octubre de 2026)](https://github.com/meshcore-dev/MeshCore/releases)
- [MeshCore: preguntas frecuentes (Room Server, administración remota)](https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md)
- [MeshCore: referencia de comandos (contraseñas por defecto)](https://docs.meshcore.io/cli_commands)
- [Gulf Coast Mesh: instalación de un repeater (pasos en la app)](https://dev-lameshsite.vercel.app/docs/meshcore-repeater-setup)
- [Puget Mesh: Remote Management](https://github.com/pugetmesh/pugetmesh.github.io/issues/52)
- [MichMesh: perfiles de tiempos de espera](https://michmesh.net/docs/MeshCore/Repeater-Setup)
- [MeshCore, issue #2123: valores de espera](https://github.com/meshcore-dev/MeshCore/issues/2123)
- [MeshCore, PR #2938: Room Server sin guest password](https://github.com/meshcore-dev/MeshCore/pull/2938)
- [App MeshCore: lista de cambios (regiones e identidad por Remote Management)](https://www.apkmirror.com/?p=12449508)
