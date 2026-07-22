---
feature: configuracion-errores-visibles
state: not-started
updated: 2026-07-22
updated_by: "@EdwardR"
---
<!--
  REGLAS (§6 Lifecycle):
  - `state` se DERIVA de las tasks. Divergencia = drift (W4).
  - Task `blocked` REQUIERE `blocked_by:`.
  - `updated` = fecha del último commit que tocó este archivo.
  - Sin feature_flag: la app no tiene mecanismo de flags y corre en un
    solo ambiente (repo-config.yaml > environments: [main]).
-->

# Status

## Gates

| Gate | Qué firma | Estado |
|---|---|---|
| G2 — requirements + design | @EdwardR (no hay tech lead separado) | pending |
| G3 — code review (por PR) | @EdwardR | pending |
| G4 — QA sign-off | @EdwardR | pending |
| G5 — Ops sign-off (pre-prod) | n/a — sin infraestructura desplegada | n/a |

<!-- G5 marcado n/a: repo-config.yaml > runtime.type: none. No hay
     ambiente productivo al que promover. -->

**Bloqueo actual de G2**: `design.md` es un esqueleto. Las decisiones
estructurales (DEC-1 a DEC-4) ya están cerradas; falta el shape de la
respuesta de error, los paths concretos y el diagrama.

⚠️ **G4 será manual en la primera parte de esta feature.** El repo tiene
Vitest instalado en `backend/` y 6 tests, pero ningún test que cubra la
capa `data/` — precisamente lo que DEC-3 viene a habilitar. Los `Tests:`
declarados en los R*.* de P1 sólo son automatizables después de la Fase 1.

## Tasks

<!-- Sin tasks todavía: tasks.md se deriva después de firmar G2. -->

(ninguna — pendiente de derivar de `design.md`)

## Notas

- 2026-07-22: spec creada con `/spec-new`. Entrevista de 6 preguntas
  resuelta en sesión, 0 OPEN_QUESTIONS abiertas, 0 marcadores
  `[NEEDS CLARIFICATION]`.
- 2026-07-22: conflict scan cross-spec sin hallazgos — es la primera
  spec del repo.
- 2026-07-22: origen del requerimiento — investigación de un bug
  reportado en sesión ("no me deja borrar cuentas, bolsillos ni
  categorías"), reproducido contra una copia de `finanzas.db`. Los tres
  DELETE fallan con `SQLITE_CONSTRAINT_FOREIGNKEY`.
