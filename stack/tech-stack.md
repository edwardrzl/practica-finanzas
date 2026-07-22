# Tech stack

> **Servicio**: `practica-finanzas`
> **Estado**: pre-llenado por `/adopt` (v0.23) con lo detectado en el
> repo. Las secciones marcadas `TODO` son decisiones pendientes, no
> datos faltantes.

> El Service Agent se **negará a generar código** mientras este archivo
> tenga `TODO`. Razón: sin stack declarado, los `design.md` salen
> genéricos y los tests no pueden trazar a las convenciones reales.

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

<!-- TODO: extraer puerto y base URL a variables de entorno. Ver
stack/constraints.md § Configuración. -->

## Persistencia

**SQLite embebido vía `better-sqlite3` `^12.11.1`.** Sin ORM ni query
builder — SQL crudo en la capa `src/data/`, un repository por entidad.

- Archivo: `backend/finanzas.db` (**no versionado** — ver `.gitignore`).
- `journal_mode=WAL` y `foreign_keys=ON` (`src/data/database.ts:5-6`).
- El schema se crea en arranque con `CREATE TABLE IF NOT EXISTS`
  (`src/data/database.ts:8`). **No hay mecanismo de migración.**
- Tablas: `movimientos`, `categorias`, `bolsillos`, `cuentas`.
  `movimientos` tiene FKs a las otras tres.

<!-- OPEN_QUESTION: el schema no está consolidado (la base se resetea
seguido). Definir estrategia de migración antes de que haya datos que
preservar. Sin esto, todo cambio de schema es destructivo. -->

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

**No hay tests en el repo.** Ningún script `test`, ningún archivo de
test, ninguna dependencia de testing en ninguno de los dos
`package.json`.

<!-- TODO: elegir framework. Vitest es el candidato natural: comparte
config con Vite en el frontend y corre TS sin transpilación aparte en el
backend. Detalle de política en stack/testing.md. -->

⚠️ Esto bloquea los gates de verificación de AI-DLC (G2 requirements
verificables, G4 implementación verificada), que se apoyan en tests
ejecutables. Hasta resolverlo, esos gates son manuales.

## Lint y formato

- **`frontend/`**: ESLint `^10.6.0` con configuración plana
  (`eslint.config.js`) — `@eslint/js`, `typescript-eslint` `^8.62.0`,
  `eslint-plugin-react-hooks` `^7.1.1`, `eslint-plugin-react-refresh`
  `^0.5.3`. Se corre con `npm run lint`.
- **`backend/`**: **sin linter configurado.**

Sin formatter (no hay Prettier) y sin pre-commit hooks (no hay Husky).

<!-- TODO: decidir si el backend adopta la misma config de ESLint, y si
se agrega un formatter compartido. -->

## Deploy target

**Ninguno.** El repo no se despliega: no hay `Dockerfile`, ni pipelines,
ni `vercel.json`, ni chart de Helm. Corre en local con `npm run dev` en
cada sub-proyecto.

Consistente con `repo-config.yaml > runtime.type: none`.

## Versiones pineadas

**El runtime de Node no está pineado** — no hay `.nvmrc`, ni campo
`engines` en ningún `package.json`, ni `volta`.

<!-- TODO: pinear la versión de Node. Sin esto, `better-sqlite3` (que
compila binarios nativos) puede fallar o requerir rebuild al cambiar de
máquina o de versión. Es la dependencia más sensible del repo. -->

Rangos declarados hoy — todas las dependencias usan `^` (minor abierto)
salvo el TypeScript del frontend, que usa `~` (sólo patch):

| Crítica | Versión | Nota |
|---|---|---|
| `better-sqlite3` | `^12.11.1` | binario nativo, sensible a la versión de Node |
| `express` | `^5.2.1` | v5, no v4 — cambia el manejo de errores async |
| `react` / `react-dom` | `^19.2.7` | |
| `vite` | `^8.1.1` | |
| `typescript` | `^6.0.3` (back) / `~6.0.2` (front) | los dos sub-proyectos pueden divergir de minor |
