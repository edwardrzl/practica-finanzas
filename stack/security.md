# Security

> **Servicio**: `practica-finanzas`
> **Estado**: pre-llenado por `/adopt` con lo observado. Casi todo acá
> es un hueco real, no un dato faltante: el repo hoy no tiene ninguna
> capa de seguridad. Se documenta para que quede visible, no para
> justificarlo.

**Contexto que acota el riesgo actual**: la app corre sólo en local, con
un usuario, contra una SQLite de datos de prueba descartables. Nada de
lo de abajo es urgente **mientras eso siga siendo cierto**. El día que
esto salga de `localhost`, todo lo de abajo se vuelve bloqueante.

## Autenticación

**Ninguna.** Los 4 routers de `backend/src/routes/` están abiertos: no
hay middleware de auth, ni sesión, ni token, ni API key. Cualquiera con
acceso al puerto 3000 puede leer y escribir todo.

<!-- TODO: definir si aplica. Si la app sigue siendo mono-usuario y
local, la respuesta puede ser legítimamente "no aplica" — pero
declararlo explícitamente. -->

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

<!-- TODO: si en algún momento se cargan movimientos reales, esto pasa a
ser lo más importante del archivo. -->

## Compliance

<!-- TODO: ninguna regulación declarada. Es un proyecto de práctica
personal, no un sistema productivo. Si eso cambia, evaluar qué aplica
según jurisdicción. -->

## Residencia de datos

No aplica: los datos viven en un archivo local, no hay infraestructura
desplegada (`repo-config.yaml > runtime.type: none`).

## Vulnerabilidades

**Sin política ni tooling.** No hay Dependabot, ni Snyk, ni Renovate
configurado. No hay `npm audit` en ningún flujo (no hay CI).

Superficie a tener en cuenta: **43 dependencias directas** entre los dos
sub-proyectos, todas con rango `^` (minor abierto). `better-sqlite3`
compila binarios nativos.

<!-- TODO: como mínimo, correr `npm audit` en ambos sub-proyectos de
tanto en tanto. Dependabot es gratis en GitHub y el repo ya está ahí. -->

## Auditoría

No se exige. No hay logging de eventos más allá del `console.log` de
arranque en `server.ts:19`.

## Hallazgo abierto — CORS

`backend/src/server.ts:10` usa `app.use(cors())` **sin configuración**,
lo que habilita cualquier origen (`Access-Control-Allow-Origin: *`).

En local con un solo frontend es inofensivo. Si esto se expone alguna
vez, hay que restringirlo al origen del frontend:

```ts
app.use(cors({ origin: "http://localhost:5173" }));
```

<!-- TODO: resolver junto con la extracción de configuración a env vars
(ver stack/constraints.md § Configuración hardcodeada). -->
