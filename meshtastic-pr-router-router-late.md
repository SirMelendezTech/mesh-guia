# Meshtastic Puerto Rico — Nodos ROUTER y ROUTER_LATE

**Guía para nodos de infraestructura y para decidir cuándo un CLIENT puede convertirse en router**
Autor: WP4TZV · Malla: Puerto Rico (región US 902–928 MHz) · Firmware estable: **2.7.26** · Última revisión: noviembre 2026

---

## 1. Primero: los Favoritos en un ROUTER

En un ROUTER o ROUTER_LATE, los favoritos sirven para una sola cosa importante: **ahorrar saltos (hops) entre routers.** Eso se llama **Zero-Cost Hops** (firmware 2.7.11+).

### 1.1 Cómo funciona

Cada mensaje sale con un límite de saltos (normalmente 3). Cada vez que un nodo lo repite, se gasta un salto. Cuando llega a 0, nadie lo repite más.

Con Zero-Cost Hops, **un router no le resta el salto al mensaje** si se cumplen las 3 condiciones:

| # | Condición |
|---|---|
| 1 | El nodo que **recibe** el mensaje es **ROUTER, ROUTER_LATE o CLIENT_BASE**. |
| 2 | **No es el primer salto** del mensaje (el primer salto siempre cuesta). |
| 3 | El nodo que **lo repitió antes** está en los **favoritos** del que recibe **y es ROUTER o ROUTER_LATE**. Un CLIENT_BASE en el paso anterior **no cuenta**. |

Si falla cualquiera de las 3, el salto se gasta normal.

### 1.2 Ejemplo en PR

```
Handheld (Ponce) ──► ROUTER cerro sur ──► ROUTER cordillera ──► ROUTER cerro norte ──► CLIENT_BASE (Bayamón)
   sale con 3          gasta 1 (1er salto)    favorito: 0           favorito: 0            favorito: 0
                       quedan 2               quedan 2              quedan 2               quedan 2
```

Sin favoritos, ese mensaje se hubiera quedado sin saltos en el segundo router. Con favoritos mutuos entre los routers, **la cadena de cerros funciona como un backbone** y los 3 saltos quedan para los extremos de la malla (los clientes en los valles y las ciudades).

### 1.3 ¿Qué marcar como favorito en un ROUTER?

| ✅ Marca | ❌ No marques |
|---|---|
| Los **otros ROUTER / ROUTER_LATE** de la comunidad que este router **escucha directo** | Handhelds, nodos de casa, nodos de carro |
| Que **ellos también te marquen a ti** (favoritos mutuos) | Nodos que no escuchas directo |
| | CLIENT_BASE de vecinos (no ahorran salto como relevo anterior) |
| | "Todo lo que aparece" |

Reglas:
- **Mutuo:** marca el router vecino en el tuyo, y que el operador del vecino marque el tuyo. Así el ahorro funciona en las dos direcciones.
- **Pocos:** el campo que identifica al relevo es de solo 8 bits; con muchos favoritos en rango sube un poco la probabilidad de confundir un nodo con otro. Es raro y no causa daño, pero mantén la lista corta: solo routers que de verdad escuchas.
- **Los dueños de CLIENT_BASE** deben marcar como favoritos los ROUTER / ROUTER_LATE que escuchan directo desde su techo. Así el mensaje que viene del router no gasta un salto al llegar a su casa.
- **Prueba con traceroute** antes y después de marcar favoritos para confirmar que se ahorran saltos.

### 1.4 Marca los favoritos en sitio

Los favoritos se guardan en el nodo al que la app está conectada. Haz los favoritos **conectado por Bluetooth o USB al router, en sitio, antes de dejarlo instalado.** La administración remota de la app oficial cubre la configuración de Radio y Module, pero no siempre permite marcar favoritos a distancia.

---

## 2. Qué hacen ROUTER y ROUTER_LATE

### 2.1 Las tres ventanas de retransmisión

Cuando un nodo escucha un mensaje, espera un momento antes de repetirlo. Hay tres turnos:

| Turno | Quién lo usa | Qué pasa |
|---|---|---|
| **Temprano** | ROUTER, REPEATER, y CLIENT_BASE (solo para sus favoritos) | Repiten primero. Los demás que los escuchan pueden cancelar su repetición. |
| **Normal** | CLIENT y casi todos los demás | El turno estándar. |
| **Tarde** | Solo ROUTER_LATE | Solo si escuchó que otro ya lo repitió, espera al final y lo repite igual. |

Dentro de cada turno hay una espera al azar que se ajusta por la señal: **mientras más débil la señal (más lejos), más rápido repite.** Así cada salto llega lo más lejos posible.

### 2.2 ¿Quién cancela?

| Rol | Si escucha que otro ya repitió el mensaje… |
|---|---|
| **CLIENT** | Cancela. No lo repite. |
| **CLIENT_BASE** | Cancela, excepto el tráfico de sus favoritos. |
| **ROUTER** | **Nunca cancela.** Repite siempre, y además primero. |
| **ROUTER_LATE** | **No cancela.** Lo pospone al turno tarde y lo repite igual. |

### 2.3 Comparación

| | CLIENT | CLIENT_BASE | **ROUTER** | **ROUTER_LATE** |
|---|---|---|---|---|
| Turno | Normal | Temprano (favoritos) / Normal | **Temprano** | Normal → **Tarde** |
| Repite siempre | ❌ | Solo favoritos | ✅ | ✅ |
| Hace que otros cancelen | ❌ | Solo favoritos | ✅ **a todos en su área** | ❌ |
| Ahorra salto con routers favoritos | ❌ | ✅ | ✅ | ✅ |
| Uso de airtime | Bajo | Bajo | Alto | Alto |
| Sitio ideal | Cualquiera | Techo de tu casa | **Cima de montaña / torre alta** | **Hueco de cobertura** (valle, detrás de un cerro) |

### 2.4 La diferencia en una línea

- **ROUTER:** "Yo veo a todo el mundo; déjenme repetir primero a mí." → Cima de montaña.
- **ROUTER_LATE:** "Yo soy la única salida de este grupo; si nadie más lo repite, lo repito yo, y si alguien lo repite, lo repito también al final." → Fondo de valle o detrás de un cerro.

---

## 3. ¿Cuándo un CLIENT se puede convertir en ROUTER o ROUTER_LATE?

**Por defecto: nunca.** Casi todos los nodos deben ser CLIENT, CLIENT_MUTE o CLIENT_BASE. Un nodo se gana el rol de router con datos, no con ganas.

### 3.1 Requisitos para cualquier router (los dos roles)

Todos tienen que cumplirse:

- [ ] **Fijo.** No se mueve. Nada de carros, mochilas ni handhelds.
- [ ] **Energía permanente.** Solar con batería para varios días nublados, o AC con respaldo. Debe sobrevivir apagones y huracanes.
- [ ] **Hardware confiable** en caja sellada, con antena exterior y cable de baja pérdida.
- [ ] **Firmware 2.7.26 estable.**
- [ ] **Administración remota configurada** (Admin Keys de 2–3 operadores) antes de instalarlo. Ver sección 8 de la guía CLIENT_BASE.
- [ ] **Datos reales** de al menos 2–4 semanas operando como CLIENT en ese mismo sitio (vecinos, SNR, traceroutes).
- [ ] **Coordinado con la comunidad de PR.** Un router afecta a todos los nodos que lo escuchan.

### 3.2 CLIENT → ROUTER

Solo si **todo** esto es cierto:

- [ ] Es un **sitio estratégico de verdad**: cima de montaña o torre alta con línea de vista amplia. Una cima de montaña es mejor que un edificio alto.
- [ ] Un **análisis de línea de vista** (viewshed) muestra que cubre un área grande.
- [ ] Como CLIENT, **escucha muchos nodos directo y muchos nodos lo escuchan a él.** Es un "hub" natural.
- [ ] **No hay otro ROUTER** cubriendo la misma zona. Dos routers que se escuchan entre sí con la misma cobertura solo suman colisiones.
- [ ] Mejora la malla para todos, no solo para ti.

**Por qué tanto cuidado:** un ROUTER hace que **todos los nodos en su área cancelen** su repetición. Si está mal ubicado:
- **Gasta los saltos** antes de que el mensaje llegue a nodos mejor ubicados.
- **Enlaces de una sola vía:** el grupo A llega al grupo B, pero la respuesta no regresa porque se acabaron los saltos. La gente responde subiendo el hop limit y empeora la congestión.
- **Colisiones:** varios routers vecinos repitiendo a la vez generan ruido y mensajes perdidos.

### 3.3 CLIENT → ROUTER_LATE

Solo si **todo** esto es cierto:

- [ ] Hay un **grupo de nodos que no ve ningún router** (detrás de un cerro, en el fondo de un valle o cañón).
- [ ] Este nodo es **la salida necesaria** de ese grupo hacia el resto de la malla.
- [ ] El sitio **no es lo bastante bueno para ROUTER**, pero es crítico para esa zona.
- [ ] La malla en esa área **no está congestionada**: **ChUtil < ~25 %** y **AirUtilTX < ~7–8 %**.

**No uses ROUTER_LATE para:**
- ❌ Tu techo en la ciudad para extender tu alcance → usa **CLIENT_BASE**.
- ❌ Un carro de forma permanente. Solo temporalmente para darle salida a un grupo de excursión sin cobertura, y lo devuelves a CLIENT después.
- ❌ Un nodo que no escucha a nadie: ROUTER_LATE no arregla una mala antena.

### 3.4 Diagrama de decisión

```
¿El nodo es fijo, con energía permanente y remote admin?
 └─ No → CLIENT / CLIENT_MUTE / CLIENT_BASE. Fin.
 └─ Sí
     ¿Es solo para extender TU alcance (tu casa, tus nodos)?
      └─ Sí → CLIENT_BASE. Fin.
      └─ No
          ¿Tienes 2–4 semanas de datos como CLIENT en ese sitio?
           └─ No → Sigue en CLIENT y recoge datos.
           └─ Sí
               ¿Cima / torre alta, línea de vista amplia, hub natural,
                sin otro router en la zona, coordinado con la comunidad?
                └─ Sí → ROUTER
                └─ No
                    ¿Hay un grupo de nodos detrás de un cerro / en un valle
                     que solo sale por este nodo, y la malla no está congestionada?
                     └─ Sí → ROUTER_LATE
                     └─ No → CLIENT (o CLIENT_BASE). Fin.
```

---

## 4. Contexto de Puerto Rico

- **PR no tiene backbone.** Muchos nodos de torre y costa están en CLIENT. Eso no es malo: es mejor que tener routers mal ubicados.
- **El potencial de backbone** está en la Cordillera Central y los cerros altos. Una cadena de ROUTER bien ubicados, **con favoritos mutuos**, podría cruzar la isla sin gastar los saltos de los usuarios.
- **Huecos naturales para ROUTER_LATE:** valles del interior, la zona del carso (mogotes) y comunidades detrás de cerros que no ven ningún router.
- **Ciudades y la zona metro:** casi nunca necesitan routers. Ahí la solución es CLIENT_BASE en los techos.
- **LongFast es lento:** cada repetición extra pesa. En una malla en LongFast, retransmisiones de más causan colisiones y mensajes perdidos.

### Herramientas para recoger datos antes de promover un nodo
- **Mapas web de PRMSH** (`malla.prmsh.com` y `meshview.prmsh.com`): vecinos, SNR, utilización del canal. El nodo candidato necesita **OK to MQTT** y **Neighbor Info** encendidos para que sus datos aparezcan.
- **Traceroutes** desde varios puntos de la isla hacia el candidato.
- **Análisis de línea de vista** (viewshed) del sitio.
- Lecturas de **ChUtil** y **AirUtilTX** del propio nodo en la app.

---

## 5. Proceso para promover un nodo

1. **Recoge datos (2–4 semanas como CLIENT).** Anota vecinos directos, SNR, ChUtil, AirUtilTX y traceroutes desde y hacia el sitio.
2. **Haz el análisis de línea de vista.** Confirma qué zonas cubre de verdad.
3. **Preséntalo a la comunidad.** Comparte los datos y confirma que no hay otro router cubriendo esa zona.
4. **Configura en sitio** (sección 6): Admin Keys, favoritos de los routers vecinos, posición fija, PIN de Bluetooth.
5. **Cambia el rol** a ROUTER o ROUTER_LATE.
6. **Coordina favoritos mutuos** con los operadores de los routers vecinos.
7. **Monitorea 1–2 semanas** (sección 7). Si hay problemas, regrésalo a CLIENT.

---

## 6. Configuración en la app

> Hazlo **en sitio, conectado directo al nodo** por Bluetooth o USB. Los nombres de menú pueden variar un poco según la versión de la app.

### 6.1 Valores recomendados

Intervalos para nodos **fijos** tomados de las recomendaciones de PRMSH (https://meshtastic.prmsh.com/settings/). Hop limit: `3`, **nunca más de 5**.

| Sección | Ajuste | ROUTER | ROUTER_LATE |
|---|---|---|---|
| Device | **Role** | `Router` | `Router Late` |
| Device | **Rebroadcast Mode** | `All` | `All` |
| Device | **Node Info Broadcast Interval** | 6 horas | 6 horas |
| LoRa | **Region** | `US` | `US` |
| LoRa | **Modem Preset** | El de la comunidad | El de la comunidad |
| LoRa | **Hop Limit** | `3` | `3` |
| LoRa | **TX Power** | `0` (máximo permitido) | `0` (máximo permitido) |
| LoRa | **OK to MQTT** | Encendido (para aparecer en la web) | Encendido (para aparecer en la web) |
| Position | **Fixed Position** | Encendido | Encendido |
| Position | **Smart Position** | Apagado | Apagado |
| Position | **Position Broadcast Interval** | 12 horas | 12 horas |
| Position | **GPS Update Interval** | 6 horas | 6 horas |
| Position | **Position Flags** | Altitude ✅ · Altitude MSL ✅ · Speed ❌ · Heading ❌ · Sats in View ❌ · Geoidal Separation ✅ | Igual |
| Telemetry | **Device / Environment Metrics** | 6 horas | 6 horas |
| Telemetry | **Power Metrics** | 1 hora (solar) | 1 hora (solar) |
| Neighbor Info | **Enabled** + **Transmit Over LoRa** | Encendido · 11 horas | Encendido · 11 horas |
| MQTT | **Módulo MQTT** | Apagado (el router se enfoca en RF; un gateway cercano lo sube gracias a OK to MQTT) | Apagado |
| Security | **Admin Keys** | 2–3 operadores | 2–3 operadores |
| Bluetooth | **Pairing Mode** | Fixed PIN propio | Fixed PIN propio |

### 6.2 Android

1. Conecta la app al nodo por Bluetooth (en sitio).
2. **Settings → Security** → agrega las **Admin Keys** de los operadores → **Save**.
3. **Nodes** → marca como **favoritos** los ROUTER / ROUTER_LATE vecinos que escucha directo.
4. **Settings → Radio Configuration → LoRa** → Region `US`, preset, **Hop Limit 3**, TX Power → **Save**.
5. **Settings → Radio Configuration → Position** → **Fixed Position** encendido, Smart Position apagado, intervalo largo → **Save**.
6. **Settings → Radio Configuration → Bluetooth** → **Fixed PIN** → **Save**.
7. **Settings → Module Configuration → Telemetry** → Device/Environment 6 horas, Power 1 hora → **Save**.
8. **Settings → Module Configuration → Neighbor Info** → **Enabled** y **Transmit Over LoRa**, 11 horas → **Save**.
9. **Último paso:** **Settings → Radio Configuration → Device** → **Role = Router** o **Router Late** → **Save**.
10. Desde tu handheld, prueba la **Remote Administration** antes de irte del sitio.

### 6.3 iOS / iPadOS / macOS

1. Conecta la app al nodo por Bluetooth (en sitio). Si tienes varios nodos, selecciónalo en **Configure**.
2. **Settings → App Settings** → **Administration** encendido.
3. **Settings → Radio Configuration → Security** → agrega las **Admin Keys** → **Save**.
4. **Nodes** → marca como **Favorite** los ROUTER / ROUTER_LATE vecinos que escucha directo.
5. **Settings → LoRa** → Region `United States`, preset, **Number of Hops = 3**, Transmit Power → **Save**.
6. **Settings → Position** → **Fixed Position** encendido, Smart Position apagado, intervalo largo → **Save**.
7. **Settings → Bluetooth** → **Fixed PIN** → **Save**.
8. **Settings → Module Configuration → Telemetry** → Device/Environment 6 horas, Power 1 hora → **Save**.
9. **Settings → Module Configuration → Neighbor Info** → **Enabled** y **Transmit Over LoRa**, 11 horas → **Save**.
10. **Último paso:** **Settings → Radio Configuration → Device** → **Device Role = Router** o **Router Late** → **Save**.
11. Desde tu handheld, prueba la **Remote Administration** antes de irte del sitio.

> **¿Por qué el rol al final?** Los routers intentan dormir más para ahorrar energía. En algunos equipos eso puede hacer la conexión Bluetooth menos estable. Deja todo configurado antes de cambiar el rol.

---

## 7. Monitoreo y cuándo dar marcha atrás

Revisa en la app (y en `malla.prmsh.com` / `meshview.prmsh.com`) durante las primeras 1–2 semanas:

| Indicador | Bien | Alerta → regresa a CLIENT |
|---|---|---|
| **ChUtil** (uso del canal en la zona) | < 25 % | > 25 % sostenido |
| **AirUtilTX** (uso del propio nodo) | < 7–8 % | > 8 % sostenido |
| Traceroutes de ida y vuelta | Llegan en los dos sentidos | Llegan de ida pero no regresan |
| Saltos usados entre extremos | Igual o menos que antes | Más que antes |
| Mensajes perdidos reportados por la comunidad | Igual o menos | Más |

Notas:
- Un **ROUTER_LATE puede no aparecer en los traceroutes**: muchas veces otro nodo repite primero y el mensaje llega por otra ruta. Eso es normal.
- En una malla ocupada, el ROUTER_LATE tiende a **perder mensajes de la cola** porque los guarda esperando el turno tarde. Si ves eso, la zona está demasiado congestionada para ese rol.
- El ROUTER_LATE puede **hacer más lentos** los mensajes, sobre todo en LongFast.

**Dar marcha atrás no es fracasar.** Si los números no salen, el nodo vuelve a CLIENT o CLIENT_BASE y sigue ayudando.

---

## 8. Errores comunes

- ❌ **ROUTER en el techo de tu casa en la ciudad.** Usa CLIENT_BASE.
- ❌ **ROUTER_LATE en el techo "para llegar más lejos".** Usa CLIENT_BASE.
- ❌ **ROUTER o ROUTER_LATE en un carro o handheld.**
- ❌ **Promover un nodo sin datos** de varias semanas como CLIENT.
- ❌ **Dos ROUTER que se escuchan y cubren la misma zona.**
- ❌ **Router sin favoritos de los routers vecinos.** Pierdes los Zero-Cost Hops.
- ❌ **Favoritos de un solo lado** entre routers. Haz los favoritos mutuos.
- ❌ **Marcar handhelds o nodos de casa como favoritos en el router.** No ahorran saltos y llenan la lista.
- ❌ **Subir el hop limit** porque "es infraestructura". Sigue en 3, nunca más de 5.
- ❌ **OK to MQTT apagado.** El router no aparece en `malla.prmsh.com` / `meshview.prmsh.com` y no puedes monitorearlo.
- ❌ **Instalar el router sin Admin Keys.** Cada cambio te obliga a subir la montaña.
- ❌ **No coordinar con la comunidad.** Un router afecta a todos los que lo escuchan.
- ❌ **Usar REPEATER.** Está deprecado desde 2.7.11.

---

## 9. Checklist de promoción

**Antes**
- [ ] 2–4 semanas de datos como CLIENT en el sitio
- [ ] Análisis de línea de vista
- [ ] ChUtil < 25 % y AirUtilTX < 7–8 % en la zona
- [ ] Confirmado que no hay otro router cubriendo lo mismo
- [ ] Aprobado / coordinado con la comunidad de PR

**En sitio**
- [ ] Firmware **2.7.26**
- [ ] Energía permanente con respaldo, caja sellada, antena exterior
- [ ] Admin Keys de 2–3 operadores
- [ ] Favoritos: solo los ROUTER / ROUTER_LATE vecinos que escucha directo
- [ ] Posición fija, Smart Position apagado, intervalos largos
- [ ] Bluetooth con Fixed PIN propio
- [ ] OK to MQTT y Neighbor Info encendidos; módulo MQTT apagado
- [ ] Intervalos fijos de PRMSH: Node Info 6 h · Position 12 h · Telemetry 6 h · Neighbor Info 11 h
- [ ] Rol cambiado **al final**
- [ ] Remote Administration probada desde un handheld antes de irte

**Después**
- [ ] Favoritos mutuos confirmados con los operadores vecinos
- [ ] Traceroutes antes/después comparados
- [ ] 1–2 semanas de monitoreo de ChUtil / AirUtilTX
- [ ] El router aparece en `malla.prmsh.com` / `meshview.prmsh.com`
- [ ] Plan de marcha atrás si los números no salen

---

## Referencias

- PRMSH — Recommended Settings: https://meshtastic.prmsh.com/settings/
- Mapas web de la comunidad: `malla.prmsh.com` · `meshview.prmsh.com`
- Meshtastic Blog — Zero-Cost Hops for Favorite Routers: https://meshtastic.org/blog/zero-cost-hops-favorite-routers/
- Meshtastic Blog — Demystifying ROUTER_LATE: https://meshtastic.org/blog/demystifying-router-late/
- Meshtastic Blog — Choosing the Right Device Role: https://meshtastic.org/blog/choosing-the-right-device-role/
- Meshtastic — Configuration Tips (Roles): https://meshtastic.org/docs/configuration/tips/
- Meshtastic — Remote Node Administration: https://meshtastic.org/docs/configuration/remote-admin/
- Meshtastic Firmware 2.7.26 release: https://github.com/meshtastic/firmware/releases/tag/v2.7.26.54e0d8d
- Guías relacionadas: `meshtastic-pr-cliente-vs-mute.md`, `meshtastic-pr-client-base.md`

*73 de WP4TZV*
