# Security

> **Servicio**: `practica-finanzas`
> **Estado**: **completo** — pre-llenado por `/adopt` con lo observado y
> cerrado en la sesión de Bootstrap del 2026-07-22.

El repo hoy no tiene ninguna capa de seguridad. Eso se documenta para que
quede visible, no para justificarlo.

**Contexto que acota el riesgo actual**: la app corre sólo en local, con
un usuario, contra una SQLite de datos de prueba descartables. Nada de
lo de abajo es urgente **mientras eso siga siendo cierto**. El día que
esto salga de `localhost`, todo lo de abajo se vuelve bloqueante.

🔒 **Restricción raíz de este archivo** (§ PII, abajo): **está prohibido
cargar datos financieros reales en este repo.** Es lo que sostiene que
todas las decisiones de abajo sean "no aplica" en vez de deuda.

## Autenticación

**Ninguna.** Los 4 routers de `backend/src/routes/` están abiertos: no
hay middleware de auth, ni sesión, ni token, ni API key. Cualquiera con
acceso al puerto 3000 puede leer y escribir todo.

**DECIDIDO — no aplica, declarado explícitamente.** Mientras la app sea
mono-usuario y corra atada a `localhost`, no hay identidad que
autenticar: el límite de seguridad es la máquina, no la app. Agregar
auth ahora sería ceremonia sin sujeto.

Esto se sostiene **sólo** junto con la prohibición de cargar datos
reales (§ PII).

**Disparador**: que la app escuche fuera de `localhost`, o que haya un
segundo usuario. Ahí auth pasa a ser **bloqueante**, antes que cualquier
feature.

## Autorización

**No aplica**: sin autenticación no hay sujeto sobre el que autorizar.
No hay roles ni permisos en el modelo de datos.

## Manejo de secretos

**No hay secretos en el repo** — verificado en el escaneo de leaks de
`/adopt`: ningún `.env` trackeado, ningún `.pem`, ningún token ni
credencial en el código.

Tampoco hay **gestión** de secretos porque no hay secretos que gestionar
(SQLite embebido, sin servicios externos, sin API keys).

Reglas a mantener:

- `.env` y `.env.local` están en `.gitignore`. **No sacarlos.**
- Si aparece la primera credencial, crear `.env.example` con las claves
  y valores vacíos, y documentarla acá.
- NUNCA hardcodear secretos en código ni en specs.

## PII / datos sensibles

⚠️ **Este servicio maneja datos financieros por definición**: montos,
movimientos, saldos, cuentas y deudas (`cuentas.tipo` admite `'deuda'`).
Hoy son datos de prueba, pero el modelo es de información financiera
personal.

Estado actual:

- Sin encryption at rest — la SQLite es un archivo plano en disco.
- Sin encryption in transit — HTTP plano contra `localhost:3000`.
- Sin masking en logs.

`backend/finanzas.db` está **destrackeado** desde la adopción de AI-DLC,
justamente para que datos reales no lleguen al repo por accidente.

### 🔒 Prohibido cargar datos financieros reales

**DECIDIDO — restricción vigente.** Este repo es un proyecto de práctica
y **sólo admite datos de prueba**: montos inventados, cuentas ficticias,
movimientos descartables.

Por qué es una restricción y no una recomendación: las tres ausencias de
arriba (sin cifrado en reposo, sin TLS, sin masking) son aceptables
**exactamente porque** no hay nada que proteger. Cargar un extracto
bancario real las convierte a las tres en deuda urgente de golpe, en un
repo sin CI y sin tests.

Corolario práctico: la base se puede borrar en cualquier momento sin
consultar a nadie — lo cual ya es la estrategia de migración acordada
(`stack/tech-stack.md § Persistencia`). Las dos decisiones se sostienen
entre sí.

**Si alguna vez querés cargar datos reales**: no es un cambio de dato, es
un cambio de proyecto. Pasa a bloqueante, en este orden: cifrado en
reposo, TLS, auth, masking en logs.

## Compliance

**DECIDIDO — ninguna regulación aplica.** Proyecto de práctica personal,
sin usuarios, sin datos de terceros y sin datos reales (§ PII). No hay
titular de datos más que vos, así que no hay régimen que invocar.

**Disparador**: que la app procese datos de otra persona. Ahí sí hay que
evaluar qué aplica según jurisdicción, antes de escribir el primer
endpoint que los toque.

## Residencia de datos

No aplica: los datos viven en un archivo local, no hay infraestructura
desplegada (`repo-config.yaml > runtime.type: none`).

## Vulnerabilidades

**Sin política ni tooling.** No hay Dependabot, ni Snyk, ni Renovate
configurado. No hay `npm audit` en ningún flujo (no hay CI).

Superficie a tener en cuenta: **43 dependencias directas** entre los dos
sub-proyectos, todas con rango `^` (minor abierto). `better-sqlite3`
compila binarios nativos.

**DECIDIDO — pendiente de implementar: Dependabot.** Un
`.github/dependabot.yml` con **dos entradas** `package-ecosystem: npm`,
una por `directory` (`/backend` y `/frontend`) — no hay workspace al
root, así que una sola entrada no vería nada.

Se eligió por sobre `npm audit` manual porque no depende de acordarse y
no necesita CI: GitHub abre los PRs solo. El repo ya vive ahí.

Política de revisión: los PRs de Dependabot se revisan cuando llegan, no
se mergean a ciegas — sin tests todavía, nada verifica que un bump no
rompa. Prioridad a `better-sqlite3` (binario nativo) y a cualquier
avanzada de major.

## Auditoría

No se exige. No hay logging de eventos más allá del `console.log` de
arranque en `server.ts:19`.

## CORS — abierto, con disparador

`backend/src/server.ts:10` usa `app.use(cors())` **sin configuración**,
lo que habilita cualquier origen (`Access-Control-Allow-Origin: *`).

**DECIDIDO — se deja abierto mientras corra sólo en local.** En
`localhost`, con un frontend y sin auth ni cookies de sesión, restringir
el origen no protege nada: no hay credencial que un sitio hostil pudiera
hacer viajar.

Y restringirlo ahora significaría hardcodear
`http://localhost:5173` — justo el tipo de configuración que
`stack/constraints.md § Configuración` acaba de prohibir agregar.

**Disparador**: el primer deploy. Ahí se resuelve **junto con** la
extracción a variables de entorno, no antes ni por separado:

```ts
app.use(cors({ origin: process.env.FRONTEND_ORIGIN }));
```
