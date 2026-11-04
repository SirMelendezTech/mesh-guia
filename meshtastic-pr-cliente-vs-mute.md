# Nodos CLIENT y CLIENT_MUTE de Meshtastic en Puerto Rico

Para nodos portátiles: en la mano, en la mochila o en el carro.

- Autor: WP4TZV
- Malla: Puerto Rico, región US (902–928 MHz)
- Firmware estable: **2.7.26**
- Última revisión: noviembre 2026

## 1. Resumen rápido

| Pregunta | Respuesta corta |
|---|---|
| ¿Estoy cerca de un nodo mío más fuerte (techo, ático)? | CLIENT_MUTE |
| ¿Ando en grupo, con varios nodos juntos? | Uno en CLIENT y el resto en CLIENT_MUTE |
| ¿Estoy en el área metro (San Juan, Bayamón, Carolina, Guaynabo) con buena cobertura? | CLIENT_MUTE |
| ¿Estoy en el campo, la montaña o la costa, con pocos nodos alrededor? | CLIENT |
| ¿Hay apagón, huracán o infraestructura caída? | CLIENT, porque cada nodo cuenta |
| ¿Puedo poner un portátil en ROUTER o REPEATER? | Nunca |

Si tu nodo no es el único puente entre otros nodos y la malla, no necesita retransmitir. MUTE ahorra tiempo de aire y batería; CLIENT ayuda a cubrir los huecos.

## 2. Qué hace cada rol

| | CLIENT | CLIENT_MUTE |
|---|---|---|
| Envía tus mensajes | Sí | Sí |
| Recibe mensajes | Sí | Sí |
| Retransmite paquetes de otros | Sí, con prioridad según el SNR | Nunca |
| Aparece en la lista de nodos | Sí | Sí |
| Consumo de batería | Normal | Más bajo |
| Efecto en la congestión | Suma tiempo de aire | Mínimo |
| Es el rol por defecto | Sí | No |

- **Un nodo en CLIENT_MUTE se puede alcanzar igual.** Los demás nodos (CLIENT, CLIENT_BASE, ROUTER) sí retransmiten sus paquetes. Lo único que deja de hacer es retransmitir los paquetes de otros.
- **CLIENT no es un router a medias.** El firmware ya le baja la prioridad de retransmisión a los nodos que escuchan con buena señal, así que en una zona con muchos nodos un CLIENT casi nunca causa problemas serios. Aun así, MUTE es más limpio cuando hay varios nodos juntos.
- **CLIENT_BASE es para tu nodo fijo de techo o ático.** Le da prioridad a lo que entra y sale de tus nodos favoritos. Marca tus portátiles como favoritos en tu CLIENT_BASE y ponlos en MUTE cuando estés en casa.

## 3. La malla en Puerto Rico

- **Región:** `US` (902–928 MHz). Respeta los límites de EIRP de 47 CFR §15.247. Subir la antena rinde más que subir la potencia.
- **Preset:** usa el mismo modem preset que la comunidad local (por defecto `LONG_FAST`). Con un preset distinto no te escucha nadie. Confirma con el grupo antes de cambiarlo.
- **Cómo está armada:** PR todavía no tiene un backbone de verdad, y muchos nodos de torre o de costa están en CLIENT. Por eso, en zonas rurales un portátil a veces sí es el único eslabón, y ahí CLIENT tiene sentido.
- **Terreno:** la Cordillera Central, El Yunque y los valles del interior dejan zonas de sombra de radio. Un portátil en la cima de una loma puede ser el puente entre alguien en el valle y la malla.
- **MQTT:** el tráfico de PR sube a MQTT con el root topic `msh/US/PR`. Para que tu nodo salga en los mapas web de la comunidad, configura MQTT como explica la sección 7.
- **Mapas web de la comunidad:** `malla.prmsh.com` y `meshview.prmsh.com`. Ahí se ven los nodos, sus vecinos, la señal y el uso del canal.
- **Valores recomendados de PRMSH:** https://meshtastic.prmsh.com/settings/. Esta guía usa esos valores.

## 4. Escenarios para nodos portátiles

### 4.1 En casa u oficina, cerca de tu nodo de techo: CLIENT_MUTE

Tu nodo de techo (CLIENT_BASE o CLIENT) ya cubre el área. Si el portátil también retransmite, solo duplica paquetes y gasta batería.

### 4.2 Área metro con muchos nodos (San Juan, Bayamón, Carolina, Caguas): CLIENT_MUTE

Hay suficientes nodos fijos. Un portátil a nivel de calle que retransmite añade colisiones sin mejorar la cobertura.

### 4.3 Grupo, caravana o evento (corrida, bicicleteada, triatlón, actividad de radioaficionados): uno en CLIENT y el resto en MUTE

- Pon en CLIENT el nodo mejor ubicado: el de la antena más alta, el del carro de apoyo o el de quien va por la loma.
- Pon todos los demás en CLIENT_MUTE.
- Diez nodos en CLIENT a 5 metros uno del otro crean una tormenta de retransmisiones.

### 4.4 Excursión, campo, montaña o costa remota: CLIENT

Por ejemplo: Toro Negro, Cerro Punta, El Yunque, el Bosque Seco de Guánica, Cabo Rojo, Vieques o Culebra. Con pocos nodos alrededor, cualquier retransmisión puede ser la que conecta a tu grupo con la malla.

### 4.5 En un vehículo: depende de la zona

- En autopistas del área metro (PR-22, PR-52 cerca de San Juan, PR-18): CLIENT_MUTE.
- En carreteras rurales del interior (PR-10, PR-143 en la Ruta Panorámica): CLIENT puede ayudar, pero un nodo que se mueve rápido es un relevo poco predecible.

### 4.6 Emergencia, huracán o apagón general: CLIENT

Cuando los nodos fijos se apagan por falta de energía, los portátiles pasan a ser la malla. Cambia a CLIENT, envía la posición y la telemetría menos seguido para estirar la batería y coordina por el canal acordado.

### 4.7 Varios nodos tuyos en la misma mochila o escritorio: solo uno en CLIENT

Por ejemplo, un T-Echo, un T-Deck y un nodo de pruebas. Uno en CLIENT (o en CLIENT_BASE si es fijo) y el resto en MUTE.

## 5. Diagrama de decisión

```
¿Es un nodo portátil?
 └─ Sí
     ├─ ¿Hay un nodo mío más fuerte cerca (casa, carro)?  → CLIENT_MUTE
     ├─ ¿Hay otros nodos del grupo a pocos metros?
     │     ├─ Soy el mejor ubicado                        → CLIENT
     │     └─ No                                          → CLIENT_MUTE
     ├─ ¿Estoy en una zona con muchos nodos (metro)?      → CLIENT_MUTE
     ├─ ¿Zona remota, pocos nodos o emergencia?           → CLIENT
     └─ ¿No estoy seguro?                                 → CLIENT (el valor por defecto);
                                                             revisa los vecinos y el SNR, y si
                                                             ves muchos nodos directos (0 hops),
                                                             cambia a MUTE
```

Una guía práctica: si en la app ves más de 5 o 6 nodos a 0 hops con buen SNR, tu portátil no está aportando cobertura. Ponlo en MUTE.

## 6. Configuración en la app (Android e iOS)

El nodo tiene que estar conectado a la app por Bluetooth. Los nombres de los menús cambian un poco según la versión de la app, pero las secciones (Device, LoRa, Position) son las mismas en las dos plataformas.

### 6.1 Los dos perfiles

Valores para nodos móviles, tomados de las recomendaciones de PRMSH (https://meshtastic.prmsh.com/settings/).

| Sección | Ajuste (como sale en la app) | Perfil A: Client | Perfil B: Client Mute |
|---|---|---|---|
| Device | Role | `Client` | `Client Mute` |
| Device | Node Info Broadcast Interval | 3 horas | 3 horas |
| LoRa | Region | `US` | `US` |
| LoRa | Modem Preset | El de la comunidad | El de la comunidad |
| LoRa | Number of Hops / Hop Limit | `3` | `3` (hasta `5` solo si estás en el borde de la malla) |
| LoRa | TX Power | `0` (el máximo permitido) | `0` (el máximo permitido) |
| LoRa | OK to MQTT | Encendido | Encendido |
| Position | Smart Position / Smart Broadcast | Encendido | Encendido |
| Position | Smart Broadcast Minimum Distance | 100 m | 100 m |
| Position | Smart Broadcast Minimum Interval | 60 s | 60 s |
| Position | Position Broadcast Interval | 1 hora | 1 hora |
| Position | GPS Update Interval | 5 min | 5 min |
| Position | Fixed Position | Apagado | Apagado |
| Position | Position Flags | Encendidos: Altitude, Altitude MSL, Speed, Heading, Sats in View. Apagado: Geoidal Separation | Igual |
| Telemetry | Device Metrics | 1 hora | 1 hora |
| Telemetry | Environment Metrics | 1 hora | 1 hora |
| Neighbor Info | Enabled y Transmit Over LoRa | Encendidos, cada 4 horas | Encendidos, cada 4 horas |
| MQTT | Map Report Interval | 1 hora | 1 hora |

**Hop limit:** `3` por defecto. Solo en el borde de la malla puedes subirlo hasta `5`, y nunca más de 5.

Firmware recomendado: 2.7.26 estable (`v2.7.26.54e0d8d`). El mínimo absoluto es 2.6.11, que corrige la CVE-2025-52464 (llaves X25519 duplicadas). Puedes actualizar desde la misma app en los equipos compatibles, o con `flasher.meshtastic.org`.

### 6.2 Android

1. Abre la app Meshtastic y conecta tu nodo: en la pestaña de conexión, escoge el radio por Bluetooth.
2. Entra a Settings (el ícono de engranaje).
3. En Radio Configuration:
   - Device → Role → `Client` o `Client Mute`. Node Info Broadcast → 3 horas (10800 s). Toca Save.
   - LoRa → revisa Region = US, Modem Preset, Hop Limit = 3, TX Power y OK to MQTT. Toca Save.
   - Position → activa Smart Position y ajusta Minimum Distance, Minimum Interval, Broadcast Interval, GPS Update Interval y Position Flags según la tabla. Deja Fixed Position apagado. Toca Save.
4. En Module Configuration:
   - Telemetry → Device y Environment cada 1 hora. Toca Save.
   - Neighbor Info → Enabled y Transmit Over LoRa encendidos, cada 4 horas. Toca Save.
   - MQTT → ver la sección 7.
5. El nodo se reinicia al guardar. Espera a que se vuelva a conectar y confirma el rol en Settings → Radio Configuration → Device.

### 6.3 iOS, iPadOS y macOS

1. Abre la app Meshtastic y conecta tu nodo en la pestaña Bluetooth (o Connect).
2. Entra a la pestaña Settings.
3. En Radio Configuration (en versiones viejas se llama Device Configuration):
   - Device → Device Role → `Client` o `Client Mute`. Node Info Broadcast Interval → *Three Hours*. Toca Save.
   - LoRa → Region = United States, Modem Preset, Number of Hops = 3, Transmit Power y OK to MQTT. Toca Save.
   - Position → activa Smart Position y ajusta Minimum Distance, Minimum Interval, Broadcast Interval, GPS Update Interval y Position Flags según la tabla. Fixed Position apagado. Toca Save.
4. En Module Configuration:
   - Telemetry → Device y Environment cada 1 hora. Toca Save.
   - Neighbor Info → Enabled y Transmit Over LoRa encendidos, cada 4 horas. Toca Save.
   - MQTT → ver la sección 7.
5. Si tienes más de un nodo, escoge primero el correcto en la sección Configure antes de cambiar nada.
6. Después del reinicio, revisa el rol en Settings → Device.

### 6.4 Cambiar de rol rápido en el campo

Solo cambias un ajuste; el resto del perfil se queda igual:

- Android: Settings → Radio Configuration → Device → Role → Save
- iOS: Settings → Radio Configuration → Device → Device Role → Save

Si sales de casa hacia una zona remota, pon `Client`. Cuando regreses a casa o a la zona metro, pon `Client Mute`.

### 6.5 Favoritos en tu nodo base (CLIENT_BASE)

Si tienes un nodo de techo en Client Base, conéctate a ese nodo y marca tus portátiles como favoritos:

- Android: pestaña Nodes → toca el portátil → Add to favorites (la estrella).
- iOS: pestaña Nodes → toca el portátil → Favorite (la estrella).

Así el base les da prioridad cuando estás en casa con el portátil en MUTE.

## 7. MQTT y los mapas web de PRMSH

Los mapas web de la comunidad, `malla.prmsh.com` y `meshview.prmsh.com`, muestran los nodos cuyos paquetes llegan a MQTT con el root topic `msh/US/PR`. Si los paquetes de tu nodo no llegan a MQTT, tu nodo no aparece.

### 7.1 Dos formas de salir en la web

| Forma | Qué haces | Cuándo sirve |
|---|---|---|
| A. Otro gateway sube tus paquetes | Enciende OK to MQTT (en LoRa). Cualquier gateway que te escuche, como un CLIENT_BASE con WiFi, sube tus paquetes | Siempre. Es lo mínimo que debe tener todo el mundo: sin esto, nadie te sube aunque te escuche |
| B. Tu propio nodo los sube | Activa el módulo MQTT con Proxy to Client, que usa el internet del celular | Cuando ningún gateway te escucha, o para enviar Map Reports (tu punto en el mapa con tu información) |

El Map Report lo envía solo tu propio nodo, así que necesita la forma B, con el módulo MQTT encendido.

### 7.2 Valores recomendados de PRMSH

| Ajuste | Valor |
|---|---|
| OK to MQTT (en LoRa) | Encendido |
| Uplink (en cada canal) | Encendido |
| Downlink (en cada canal) | Apagado, que es lo seguro para un puente |
| Root Topic | `msh/US/PR` |
| Map Report Interval | 1 hora (nodo móvil) |

Fuente: https://meshtastic.prmsh.com/settings/

### 7.3 El módulo MQTT (forma B)

| Ajuste en la app | Valor |
|---|---|
| Enabled | Encendido |
| Server Address | El broker que indique el operador de PRMSH, o el público, `mqtt.meshtastic.org` |
| Username / Password | Los que dé el operador de PRMSH. En el público: `meshdev` / `large4cats` |
| Encryption Enabled | Encendido |
| JSON Enabled | Apagado |
| TLS Enabled | Encendido con el broker público; con el de PRMSH, lo que indique el operador |
| Root Topic | `msh/US/PR` |
| Proxy to Client | Encendido |
| Map Reporting | Encendido, cada 1 hora |

Las credenciales de un broker privado son del operador. No las publiques ni las compartas en chats ni en repositorios.

### 7.4 Uplink y Downlink en cada canal

| Canal | Uplink | Downlink | Precisión de la posición |
|---|---|---|---|
| Primario (LongFast) | Encendido | Apagado | Aproximada, no exacta |
| Privado del grupo (con PSK propio) | Lo que acuerde el grupo | Apagado, salvo que lo coordines con el operador | La que acuerde el grupo |

**Por qué Downlink va apagado:** Downlink baja a la radio mensajes que vienen de internet. Si el broker no aplica la política zero-hop, esos mensajes se repiten por toda la malla con todos los saltos y la congestionan. Uplink solo sube, y no afecta la malla.

### 7.5 Android

1. Conecta el nodo por Bluetooth.
2. Settings → Radio Configuration → LoRa → OK to MQTT encendido → Save.
3. Settings → Module Configuration → MQTT:
   - Activa MQTT Enabled.
   - Llena Address, Username, Password y Root Topic = msh/US/PR.
   - Encryption Enabled encendido, JSON apagado y TLS según la tabla.
   - Activa Proxy to Client.
   - Activa Map Reporting, cada 1 hora.
   - Toca Save.
4. Settings → Channels → toca el canal primario → Uplink Enabled encendido, Downlink Enabled apagado → Save.
5. Para comprobarlo: la pantalla de MQTT muestra si el proxy del teléfono está activo. Desde ahí lo puedes apagar sin tocar la configuración del radio.

### 7.6 iOS, iPadOS y macOS

1. Conecta el nodo por Bluetooth.
2. Settings → LoRa → OK to MQTT encendido → Save.
3. Settings → Module Configuration → MQTT:
   - Activa Enabled.
   - Llena Address, Username, Password y Root Topic = msh/US/PR.
   - Encryption Enabled encendido, JSON apagado y TLS según la tabla.
   - Activa Proxy to Client.
   - Activa Map Reporting, cada 1 hora.
   - Toca Save.
4. Settings → Channels → escoge el canal primario → Uplink Enabled encendido, Downlink Enabled apagado → Save.
5. Para comprobarlo: el estado debe decir Uplink Only.

### 7.7 Qué usar según dónde estés

| Situación | OK to MQTT | Módulo MQTT con Proxy |
|---|---|---|
| En casa, con tu CLIENT_BASE como gateway | Sí | Opcional (solo para el Map Report) |
| Zona metro con gateways cerca | Sí | Opcional |
| Campo o montaña sin gateways cerca | Sí | Sí, si tienes señal celular y quieres salir en el mapa |
| Vieques, Culebra o fuera de PR, sin malla alrededor | Sí | Sí |

Proxy to Client gasta datos y batería del celular, y la app tiene que estar abierta o en segundo plano con el radio conectado. Si un gateway fijo ya te escucha, lo puedes apagar.

### 7.8 Comprueba que sales en la web

1. Abre `malla.prmsh.com` o `meshview.prmsh.com`.
2. Busca tu nodo por short name, long name o ID (`!xxxxxxxx`).
3. Puede tardar hasta el próximo Node Info o Map Report: hasta 1 hora con los valores de esta guía.
4. Si no sales, revisa en este orden:
   - OK to MQTT encendido.
   - Root Topic exactamente `msh/US/PR`.
   - Uplink encendido en el canal primario.
   - Proxy to Client activo en la app (si usas la forma B).
   - Que algún gateway te escuche (si usas solo la forma A).

## 8. Errores comunes

- **Poner un portátil en ROUTER, REPEATER o ROUTER_LATE.** Esos roles son para nodos fijos, altos y con energía permanente. En un portátil causan colisiones y rutas que desaparecen cuando te mueves. Además, REPEATER está obsoleto desde el firmware 2.7.11.
- **Subir el hop limit a más de 5 "para llegar más lejos".** Multiplica el tráfico en toda la isla. Usa 3; solo en el borde de la malla, hasta 5.
- **Poner todos los nodos del grupo en CLIENT** durante una actividad.
- **Enviar la posición cada 30 segundos sin smart broadcast.** Gasta tiempo de aire y batería.
- **Salir al campo con MUTE puesto.** Antes de una excursión, cámbialo a CLIENT.
- **Usar un preset distinto al de la comunidad.** Te quedas aislado sin darte cuenta.
- **Encender Downlink sin coordinarlo con el operador.** Sin zero-hop, inunda la malla.
- **Dejar OK to MQTT apagado** y después preguntar por qué no sales en malla.prmsh.com o meshview.prmsh.com.
- **Compartir tu posición exacta en el canal público con uplink.** Tu ubicación exacta termina en internet.

## 9. Checklist antes de salir

- [ ] Firmware 2.7.26 estable
- [ ] Región `US` y el mismo preset que la comunidad
- [ ] El rol que corresponde al escenario (sección 4)
- [ ] Hop limit en 3 (hasta 5 en el borde de la malla)
- [ ] Smart position en 100 m y 60 s; posición cada 1 h; telemetría cada 1 h; Neighbor Info cada 4 h
- [ ] Canales: el primario público y el privado del grupo, si hay
- [ ] Batería cargada o power bank
- [ ] Antena bien conectada (nunca transmitas sin antena)
- [ ] OK to MQTT encendido; Uplink encendido y Downlink apagado; root topic `msh/US/PR`
- [ ] Proxy to Client si no hay gateway cerca y quieres salir en el mapa
- [ ] Al regresar a casa: de vuelta a CLIENT_MUTE

## Referencias

- PRMSH, valores recomendados: https://meshtastic.prmsh.com/settings/
- Mapas web de la comunidad: `malla.prmsh.com` y `meshview.prmsh.com`
- Meshtastic, consejos de configuración (roles): https://meshtastic.org/docs/configuration/tips/
- Blog de Meshtastic, cómo escoger el rol: https://meshtastic.org/blog/choosing-the-right-device-role/
- Meshtastic, configuración de posición: https://meshtastic.org/docs/configuration/radio/position/
- Meshtastic para Android, ajustes de radio y usuario: https://meshtastic.org/docs/software/android/user/settings-radio-user/
- Meshtastic para Apple, ajustes: https://meshtastic.org/docs/software/apple/user/settings/
- Meshtastic, módulo MQTT: https://meshtastic.org/docs/configuration/module/mqtt/
- Meshtastic, integraciones MQTT (servidor público, zero-hop): https://meshtastic.org/docs/software/integrations/mqtt/
- Meshtastic para Android, MQTT: https://meshtastic.org/docs/software/android/user/mqtt/
- Meshtastic para Apple, MQTT: https://meshtastic.org/docs/software/apple/user/mqtt/

*73 de WP4TZV*
