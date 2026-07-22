# Patterns

> **Servicio**: `practica-finanzas`
> **Estado**: **completo** — pre-llenado por `/adopt` con las
> convenciones **observadas en el código** y cerrado en la sesión de
> Bootstrap del 2026-07-22.

> Casi todo lo de acá no es propuesta: es lo que el repo ya hace de forma
> consistente. Lo que sí se decidió en el Bootstrap está marcado
> `DECIDIDO — pendiente de implementar`.

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

**Rutas relativas dentro de cada sub-proyecto.** No hay `paths`
configurado en ningún `tsconfig`, así que no existe `@/` — los imports
internos son `./`, `../`.

**Única excepción prevista**: `@shared/*`, el alias hacia `shared/types/`
al root, cuando se implemente (ver `stack/architecture.md § Tipos del
dominio`). Es el único alias que va a existir. No agregar `@/` para
imports internos: el objetivo del alias es cruzar el borde entre
sub-proyectos, no ahorrar `../`.

Orden observado (a mantener): externos primero, después internos.

```ts
import express from "express";              // externo
import cors from "cors";
import categoriasRoutes from "./routes/categoriasRoutes";  // interno
```

**DECIDIDO — pendiente de implementar: el orden se fuerza con
`eslint-plugin-simple-import-sort`**, en los dos sub-proyectos, junto con
la llegada de ESLint al backend (`stack/tech-stack.md § Lint y formato`).

Ordena y agrupa solo con `--fix`, así que deja de ser algo que revisar a
mano y elimina los diffs por reordenamiento. Se eligió por sobre
`import/order` por configuración: éste no necesita declarar los grupos.

⚠️ Cuando entre `shared/` (`stack/architecture.md § Tipos del dominio`),
el alias `@shared/*` es un grupo propio: **externos → `@shared/*` →
internos relativos**.

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

La política vive en **`stack/testing.md`** — estructura de archivos,
niveles obligatorios y cobertura. No se duplica acá a propósito: una
convención escrita en dos lados se desincroniza.

Convención obligatoria: `// Derived from R*.*` al inicio de cada test,
para que el gate G4 pueda trazar test → requirement.

## Logging

Hoy el único log del repo es un `console.log` de arranque
(`backend/src/server.ts:19`).

**DECIDIDO — pendiente de implementar: wrapper propio sobre `console`,
sin librería.** Un módulo chico en el backend que exponga `debug`,
`info`, `warn` y `error`. Sin Pino ni Winston: un logger estructurado
rinde cuando hay agregación de logs, y acá la salida es una terminal.

Lo que compra igual: **un punto único** por donde pasa todo log, que es
donde después se enchufa algo real sin tocar los call sites, y donde vive
la regla de abajo.

🔒 **Restricción, ya vigente aunque el wrapper no exista**: este servicio
maneja datos financieros — **NO loguear montos, saldos ni descripciones
de movimientos**. Loguear identificadores y nombres de operación, nunca
el contenido. Ver `stack/security.md § PII / datos sensibles`.

Regla para código nuevo: nada de `console.log` suelto en el backend una
vez que el wrapper exista.

## Error reporting

**Ninguno, y es deliberado.** Sin Sentry, sin Datadog, sin App Insights.

Un servicio de error reporting existe para enterarte de fallas que
ocurren donde no estás mirando. Acá la app corre en local, con el dev
mirando la terminal: no hay a quién reportarle.

**Disparador de revisión**: el primer deploy a cualquier ambiente
(`repo-config.yaml > runtime.type` deja de ser `none`).
