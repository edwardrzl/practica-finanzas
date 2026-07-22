---
feature: configuracion-errores-visibles
modality: code
initiative: NONE
owner: "@EdwardR"
status: draft
---
<!--
  GUARDRAILS (de la plantilla, conservados):
  - ✅ QUÉ necesita el usuario y POR QUÉ. ❌ CÓMO se implementa.
  - Una acción por requirement. Si tiene "y", dividirlo.
  - NFRs medibles. Casos negativos explícitos.
  - Cada R*.* TESTEABLE y NO AMBIGUO.
  - Máximo 3 [NEEDS CLARIFICATION]. NO inventar (§3.12).
-->

# Feature: Errores visibles en Configuración

## Contexto

En la pantalla de Configuración, cuando una operación falla **no ocurre
nada visible**: la lista no cambia, el modal no se cierra, no aparece
ningún mensaje. El usuario no puede distinguir "falló" de "no hizo clic".

El caso que lo destapó es el borrado. Las cuatro tablas están
relacionadas por foreign keys y `database.ts:6` activa
`foreign_keys=ON`, así que SQLite **rechaza borrar una categoría, cuenta
o bolsillo que algún movimiento esté usando**. Ese rechazo es correcto —
protege la integridad del historial — pero hoy se pierde en el camino:

1. SQLite lanza `FOREIGN KEY constraint failed`.
2. El repository no lo captura.
3. El `if (!seBorro)` del service nunca se ejecuta.
4. El controller lo devuelve como **404** con el mensaje crudo de SQLite.
5. El cliente HTTP **descarta** ese mensaje y lanza uno genérico.
6. El componente no tiene `try/catch`: la promesa se rechaza sin oyente.

Con los datos actuales las 6 entidades están referenciadas por alguno de
los 4 movimientos, así que **ninguna se puede borrar** y no hay forma de
saber por qué.

El mismo patrón de tragar errores existe en crear y editar, en las tres
entidades.

**Usuario primario**: el dueño de la app, único usuario (ver
`stack/security.md § Autenticación`).

## Stakeholders

- @EdwardR — dueño, dev y usuario

## Métricas de éxito

- Ante cualquier operación fallida en Configuración, el usuario ve un
  mensaje en pantalla que nombra la causa concreta — 0 fallos silenciosos.
- El usuario puede distinguir sin leer código ni consola las tres
  situaciones: la entidad no existe, la entidad está en uso, el dato
  enviado es inválido.
- 0 movimientos huérfanos tras cualquier operación de borrado.

## Slices priorizados

### P1 — Borrado bloqueado con motivo visible (MVP)

- **Por qué esta prioridad**: es el fallo que hoy no tiene explicación
  posible para el usuario. Entrega valor solo, sin depender de P2.
- **Prueba independiente**: intentar borrar la categoría `gasolina`
  (tiene 1 movimiento) → aparece un mensaje que dice que está en uso y la
  categoría sigue en la lista. Crear una categoría nueva y borrarla →
  desaparece sin mensaje de error.
- **Cubre**: R1.*, R2.*

### P2 — Errores visibles en crear y editar

- **Por qué esta prioridad**: aditivo. Extiende el mismo mecanismo de P1
  a las otras dos operaciones; sin P1 no hay dónde mostrarlos.
- **Prueba independiente**: crear una categoría con nombre vacío →
  aparece "El nombre de la categoría no puede estar vacío" en pantalla.
- **Cubre**: R3.*

## Requisitos funcionales

### R1 — Rechazo de borrado de entidades en uso [P1]

**R1.1** IF se solicita borrar una categoría, cuenta o bolsillo que tiene
al menos un movimiento asociado, THEN THE SYSTEM SHALL rechazar la
operación sin modificar ningún dato.
Tests: unit, integration

**R1.2** WHEN THE SYSTEM rechaza un borrado por entidad en uso, THE
SYSTEM SHALL responder con estado HTTP 409 y un código de error estable
distinguible del resto.
Tests: unit, integration

**R1.3** WHEN THE SYSTEM rechaza un borrado por entidad en uso, THE
SYSTEM SHALL incluir en la respuesta el nombre de la entidad y la
cantidad exacta de movimientos que la referencian.
Tests: unit

**R1.4** WHEN se solicita borrar una entidad sin movimientos asociados,
THE SYSTEM SHALL borrarla y responder 204.
Tests: unit, integration

**R1.5** IF se solicita borrar una entidad que no existe, THEN THE SYSTEM
SHALL responder 404, distinguible del rechazo por entidad en uso.
Tests: unit

<!-- R1.5 corrige un defecto actual: hoy el controller devuelve 404 tanto
     para "no existe" como para "está en uso", que son situaciones
     distintas con acciones distintas del usuario. -->

### R2 — Visibilidad del rechazo en la interfaz [P1]

**R2.1** WHEN una solicitud de borrado falla, THE SYSTEM SHALL mostrar el
mensaje recibido del backend en la sección correspondiente de
Configuración, sin reemplazarlo por un texto genérico.
Tests: integration

**R2.2** WHEN una solicitud de borrado falla, THE SYSTEM SHALL mantener
la entidad en la lista visible.
Tests: integration

**R2.3** WHEN una solicitud de borrado falla, THE SYSTEM SHALL cerrar el
diálogo de confirmación.
Tests: integration

<!-- R2.3: si el diálogo quedara abierto sobre el mensaje de error, el
     usuario no lo vería. Decisión de la entrevista: el intento se deja
     ocurrir y el mensaje aparece después. -->

**R2.4** WHEN una operación posterior en la misma sección termina bien,
THE SYSTEM SHALL dejar de mostrar el mensaje de error anterior.
Tests: integration

### R3 — Errores visibles en crear y editar [P2]

**R3.1** IF una solicitud de creación es rechazada por el backend, THEN
THE SYSTEM SHALL mostrar el mensaje recibido en la sección
correspondiente.
Tests: integration

**R3.2** IF una solicitud de edición es rechazada por el backend, THEN
THE SYSTEM SHALL mostrar el mensaje recibido en la sección
correspondiente.
Tests: integration

**R3.3** WHEN THE SYSTEM rechaza una creación o edición por dato
inválido, THE SYSTEM SHALL responder con estado HTTP 400 y el mensaje de
la validación que falló.
Tests: unit

**R3.4** WHEN una creación o edición falla, THE SYSTEM SHALL mantener
abierto el formulario con los datos que el usuario había ingresado.
Tests: integration

## Requisitos no funcionales

**NFR1** THE SYSTEM SHALL aplicar el mismo comportamiento de R1, R2 y R3
a las tres entidades de Configuración —categorías, cuentas y bolsillos—
sin diferencias observables entre ellas.
Tests: integration

<!-- Sin NFRs de performance: la app corre en local contra SQLite
     embebido, con un usuario y decenas de filas. Un umbral de latencia
     acá sería teatro (ver stack/testing.md § Cobertura mínima). -->

## Fuera de scope

- **Archivar entidades** (marcarlas inactivas conservando historial).
  Evaluado en la entrevista y descartado para esta spec: requiere cambio
  de schema y tocar todos los selectores. R1 no cierra esa puerta.
- **Borrado en cascada** de movimientos. Descartado: perdería historial y
  dejaría los saldos de cuentas y bolsillos inconsistentes.
- **Desvincular movimientos** (dejar `id_categoria` en NULL). Descartado:
  `id_bolsillo` e `id_cuenta` son `NOT NULL`, así que no aplica de forma
  uniforme a las tres entidades y violaría NFR1.
- **Desactivar preventivamente el botón Eliminar**. Requeriría exponer el
  conteo de movimientos en cada listado; se decidió dejar que el intento
  ocurra y explicar el resultado.
- **Errores fuera de Configuración** (pantallas Home e Historial).
- **Corregir el movimiento `id=1`**, que guarda `valor: -100` con
  `tipo: 'gasto'` mientras el resto guarda el valor positivo. Es dato
  viejo inconsistente, anterior a la lógica actual. Merece su propia spec.

## Dependencias internas

- Depende de: — (ninguna)
- Bloquea: — (ninguna)

## Clarifications

### Session 2026-07-22

- Q: ¿Qué debe pasar al borrar una entidad con movimientos asociados?
  → A: Bloquear con mensaje claro. Descartadas: archivar, desvincular,
  cascada (ver *Fuera de scope*).
- Q: ¿El botón Eliminar se desactiva de entrada o deja intentar?
  → A: Deja intentar y muestra el mensaje al confirmar.
- Q: ¿La spec cubre sólo borrado o también crear y editar?
  → A: Las tres operaciones, en las tres entidades. Borrado es P1;
  crear y editar son P2.
- Q: ¿Cómo se muestran los errores en pantalla?
  → A: Texto inline en cada sección. Descartada la librería de toasts
  por `stack/constraints.md § Librerías prohibidas` (dependencia de
  conveniencia sin justificación suficiente).
- Q: ¿El refactor de inyección de conexión en los repositories entra en
  esta spec? → A: Sí. La spec toca los tres repositories igual para
  agregar el conteo de movimientos, y sin ese refactor la lógica nueva no
  se puede testear (`stack/testing.md § Aislamiento de la capa de datos`).
- Q: ¿Se implementa `AppError` + middleware de errores acá?
  → A: Sí. R1.2 exige un código de error estable distinguible, que es
  exactamente lo que `stack/architecture.md § Manejo de errores` declaró
  pendiente.

## OPEN_QUESTIONS

<!-- Vacío: las seis preguntas de la entrevista se resolvieron en sesión
     y quedaron registradas arriba. 0 abiertas = no bloquean G2. -->

- (ninguna)
