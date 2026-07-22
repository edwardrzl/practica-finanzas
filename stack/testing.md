# Testing

> **Servicio**: `practica-finanzas`
> **Estado**: 🔴 **OPEN_QUESTION de prioridad ALTA.** No hay tests en el
> repo. Este archivo documenta el estado real y las decisiones
> pendientes — no describe una política vigente.

## Estado actual

**Cero tests.** Verificado durante la adopción:

- Ningún script `test` en `backend/package.json` ni en `frontend/package.json`.
- Ningún archivo `*.test.ts`, `*.spec.ts` ni directorio `tests/`.
- Ninguna dependencia de testing declarada.

**Por qué importa para AI-DLC**: los gates de verificación se apoyan en
tests ejecutables. Un *gate* es un checkpoint que una spec debe pasar
para avanzar. Sin tests:

- **G2** (requirements verificables) se degrada: un `R*.*` sin test que
  lo cubra es una afirmación, no algo verificable.
- **G4** (implementación verificada) pasa a ser **manual** — alguien
  tiene que probar a mano y declarar que funciona.
- `/spec-verify` no puede cruzar tests ↔ requirements, que es su
  función principal.

Hasta que esto se resuelva, tratá los gates G2 y G4 como manuales y
dejalo dicho en el `status.md` de cada spec.

## Niveles obligatorios

<!-- TODO: decidir. Punto de partida sugerido para este repo, en orden
de retorno sobre esfuerzo:

1. unit sobre `backend/src/services/` — es donde vive la lógica de
   negocio real (cálculo de sobrante, actualización de saldos). Los
   bugs del historial se concentran ahí: 06c9649 "Arreglo actualiza
   sobrante al actualizar categoria", 099da58 "fix bug editar".
2. integration sobre `backend/src/data/` contra una SQLite en memoria
   (`new Database(":memory:")`) — barato y rápido, no necesita
   testcontainers.
3. e2e recién si la app crece.

No fijar los tres niveles como obligatorios de entrada: sin CI que los
corra, una política que nadie ejecuta es peor que ninguna. -->

## Cobertura mínima

<!-- TODO: no fijar un % hasta que exista el primer test. Un umbral sin
tests es teatro. Sugerencia: arrancar con "toda lógica nueva en
services/ va con test" y medir después. -->

## Frameworks

<!-- TODO: decidir. Candidato fuerte: **Vitest**.

- El frontend ya usa Vite 8 — Vitest comparte la config, sin setup extra.
- En el backend corre TypeScript sin cadena de transpilación aparte,
  que es justo lo que hace incómodo a Jest acá.
- Un solo framework para los dos sub-proyectos = una sola convención.

Alternativa sin dependencias: `node:test` (nativo desde Node 18) para el
backend. Menos ergonómico, cero deps.

Decidir también el runner de e2e sólo cuando haga falta (Playwright). -->

## Convención `// Derived from R*.*`

Cada test debe declarar el `R*.*` que cubre como comment al inicio:

```
// Derived from R1.2 (token entropy)
test('reset token has 256 bits of entropy', () => { ... });
```

Esto permite a `/spec-verify` cruzar tests ↔ requirements y detectar
tests huérfanos (sin `R*.*` válido tras Amendment) o `R*.*` sin
cobertura.

**En este repo**, por el monorepo cross-cutting, el comment debe incluir
también la capa cuando el requirement la declara:

```
// Derived from R2.1 [only: backend] (POST /api/movimientos crea el registro)
```

## Política de mocks

<!-- TODO: decidir. Nota específica de este repo: la DB es **propia**,
no un tercero — la regla de la metodología dice que la DB propia NO se
mockea, se usa de verdad. Con SQLite eso es trivial y barato:
`new Database(":memory:")` levanta una base real y aislada por test, sin
Docker ni testcontainers.

O sea: acá casi no hay razón legítima para mockear. Si aparece un mock
de la capa `data/`, es señal de que la lógica está en el lugar
equivocado. -->

⚠️ Obstáculo conocido: `backend/src/data/database.ts` exporta una
conexión **singleton** que los repositories importan directo. Eso impide
inyectar una base en memoria sin tocar el código. Resolverlo es
prerrequisito de cualquier test de la capa `data/`. Ver
`stack/architecture.md` § Inyección de dependencias.

## Estructura de archivos

<!-- TODO: decidir entre co-located (`src/services/foo.ts` +
`src/services/foo.test.ts`) o directorio aparte (`tests/`).
Sugerencia: co-located — con la estructura por capas que ya tiene el
backend, mantiene el test al lado de lo que prueba. -->

## TDD vs test-after

<!-- TODO: definir política. La metodología (§4 Fase 4) recomienda tests
primero cuando hay lógica de negocio compleja; test-after es aceptable
para boilerplate. `/spec-implement` aplica tests primero por default.

Para este repo: la lógica de `services/` (saldos, sobrantes, límites) es
exactamente el caso donde TDD paga. Los controllers y routes son
boilerplate. -->

## CI gates de tests

**No hay CI.** Sin `.github/workflows/`, sin ningún pipeline.

<!-- TODO: al agregar el primer test, agregar también un workflow de
GitHub Actions que lo corra en cada PR. Sin eso, los tests se pudren.
Cruzar con `repo-config.yaml > environments[].gate`, que hoy dice
"TODO — no hay CI ni tests todavía". -->
