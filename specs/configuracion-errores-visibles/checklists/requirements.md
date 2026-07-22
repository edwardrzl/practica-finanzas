<!--
  CONCEPTO — "unit tests del requirements": esta checklist valida la
  CALIDAD DE LA REDACCIÓN de la spec, NO la implementación.

  REGLAS:
  - Numeración global CHK-NNN incremental; nunca renumerar.
  - ≥80% de los items con referencia de trazabilidad.
  - Máximo ~25 items.
  - GATE G2: se firma sólo con TODOS los items [x] o tachados con
    justificación.
-->
# Checklist de requirements: configuracion-errores-visibles

**Propósito**: validar que `requirements.md` está listo para firmar G2.
**Creada**: 2026-07-22 · **Spec**: [requirements.md](../requirements.md)

## Completitud

- [ ] CHK-001 ¿Cada slice (P1/P2) declara su prueba independiente? [Estructura]
- [ ] CHK-002 ¿Todos los flujos de error/excepción tienen un R*.* (IF/THEN)? [Gap]
- [ ] CHK-003 ¿Los casos límite (vacío, máximo, concurrencia, duplicados) están contemplados? [Gap]
- [ ] CHK-004 ¿"Fuera de scope" lista lo que un lector podría asumir incluido? [Estructura]

## Claridad

- [ ] CHK-005 ¿Cero adjetivos sin métrica ("rápido", "intuitivo", "robusto", "escalable")? [Claridad]
- [ ] CHK-006 ¿Cero marcadores [NEEDS CLARIFICATION] pendientes? [Claridad]
- [ ] CHK-007 ¿Cada R*.* admite UNA sola interpretación razonable? [Claridad]
- [ ] CHK-008 ¿Los términos de dominio se usan consistentemente (sin sinónimos intercambiados)? [Claridad]

## Testeabilidad

- [ ] CHK-009 ¿Cada R*.* tiene `Tests:` declarado con niveles concretos (o `none` justificado)? [Cobertura]
- [ ] CHK-010 ¿Cada R*.* es verificable por un test automatizable? [Cobertura]
- [ ] CHK-011 ¿Las métricas de éxito son medibles sin leer el código? [Cobertura]

## Consistencia

- [ ] CHK-012 ¿Ningún R*.* contradice a otro R*.* o a un NFR? [Conflicto]
- [ ] CHK-013 ¿El conflict scan cross-spec (3.d) corrió y sus hallazgos están resueltos o documentados? [Conflicto]

## Dependencias y supuestos

- [ ] CHK-014 ¿Toda dependencia externa está declarada como D-N con estado y estrategia? [Gap]
- [ ] CHK-015 ¿Las OPEN_QUESTIONS abiertas tienen owner y due? (0 abiertas para firmar G2) [Estructura]
- [ ] CHK-016 ¿Los supuestos tomados como default están escritos (no implícitos en la cabeza del autor)? [Gap]

## Items específicos de esta feature

<!-- Derivados de la entrevista: hay UI, hay integridad referencial, hay
     tres entidades que deben comportarse igual, y hay una decisión de
     producto (bloquear) con tres alternativas descartadas. -->

- [ ] CHK-017 ¿Se distingue sin ambigüedad el rechazo por "entidad en uso" (409) del rechazo por "entidad inexistente" (404)? [R1.2, R1.5]
- [ ] CHK-018 ¿El texto del mensaje al usuario está especificado en cuanto a qué información incluye, sin fijar la redacción exacta? [R1.3]
- [ ] CHK-019 ¿Se declara explícitamente que ningún mensaje de error puede exponer montos, saldos ni descripciones de movimientos? [R1.3, Gap]
- [ ] CHK-020 ¿NFR1 (comportamiento idéntico en las tres entidades) es verificable entidad por entidad? [NFR1]
- [ ] CHK-021 ¿Está especificado qué ve el usuario mientras la operación está en curso (estado de carga)? [Gap]
- [ ] CHK-022 ¿Se define qué pasa si el backend no responde o la red falla, distinto de un rechazo con mensaje? [Gap]
- [ ] CHK-023 ¿Las tres alternativas descartadas (archivar, desvincular, cascada) están registradas con su razón, para no re-litigarlas en un amendment? [Estructura]
- [ ] CHK-024 ¿Se declara que la feature no cambia el schema, dado que no hay mecanismo de migración? [Gap]
- [ ] CHK-025 ¿El comportamiento del formulario tras un fallo (mantener datos ingresados) está especificado para crear y para editar? [R3.4]

<!-- CHK-021 y CHK-022 apuntan a huecos REALES detectados al redactar:
     ningún R*.* de la spec cubre hoy el estado de carga ni el fallo de
     red. Resolverlos en /spec-clarify puede agregar R*.* nuevos. -->
