<!--
  GUARDRAILS (de la plantilla, conservados):
  - Todo componente/abstracción nuevo debe justificarse con un R*.* o
    NFR concreto.
  - Cruzar con stack/architecture.md y stack/constraints.md.
  - Decisiones con notación DEC-N.
  - Registrar alternativas rechazadas.

  ESTADO: esqueleto. Se llena tras aprobar requirements.md (gate G2).
  Lo de abajo son las decisiones ya cerradas en la entrevista de
  /spec-new — no re-litigar, sí completar.
-->
# Design: Errores visibles en Configuración

> ⚠️ **Esqueleto.** Se completa cuando `requirements.md` esté aprobado.
> Las DEC-1 a DEC-4 ya están decididas (entrevista de `/spec-new`,
> registradas en `requirements.md § Clarifications`); el resto de las
> secciones está pendiente.

## Arquitectura

<!-- PENDIENTE: diagrama mermaid del flujo de error desde SQLite hasta
     la pantalla, marcando los 5 eslabones que hoy lo pierden. -->

## Componentes

| Componente | Responsabilidad | Justificado por |
|---|---|---|
| `AppError` | Error de dominio con `status` HTTP y `code` estable | R1.2, R3.3 |
| Middleware de errores | Traduce `AppError` a respuesta JSON uniforme al final de `server.ts` | R1.2, R1.5, R3.3 |
| Conteo de movimientos por entidad | Responde cuántos movimientos referencian una categoría/cuenta/bolsillo | R1.1, R1.3 |
| Repositories como factory | Reciben la conexión en vez de importar el singleton | habilita `Tests:` de R1.1 |
| Mensaje inline por sección | Muestra el error en Categorías / Cuentas / Bolsillos | R2.1, R3.1, R3.2 |

<!-- PENDIENTE: paths concretos de cada uno. -->

## Modelo de datos

**Sin cambios de schema.** Esta feature no crea ni altera tablas: se
apoya en las foreign keys que ya existen.

Relevante de `stack/tech-stack.md § Persistencia`: no hay mecanismo de
migración, así que evitar cambios de schema es deliberado. Si en algún
momento se implementa *archivar* (fuera de scope), ahí sí habrá que
resolver migraciones primero.

## Contratos

### API

<!-- PENDIENTE: shape exacto de la respuesta de error. Punto de partida
     de stack/architecture.md § Manejo de errores:
       { "error": { "code": "...", "message": "..." } }
     Definir los `code` concretos: entidad en uso, no encontrada,
     dato inválido. -->

### Eventos

No aplica — la app no publica eventos.

## Decisiones (DEC-N)

- **DEC-1**: Bloquear el borrado de entidades en uso — justifica R1.1.
  - Alternativas consideradas: *archivar* (rechazada por ahora: exige
    cambio de schema sin mecanismo de migración y tocar todos los
    selectores); *desvincular* (rechazada: `id_bolsillo` e `id_cuenta`
    son `NOT NULL`, violaría NFR1); *cascada* (rechazada: pierde
    historial y descuadra los saldos).

- **DEC-2**: Introducir `AppError` + middleware de errores — justifica
  R1.2 y R3.3.
  - Alternativas consideradas: distinguir el 409 del 404 comparando el
    texto del mensaje (rechazada: cualquier cambio de redacción rompería
    el status). Estaba declarado como pendiente en
    `stack/architecture.md § Manejo de errores`; esta feature es su
    primer caso de uso real.

- **DEC-3**: Convertir los repositories en factories que reciben la
  conexión — habilita los `Tests: unit` de R1.1.
  - Alternativas consideradas: mantener el singleton y darle a cada
    suite un archivo `.db` temporal (rechazada en
    `stack/testing.md § Aislamiento de la capa de datos`: deja estado
    global compartido entre suites). Se hace dentro de esta spec porque
    los tres repositories se tocan igual para agregar el conteo.

- **DEC-4**: Mensajes de error como texto inline por sección — justifica
  R2.1, R3.1, R3.2.
  - Alternativas consideradas: librería de toasts (rechazada por
    `stack/constraints.md § Librerías prohibidas` — dependencia de
    conveniencia); toast propio (rechazada: un componente y un contexto
    más que mantener, sin necesidad demostrada todavía).

## Complejidad justificada

| Qué | Por qué es necesario | Alternativa más simple rechazada porque |
|---|---|---|
| Refactor de los 3 repositories a factory (DEC-3) | Sin él, `Tests: unit` de R1.1 es imposible: la lógica nueva abriría la base real | El archivo `.db` temporal por suite deja estado global compartido y es más lento |
| `AppError` + middleware (DEC-2) | R1.2 exige un código estable distinguible del 404 de R1.5 | Comparar el texto del mensaje ata el status HTTP a la redacción |

## Despliegue

No aplica — `repo-config.yaml > runtime.type: none`. La app corre en
local con `npm run dev` en cada sub-proyecto.

### Configuración

Sin variables nuevas. `stack/constraints.md § Configuración hardcodeada`
prohíbe que código nuevo agregue valores hardcodeados; esta feature no
introduce ninguno.

## Seguridad

- **Auth**: no aplica (`stack/security.md § Autenticación` — sin
  autenticación mientras la app sea mono-usuario y local).
- **Datos sensibles / PII**: los mensajes de error incluyen nombre de
  entidad y cantidad de movimientos. **No** deben incluir montos, saldos
  ni descripciones de movimientos — prohibido por
  `stack/patterns.md § Logging` y `stack/security.md § PII`.
- **Threat model**: sin superficie nueva. No se agregan endpoints; los
  existentes cambian su código de estado y el cuerpo del error.

<!-- PENDIENTE al completar: verificar que el middleware no filtre
     mensajes internos de SQLite al cliente en el caso 500. -->

## Observabilidad

- **Métricas**: no aplica (sin infraestructura de métricas).
- **Logs**: pendiente de decidir si el middleware loguea los 500. Cruzar
  con `stack/patterns.md § Logging` — el wrapper sobre `console` está
  declarado pero no implementado.
- **Alertas**: no aplica (`stack/patterns.md § Error reporting`).

## Conflicts resolved

El conflict scan cross-spec de `/spec-new` (3.d) corrió con `specs/`
vacía: **no hay otras specs activas**, por lo tanto no hay conflictos.
