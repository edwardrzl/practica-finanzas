# Constraints

> **Servicio**: `practica-finanzas`
> **Estado**: **completo** — pre-llenado por `/adopt` con lo observado en
> el código y cerrado en la sesión de Bootstrap del 2026-07-22.

> Lo que está **prohibido o desaconsejado** en este repo. Anti-patrones
> específicos del proyecto. Cada constraint con justificación corta
> (sin "porque sí" — siempre hay una razón concreta).

## Librerías / dependencias prohibidas

**Criterio general**: el repo hoy tiene **cero dependencias de
conveniencia** (sin lodash, sin moment). Mantener esa disciplina —
agregar una dependencia requiere justificar por qué la stdlib o la
plataforma no alcanzan.

**Prohibiciones concretas.** Cada una es el reverso de una decisión ya
tomada: no se prohíben por malas, sino porque el repo **ya eligió otra
cosa** y tener las dos daría dos formas de hacer lo mismo.

| Prohibido | Porque ya se eligió | Dónde está la decisión |
|---|---|---|
| ORM / query builder (Prisma, TypeORM, Knex, Drizzle) | SQL crudo en `data/`, un repository por entidad | `tech-stack.md § Persistencia` |
| Librerías de estado en frontend (Redux, Zustand, Jotai) | Context API, un Context por entidad | `architecture.md § Capas y boundaries` |
| Clientes HTTP (axios, got, superagent) | `fetch` nativo, ya usado en los 4 clientes de `api/` | `architecture.md § Capas y boundaries` |
| Otros runners de test (Jest, Mocha, AVA) | Vitest, único runner del monorepo | `tech-stack.md § Tests` |

> **Prohibido ≠ imposible.** Significa que meter una de éstas requiere
> una decisión explícita que revierta la de la derecha y actualice
> `stack/` — no que sea intocable para siempre. Lo que no se acepta es
> que entre de contrabando en el diff de una feature.

## Patterns desaconsejados

- **No usar `any`** sin comment que lo justifique. Los dos
  sub-proyectos son TypeScript estricto; `any` anula el único mecanismo
  de seguridad que tiene el repo hoy (no hay tests que lo respalden).
- **No saltarse las capas.** En el backend: un controller no importa de
  `data/`, pasa por `services/`. En el frontend: un componente no
  importa de `api/`, consume el Context. Ver `stack/architecture.md`
  § Capas y boundaries.
- **No poner lógica de negocio en repositories.** La capa `data/` es
  SQL y mapeo. Los cálculos de saldo, sobrante y límite van en
  `services/`.
- **No swallow de excepciones en silencio.**

## Cosas que NO se deben hacer

- **No commitear `finanzas.db`, `-shm` ni `-wal`.** Están en
  `.gitignore` desde la adopción de AI-DLC. Son artefactos de runtime:
  con `journal_mode=WAL` el `-wal` cambia con sólo levantar el server,
  y la base se resetea seguido. El schema canónico vive en
  `backend/src/data/database.ts`, no en el archivo `.db`.
- **No commitear directo a `main`.** AI-DLC es PR-only por diseño. Las
  ramas de feature usan el prefijo `feat/` (`repo-config.yaml >
  branch_pattern`).
- **No `git push --force` a `main`.**
- **No usar `--no-verify`** para saltar hooks.
- **No deshabilitar tests para que pase CI.** (Aún no aplica: no hay
  tests ni CI. Queda escrito para cuando los haya.)

## Configuración hardcodeada — deuda conocida

Tres valores están hardcodeados y deberían ser configuración:

| Valor | Dónde | Impacto |
|---|---|---|
| Puerto `3000` | `backend/src/server.ts:19` | no se puede correr dos instancias ni cambiar de puerto sin editar código |
| `http://localhost:3000` | los 4 clientes de `frontend/src/api/` | repetido 16 veces; apuntar a otro backend exige tocar 4 archivos |
| `cors()` sin origen | `backend/src/server.ts:10` | abierto a cualquier origen (ver `stack/security.md`) |

**DECIDIDO — no se refactoriza ahora; se congela.** Los tres valores
quedan como están.

🔒 **Regla vigente desde ya: código nuevo no agrega más configuración
hardcodeada.** Un endpoint nuevo, un cliente nuevo o un origen nuevo no
pueden sumar un cuarto valor a esa tabla. La deuda está acotada en tres
lugares conocidos y ahí se queda.

**Cómo se salda, cuando se salde**: una spec de modalidad
`refactor-only` (preserva comportamiento, no crea requirements nuevos)
que extraiga los tres **juntos** — el puerto, la base URL y el origen de
CORS son la misma decisión vista desde tres archivos. Sacar uno solo deja
el problema y pierde el envión.

**Disparador**: el primer deploy a cualquier ambiente. Hasta entonces no
hay un segundo valor posible para ninguno de los tres, así que
extraerlos no compraría nada.

## Restricciones de runtime / infra

- **`better-sqlite3` es síncrono**: toda query bloquea el event loop.
  No introducir operaciones pesadas en la capa `data/` asumiendo que
  son async — no lo son.
- **`better-sqlite3` compila binarios nativos**: es sensible a la
  versión de Node. El Bootstrap fijó **Node 22** vía `.nvmrc` +
  `engines` (`tech-stack.md § Versiones pineadas`), pero eso está
  **pendiente de implementar** — hasta entonces, cambiar de versión de
  Node puede exigir `npm rebuild better-sqlite3`.
- **Sin migraciones, por decisión**: el schema se crea con `CREATE TABLE
  IF NOT EXISTS` al arrancar (`database.ts:8`). Eso significa que
  **modificar una tabla existente no tiene efecto** sobre una base ya
  creada — hay que borrar `finanzas.db`. Toda spec que cambie el schema
  **debe decirlo en su `design.md`**. Ver `tech-stack.md § Persistencia`.

## Anti-patrones del methodology aplicados aquí

- **No backfillear specs retroactivas** para el código que ya existe
  (anti-patrón *strangler*, §15). `specs/` arranca vacía a propósito:
  las specs se escriben para trabajo **nuevo**, no para documentar lo
  ya construido.
- **No declarar ambientes que no existen.** `repo-config.yaml` declara
  sólo `main` porque es la única rama del repo. No agregar `qa` ni
  `staging` "por las dudas".
- **No usar `cross_cutting_specs` como si fuera parity.** Está activado
  por layering (vertical slices backend+frontend), no porque los
  sub-proyectos deban espejarse. Cada `R*.*` declara su capa con
  `[only: backend]` / `[only: frontend]`. Ver el comentario extenso en
  `repo-config.yaml > monorepo`.
