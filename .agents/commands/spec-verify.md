---
name: spec-verify
description: Auditar la spec — pre-G2 (consistencia interna), cobertura R*.* ↔ tests, gaps, drift, conflicts (read-only)
---

# `/spec-verify <feature-slug> [--pre-g2] [--cross]` — Auditar (read-only)

Sigue el protocolo §7 (AGENTS.md). Tres modos componibles; ninguno
escribe nada. Antes de razonar, correr `scripts/spec-lint` (sh o ps1)
si existe y partir de su salida — lo mecánico lo valida el script; el
agente agrega el juicio semántico.

## Modo default — auditoría operacional (post-aprobación)

1. **CONTEXT** — leer `requirements.md`, `tasks.md`, `status.md`,
   `mocks/`, `tests/` del repo.

2. **CHECKS** — reportar:
   - `R*.*` sin `Tests:` declarado (§5 regla 6 del methodology).
   - `R*.*` con `Tests:` declarado pero **niveles no cubiertos**
     (declara `unit, integration` y sólo hay unit con
     `// Derived from R*.*`).
   - Tests con `// Derived from R*.*` cuyo `R*.*` ya no existe
     (huérfanos por Amendment).
   - Tasks `done` sin commit hash en `status.md`.
   - `D-N` en `NEGOTIATING` > 10 días hábiles; `AGREED` > 6 semanas
     sin `IMPLEMENTED` (§6 SLAs).
   - Tasks `blocked` > 4 semanas sin decisión `BLOCK`/`WORKAROUND`/
     `cancel` (§6 SLAs).
   - Mocks sin `Ready to unmock` o sin owner declarado.
   - Drift entre `state:` declarado y derivación del Lifecycle (§6).
   - `OPEN_QUESTIONS` sin owner o sin `due`; o con `due` vencido.
   - `feature_flag.main == ON` > 90 días al 100% sin task de limpieza
     (§6 *Limpieza de feature flags*).
   - **Ajuste por modalidad** (§6): `catalog-only` omite checks de
     `design.md`/`tasks.md`; `docs-only` omite tests; `refactor-only`
     **exige** tests existentes verdes pre y post; etc.
   - **Stack drift**: violaciones a `stack/patterns.md` /
     `stack/constraints.md`.

## Modo `--pre-g2` — consistencia interna antes de firmar G2

Valida que requirements/design/tasks son coherentes **entre sí**
cuando todavía es barato corregir. Severidades: **CRITICAL** (bloquea
G2) / **HIGH** / **MEDIUM** / **LOW**.

1. **Cobertura R ↔ task** (cuando `tasks.md` ya está poblado):
   - Cada `R*.*` cubierto por ≥1 task → tabla
     `R*.* | task(s) | slice`. Requirement sin task = **CRITICAL**.
   - Cada task cita `R*.*` existentes. Task sin requirement =
     **HIGH** (¿scope creep o chore disfrazado?).
2. **Vaguedad**: adjetivos sin métrica en R*.*/NFRs ("rápido",
   "intuitivo", "robusto", "escalable", "pronto") = **HIGH**.
   Placeholders (`TODO`, `???`, `TBD`) = **HIGH**.
3. **Marcadores y preguntas**: `[NEEDS CLARIFICATION]` restantes o
   `OPEN_QUESTIONS` abiertas = **CRITICAL** (sugerir `/spec-clarify`).
4. **Duplicación / contradicción interna**: dos `R*.*` que se
   solapan o se contradicen = **HIGH**.
5. **Drift de terminología**: mismo concepto con ≥2 nombres entre
   requirements/design/tasks = **MEDIUM**.
6. **Design ↔ requirements**: componente de `design.md` que ningún
   `R*.*`/NFR justifica y no está en `Complejidad justificada` =
   **MEDIUM** (anti-overengineering). Entidad del modelo de datos sin
   origen en la spec = **MEDIUM**.
7. **Slices**: slice sin prueba independiente declarada, o P2/P3 que
   es prerequisito de P1 = **HIGH** (rompe partial-deploy).
8. **Checklist**: `checklists/requirements.md` con items `[ ]` =
   reportar conteo (G2 exige completa).

Salida: tabla `ID | Categoría | Severidad | Ubicación | Resumen |
Recomendación` + métricas (R totales, % con task, vagos, CRITICALs).
**Con ≥1 CRITICAL, recomendar NO firmar G2.**

## Modo `--cross` — conflictos contra otras specs

El mismo scan de `/spec-new` 3.d pero a demanda contra todas las
specs activas del repo: contradicciones de endpoints, flags, NFRs,
módulos compartidos, con citas explícitas (`spec/R*.*` vs
`otra-spec/R*.*`). Útil para auditar coherencia del catálogo tras N
specs o antes de un PR grande. El dev decide: amendment / alinear /
documentar coexistencia.

## CLOSE (todos los modos)

- Gaps por categoría con sugerencia de fix concreta para cada uno.
- Si todo verde en default: confirmar condiciones de promoción y
  sugerir `/spec-promote`. Si todo verde en `--pre-g2`: indicar que
  la spec está lista para firma G2.
