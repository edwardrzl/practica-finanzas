# Setup del MCP de Azure DevOps (Claude Code / Windows SYC)

El MCP `azure-devops` (declarado en `repo-config.yaml > mcps`) se configura en `.mcp.json`
(raíz del repo). Habilita `creation_mode: discover-first` — leer Epics/Features de ADO
antes de crear specs. Esta guía deriva de fricción real diagnosticada en una adopción
brownfield SYC (2026-05-22): hay **3 capas** que destrabar en Windows corporativo.

## `.mcp.json` (TL;DR)

Copia el `.mcp.json.example` de la raíz a `.mcp.json` y ajusta `<org>` si no es `sycdevops`:

```jsonc
{
  "mcpServers": {
    "azure-devops": {
      "command": "npx",
      "args": ["-y", "@azure-devops/mcp", "sycdevops", "-a", "pat"],
      "env": {
        "NODE_USE_ENV_PROXY": "1",
        "HTTP_PROXY": "http://wsaprd.syc.loc:3128",
        "HTTPS_PROXY": "http://wsaprd.syc.loc:3128",
        "NO_PROXY": "*.syc.com.co,*.sycpruebas.com,localhost,127.0.0.1,::1"
      }
    }
  }
}
```

El `.mcp.json` **no contiene secretos** — el PAT va por variable de entorno (abajo), y el
proxy es un hostname interno, no un secreto. Es seguro commitearlo para el equipo.

> **Server local, no remoto.** Existe un server remoto (`https://mcp.dev.azure.com/{org}`,
> sin ejecución local → inmune al AV) pero **NO soporta Claude Code todavía** (sólo VS Code
> / Visual Studio — los demás requieren registro de OAuth Client ID en Entra). Para Claude
> Code → server local stdio.

## Por qué esta config (las 3 capas)

### 1. Global install → evita los temporales `_npx` que el AV bloquea

`npx -y` desempaqueta el paquete en `%LocalAppData%\npm-cache\_npx\<hash>\` (dirs con hash
**rotativo**); el AV corporativo cuarentena los binarios recién escritos ahí. Instala el
server global (ruta estable) **una vez por máquina**:

```
npm i -g @azure-devops/mcp
```

Con eso, `npx -y @azure-devops/mcp` resuelve al binario global estable y deja de tocar
`_npx`. El `.mcp.json` con forma `npx` no cambia (el global install es per-máquina).

### 2. Proxy → `NODE_USE_ENV_PROXY=1`

El `fetch` nativo de Node **no honra `HTTP(S)_PROXY` por defecto**. Sin esto el server no
alcanza `dev.azure.com` (timeout al resolver el tenant) y la primera llamada cae con
`-32000 Connection closed`. `git` sí anda porque libcurl respeta el proxy; Node fetch no.
Node 20+ con `NODE_USE_ENV_PROXY=1` + las env de proxy lo arregla (ver bloque `env`).

### 3. Auth por **PAT**, NO interactiva

La auth interactiva (default) abre el navegador lanzando PowerShell (`node → powershell
Start <login>`), patrón que el **antivirus corporativo SYC bloquea** (regla heurística
*"Inicio de PowerShell desde script de JScript"*) → la auth nunca completa. El **PAT usa
Basic auth, sin navegador** → esquiva el bloqueo. (`-a envvar` NO sirve: usa Bearer, no
Basic; un PAT de ADO necesita Basic.)

## Setup por dev (una vez)

1. **Node 20+** y el server global: `npm i -g @azure-devops/mcp`.
2. **Genera un PAT** en https://dev.azure.com/sycdevops/_usersSettings/tokens
   (scopes de lectura: **Work Items: Read**, **Project and Team: Read**; suma
   **Code: Read** / **Build: Read** si vas a usar repos/pipelines).
3. **Guarda el PAT como env var** (base64 de `:<PAT>` — usuario vacío = Basic auth de ADO):
   ```powershell
   setx PERSONAL_ACCESS_TOKEN ([Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(":<TU_PAT>")))
   ```
   El PAT vive en tu perfil de Windows — **nunca** en el repo.
4. **Reinicia Claude Code** (para heredar la env var y releer `.mcp.json`).
5. `/mcp` → `azure-devops` debe quedar **connected**.

## Verificación rápida del PAT (opcional, antes de reiniciar)

```powershell
$b64 = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(":<TU_PAT>"))
Invoke-RestMethod -Uri "https://dev.azure.com/sycdevops/_apis/projects?api-version=7.1" `
  -Headers @{ Authorization = "Basic $b64" } -Proxy "http://wsaprd.syc.loc:3128" |
  Select-Object -ExpandProperty value | Select-Object name
```
Si lista los proyectos (incluido `Edesk Web y Escritorio`), el PAT y el encoding están OK.

## Troubleshooting

- `PERSONAL_ACCESS_TOKEN is not set` → reinicia Claude Code tras el `setx` (las env nuevas
  sólo las heredan procesos nuevos).
- Conexión que se cae en la primera llamada (`-32000`) → el `fetch` no usa el proxy;
  confirma `NODE_USE_ENV_PROXY=1` en `.mcp.json`.
- Ventana del antivirus al ejecutar `node` → si bloquea, pide a IT excluir
  `%AppData%\npm\node_modules\@azure-devops\mcp`. Con PAT no debería dispararse el bloqueo
  de browser/PowerShell.
- Fallback: `.mcp.json` local **sin commitear** con `"command": "node"`,
  `"args": ["C:\\Users\\<user>\\AppData\\Roaming\\npm\\node_modules\\@azure-devops\\mcp\\dist\\index.js", "<org>", "-a", "pat"]`.
