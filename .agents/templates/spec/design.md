<!--
  PLANTILLA AI-DLC — design.md (canonical: .agents/templates/spec/)
  Se llena DESPUÉS de que requirements.md esté aprobado (o al menos
  estable). Aquí sí va el CÓMO: arquitectura, contratos, datos.

  GUARDRAILS:
  - Todo componente/abstracción nuevo debe justificarse con un R*.*
    o NFR concreto. Si ningún requirement lo exige, no va — o se
    declara en "Complejidad justificada".
  - Cruzar con stack/architecture.md y stack/constraints.md: el
    design no contradice el stack declarado del repo.
  - Decisiones con notación DEC-N (no D-N — reservado a Dependencies).
  - Registrar alternativas rechazadas: el "por qué no" vale tanto
    como el "por qué sí" (evita re-litigar en amendments).
-->
# Design: <Feature>

## Arquitectura

<!-- Diagrama mermaid + prosa corta. Sólo los componentes que esta
     feature toca o crea. -->

## Componentes

| Componente | Responsabilidad | Justificado por |
|---|---|---|
| <nombre> | <una línea> | R<x>.<y> / NFR<n> |

## Modelo de datos

<!-- DDL o diagrama ER. Si modality: data-migration, incluir además:
     SQL exacto, plan de rollback por fase, plan de backfill (batch
     size, idempotencia, ETA), queries de verificación de invariantes
     (§6 expand-contract). -->

## Contratos

### API
<!-- OpenAPI snippet o link a .org/contracts/ -->

### Eventos
<!-- AsyncAPI snippet o link -->

## Decisiones (DEC-N)

- **DEC-1**: <decisión> — justifica R<x>.<y>.
  - Alternativas consideradas: <opción B> (rechazada porque <razón>).
- **DEC-2**: ...

## Complejidad justificada

<!-- Guardrail anti-overengineering. Si el design introduce algo que
     un revisor podría considerar más complejo de lo que los R*.*
     exigen (capa de abstracción extra, proyecto/paquete nuevo,
     patrón no usado en el repo, generalización "para el futuro"),
     declararlo aquí. Vacío = el design usa lo más simple que cumple.
     /spec-verify --pre-g2 reporta complejidad no declarada. -->

| Qué | Por qué es necesario | Alternativa más simple rechazada porque |
|---|---|---|
| <nada — omitir tabla si no aplica> | | |

## Despliegue

<!-- Según repo_type (§6). Para service: namespace, recursos, path a
     manifiestos. Para library: registry y versionado. -->

### Configuración

| Variable | Origen | Notas |
|---|---|---|
<!-- Secrets SIEMPRE por nombre/referencia, NUNCA por valor. -->

## Seguridad

- Auth: ...
- Datos sensibles / PII: ...
- Threat model: ... <!-- cruzar con stack/security.md -->

## Observabilidad

- Métricas: ...
- Logs: ...
- Alertas: ...

## Conflicts resolved

<!-- Sólo si el conflict scan de /spec-new (3.c) detectó conflictos
     con otras specs y se decidió coexistir: documentar el por qué. -->
