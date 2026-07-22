# stack/ — definición del stack y convenciones

> Esta carpeta contiene la **configuración estable** del repo: stack
> técnico, arquitectura, patrones, seguridad, restricciones, testing.
> Es el primer set de archivos que el Service Agent lee al arrancar.
>
> **Estado**: ✅ **Bootstrap completado el 2026-07-22.** Los seis
> archivos están cerrados, sin pendientes. El Service Agent puede
> generar código.
>
> Varias decisiones quedaron **declaradas pero todavía no
> implementadas** (marcadas `DECIDIDO — pendiente de implementar`):
> Vitest, ESLint en backend, Prettier, `.nvmrc`, `shared/types/`,
> middleware de errores, Dependabot y el workflow de CI. Eso es
> intencional — el Bootstrap declara el stack, no cambia código.

> **La metodología es agnóstica al stack**: no preescribe ni lenguaje,
> ni framework, ni arquitectura, ni testing framework. Tú decides.
> Estos archivos sirven para que esa decisión quede explícita y el
> agente la respete al implementar.

## Cómo llenar esto

Dos modos:

### Modo A — conversacional (recomendado)

Abre tu agente preferido (Claude Code, OpenCode, Cursor, Codex CLI,
Continue, Aider, etc.) en este repo y dile algo como:

> *"Bootstrap del stack: arranquemos por `tech-stack.md`."*

El Service Agent (definido en `AGENTS.md`) te va a hacer preguntas
concretas, una a la vez, y a escribir los archivos a medida que
decides. AGENTS.md es el estándar abierto que todas las tools agente
leen.

### Modo B — manual

Edita cada archivo de esta carpeta directamente. Cuando termines,
dile al agente: *"el stack está completo, sustituye los placeholders
en AGENTS.md"*.

## Orden recomendado

1. `tech-stack.md` — qué lenguaje / framework / BD / runtime usas.
2. `architecture.md` — qué patrón arquitectónico (Clean Arch, Hexagonal,
   MVC, Modular Monolith, Microservices, etc.).
3. `patterns.md` — naming, formato de commits, organización de tests.
4. `security.md` — auth, secretos, PII, compliance.
5. `constraints.md` — qué está prohibido (anti-patrones de **este**
   proyecto, no globales).
6. `testing.md` — niveles de test, cobertura mínima, herramientas.

Cada archivo bloquea al siguiente: no tiene sentido decidir
`patterns.md` antes de saber qué framework usas.
