# Tech stack

> **Servicio**: `practica-finanzas`
> **Estado**: **completo** — pre-llenado por `/adopt` (v0.23) con lo
> detectado en el repo y cerrado en la sesión de Bootstrap del
> 2026-07-22. Sin decisiones pendientes.

> Algunas decisiones de abajo están **declaradas pero todavía no
> implementadas** en el repo (marcadas `DECIDIDO — pendiente de
> implementar`). Eso es intencional: el Bootstrap declara el stack, no
> cambia código. Cada una es una tarea de tooling independiente.

Monorepo de dos sub-proyectos sin tooling de workspace (no hay
`package.json` al root, ni pnpm/yarn workspaces). Cada uno se instala y
se corre por separado.

## Lenguaje y framework

**Ambos sub-proyectos: TypeScript.**

| | `backend/` | `frontend/` |
|---|---|---|
| Tipo | service (API REST) | frontend-app (SPA) |
| TypeScript | `^6.0.3` | `~6.0.2` |
| Framework | Express `^5.2.1` | React `^19.2.7` + React DOM `^19.2.7` |
| Routing | Express Router, 4 routers montados bajo `/api/*` | react-router-dom `^7.18.1` |
| Dev server | `ts-node-dev` `^2.0.0` (`--respawn --transpile-only`) | Vite `^8.1.1` |
| Otros | `cors` `^2.8.6` | `@vitejs/plugin-react` `^6.0.3` |

El backend escucha en el puerto **`3000` hardcodeado** (`src/server.ts:19`)
y monta `/api/categorias`, `/api/cuentas`, `/api/bolsillos`,
`/api/movimientos`. El frontend consume esa base URL, también
hardcodeada, desde los 4 clientes de `src/api/`.

**DECIDIDO — deuda declarada, sin refactor ahora.** El puerto y la base
URL siguen hardcodeados por ahora. La regla hacia adelante vive en
`stack/constraints.md § Configuración`: **código nuevo no agrega más
valores de entorno hardcodeados**. La extracción de los existentes es un
cambio `refactor-only`, no se mezcla con features.

## Persistencia

**SQLite embebido vía `better-sqlite3` `^12.11.1`.** Sin ORM ni query
builder — SQL crudo en la capa `src/data/`, un repository por entidad.

- Archivo: `backend/finanzas.db` (**no versionado** — ver `.gitignore`).
- `journal_mode=WAL` y `foreign_keys=ON` (`src/data/database.ts:5-6`).
- El schema se crea en arranque con `CREATE TABLE IF NOT EXISTS`
  (`src/data/database.ts:8`). **No hay mecanismo de migración.**
- Tablas: `movimientos`, `categorias`, `bolsillos`, `cuentas`.
  `movimientos` tiene FKs a las otras tres.

**Migraciones: no hay, y es una decisión, no un olvido.** `DECIDIDO —
aceptado explícitamente`. Se sigue con `CREATE TABLE IF NOT EXISTS` al
arrancar, y **todo cambio de schema es destructivo**: se borra
`finanzas.db` y se deja que el arranque la vuelva a crear.

Es sostenible porque hoy la base sólo tiene datos de prueba — de hecho
`/adopt` la sacó del control de versiones justamente por eso.

**Disparador de revisión**: el primer dato que valga la pena preservar.
En ese momento, la salida acordada es archivos SQL numerados
(`migrations/001_*.sql`) más una tabla `schema_version` que registre
hasta dónde se aplicó — sin dependencias nuevas.

⚠️ Mientras tanto: una spec que cambie el schema **debe** decir en su
`design.md` que resetea la base.

Sin cache (Redis/Memcached). No aplica al alcance actual.

## Build y package manager

**npm** en ambos (`package-lock.json` versionado en los dos, sin
`pnpm-lock.yaml` ni `yarn.lock`).

| Comando | `backend/` | `frontend/` |
|---|---|---|
| dev | `npm run dev` → `ts-node-dev --respawn --transpile-only src/server.ts` | `npm run dev` → `vite` |
| build | `npm run build` → `tsc` (salida a `dist/`) | `npm run build` → `tsc -b && vite build` |
| start | `npm start` → `node dist/server.js` | `npm run preview` → `vite preview` |

Lockfiles: **commitear ambos**.

## Tests

**Framework: Vitest en ambos sub-proyectos.** `DECIDIDO — pendiente de
implementar` (hoy no hay ningún script `test`, ningún archivo de test ni
dependencia de testing en los dos `package.json`).

Razón de la elección: en `frontend/` comparte configuración con Vite, que
ya está; en `backend/` corre TypeScript sin una capa de transpilación
aparte (a diferencia de Jest, que necesitaría `ts-jest` o Babel y choca
con el ESM de Vite). Un solo runner y una sola sintaxis de assertions
para todo el monorepo.

Cada sub-proyecto lleva su propia instalación y su propio script `test`
— no hay workspace que compartir dependencias, igual que con el resto
del tooling.

Política de niveles, cobertura y organización: `stack/testing.md`.

⚠️ Hasta que Vitest esté instalado y con tests reales, los gates de
verificación de AI-DLC (G2 requirements verificables, G4 implementación
verificada) siguen siendo **manuales**.

## Lint y formato

- **`frontend/`**: ESLint `^10.6.0` con configuración plana
  (`eslint.config.js`) — `@eslint/js`, `typescript-eslint` `^8.62.0`,
  `eslint-plugin-react-hooks` `^7.1.1`, `eslint-plugin-react-refresh`
  `^0.5.3`. Se corre con `npm run lint`.
- **`backend/`**: **sin linter configurado.**

Sin formatter (no hay Prettier) y sin pre-commit hooks (no hay Husky).

**DECIDIDO — pendiente de implementar:**

- **`backend/` adopta ESLint** con la misma configuración plana que
  `frontend/` (`@eslint/js` + `typescript-eslint`), menos los plugins de
  React, que no aplican. Script `npm run lint` en ambos.
- **Prettier compartido**, configurado una vez al root y consumido por
  los dos sub-proyectos. Es la excepción al "cada sub-proyecto por
  separado": el formato debe ser idéntico a ambos lados o los diffs se
  llenan de ruido.

Sin pre-commit hooks por ahora — sin CI, un hook local es lo único que
habría, y se saltea con `--no-verify`. Se reevalúa si aparece CI.

Las convenciones que estas herramientas hacen cumplir se declaran en
`stack/patterns.md`.

## Deploy target

**Ninguno.** El repo no se despliega: no hay `Dockerfile`, ni pipelines,
ni `vercel.json`, ni chart de Helm. Corre en local con `npm run dev` en
cada sub-proyecto.

Consistente con `repo-config.yaml > runtime.type: none`.

## Versiones pineadas

**Node 22 (LTS).** `DECIDIDO — pendiente de implementar`. Hoy el runtime
no está pineado: no hay `.nvmrc`, ni campo `engines` en ningún
`package.json`, ni `volta`.

Mecanismo acordado, los dos:

- **`.nvmrc` al root** con `22` — para que nvm/fnm cambien de versión
  solos al entrar al repo.
- **`engines: { "node": ">=22 <23" }`** en ambos `package.json` — para
  que npm avise si la versión activa no coincide.

Versión de referencia: la máquina de desarrollo actual corre Node
v22.23.1 con npm 10.9.8.

Motivo: `better-sqlite3` compila binarios nativos contra la ABI de Node.
Cambiar de major sin rebuild lo rompe con un error de módulo inválido,
y es la dependencia más sensible del repo.

Rangos declarados hoy — todas las dependencias usan `^` (minor abierto)
salvo el TypeScript del frontend, que usa `~` (sólo patch):

| Crítica | Versión | Nota |
|---|---|---|
| `better-sqlite3` | `^12.11.1` | binario nativo, sensible a la versión de Node |
| `express` | `^5.2.1` | v5, no v4 — cambia el manejo de errores async |
| `react` / `react-dom` | `^19.2.7` | |
| `vite` | `^8.1.1` | |
| `typescript` | `^6.0.3` (back) / `~6.0.2` (front) | los dos sub-proyectos pueden divergir de minor |
