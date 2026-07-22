---
feature: <slug>
modality: code                  # code | config-only | data-migration | catalog-only | docs-only | refactor-only (§6)
initiative: NONE                # opcional — slug/URL sólo si pertenece a una Initiative
owner: <team-o-@persona>
status: draft                   # draft | in-review | approved | in-implementation | done
# work_items:                   # opcional — sólo si repo-config.yaml declara tracker (§13)
#   feature_id: <id-owner>
---
<!--
  PLANTILLA AI-DLC — requirements.md (canonical: .agents/templates/spec/)
  El Service Agent la copia a specs/<feature>/requirements.md durante
  /spec-new y la llena con la entrevista. Las notas en comentarios HTML
  son guardrails para el agente: se CONSERVAN en la spec generada (no
  renderizan y guían amendments futuros). El frontmatter YAML va
  SIEMPRE primero en el archivo (los parsers lo exigen).

  GUARDRAILS (obligatorios al llenar):
  - ✅ QUÉ necesita el usuario y POR QUÉ. ❌ CÓMO se implementa
    (nada de stack, librerías, endpoints internos, estructura de
    código — eso va en design.md).
  - Una acción por requirement. Si tiene "y", dividirlo.
  - NFRs medibles: "rápido" ❌ → "p99 < 500ms" ✅.
  - Casos negativos explícitos (qué hacer ante error/abuso/límite).
  - Cada R*.* debe ser TESTEABLE y NO AMBIGUO: si no puedes escribir
    un test que lo verifique, o admite dos interpretaciones razonables,
    reescribirlo o marcarlo.
  - Ambigüedad: marcar inline con [NEEDS CLARIFICATION: <pregunta
    concreta + opciones>]. MÁXIMO 3 en toda la spec — si necesitas
    más, la captura de intención fue insuficiente: volver a conversar
    con el dev antes de seguir. /spec-clarify los resuelve.
  - NO inventar: lo que no se sabe se marca, no se asume (§3.12).
-->

# Feature: <Nombre>

> *(Opcional)* Parte de [Initiative: <name>](<url>) — omitir si es self-contained.

## Contexto

<!-- Por qué existe esta feature: problema, usuario primario, valor. -->

## Stakeholders

- <PM>
- <Tech lead>
- <Compliance/Legal — si aplica>

## Métricas de éxito

<!-- Medibles y agnósticas de tecnología, verificables sin leer código.
     ✅ "el usuario completa el flujo en < 2 min", "tasa de error < 0.5%"
     ❌ "la API responde 200", "el componente usa cache" -->
- <KPI 1>
- <KPI 2>

## Slices priorizados

<!-- Partir la feature en rebanadas INDEPENDIENTES por prioridad.
     P1 = el MVP: lo mínimo que entrega valor observable y es
     desplegable solo (alimenta partial-deploy, §3.10). P2/P3 son
     aditivos — no pueden ser prerequisito de P1.
     Cada slice declara cómo se prueba SIN las demás. Las tasks de
     tasks.md se organizan por slice. -->

### P1 — <nombre del slice> (MVP)
- **Por qué esta prioridad**: <valor que entrega solo>
- **Prueba independiente**: <cómo se valida sin P2/P3>
- **Cubre**: R1.*, R2.*

### P2 — <nombre del slice>
- **Por qué esta prioridad**: <...>
- **Prueba independiente**: <...>
- **Cubre**: R3.*

## Requisitos funcionales

<!-- EARS (§5): WHEN / WHILE / WHERE / IF-THEN / THE SYSTEM SHALL.
     Numeración estable R<grupo>.<n> — nunca renumerar; las R*.* se
     citan en commits, tests y PRs. Cada R*.* declara `Tests:` con
     niveles: unit | integration | e2e | contract | load |
     accessibility | security | none (este último con justificación). -->

### R1 — <Categoría> [P1]

**R1.1** WHEN <trigger>, THE SYSTEM SHALL <acción observable>.
         Tests: unit, integration

**R1.2** IF <condición de error>, THEN THE SYSTEM SHALL <manejo>.
         Tests: unit

### R2 — <Categoría> [P1]

...

## Requisitos no funcionales

**NFR1** THE SYSTEM SHALL <atributo medible> (<umbral, ej. p99 < 500ms>).
         Tests: load

## Dependencies

<!-- Omitir si no hay dependencias externas. Formato D-N (§6):
     todo lo que la feature necesita y aún no existe. -->

### D1 — <título corto>
- **Tipo**: humana | técnica | externa
- **Estado**: NEGOTIATING | AGREED | IMPLEMENTED | LIVE
- **Contrato**: <path/URL versionado>
- **Owner**: <equipo> / <@persona>
- **Tracking**: <URL al work item del proveedor>
- **ETA**: <informativo>
- **Estrategia**: MOCK | BLOCK | PIN | WORKAROUND
- **Mock**: `mocks/<nombre>.mock.<ext>`
- **Ready to unmock**: <condición observable>

## Fuera de scope

<!-- Explícito: lo que alguien podría asumir que entra y NO entra. -->
- <X>

## Dependencias internas

<!-- Opcional: otras features de este repo. -->
- Depende de: <feature>
- Bloquea: <feature>

## Clarifications

<!-- Registro persistente de decisiones tomadas durante /spec-clarify.
     NO borrar entradas — son la memoria de por qué la spec dice lo
     que dice. Formato por sesión: -->

### Session <YYYY-MM-DD>
- Q: <pregunta> → A: <respuesta final>

## OPEN_QUESTIONS

<!-- Preguntas que NO se pudieron resolver en la sesión. Toda entrada
     abierta BLOQUEA el gate G2 (status no puede pasar a approved).
     owner y due son obligatorios — spec-lint lo verifica. -->

- [ ] <pregunta> — owner: @<persona>, due: <YYYY-MM-DD>
