---
name: spec-new
description: Iniciar una feature spec con entrevista guiada
---

# `/spec-new <feature-slug>` — Iniciar una feature spec

Sigue el protocolo §7 (AGENTS.md). Para la feature `<feature-slug>`:

1. **CONTEXT** — verificar:
   - Repo actual y rama de trabajo.
   - **`stack/` completo**: si algún archivo de `stack/` aún tiene
     `TODO`, **parar** y proponer `Bootstrap` (ver AGENTS.md § Bootstrap)
     antes de iniciar la spec.
   - ¿La feature pertenece a una Initiative? Si sí, pedir URL o slug
     (recordar: Initiative es opcional, §6 del methodology).
   - ¿Hay un PR de requerimiento del cliente, work item de origen,
     conversación previa relevante?

2. **WORKTREE** — preparar el espacio de trabajo aislado (§6 del
   methodology *Configuración del repo* + *Worktree, ramas y flujo de
   promoción*):
   - **Leer** `repo-config.yaml` y obtener las ramas declaradas en
     `environments[].branch`. Si el archivo no existe, **parar** y
     proponer crearlo antes de seguir (no asumir `pruebas/qa/main`
     por reflejo).
   - **Preguntar** la rama base ofreciendo **sólo** las ramas
     declaradas (default = la primera de `promotion_path`).
   - **Proponer** crear:
     `git worktree add -b feat/<feature-slug> ../<repo>--<feature-slug> origin/<base>`
     y pedir OK antes de ejecutar (acción reversible pero observable).
   - Tras crear, **verificar** que el `cwd` quedó en el worktree nuevo
     antes de continuar.

3. **CLARIFY** — entrevista guiada, **una pregunta a la vez**:

   **3.a Overlap con specs existentes** — antes de cualquier otra
   pregunta, listar las features actuales en `specs/` y confirmar con
   el dev que ésta es realmente nueva (no continuación, extensión o
   amendment de algo ya existente). Si hay overlap, proponer
   `/spec-implement` o `/spec-amend` y cerrar este flujo.

   **3.b Discover work item existente** — sólo si
   `repo-config.yaml > trackers[]` declara al menos un tracker:

   > "¿Esta spec corresponde a un work item existente?
   > (a) Sí — pásame el ID o el título que busque. *(Recomendado
   >     en brownfield con `creation_mode: discover-first`.)*
   > (b) Parcial — el padre existe, faltan children por crear.
   > (c) No — es nueva; propondré crear la jerarquía en EXECUTE."

   IF (a) o (b): consultar vía MCP o `az boards work-item show` /
   `az boards query`. Reportar lo encontrado (Feature, children,
   Acceptance Criteria — son **input** para los R*.*, no se
   descartan). Si el repo declara trackers `stakeholder`, preguntar
   también si implementa una Feature/Story del project stakeholder y
   citarla en `status.md > work_items.stakeholders[]`.
   **Anti-patrón duplicación catastrófica**: antes de proponer crear
   work items, buscar por título similar y reportar matches (§13).

   **3.c Entrevista funcional**:
   - ¿Cuál es el problema que resuelve? ¿Quién es el usuario primario?
   - ¿Cuáles son los criterios de éxito **observables**? (forzar NFRs
     medibles — "rápido" no vale; "p99 < 500ms" sí)
   - **¿Cómo se parte en slices priorizados?** Identificar P1 (el MVP:
     lo mínimo que entrega valor y es desplegable solo) y qué queda
     para P2/P3. Cada slice declara su **prueba independiente**
     (plantilla § Slices priorizados). Si la feature no admite partición,
     declararlo (una feature de un solo slice es válida).
   - ¿Restricciones legales / compliance / residencia de datos? (cruzar
     con `stack/security.md`)
   - ¿Toca otros servicios? ¿De qué equipos? Si sí, **escalar al
     Architect Agent** (§7 del methodology).
   - ¿Depende de algo que aún no existe (SP, endpoint, librería,
     componente de diseño)? — futuras `D-N` (§6).
   - **¿Requiere nuevas dependencias** (npm/pip/nuget/etc.)? Si sí,
     listar las anticipadas y marcar `OPEN_QUESTION` sobre
     licencia/vulnerabilidades/policy. El OK de cada dep es parte de
     G2 (ver AGENTS.md *Dependencias nuevas*).
   - ¿Cómo se prueba cada R*.* (unit / integration / e2e / contract /
     load / accessibility)? Cruzar con `stack/testing.md`.
   - Lo que no tenga respuesta clara: marcar inline
     `[NEEDS CLARIFICATION: <pregunta + opciones>]` (**máximo 3** en
     toda la spec — si necesitas más, la conversación de intent no
     alcanzó: seguir entrevistando antes de escribir) o registrarlo
     en `OPEN_QUESTIONS` con `owner:` y `due:` si la respuesta depende
     de un tercero. **NO inventar** (§3.12).

   **3.d Conflict scan cross-spec** — antes de PROPOSE, comparar la
   spec nueva contra las specs activas del repo (state ≠ `legacy`,
   `archived`, `cancelled`) buscando contradicciones: mismo endpoint
   con shapes distintos, feature flags con sentidos opuestos, NFRs
   incompatibles (timeouts, límites, formatos), módulos compartidos
   con reglas opuestas. Reportar candidates con cita explícita
   (`specs/<otra>/R*.*` vs lo nuevo) y resolver cada uno con el dev:
   (a) alinear mi spec, (b) amendment de la otra, (c) coexisten
   intencionalmente → documentar en `design.md > Conflicts resolved`,
   (d) `OPEN_QUESTION`. Falsos positivos esperables — mejor
   sobre-detectar. Si no hay conflictos, **declararlo explícitamente**
   (el silencio es ambiguo).

4. **PROPOSE** la estructura inicial; pedir OK antes de escribir.
   Si 3.b fue (a): los `R*.*` se extraen de los Acceptance Criteria
   existentes y `tasks.md` mapea a los work items con
   `discovered: true` — **cero work items nuevos**. Si (b)/(c):
   proponer los faltantes con comandos `az` listos, OK por cada uno.

5. **EXECUTE** — crear `specs/<feature-slug>/` **copiando las
   plantillas de `.agents/templates/spec/`** (no generar de memoria —
   las plantillas traen los guardrails):
   - `requirements.md` ← plantilla, llena con la entrevista (slices,
     EARS + Tests strategy, Dependencies, Clarifications vacía,
     OPEN_QUESTIONS).
   - `design.md` ← plantilla, esqueleto (se llena tras aprobar
     requirements). Aplicar `stack/architecture.md`.
   - `tasks.md` ← plantilla, vacío hasta que design esté firmado.
   - `status.md` ← plantilla (state: not-started, tabla Gates en
     pending).
   - `checklists/requirements.md` ← plantilla checklist, **adaptada**:
     conservar los items base CHK-001..016 y agregar items específicos
     de la feature detectados en la entrevista (accesibilidad si hay
     UI, retención si hay PII, idempotencia si hay pagos/webhooks,
     límites si hay archivos/colas...).

6. **CLOSE** — reportar qué se creó, marcadores
   `[NEEDS CLARIFICATION]` y `OPEN_QUESTIONS` abiertas (bloquean G2),
   y siguiente paso sugerido: **`/spec-clarify <feature-slug>`** para
   resolver ambigüedades de forma estructurada, luego completar la
   checklist y pedir firma G2.

**STOP — gate G2**. La firma de G2 requiere: checklist de requirements
**completa**, **0** `OPEN_QUESTIONS` abiertas y **0** marcadores
`[NEEDS CLARIFICATION]` (verificable con `scripts/spec-lint` y
`/spec-verify --pre-g2`). Mostrar la spec al dev y **esperar OK
explícito** antes de invocar `/spec-implement`. NO escribir código de
producción todavía, aunque el requerimiento "esté claro" o "sea
rápido" — el dev pierde la chance de ajustar la spec **antes** de que
existan archivos de código que toque revertir (§3.16 del methodology).
