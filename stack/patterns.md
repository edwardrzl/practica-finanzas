# Patterns

> **Servicio**: `practica-finanzas`
> **Estado**: pre-llenado por `/adopt` con las convenciones **observadas
> en el código**. No son propuestas: es lo que el repo ya hace de forma
> consistente. Donde el repo no es consistente, quedó marcado.

## Naming

### Archivos

Convención **por capa**, consistente en los 4 dominios del repo:

| Capa | Convención | Ejemplos |
|---|---|---|
| `backend/src/routes/` | camelCase + sufijo `Routes` | `movimientosRoutes.ts` |
| `backend/src/controllers/` | camelCase + sufijo `Controller` | `categoriasController.ts` |
| `backend/src/services/` | camelCase + sufijo `Service` | `cuentasService.ts` |
| `backend/src/data/` | camelCase + sufijo `Repository` | `bolsillosRepository.ts` |
| `frontend/src/api/` | camelCase + sufijo `Client` | `movimientosClient.ts` |
| `frontend/src/context/` | PascalCase + sufijo `Context` | `CategoriasContext.tsx` |
| `frontend/src/components/` | PascalCase | `SaldoDisponible.tsx`, `CuentaEditarForm.tsx` |
| `frontend/src/pages/` | PascalCase | `Historial.tsx` |

Regla derivada: **archivos que exportan un componente React van en
PascalCase; el resto en camelCase.** El sufijo nombra la capa.

Los nombres de dominio están **en español y en plural**
(`movimientos`, `categorias`, `cuentas`, `bolsillos`). Mantenerlo:
mezclar idiomas en los nombres de entidad es la vía rápida al desorden.

Los componentes de formulario siguen `<Entidad><Acción>Form`:
`CategoriaCrearForm.tsx`, `MovimientoEditarForm.tsx`.

### Funciones / métodos

**camelCase**, estándar de TypeScript.

### Clases / tipos / interfaces

**PascalCase, sin prefijo `I`** — convención de TS, no de C#. Los tipos
del dominio viven en `types/types.ts` de cada sub-proyecto.

⚠️ Están **duplicados** entre backend y frontend. Ver
`stack/architecture.md` § Estilo arquitectónico.

### Variables / constantes

**camelCase** para variables. No hay constantes en `UPPER_SNAKE_CASE`
en el repo todavía; usarlo si aparecen constantes de módulo.

## Imports

**Rutas relativas, sin alias de path.** No hay `paths` configurado en
ningún `tsconfig`, así que no existe `@/` — los imports son `./`, `../`.

Orden observado (a mantener): externos primero, después internos.

```ts
import express from "express";              // externo
import cors from "cors";
import categoriasRoutes from "./routes/categoriasRoutes";  // interno
```

<!-- TODO: el orden no está forzado por linter. El backend ni siquiera
tiene ESLint. Considerar agregar la regla si empieza a haber drift. -->

## Convención de commits

```
<type>(<scope>): T<n> - <desc> [R<x>.<y>]
```

**Sin sufijo `AB#<id>`**: este repo no tiene tracker
(`repo-config.yaml > trackers: []`). La trazabilidad es a la spec vía
`[R<x>.<y>]`.

`<scope>` en este monorepo debe ser la capa afectada: `backend`,
`frontend`, o ambas si el commit es de un slice completo.

```
feat(backend): T1 - endpoint POST /api/movimientos [R2.1]
feat(frontend): T2 - formulario de alta de movimiento [R2.2]
```

> El historial previo a la adopción **no** sigue esta convención
> (`avance`, `commit prueba`, `final hasta el momento`). No se reescribe
> —  la convención aplica de acá en adelante.

## Branching

- Prefijo de feature: **`feat/<slug>`** (`repo-config.yaml >
  branch_pattern`).
- Un solo ambiente: `main`. `promotion_path: [main]`, o sea que un PR
  aprobado va directo a `main`, sin saltos intermedios.
- **PR-only**: no se commitea directo a `main`.

## Organización de tests

<!-- TODO: no hay tests todavía. La decisión de estructura está en
stack/testing.md § Estructura de archivos (sugerencia: co-located).
No duplicar la política acá — este archivo apunta allá. -->

Convención obligatoria cuando existan: `// Derived from R*.*` al inicio
de cada test. Detalle en `stack/testing.md`.

## Logging

**No hay framework de logging.** El único log del repo es un
`console.log` de arranque (`backend/src/server.ts:19`).

<!-- TODO: si se agrega logging, definir niveles y formato. Restricción
que ya aplica: este servicio maneja datos financieros — NO loguear
montos, saldos ni descripciones de movimientos. Ver stack/security.md
§ PII / datos sensibles. -->

## Error reporting

**Ninguno.** Sin Sentry, sin Datadog, sin App Insights.

<!-- TODO: no tiene sentido mientras la app corra sólo en local — no hay
nadie a quien reportarle. Revisar si alguna vez se despliega. -->
