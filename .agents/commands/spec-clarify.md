---
name: spec-clarify
description: Resolver ambigüedades de una spec con preguntas estructuradas antes de firmar G2
---

# `/spec-clarify <feature-slug>` — Clarificación estructurada

Sigue el protocolo §7 (AGENTS.md). Reduce la ambigüedad residual de
`specs/<feature-slug>/requirements.md` **antes** de firmar G2. Se
invoca después de `/spec-new` (o en cualquier momento mientras
`status: draft | in-review`). Read-mostly: sólo escribe en
`requirements.md` y `checklists/requirements.md`.

1. **CONTEXT** — leer `requirements.md` completo (incluida la
   checklist si existe). Si `status: approved` o posterior, **parar**:
   los cambios a una spec aprobada van por `/spec-amend`, no por
   clarify.

2. **SCAN de ambigüedad** — evaluar la spec contra esta taxonomía y
   marcar cada categoría `Clara` / `Parcial` / `Faltante`:

   | Categoría | Qué busca |
   |---|---|
   | Alcance | Límites difusos, "fuera de scope" vacío, slices sin prueba independiente |
   | Dominio y datos | Entidades sin definir, cardinalidades ambiguas, ciclo de vida de los datos (retención, borrado) |
   | Flujo de interacción | Pasos del usuario sin orden claro, estados de UI/proceso sin transiciones |
   | Atributos no funcionales | "rápido/seguro/escalable" sin umbral; NFRs faltantes para el tipo de feature |
   | Integraciones y D-N | Dependencias mencionadas en prosa pero no declaradas como D-N; contratos sin versión |
   | Edge cases | Vacío, máximo, concurrencia, duplicados, errores de terceros sin R*.* |
   | Restricciones | Legal/compliance/residencia de datos no cruzadas con `stack/security.md`; límites del stack |
   | Terminología | Mismo concepto con dos nombres; jerga del cliente sin definir |
   | Señal de completitud | ¿Cómo se sabe que la feature está "lista"? Métricas de éxito no observables |
   | Otro | Lo que no encaje arriba |

   **Insumos adicionales del scan** (entran a la misma cola):
   - Marcadores `[NEEDS CLARIFICATION: ...]` inline (prioridad alta —
     el autor ya sabía que faltaba).
   - `OPEN_QUESTIONS` abiertas cuyo dueño es el propio dev presente
     (las de owner externo NO se inventan aquí — siguen abiertas con
     su due).

3. **PRIORIZAR** — máximo **5 preguntas** por sesión, ordenadas por
   `impacto × incertidumbre` (impacto = cuánto cambia
   arquitectura/datos/UX/tests si la respuesta sorprende). Si hay más
   de 5 candidatas, las restantes se listan al final como *diferidas*
   (el dev decide si correr otra sesión o registrarlas como
   `OPEN_QUESTIONS` con owner/due).

4. **PREGUNTAR — una a la vez**, formato obligatorio:
   - **Multiple choice** (default): tabla de 2-5 opciones, con la
     recomendada marcada y justificada en 1 línea:

     > **P1 (Atributos no funcionales)** — R2.1 dice "la búsqueda
     > responde rápido". ¿Qué umbral fijamos?
     >
     > | Opción | Umbral | Notas |
     > |---|---|---|
     > | A (Recomendada) | p95 < 1s | consistente con el resto del módulo |
     > | B | p99 < 500ms | exige cache; ¿lo justifica el caso? |
     > | C | Otro | dime el valor |
   - **Respuesta corta** cuando no hay opciones enumerables: pedir
     valor concreto (≤5 palabras) y ofrecer un default sugerido.
   - Si el dev contesta "la recomendada" / "ok", usar la propuesta.
   - Esperar la respuesta antes de la siguiente pregunta (§3.12).

5. **INTEGRAR cada respuesta inmediatamente** (no acumular al final):
   - Registrar en la sección `## Clarifications` de `requirements.md`
     bajo `### Session <YYYY-MM-DD>`:
     `- Q: <pregunta> → A: <respuesta final>`
   - **Aplicar** la decisión donde corresponda: reescribir el `R*.*`
     afectado, agregar uno nuevo, actualizar NFR/edge case/D-N, y
     borrar el marcador `[NEEDS CLARIFICATION]` resuelto.
   - Si la respuesta resuelve una `OPEN_QUESTION`, marcarla
     `- [x] ... resuelto: <fecha> con <decisión corta>`.
   - No reordenar secciones ni renumerar R*.* existentes.

6. **RE-VALIDAR checklist** — si existe
   `checklists/requirements.md`, re-evaluar los items afectados y
   actualizar `[ ]`→`[x]` sólo donde el estado realmente cambió.
   Reportar conteo antes/después.

7. **CLOSE** — reportar:
   - Tabla de cobertura: categoría → Clara / Parcial / Faltante /
     Diferida.
   - Q&A integradas y R*.* tocados.
   - Marcadores `[NEEDS CLARIFICATION]` y `OPEN_QUESTIONS` restantes
     (recordar: bloquean G2).
   - Siguiente paso sugerido: otra sesión de clarify, completar
     checklist, o pedir firma G2 (`/spec-verify --pre-g2` primero).

**Anti-patrones**: preguntar las 5 de una vez (abruma y el dev contesta
mal); preguntar lo que la spec ya responde (leer antes de preguntar);
hacer preguntas genéricas de catálogo en vez de citar el texto
ambiguo concreto; "resolver" en el chat sin persistir en
`## Clarifications` (la decisión se pierde — es el anti-patrón que
esta sesión existe para evitar).
