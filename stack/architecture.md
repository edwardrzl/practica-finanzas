# Architecture

> **Servicio**: `practica-finanzas`
> **Estado**: **completo** — pre-llenado por `/adopt` con la estructura
> observada en el código y cerrado en la sesión de Bootstrap del
> 2026-07-22.

> Lo que sigue mezcla **estructura observada** (lo que el código ya hace,
> a respetar) con **decisiones tomadas y todavía no implementadas**
> (marcadas `DECIDIDO — pendiente de implementar`). El Bootstrap declara
> la arquitectura; no refactoriza.

## Estilo arquitectónico

Monorepo de dos sub-proyectos con **arquitectura en capas** en el
backend y **SPA con estado por contexto** en el frontend. Comunicación
por **REST sobre JSON**, sin contrato formal (no hay OpenAPI ni tipos
compartidos entre los dos lados).

### Tipos del dominio: `shared/` al root

**DECIDIDO — pendiente de implementar.** Hoy
`backend/src/types/types.ts` y `frontend/src/types/types.ts` son
archivos **separados** que describen las mismas cuatro entidades:
duplicación real, donde un cambio de schema hay que aplicarlo en los dos
lados y nada lo verifica.

Destino: **una sola definición en `shared/types/`** al root del repo,
importada por ambos sub-proyectos.

Mecanismo (no hay workspace tooling, así que se resuelve con paths):

- `tsconfig.json` de cada sub-proyecto: `paths` con un alias
  (`@shared/*` → `../shared/*`).
- `frontend/vite.config.ts`: el mismo alias en `resolve.alias`, porque
  Vite no lee `paths` de tsconfig por su cuenta.
- El backend compila con `tsc`, que sí los lee.

Se eligió esto por sobre un contrato OpenAPI generado: con cuatro
entidades el contrato formal cuesta más de lo que devuelve. Y por sobre
"mantener la duplicación con el backend como fuente de verdad", porque
esa disciplina no está verificada por nada y el repo no tiene CI.

Regla desde ya, aunque la carpeta todavía no exista: **una entidad nueva
del dominio se define una sola vez**. No agregar la quinta duplicación.

## Estructura de carpetas

```
backend/src/
├── server.ts          ← entrypoint: monta CORS, JSON y los 4 routers
├── routes/            ← define endpoints, delega en controllers
├── controllers/       ← parsea request, arma response, sin lógica de negocio
├── services/          ← lógica de negocio
├── data/              ← acceso a SQLite: un repository por entidad + database.ts
└── types/             ← tipos del dominio

frontend/src/
├── main.tsx           ← entrypoint
├── App.tsx            ← router + composición de providers
├── pages/             ← Home, Historial, Configuracion
├── components/        ← agrupados por página (home/, configuracion/, historial/)
├── context/           ← un Context por entidad, dueño del estado y del fetch
├── api/               ← un cliente HTTP por entidad
└── types/             ← tipos del dominio (duplicados del backend)
```

Cuatro entidades atraviesan todas las capas de forma consistente:
`categorias`, `cuentas`, `bolsillos`, `movimientos`.

## Capas y boundaries

**Backend** — flujo estricto en un solo sentido:

```
routes → controllers → services → data(repository) → SQLite
```

Reglas observadas, a respetar:

- Un controller **no** toca la capa `data` directamente: pasa por el service.
- Un repository **no** contiene lógica de negocio: sólo SQL y mapeo.
- `database.ts` es el único que abre la conexión; los repositories la importan.

**Frontend** — flujo análogo:

```
components → context → api(client) → HTTP → backend
```

- Un componente **no** llama a `api/` directamente: consume el Context.
- El Context es dueño del estado y de refrescarlo tras una mutación.

## Inyección de dependencias

**No hay contenedor de DI.** Las dependencias se resuelven por
**imports directos** de módulos. `database.ts` exporta una instancia
singleton de la conexión (`export default db`), que los repositories
importan.

Esto acopla los repositories a una conexión concreta y hace difícil
testearlos contra una DB en memoria.

<!-- OPEN_QUESTION: decisión diferida a propósito. Se resuelve en
stack/testing.md § Aislamiento de la capa de datos, junto con el resto
de la estrategia de tests — no antes, porque la única razón para
cambiarlo es la testabilidad. Las dos salidas en juego: convertir los
repositories en factories que reciben la conexión, o dejar el singleton
y darle a cada suite un archivo .db temporal. -->

## Manejo de errores

**DECIDIDO — pendiente de implementar.** Hoy no hay middleware de
errores, ni tipo de error de dominio, ni formato de respuesta acordado:
cada controller resuelve por su cuenta.

Tres piezas:

1. **`AppError`** — error de dominio con `status` (HTTP) y `code`
   (string estable, legible por el frontend). Los services lo lanzan;
   los controllers no lo traducen.
2. **Middleware de errores** registrado **al final** de `server.ts`,
   después de los routers. Un `AppError` sale con su `status`; cualquier
   otra cosa sale como `500` y no filtra el mensaje interno al cliente.
3. **Formato único de respuesta de error**:

   ```json
   { "error": { "code": "CATEGORIA_NO_ENCONTRADA", "message": "..." } }
   ```

Sobre Express 5 — es la razón por la que esto es barato acá: a
diferencia de v4, un `reject` dentro de un handler `async` **llega solo**
al error handler. No hace falta envolver cada ruta en un `asyncHandler`
ni poner `try/catch` sólo para reenviar con `next(err)`.

Regla para código nuevo: un controller **no** arma respuestas de error a
mano; lanza o deja propagar.

## Concurrencia / async

`better-sqlite3` es **síncrono por diseño**: las queries bloquean el
event loop. Es aceptable en el alcance actual (un usuario, local), pero
es la restricción de escalabilidad más fuerte del backend.

`journal_mode=WAL` permite lecturas concurrentes con una escritura.

**DECIDIDO — aceptado explícitamente.** El bloqueo del event loop no se
mitiga: es coherente con el alcance declarado (un usuario, local, sin
deploy — ver `repo-config.yaml > runtime.type: none`). Elegir un driver
async o mover la DB fuera del proceso sería resolver un problema que el
proyecto no tiene.

**Disparador de revisión**: el día que esto sirva a más de un usuario
concurrente, o salga de local. Ahí se revisa el motor, no antes.

## ADRs

**DECIDIDO — sin proceso formal de ADRs por ahora.** Este archivo, más
`stack/tech-stack.md` y `stack/constraints.md`, cumplen el rol: registran
la decisión y el porqué. Una carpeta `docs/adr/` en paralelo se
desincronizaría de `stack/` y daría dos fuentes de verdad para lo mismo.

Las tres decisiones que estaban tomadas de hecho pero nunca escritas ya
quedaron documentadas en esta sesión:

| Decisión | Dónde | Alternativa descartada |
|---|---|---|
| SQLite embebido | `tech-stack.md § Persistencia` | motor cliente/servidor |
| SQL crudo, sin ORM | `tech-stack.md § Persistencia` | ORM / query builder |
| Context API para estado | § Capas y boundaries, arriba | Redux / Zustand |

**Disparador de revisión**: si entra más gente al repo, o si aparece una
decisión con alternativas de peso y consecuencias difíciles de revertir,
ahí conviene una ADR de verdad con contexto y opciones evaluadas.
