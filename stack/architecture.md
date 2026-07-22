# Architecture

> **Servicio**: `practica-finanzas`
> **Estado**: pre-llenado por `/adopt` con la estructura observada en el
> código. Lo que no está en el código quedó como TODO.

## Estilo arquitectónico

Monorepo de dos sub-proyectos con **arquitectura en capas** en el
backend y **SPA con estado por contexto** en el frontend. Comunicación
por **REST sobre JSON**, sin contrato formal (no hay OpenAPI ni tipos
compartidos entre los dos lados).

⚠️ `backend/src/types/types.ts` y `frontend/src/types/types.ts` son
archivos **separados** que describen las mismas entidades. Duplicación
real: un cambio de schema hay que aplicarlo en los dos.

<!-- TODO: decidir si se extrae un paquete de tipos compartido o se
genera el cliente desde un contrato. Hoy la sincronización es manual. -->

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

<!-- TODO: esto acopla los repositories a una conexión concreta y hace
difícil testearlos contra una DB en memoria. Revisar al definir la
estrategia de tests (stack/testing.md). -->

## Manejo de errores

<!-- TODO: no hay middleware de errores centralizado en server.ts, ni
tipo de error de dominio, ni formato de respuesta de error acordado.
Definirlo. Ojo: Express 5 cambió el manejo de errores async respecto
de v4 — los rejects en handlers async ahora sí llegan al error
handler, cosa que en v4 requería envolverlos a mano. -->

## Concurrencia / async

`better-sqlite3` es **síncrono por diseño**: las queries bloquean el
event loop. Es aceptable en el alcance actual (un usuario, local), pero
es la restricción de escalabilidad más fuerte del backend.

`journal_mode=WAL` permite lecturas concurrentes con una escritura.

<!-- TODO: si alguna vez esto sirve a más de un usuario, revisar. -->

## ADRs

<!-- TODO: no hay ADRs (Architecture Decision Records) todavía.
Candidatas a documentar como primera ADR, todas decisiones ya tomadas
de hecho pero nunca escritas: SQLite embebido en vez de un motor
cliente/servidor; SQL crudo en vez de ORM; Context API en vez de una
librería de estado. -->
