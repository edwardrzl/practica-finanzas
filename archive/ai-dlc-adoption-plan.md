---
generated_at: 2026-07-22T16:32:47Z
generated_by: Claude Code (Opus 4.8) — /adopt
target_repo: practica-finanzas
target_path: C:\UC_proyectos\practica-finanzas
target_branch: chore/adopt-ai-dlc
base_branch: main
methodology_version: 0.23
template_source: C:\Users\e.rodriguez\Downloads\syc\syc-ai-dlc\template
template_version: v0.21-8-g141dc98
mode: brownfield
dry_run: true
---

# Plan de adopción AI-DLC — practica-finanzas

> **DRY-RUN.** Este plan describe lo que Phase 4 *haría*. No se ejecutó
> nada sobre el repo. El único archivo escrito es este mismo, sin
> trackear, sobre `main`. Se borra con `rm .ai-dlc-adoption-plan.md`.

## Contexto detectado (Phase 1)

- **Estructura**: monorepo sin tooling de workspace. `backend/` (Express 5
  + better-sqlite3, TS) y `frontend/` (React 19 + Vite 8, TS). Sin
  `package.json` al root.
- **AI infra previa**: **ninguna**. Cero Categoría A (tools externas),
  cero Categoría B (custom del equipo). El bootstrap es **aditivo puro**:
  no hay merge, ni appended-section, ni conflictos de protocolo.
- **Memoria de sesión ad-hoc**: ninguna.
- **Branches**: sólo `main`. Sin ramas de ambiente, sin ramas de feature.
- **CI/CD**: ninguno. Sin pipelines, sin Dockerfile, sin artefactos de deploy.
- **Tests**: **cero** en todo el repo.
- **Acoplamiento**: 10 de 14 commits tocan `backend/` y `frontend/` a la
  vez → las features son *vertical slices*.

## Decisiones tomadas (Phase 2)

| Campo | Valor | Origen |
|---|---|---|
| `repo_type` | `custom` | Q1 — monorepo mixto; evita heredar 3 ambientes ficticios |
| `trackers[]` | `[]` | Q2 — sin ADO/GitHub Issues; specs son la unidad de trazabilidad |
| `environments[]` | `[main]` | Q3 — es la única rama que existe |
| `promotion_path` | `[main]` | Derivado de Q3 (un solo ambiente, sin orden que decidir) |
| Rama base del bootstrap | `main` | Q4.bis |
| `runtime.type` | `none` | Q5 — corre en local, sin deploy |
| `branch_pattern` | `feat/` | Q6 — sin historial previo; default de la metodología |
| `design_service` | no aplica (comentado) | Q7 — cero rastro de Figma |
| Ubicación de specs | `specs/` al root + `cross_cutting_specs: true` | Q10 — 10/14 commits cruzan ambos sub-proyectos |
| `{{SERVICE_NAME}}` | `practica-finanzas` | Q8.1 |
| `{{OWNER_TEAM}}` | `EdwardR` | Q8.2 — autor único de 14/14 commits |
| `{{LEAD_EMAIL}}` | `edrlxyz@gmail.com` | Q8.3 — `user.email` del target |
| `finanzas.db*` | untrackear + `.gitignore` | Extra — data de prueba, resets frecuentes |
| `.gitattributes` | scopeado a rutas AI-DLC | Extra — evita renormalizar 53 archivos CRLF |
| `AGENTS.md` | copiar tal cual (529 líneas) | Extra — trimear rompería el `--upgrade` |
| Runbooks de adopción | copiar los 3 | Extra — habilitan `--upgrade` en modo Y |

**Preguntas del catálogo que NO aplicaron** (sin evidencia que las
motive): Q2.a–Q2.d (sin tracker), Q4 (derivada), Q9 (sin Categoría B),
Q11 y Q17 (sin memoria ad-hoc), Q12 (sin `CLAUDE.md`), Q13 (sin
`.cursorrules`), Q14 y Q15 (sin pipelines), Q16 (sin skills instaladas).

## OPEN_QUESTIONS pendientes

Ninguna bloquea el bootstrap. Todas deben resolverse antes del primer
merge o de la primera spec, según se indica.

1. **[ALTA] Cero tests en el repo.** No hay script `test`, ni archivos de
   test, ni dependencias de testing en ninguno de los dos
   `package.json`. AI-DLC apoya sus gates de verificación (G2
   requirements verificables, G4 implementación verificada) en tests
   ejecutables. Sin ellos, esos gates son manuales.
   → `stack/testing.md` queda como TODO honesto. Resolver antes de la
   primera spec que llegue a G4.

2. **[MEDIA] `gate` del ambiente `main` sin definir.** Sin CI ni tests no
   hay criterio automatizable de promoción.
   → Queda `gate: "TODO — sin CI ni tests aún"` en `repo-config.yaml`.

3. **[MEDIA] Schema de la DB no consolidado.** Declarado por el dev: la
   base se resetea seguido mientras el schema se estabiliza. El schema
   vive en `backend/src/data/database.ts` como `CREATE TABLE IF NOT
   EXISTS`, sin mecanismo de migración.
   → Considerar declarar las specs que toquen el schema como modalidad
   `refactor-only` (refactoriza preservando comportamiento, sin crear
   requirements nuevos) hasta que se consolide.

4. **[BAJA] Branch policies de GitHub no detectables.** `gh` CLI no está
   instalado y no hay `CODEOWNERS`.
   → Revisar los requisitos de merge al abrir el PR.

5. **[BAJA] Configuración hardcodeada.** Puerto `3000` en
   `backend/src/server.ts:19`, `http://localhost:3000` repetido en los 4
   clientes de `frontend/src/api/`, y `cors()` abierto a todo origen
   (`server.ts:10`).
   → Candidatos a `stack/constraints.md` y `stack/security.md`. No se
   toca código en el bootstrap.

## Archivos a CREAR — 58

Todos bajo `C:\UC_proyectos\practica-finanzas\`.

**Raíz — protocolo y config (7)**

| Path | Rol en el manifiesto | Nota |
|---|---|---|
| `AGENTS.md` | `bracketed` | Instrucciones para toda tool agente. Sentinels `v=0.23`. Placeholders sustituidos. |
| `CLAUDE.md` | `owned` | Redirect a `AGENTS.md`. |
| `repo-config.yaml` | `template` | Con los valores negociados arriba. |
| `ADOPT.md` | `owned` | Protocolo de adopción; habilita `--upgrade` en modo Y. |
| `BOOTSTRAP.md` | `owned` | Runbook greenfield. |
| `BROWNFIELD-CHECKLIST.md` | `owned` | Runbook brownfield manual. |
| `.gitattributes` | `owned` | **Generado scopeado**, no copiado tal cual (ver abajo). |

**`.agents/` — canonical de comandos y plantillas (19)**

- `.agents/commands/` × 12 → `ado-link`, `ado-status`, `adopt`,
  `bug-triage`, `spec-amend`, `spec-clarify`, `spec-handoff`,
  `spec-implement`, `spec-new`, `spec-promote`, `spec-status`,
  `spec-verify`. Rol `owned`.
- `.agents/templates/spec/` × 5 → `requirements.md`, `design.md`,
  `tasks.md`, `status.md`, `checklist-requirements.md`. Rol `owned`.
- `.agents/templates/README.md`, `.agents/skills/README.md`. Rol `owned`.

> `.agents/skills/` queda **vacía de skills** por diseño (zero defaults).

**`.claude/commands/` — vistas para Claude Code (12)**

⚠️ **Degradado documentado.** El target tiene `core.symlinks=false` y
Windows sin Developer Mode: probé crear un symlink y falla. Se escriben
como **wrappers de texto** cuyo contenido es la ruta relativa al
canonical (`../../.agents/commands/<name>.md`), no como symlinks modo
`120000`. Consecuencia: si el canonical cambia, el wrapper no lo refleja
solo. `scripts/restore-symlinks.sh` los convierte a symlinks reales en
un clone POSIX o con Developer Mode activo.

**`stack/` — conocimiento del stack (7)**

`architecture.md`, `constraints.md`, `patterns.md`, `security.md`,
`tech-stack.md`, `testing.md`, `README.md`. Rol `template` — pre-llenados
con lo detectado en Phase 1, el resto queda TODO explícito. **No** se
inventan NFRs, deploy target ni política de versionado.

**`specs/` (2)** — `README.md` + `.gitkeep`. Vacío: **no** se backfillean
specs retroactivas del código existente (anti-patrón *strangler*, §15).

**`guides/` (4)** — `MCP-azure-devops-windows.md`, `SHAPE-data-pipeline.md`,
`SHAPE-llm-agent.md`, `SHAPE-shared-service.md`. Rol `owned`.

**`scripts/` (3)** — `spec-lint.sh`, `spec-lint.ps1`, `restore-symlinks.sh`.

**`.org/` (2)** — `README.md`, `contracts/.gitkeep`.

**Otros (1)** — `.mcp.json.example`. El `.mcp.json` real **no** se crea
(`mcps: []`).

**Generado, no copiado (1)** — `.ai-dlc-version`: manifiesto per-archivo
con `sha256_at_install` de cada uno de los 57 anteriores, más el bloque
`placeholders:` que reusa `ai-dlc-upgrade`. Se escribe **al final**, con
los hashes del contenido final en disco (post-sustitución), para que el
primer `--upgrade` no detecte falsas modificaciones del usuario.

## Archivos a MODIFICAR — 1

**`.gitignore`** — merge quirúrgico, se preservan las 4 líneas actuales
(`node_modules/`, `dist/`, `.env`, `.env.local`). Se agregan:

- Bloque AI-DLC del template: transcripts de sesión datados
  (`YYYY-MM-DD-*.txt`), exports de otros agentes (`session-*.md`),
  `.claude/settings.local.json`, `coverage/`, `test-results/`,
  `playwright-report/`, `Thumbs.db`, `.DS_Store`, `.idea/`, `*.log`.
- Bloque de este repo, por la decisión sobre la DB:
  ```
  # SQLite local (schema en backend/src/data/database.ts)
  *.db
  *.db-shm
  *.db-wal
  ```

## Archivos a DESTRACKEAR — 3

```bash
git rm --cached backend/finanzas.db backend/finanzas.db-shm backend/finanzas.db-wal
```

**Los archivos locales NO se borran** — seguís trabajando igual. Sólo
dejan de versionarse. Reversible: viven en el historial hasta `main`.

## Archivos a MOVER — 0

No hay memoria de sesión ad-hoc ni Categoría B que consolidar.

*(En una corrida real, al cerrar Phase 4 este plan se movería a
`archive/ai-dlc-adoption-plan.md`. En dry-run queda donde está.)*

## Archivos a CONSOLIDAR (Categoría B) — 0

No se detectó AI infra custom del equipo.

## Archivos NO TOCADOS

Confirmación explícita de lo que queda **intacto**:

- **`backend/**`** — los 24 archivos fuente. Cero cambios de código.
- **`frontend/**`** — los 45 archivos fuente, incluidos `README.md`
  (boilerplate de Vite), `.gitignore` propio, `eslint.config.js`, los 3
  `tsconfig*.json` y `vite.config.ts`.
- **`backend/finanzas.db*`** — se destrackean, **no se borran ni modifican**.
- Los 53 archivos en CRLF — el `.gitattributes` scopeado **no** los
  renormaliza.
- Historial de git — sin rebase, sin reescritura, sin renombre de ramas.

## Desviaciones del protocolo, registradas

1. **`AGENTS.md` de 529 líneas** vs el target de ~100 que fija
   `ADOPT.md:489`. Aceptado deliberadamente: es deuda conocida del
   template (`ADOPT.md:522`), y trimearlo haría divergir el bloque
   bracketed, forzando resolución de conflicto en cada `--upgrade`.
2. **`.gitattributes` generado en vez de copiado.** El del template trae
   `* text=auto eol=lf`, que renormalizaría 53 archivos de código ajenos
   al bootstrap.
3. **`.claude/commands/` como wrappers de texto** en vez de symlinks, por
   limitación de plataforma.
4. **Gap del protocolo (del repo del methodology, no de este target)**: el
   schema del manifiesto en `ADOPT.md:1248` lista `stack/conventions.md`,
   que no existe en el payload real (hay `stack/patterns.md` y
   `stack/README.md`). El manifiesto se generaría contra el payload real.

## Commit propuesto

```
chore: adopt AI-DLC v0.23 [bootstrap]

- Estructura AI-DLC: .agents/ (12 comandos + 5 plantillas de spec),
  stack/ (7 docs), specs/, guides/, scripts/, .org/
- repo-config.yaml: repo_type custom, sin tracker, ambiente unico main,
  runtime none, specs cross-cutting al root
- AGENTS.md + CLAUDE.md con sentinels v=0.23
- .gitattributes scopeado a rutas AI-DLC (no renormaliza backend/ ni frontend/)
- .gitignore: patrones AI-DLC + SQLite local
- Destrackea backend/finanzas.db* (data de prueba, se resetea seguido)
- Manifiesto .ai-dlc-version para --upgrade futuro

Sin cambios de codigo en backend/ ni frontend/.

Methodology: see ai-dlc-methodology.md v0.23
```

## Reversión

```bash
git -C C:\UC_proyectos\practica-finanzas checkout main
git -C C:\UC_proyectos\practica-finanzas branch -D chore/adopt-ai-dlc
```

Para descartar este plan en dry-run:

```bash
rm C:\UC_proyectos\practica-finanzas\.ai-dlc-adoption-plan.md
```

## Siguientes pasos post-merge

1. Llenar los TODO de `stack/tech-stack.md`, `stack/architecture.md` y
   `stack/security.md` con lo que sólo vos sabés (NFRs, deploy target).
2. Resolver OPEN_QUESTION #1: decidir framework de test (Vitest encaja
   con Vite en el frontend; node:test o Vitest en el backend) y agregar
   el script `test` a ambos `package.json`.
3. Primera spec con `/spec-new <slug>`. Candidata natural según el
   historial: consolidar el schema de la DB, en modalidad `refactor-only`.
4. Dejar de commitear directo a `main` — AI-DLC es PR-only por diseño.

---

## ENMIENDA — aplicada durante Phase 4 (2026-07-22)

**Corrección de Q10.** Al escribir `repo-config.yaml` se leyó la
semántica real de `cross_cutting_specs` (`methodology:1550-1563`) y se
detectó que el flag está diseñado para **feature parity** (sub-proyectos
que implementan el mismo contrato y deben espejarse), no para el
**layering** de este repo (backend expone API, frontend consume).

`methodology:1562` marca como anti-patrón usar el flag sin parity real.

**Resolución acordada con el dev**: se mantiene `cross_cutting_specs:
true` porque la ubicación de specs al root sí es la correcta (10/14
commits cruzan ambos sub-proyectos), pero se documenta explícitamente en
`repo-config.yaml > monorepo` que:

- NO aplica matriz de tests por sub-proyecto,
- NO aplica drift-de-parity como bloqueo de promoción,
- cada `R*.*` declara su capa con `[only: backend]` / `[only: frontend]`
  en vez de asumir cobertura en ambos.

Se agregó además el bloque `monorepo.services[]` declarando los tipos
individuales (`backend: service`, `frontend: frontend-app`), que el plan
original no contemplaba.

**Gap del protocolo detectado**: `ADOPT.md:1117` indica sustituir
`<METHODOLOGY_VERSION>` y `{{...}}` "en todos los archivos copiados",
pero los runbooks del propio template (`BOOTSTRAP.md:226`,
`BROWNFIELD-CHECKLIST.md:349`) apuntan el `sed` sólo a `AGENTS.md
repo-config.yaml`. Se siguió el criterio de los runbooks: sustituir en
`ADOPT.md`/`BOOTSTRAP.md`/`BROWNFIELD-CHECKLIST.md` habría corrompido
sus tablas de referencia y sus comandos `sed`, que citan los
placeholders literalmente.
