# Testing

> **Servicio**: `practica-finanzas`
> **Estado**: **completo** — política acordada en la sesión de Bootstrap
> del 2026-07-22.

> ⚠️ **La política está decidida; la infraestructura no está
> implementada.** Sigue sin haber un solo test en el repo. Todo lo de
> abajo marcado `DECIDIDO — pendiente de implementar` describe a qué se
> ajusta el primer test cuando se escriba, no algo que ya corra.

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

**DECIDIDO — un solo nivel obligatorio: unit sobre
`backend/src/services/`.**

| Nivel | Alcance | Estado |
|---|---|---|
| unit | `backend/src/services/` | 🔴 **obligatorio** |
| integration | `backend/src/data/` contra SQLite en memoria | recomendado |
| e2e | flujo completo (Playwright) | no aplica todavía |

Por qué sólo `services/`: es donde vive la lógica de negocio real
(cálculo de sobrante, actualización de saldos, límites) y donde se
concentran los bugs del historial — `06c9649` *"Arreglo actualiza
sobrante al actualizar categoria"*, `099da58` *"fix bug editar"*. Los
controllers y las routes son plomería: parsean y delegan.

Por qué **no** los tres de entrada: una política que nadie ejecuta es
peor que ninguna. Se empieza por lo que paga y se sube el listón cuando
haya evidencia de que hace falta.

Integration sobre `data/` queda **recomendado y barato** una vez hecho el
refactor de § Aislamiento de la capa de datos: `new Database(":memory:")`
levanta una base real y aislada por test, sin Docker ni testcontainers.
Se sube a obligatorio si aparecen bugs de SQL.

## Cobertura mínima

**DECIDIDO — sin umbral numérico.** Un porcentaje mínimo sobre cero tests
es teatro: se cumple testeando lo trivial.

La regla es de comportamiento, no de métrica:

> **Toda lógica nueva en `services/` va con test en el mismo PR.**

Se mide cuando exista una base sobre la cual medir. Recién ahí tiene
sentido discutir un umbral, y el candidato será cobertura de `services/`,
no del repo entero.

## Frameworks

**DECIDIDO — Vitest en los dos sub-proyectos.** `pendiente de
implementar`. Ver `stack/tech-stack.md § Tests` para el razonamiento
completo; en corto: comparte config con el Vite del frontend y corre
TypeScript en el backend sin una capa de transpilación aparte.

Cada sub-proyecto lleva su propia instalación y su propio script `test`
— no hay workspace que comparta dependencias.

Otros runners están **prohibidos** (`stack/constraints.md § Librerías
prohibidas`): dos runners son dos configs y dos sintaxis de assertions.

Runner de e2e: se decide si e2e alguna vez pasa a aplicar. El candidato
por default sería Playwright, pero no se declara nada hasta entonces.

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

**DECIDIDO — casi no se mockea.**

La regla de la metodología: **la DB propia no se mockea, se usa de
verdad.** Se mockean terceros (APIs externas, servicios de pago,
mensajería), y este repo no tiene ninguno — SQLite embebido, sin
servicios externos, sin API keys.

Con SQLite usar la base de verdad es trivial y barato:
`new Database(":memory:")` levanta una base real, aislada por test, en
milisegundos.

> 🚩 **Si aparece un mock de la capa `data/`, es un olor, no una
> solución.** Casi siempre significa que hay lógica de negocio dentro de
> un repository que debería estar en `services/`
> (`stack/constraints.md § Patterns desaconsejados`). Arreglar la capa,
> no mockearla.

## Aislamiento de la capa de datos

**DECIDIDO — pendiente de implementar. Los repositories reciben la
conexión.** Esta es la decisión que `stack/architecture.md § Inyección de
dependencias` difirió a este archivo.

Hoy `backend/src/data/database.ts` exporta una conexión **singleton**
(`export default db`) que los cuatro repositories importan directo. Eso
ata cada repository a un archivo `.db` concreto: no hay forma de darle
una base en memoria sin tocar el código. Es prerrequisito de cualquier
test de la capa `data/`.

Forma acordada: cada repository pasa a ser una **factory que recibe la
conexión**.

```ts
// data/categoriasRepository.ts
export const crearCategoriasRepository = (db: Database) => ({
  listar: () => db.prepare("SELECT ...").all(),
});
```

- `server.ts` (o donde se componga el backend) le pasa el singleton al
  arrancar — el comportamiento en runtime no cambia.
- Los tests le pasan `new Database(":memory:")`, una por test.

Se eligió por sobre "singleton + archivo `.db` temporal por suite"
porque ese camino deja estado global compartido entre suites del mismo
proceso, y `:memory:` es más rápido y se limpia solo.

Alcance: los 4 repositories, `database.ts` y sus call sites en
`services/`. Es refactor puro — sin cambio de comportamiento observable,
o sea candidato a spec `refactor-only`.

## Estructura de archivos

**DECIDIDO — co-located.** El test vive al lado de lo que prueba, con el
sufijo `.test.ts`:

```
backend/src/services/movimientosService.ts
backend/src/services/movimientosService.test.ts
```

Razón: con la estructura por capas que ya tiene el backend, un árbol
`tests/` paralelo sería una segunda copia de la misma jerarquía que hay
que mantener sincronizada a mano. Co-located, el test se mueve, se
renombra y se borra junto con su código.

Los `.test.ts` quedan fuera del build de producción vía `exclude` en el
`tsconfig` de build.

Naming: `<archivo>.test.ts`, camelCase igual que el archivo que prueba
(`stack/patterns.md § Naming`).

## TDD vs test-after

**DECIDIDO — TDD en `services/`, test-after aceptable en el resto.**

| Capa | Política |
|---|---|
| `backend/src/services/` | **tests primero** |
| `controllers/`, `routes/`, `data/` | test-after, o sin test si no hay lógica |
| `frontend/` | test-after |

`services/` es exactamente el caso donde TDD paga: reglas de saldo,
sobrante y límite, con muchos casos borde y sin UI de por medio. Escribir
el caso antes obliga a definir qué se espera cuando el monto es cero,
cuando la categoría no existe, cuando el saldo queda negativo.

El resto es plomería: parsear un request y delegar. Escribir el test
antes ahí no descubre nada de diseño.

`/spec-implement` aplica tests primero por default (metodología §4 Fase
4), que coincide con esta política para el único nivel obligatorio.

## CI gates de tests

**No hay CI todavía.** Sin `.github/workflows/`, sin ningún pipeline.

**DECIDIDO — pendiente de implementar: workflow de GitHub Actions en cada
PR**, que corra **lint y test en los dos sub-proyectos**. Entra **junto
con el primer test**, no después: sin nada que los corra en cada PR, los
tests se pudren en silencio y la política de arriba se vuelve decorativa.

Forma mínima: un workflow con matriz sobre `backend` y `frontend`, Node
22 (`stack/tech-stack.md § Versiones pineadas`), `npm ci` en cada
`directory`, después `npm run lint` y `npm test`.

⚠️ **Esto cierra una pregunta abierta de la adopción.**
`repo-config.yaml > environments[].gate` para `main` está hoy sin
definir, justamente por la ausencia de CI y de tests. Cuando el workflow
exista, ese gate pasa a ser **"CI verde en el PR"**, y hay que
actualizarlo ahí — `repo-config.yaml` es la fuente de verdad del gate,
no este archivo.
