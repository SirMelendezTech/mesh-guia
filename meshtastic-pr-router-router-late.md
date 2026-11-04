# Nodos ROUTER y ROUTER_LATE de Meshtastic en Puerto Rico

Para nodos de infraestructura, y para decidir cuándo un CLIENT puede pasar a ser router.

- Autor: WP4TZV
- Malla: Puerto Rico, región US (902–928 MHz)
- Firmware estable: **2.7.26**
- Última revisión: noviembre 2026

## 1. Primero, los favoritos en un ROUTER

En un ROUTER o ROUTER_LATE, los favoritos sirven sobre todo para una cosa: ahorrar saltos (hops) entre routers. Eso se llama Zero-Cost Hops y funciona desde el firmware 2.7.11.

### 1.1 Cómo funciona

Cada mensaje sale con un límite de saltos, normalmente 3. Cada vez que un nodo lo repite, se gasta un salto. Cuando llega a 0, nadie lo repite más.

Con Zero-Cost Hops, un router no le resta el salto al mensaje si se cumplen estas 3 condiciones:

| | Condición |
|---|---|
| 1 | El nodo que recibe el mensaje es ROUTER, ROUTER_LATE o CLIENT_BASE |
| 2 | No es el primer salto del mensaje (el primer salto siempre cuenta) |
| 3 | El nodo que lo repitió antes está en los favoritos del que lo recibe, y es ROUTER o ROUTER_LATE. Un CLIENT_BASE en el paso anterior no cuenta |

Si falla cualquiera de las 3, el salto se gasta como siempre.

### 1.2 Un ejemplo en PR

```
Portátil (Ponce) ──► ROUTER cerro sur ──► ROUTER cordillera ──► ROUTER cerro norte ──► CLIENT_BASE (Bayamón)
   sale con 3          gasta 1 (1er salto)    favorito: 0           favorito: 0            favorito: 0
                       quedan 2               quedan 2              quedan 2               quedan 2
```

Sin favoritos, ese mensaje se habría quedado sin saltos en el segundo router. Con favoritos mutuos entre los routers, la cadena de cerros funciona como un backbone, y los 3 saltos quedan para las puntas de la malla: los clientes en los valles y en las ciudades.

### 1.3 Qué marcar como favorito en un ROUTER

| Márcalos | No los marques |
|---|---|
| Los otros ROUTER y ROUTER_LATE de la comunidad que este router escucha directo | Portátiles, nodos de casa, nodos de carro |
| Y pide que ellos también te marquen a ti (favoritos mutuos) | Nodos que no escuchas directo |
| | El CLIENT_BASE de un vecino (como relevo anterior no ahorra salto) |
| | Todo lo que aparece en la lista |

- **Que sea mutuo.** Marca el router vecino en el tuyo, y que su operador marque el tuyo. Así el ahorro funciona en las dos direcciones.
- **Que sean pocos.** El campo que identifica al relevo tiene solo 8 bits, y con muchos favoritos al alcance sube un poco la probabilidad de confundir un nodo con otro. Es raro y no hace daño, pero mantén la lista corta: solo los routers que de verdad escuchas.
- **Los dueños de un CLIENT_BASE** deben marcar como favoritos los ROUTER y ROUTER_LATE que escuchan directo desde su techo. Así el mensaje que llega desde el router no gasta un salto al entrar a su casa.
- **Haz un traceroute** antes y después de marcar los favoritos para confirmar que se ahorran saltos.

### 1.4 Marca los favoritos en el sitio

Los favoritos se guardan en el nodo al que está conectada la app. Márcalos conectado al router por Bluetooth o USB, en el sitio, antes de dejarlo instalado. La administración remota de la app oficial cubre la configuración de Radio y de Module, pero no siempre deja marcar favoritos a distancia.

## 2. Qué hacen ROUTER y ROUTER_LATE

### 2.1 Los tres turnos para retransmitir

Cuando un nodo escucha un mensaje, espera un momento antes de repetirlo. Hay tres turnos:

| Turno | Quién lo usa | Qué pasa |
|---|---|---|
| Temprano | ROUTER, REPEATER y CLIENT_BASE (este último solo con sus favoritos) | Repiten primero. Los que los escuchan pueden cancelar su propia repetición |
| Normal | CLIENT y casi todos los demás | El turno de siempre |
| Tarde | Solo ROUTER_LATE | Aunque haya escuchado que otro ya lo repitió, espera al final y lo repite igual |

Dentro de cada turno hay una espera al azar que depende de la señal: mientras más débil la señal (más lejos está quien lo envió), más rápido repite. Así cada salto llega lo más lejos posible.

### 2.2 Quién cancela

| Rol | Si escucha que otro ya repitió el mensaje… |
|---|---|
| CLIENT | Cancela y no lo repite |
| CLIENT_BASE | Cancela, menos con el tráfico de sus favoritos |
| ROUTER | Nunca cancela. Siempre repite, y además lo hace primero |
| ROUTER_LATE | No cancela. Lo pasa al turno tarde y lo repite igual |

### 2.3 Comparación

| | CLIENT | CLIENT_BASE | ROUTER | ROUTER_LATE |
|---|---|---|---|---|
| Turno | Normal | Temprano con sus favoritos, normal con el resto | Temprano | Normal, y luego tarde |
| Siempre repite | No | Solo a sus favoritos | Sí | Sí |
| Hace que otros cancelen | No | Solo con sus favoritos | Sí, a todos en su área | No |
| Ahorra salto con routers favoritos | No | Sí | Sí | Sí |
| Uso del tiempo de aire | Bajo | Bajo | Alto | Alto |
| Sitio ideal | Cualquiera | El techo de tu casa | La cima de una montaña o una torre alta | Un hueco de cobertura (un valle, detrás de un cerro) |

### 2.4 La diferencia en pocas palabras

- **ROUTER:** "Yo veo a todo el mundo; déjenme repetir primero." Va en la cima de una montaña.
- **ROUTER_LATE:** "Soy la única salida de este grupo. Si nadie lo repite, lo repito yo; y si alguien lo repite, lo repito también al final." Va en el fondo de un valle o detrás de un cerro.

## 3. Cuándo un CLIENT puede pasar a ROUTER o ROUTER_LATE

En principio, nunca. Casi todos los nodos deben ser CLIENT, CLIENT_MUTE o CLIENT_BASE. Un nodo se gana el rol de router con datos, no con ganas.

### 3.1 Requisitos para cualquier router

Tienen que cumplirse todos:

- [ ] **Fijo.** No se mueve: nada de carros, mochilas ni portátiles.
- [ ] **Energía permanente.** Solar con batería para varios días nublados, o corriente con respaldo. Tiene que aguantar apagones y huracanes.
- [ ] **Hardware confiable** en caja sellada, con antena exterior y cable de baja pérdida.
- [ ] **Firmware 2.7.26 estable.**
- [ ] **Administración remota configurada** antes de instalarlo, con las Admin Keys de 2 o 3 operadores. Ver la sección 8 de la guía de CLIENT_BASE.
- [ ] **Datos reales** de por lo menos 2 a 4 semanas funcionando como CLIENT en ese mismo sitio: vecinos, SNR y traceroutes.
- [ ] **Coordinado con la comunidad de PR.** Un router afecta a todos los nodos que lo escuchan.

### 3.2 De CLIENT a ROUTER

Solo si todo esto es cierto:

- [ ] Es un sitio estratégico de verdad: la cima de una montaña o una torre alta con línea de vista amplia. Una cima de montaña es mejor que un edificio alto.
- [ ] Un análisis de línea de vista (viewshed) muestra que cubre un área grande.
- [ ] Como CLIENT, escucha a muchos nodos directo y muchos nodos lo escuchan a él. Ya funciona como punto de reunión.
- [ ] No hay otro ROUTER cubriendo la misma zona. Dos routers que se escuchan entre sí y cubren lo mismo solo suman colisiones.
- [ ] Mejora la malla para todos, no solo para ti.

Por qué tanto cuidado: un ROUTER hace que todos los nodos de su área cancelen su repetición. Si está mal ubicado:

- **Gasta los saltos** antes de que el mensaje llegue a nodos mejor ubicados.
- **Crea enlaces de una sola vía:** el grupo A llega al grupo B, pero la respuesta no regresa porque se acabaron los saltos. La gente reacciona subiendo el hop limit, y la congestión empeora.
- **Causa colisiones:** varios routers vecinos repitiendo a la vez generan ruido y mensajes perdidos.

### 3.3 De CLIENT a ROUTER_LATE

Solo si todo esto es cierto:

- [ ] Hay un grupo de nodos que no ve ningún router: detrás de un cerro, en el fondo de un valle o de un cañón.
- [ ] Este nodo es la salida que ese grupo necesita hacia el resto de la malla.
- [ ] El sitio no es lo bastante bueno para ROUTER, pero es clave para esa zona.
- [ ] La malla en esa área no está congestionada: ChUtil por debajo de 25 % y AirUtilTX por debajo de 7–8 %, más o menos.

No uses ROUTER_LATE para:

- **Extender tu alcance desde tu techo en la ciudad.** Para eso está CLIENT_BASE.
- **Un carro de forma permanente.** Solo de forma temporal, para darle salida a un grupo de excursión sin cobertura; después lo devuelves a CLIENT.
- **Un nodo que no escucha a nadie.** ROUTER_LATE no arregla una mala antena.

### 3.4 Diagrama de decisión

```
¿El nodo es fijo, con energía permanente y administración remota?
 └─ No → CLIENT / CLIENT_MUTE / CLIENT_BASE. Fin.
 └─ Sí
     ¿Es solo para extender TU alcance (tu casa, tus nodos)?
      └─ Sí → CLIENT_BASE. Fin.
      └─ No
          ¿Tienes 2 a 4 semanas de datos como CLIENT en ese sitio?
           └─ No → Déjalo en CLIENT y recoge datos.
           └─ Sí
               ¿Cima o torre alta, línea de vista amplia, punto de reunión natural,
                sin otro router en la zona y coordinado con la comunidad?
                └─ Sí → ROUTER
                └─ No
                    ¿Hay un grupo de nodos detrás de un cerro o en un valle
                     que solo sale por este nodo, y la malla no está congestionada?
                     └─ Sí → ROUTER_LATE
                     └─ No → CLIENT (o CLIENT_BASE). Fin.
```

## 4. La malla en Puerto Rico

- **PR no tiene backbone.** Muchos nodos de torre y de costa están en CLIENT. No es un problema: es mejor eso que tener routers mal ubicados.
- **Dónde podría estar el backbone:** en la Cordillera Central y los cerros altos. Una cadena de ROUTERs bien ubicados, con favoritos mutuos, podría cruzar la isla sin gastar los saltos de los usuarios.
- **Huecos naturales para ROUTER_LATE:** los valles del interior, la zona del carso (los mogotes) y las comunidades detrás de cerros que no ven ningún router.
- **Las ciudades y el área metro** casi nunca necesitan routers. Ahí la solución es un CLIENT_BASE en cada techo.
- **LongFast es lento,** así que cada repetición de más pesa. En una malla con LongFast, las retransmisiones que sobran causan colisiones y mensajes perdidos.

### Herramientas para recoger datos antes de promover un nodo

- **Los mapas web de PRMSH** (`malla.prmsh.com` y `meshview.prmsh.com`): vecinos, SNR y uso del canal. El nodo candidato necesita OK to MQTT y Neighbor Info encendidos para que salgan sus datos.
- **Traceroutes** hacia el candidato desde varios puntos de la isla.
- **Un análisis de línea de vista** (viewshed) del sitio.
- **Las lecturas de ChUtil y AirUtilTX** del propio nodo en la app.

## 5. Cómo promover un nodo

1. **Recoge datos durante 2 a 4 semanas como CLIENT.** Anota los vecinos directos, el SNR, ChUtil, AirUtilTX y los traceroutes desde el sitio y hacia él.
2. **Haz el análisis de línea de vista.** Confirma qué zonas cubre de verdad.
3. **Preséntalo a la comunidad.** Comparte los datos y confirma que no hay otro router cubriendo esa zona.
4. **Configúralo en el sitio** (sección 6): Admin Keys, favoritos de los routers vecinos, posición fija y PIN de Bluetooth.
5. **Cambia el rol** a ROUTER o ROUTER_LATE.
6. **Coordina los favoritos mutuos** con los operadores de los routers vecinos.
7. **Vigílalo durante 1 o 2 semanas** (sección 7). Si hay problemas, devuélvelo a CLIENT.

## 6. Configuración en la app

Hazlo en el sitio, conectado directo al nodo por Bluetooth o USB. Los nombres de los menús cambian un poco según la versión de la app.

### 6.1 Valores recomendados

Intervalos para nodos fijos, tomados de las recomendaciones de PRMSH (https://meshtastic.prmsh.com/settings/). Hop limit: `3`, y nunca más de 5.

| Sección | Ajuste | ROUTER | ROUTER_LATE |
|---|---|---|---|
| Device | Role | `Router` | `Router Late` |
| Device | Rebroadcast Mode | `All` | `All` |
| Device | Node Info Broadcast Interval | 6 horas | 6 horas |
| LoRa | Region | `US` | `US` |
| LoRa | Modem Preset | El de la comunidad | El de la comunidad |
| LoRa | Hop Limit | `3` | `3` |
| LoRa | TX Power | `0` (el máximo permitido) | `0` (el máximo permitido) |
| LoRa | OK to MQTT | Encendido, para salir en la web | Encendido, para salir en la web |
| Position | Fixed Position | Encendido | Encendido |
| Position | Smart Position | Apagado | Apagado |
| Position | Position Broadcast Interval | 12 horas | 12 horas |
| Position | GPS Update Interval | 6 horas | 6 horas |
| Position | Position Flags | Encendidos: Altitude, Altitude MSL, Geoidal Separation. Apagados: Speed, Heading, Sats in View | Igual |
| Telemetry | Device y Environment Metrics | 6 horas | 6 horas |
| Telemetry | Power Metrics | 1 hora (equipos solares) | 1 hora (equipos solares) |
| Neighbor Info | Enabled y Transmit Over LoRa | Encendidos, cada 11 horas | Encendidos, cada 11 horas |
| MQTT | Módulo MQTT | Apagado. El router se dedica a la radio, y un gateway cercano sube sus paquetes gracias a OK to MQTT | Apagado |
| Security | Admin Keys | De 2 o 3 operadores | De 2 o 3 operadores |
| Bluetooth | Pairing Mode | Fixed PIN propio | Fixed PIN propio |

### 6.2 Android

1. Conecta la app al nodo por Bluetooth, en el sitio.
2. Settings → Security → añade las Admin Keys de los operadores → Save.
3. En Nodes, marca como favoritos los ROUTER y ROUTER_LATE vecinos que escucha directo.
4. Settings → Radio Configuration → LoRa → Region `US`, el preset, Hop Limit 3 y TX Power → Save.
5. Settings → Radio Configuration → Position → Fixed Position encendido, Smart Position apagado e intervalo largo → Save.
6. Settings → Radio Configuration → Bluetooth → Fixed PIN → Save.
7. Settings → Module Configuration → Telemetry → Device y Environment cada 6 horas, Power cada 1 hora → Save.
8. Settings → Module Configuration → Neighbor Info → Enabled y Transmit Over LoRa, cada 11 horas → Save.
9. Por último: Settings → Radio Configuration → Device → Role = Router o Router Late → Save.
10. Desde tu portátil, prueba la Remote Administration antes de irte del sitio.

### 6.3 iOS, iPadOS y macOS

1. Conecta la app al nodo por Bluetooth, en el sitio. Si tienes varios nodos, escógelo en Configure.
2. Settings → App Settings → Administration encendido.
3. Settings → Radio Configuration → Security → añade las Admin Keys → Save.
4. En Nodes, marca como Favorite los ROUTER y ROUTER_LATE vecinos que escucha directo.
5. Settings → LoRa → Region `United States`, el preset, Number of Hops = 3 y Transmit Power → Save.
6. Settings → Position → Fixed Position encendido, Smart Position apagado e intervalo largo → Save.
7. Settings → Bluetooth → Fixed PIN → Save.
8. Settings → Module Configuration → Telemetry → Device y Environment cada 6 horas, Power cada 1 hora → Save.
9. Settings → Module Configuration → Neighbor Info → Enabled y Transmit Over LoRa, cada 11 horas → Save.
10. Por último: Settings → Radio Configuration → Device → Device Role = Router o Router Late → Save.
11. Desde tu portátil, prueba la Remote Administration antes de irte del sitio.

**Por qué el rol va al final:** los routers intentan dormir más para ahorrar energía, y en algunos equipos eso hace que la conexión Bluetooth sea menos estable. Deja todo configurado antes de cambiar el rol.

## 7. Qué vigilar y cuándo dar marcha atrás

Durante las primeras 1 o 2 semanas, revisa en la app (y en `malla.prmsh.com` o `meshview.prmsh.com`):

| Indicador | Bien | Mal: devuélvelo a CLIENT |
|---|---|---|
| ChUtil (uso del canal en la zona) | Menos de 25 % | Más de 25 % todo el tiempo |
| AirUtilTX (uso del propio nodo) | Menos de 7–8 % | Más de 8 % todo el tiempo |
| Traceroutes de ida y vuelta | Llegan en los dos sentidos | Llegan de ida pero no regresan |
| Saltos usados de punta a punta | Iguales o menos que antes | Más que antes |
| Mensajes perdidos que reporta la comunidad | Igual o menos | Más |

- **Un ROUTER_LATE puede no salir en los traceroutes.** Muchas veces otro nodo repite primero y el mensaje llega por otra ruta. Es normal.
- **En una malla ocupada, el ROUTER_LATE tiende a perder mensajes de la cola,** porque los guarda esperando el turno tarde. Si ves eso, la zona está demasiado congestionada para ese rol.
- **El ROUTER_LATE puede hacer más lentos los mensajes,** sobre todo con LongFast.

Dar marcha atrás no es un fracaso. Si los números no dan, el nodo vuelve a CLIENT o CLIENT_BASE y sigue ayudando.

## 8. Errores comunes

- **Poner un ROUTER en el techo de tu casa en la ciudad.** Usa CLIENT_BASE.
- **Poner un ROUTER_LATE en el techo "para llegar más lejos".** Usa CLIENT_BASE.
- **Poner ROUTER o ROUTER_LATE en un carro o en un portátil.**
- **Promover un nodo sin varias semanas de datos** como CLIENT.
- **Tener dos ROUTER que se escuchan y cubren la misma zona.**
- **Un router sin los routers vecinos en favoritos.** Pierdes los Zero-Cost Hops.
- **Favoritos de un solo lado entre routers.** Hazlos mutuos.
- **Marcar portátiles o nodos de casa como favoritos en el router.** No ahorran saltos y llenan la lista.
- **Subir el hop limit "porque es infraestructura".** Se queda en 3, y nunca más de 5.
- **Dejar OK to MQTT apagado.** El router no sale en `malla.prmsh.com` ni en `meshview.prmsh.com`, y no puedes vigilarlo.
- **Instalar el router sin Admin Keys.** Cada cambio te obliga a subir la montaña.
- **No coordinar con la comunidad.** Un router afecta a todos los que lo escuchan.
- **Usar REPEATER.** Está obsoleto desde la 2.7.11.

## 9. Checklist para promover un nodo

**Antes**

- [ ] 2 a 4 semanas de datos como CLIENT en el sitio
- [ ] Análisis de línea de vista
- [ ] ChUtil por debajo de 25 % y AirUtilTX por debajo de 7–8 % en la zona
- [ ] Confirmado que no hay otro router cubriendo lo mismo
- [ ] Aprobado y coordinado con la comunidad de PR

**En el sitio**

- [ ] Firmware 2.7.26
- [ ] Energía permanente con respaldo, caja sellada y antena exterior
- [ ] Admin Keys de 2 o 3 operadores
- [ ] Favoritos: solo los ROUTER y ROUTER_LATE vecinos que escucha directo
- [ ] Posición fija, Smart Position apagado e intervalos largos
- [ ] Bluetooth con un Fixed PIN propio
- [ ] OK to MQTT y Neighbor Info encendidos; módulo MQTT apagado
- [ ] Intervalos de PRMSH para nodos fijos: Node Info 6 h, posición 12 h, telemetría 6 h, Neighbor Info 11 h
- [ ] El rol cambiado al final
- [ ] Remote Administration probada desde un portátil antes de irte

**Después**

- [ ] Favoritos mutuos confirmados con los operadores vecinos
- [ ] Traceroutes de antes y de después comparados
- [ ] 1 o 2 semanas vigilando ChUtil y AirUtilTX
- [ ] El router sale en `malla.prmsh.com` o `meshview.prmsh.com`
- [ ] Un plan para dar marcha atrás si los números no dan

## Referencias

- PRMSH, valores recomendados: https://meshtastic.prmsh.com/settings/
- Mapas web de la comunidad: `malla.prmsh.com` y `meshview.prmsh.com`
- Blog de Meshtastic, Zero-Cost Hops con routers favoritos: https://meshtastic.org/blog/zero-cost-hops-favorite-routers/
- Blog de Meshtastic, ROUTER_LATE explicado: https://meshtastic.org/blog/demystifying-router-late/
- Blog de Meshtastic, cómo escoger el rol: https://meshtastic.org/blog/choosing-the-right-device-role/
- Meshtastic, consejos de configuración (roles): https://meshtastic.org/docs/configuration/tips/
- Meshtastic, administración remota de nodos: https://meshtastic.org/docs/configuration/remote-admin/
- Firmware 2.7.26 de Meshtastic: https://github.com/meshtastic/firmware/releases/tag/v2.7.26.54e0d8d
- Guías relacionadas: `meshtastic-pr-cliente-vs-mute.md` y `meshtastic-pr-client-base.md`

*73 de WP4TZV*
