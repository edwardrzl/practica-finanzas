---
name: spec-status
description: Estado legible — de una feature (con slug) o panorama del repo (sin slug) (read-only)
---

# `/spec-status [<feature-slug>]` — Estado legible (read-only)

Dos modos según el argumento. Ninguno escribe nada.

## Sin argumento — panorama del repo ("¿y ahora qué?")

Es la respuesta a *"¿en qué íbamos?"*, *"retomo después de
vacaciones"*, *"no sé qué sigue"*. También es lo que el agente ofrece
al **abrir sesión sin pedido concreto** (ver AGENTS.md § Protocolo).

1. Listar `specs/*/status.md` y leer frontmatter de cada una
   (ignorar `legacy` salvo conteo).
2. Si existe `scripts/spec-lint`, correrlo y partir de su salida.
3. Producir el panorama:

   | Feature | State | Próxima acción concreta |
   |---|---|---|
   | `<slug>` | `in-progress` | T4 pending — `/spec-implement <slug>` |
   | `<slug>` | `partial-deploy-pruebas` | QA sign-off pendiente — `/spec-promote --to qa` cuando firme |
   | `<slug>` | draft sin G2 | 2 OPEN_QUESTIONS — `/spec-clarify <slug>` |

   Más: tasks `blocked` con su causa (`blocked_by`), `D-N` que
   exceden SLAs (§6), gates pendientes de firma, drift declarado vs
   derivado, y conteo de `legacy`.
4. Cerrar con **una recomendación concreta**: *"lo más
   desbloqueante ahora es X porque Y. ¿Arranco con eso?"* — no una
   lista neutra de 10 opciones. Si no hay nada activo, proponer
   `/spec-new` o revisar el backlog del tracker (si hay).

## Con `<feature-slug>` — detalle de una feature

Leer (sin modificar nada):

- `requirements.md` → contar `R*.*` totales, agrupar por estado;
  `[NEEDS CLARIFICATION]` y `OPEN_QUESTIONS` abiertas (bloquean G2).
- `checklists/requirements.md` → items pendientes (G2).
- `tasks.md` + `status.md` → done / in-progress / pending / blocked
  (con causa), fase/slice actual, tabla Gates.
- `bugs.md` → bugs abiertos por tipo (A/B/C/D/E).
- (si existe) `amendments.md` → últimos `AMD-NNN` y `HANDOFF-NNN`.
- Sección `Dependencies` de `requirements.md` → `D-N` y su estado (§6).
- Última ejecución de tests por nivel con cuántos `R*.*` cubre cada
  nivel.

Producir un resumen humano con: progreso global de `R*.*`, tasks por
estado y causa, cobertura de tests **por nivel** (no sólo global),
bugs abiertos con tipo, amendments recientes, gates firmados vs
pendientes, y **siguiente paso sugerido** (una acción concreta con su
comando, no un menú).

Pensado para retomar trabajo tras una pausa (límite de tokens, fin de
jornada, handoff). **NO escribe nada**.
