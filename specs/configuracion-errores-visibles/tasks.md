<!--
  GUARDRAILS (de la plantilla, conservados):
  - Organizar por FASES: Setup → Foundational (bloqueante) → una fase
    por slice (P1, P2) → Polish. Setup + Foundational + P1 debe dar algo
    desplegable.
  - Cada task cita los R*.* que cubre. Una task sin R*.* es sospechosa.
  - [P] sólo si es paralelizable dentro de su fase.
  - Cada fase cierra con un CHECKPOINT observable.
  - Tamaño: S (< 1h), M (media jornada), L (1+ día).

  ESTADO: vacío a propósito. Se deriva DESPUÉS de que design.md esté
  firmado (gate G2). Ver AGENTS.md § Workflow.
-->
# Tasks: Errores visibles en Configuración

> ⚠️ **Vacío a propósito.**
>
> Las tasks se derivan de `design.md`, y `design.md` todavía es un
> esqueleto. Llenarlo antes de firmar G2 llevaría a estimar trabajo
> sobre decisiones que aún pueden cambiar.
>
> **Siguiente paso**: completar `design.md`, firmar G2, y recién ahí
> derivar las tasks — o dejar que `/spec-implement` las derive.

<!--
  Forma prevista de las fases, según los slices de requirements.md.
  NO son tasks todavía: es el esqueleto para cuando se deriven.

  Fase 0 — Setup
    (probablemente vacía: sin dependencias nuevas que aprobar)

  Fase 1 — Foundational (bloqueante para P1 y P2)
    - AppError + middleware de errores          [DEC-2]
    - Repositories a factory con conexión       [DEC-3]
    - Conteo de movimientos por entidad         [R1.1, R1.3]

  Fase 2 — Slice P1 (borrado bloqueado con motivo visible)
    - Backend: rechazo 409 en las 3 entidades   [R1.1–R1.5]
    - Frontend: clientes propagan el mensaje    [R2.1]
    - Frontend: mensaje inline en las 3 secciones [R2.1–R2.4]

  Fase 3 — Slice P2 (errores visibles en crear y editar)
    - Backend: 400 con mensaje de validación    [R3.3]
    - Frontend: crear y editar muestran el error [R3.1, R3.2, R3.4]

  Fase final — Polish
    - Verificar NFR1: comportamiento idéntico en las 3 entidades
-->
