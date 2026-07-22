<#
spec-lint.ps1 — Linter mecánico de specs AI-DLC.

Capa "Garantía" de la metodología AI-DLC (§7 del methodology): verificación
mecánica de la consistencia estructural de las specs en specs/<feature>/
(status.md, requirements.md, checklists/requirements.md). Pensado para
correr local (pre-commit) o en CI. Self-contained: solo PowerShell 5.1
(sin módulos externos).

Uso:
  powershell -File spec-lint.ps1 [<repo-root>|.] [--feature <slug>]
  powershell -File spec-lint.ps1 --help

Salida: una línea por hallazgo con formato "ERROR <feature>: <mensaje>" o
"WARN <feature>: <mensaje>", más un resumen final.
Exit 0 si no hay errores; exit 1 si hay >= 1 error (los warnings no afectan).

Equivalente bash: spec-lint.sh (mismo comportamiento).
#>

function Show-Usage {
    Write-Output @'
spec-lint — linter mecánico de specs AI-DLC (capa "Garantía", §7 del methodology).

Uso: spec-lint.ps1 [<repo-root>|.] [--feature <slug>]

  <repo-root>        Raíz del repo adoptado (default: directorio actual).
  --feature <slug>   Lintea solo specs/<slug>/ en lugar de todas las features.
  --help, -h         Muestra esta ayuda.

Checks: E1-E9 (errores) y W1-W5 (warnings). Ignora specs/README.md,
specs/spikes/ y archivos sueltos bajo specs/.
Exit code: 0 si no hay errores, 1 si hay >= 1 error.
'@
}

# ---- Parseo de argumentos (estilo CLI, compatible con la versión bash) ------
$Root = '.'
$Feature = ''
$ArgList = @($args)
$i = 0
while ($i -lt $ArgList.Count) {
    $a = [string]$ArgList[$i]
    if ($a -eq '--help' -or $a -eq '-h') {
        Show-Usage
        exit 0
    }
    elseif ($a -eq '--feature') {
        if ($i + 1 -ge $ArgList.Count) {
            [Console]::Error.WriteLine('spec-lint: --feature requiere un <slug>')
            exit 1
        }
        $Feature = [string]$ArgList[$i + 1]
        $i += 2
    }
    elseif ($a -like '--*') {
        [Console]::Error.WriteLine("spec-lint: opción desconocida '$a'")
        exit 1
    }
    else {
        $Root = $a
        $i++
    }
}

$SpecsDir = Join-Path $Root 'specs'
if (-not (Test-Path -LiteralPath $SpecsDir -PathType Container)) {
    [Console]::Error.WriteLine("spec-lint: no existe el directorio '$SpecsDir'")
    exit 1
}

$script:ErrorsCount = 0
$script:WarningsCount = 0
$script:FeaturesCount = 0
$script:Today = Get-Date -Format 'yyyy-MM-dd'

function Write-LintError {
    param([string]$Feat, [string]$Message)
    Write-Output ("ERROR {0}: {1}" -f $Feat, $Message)
    $script:ErrorsCount++
}

function Write-LintWarn {
    param([string]$Feat, [string]$Message)
    Write-Output ("WARN {0}: {1}" -f $Feat, $Message)
    $script:WarningsCount++
}

# Frontmatter YAML de un archivo (líneas entre el primer '---' en la línea 1
# y el siguiente '---').
function Get-Frontmatter {
    param([string]$Path)
    # -Encoding UTF8: los .md de specs son UTF-8; el default ANSI de PS 5.1
    # rompería los caracteres acentuados.
    $lines = @(Get-Content -LiteralPath $Path -Encoding UTF8)
    if ($lines.Count -lt 1) { return @() }
    $first = $lines[0]
    if ($null -eq $first) { return @() }
    if ($first.TrimEnd() -ne '---') { return @() }
    $out = @()
    for ($k = 1; $k -lt $lines.Count; $k++) {
        if ($lines[$k].TrimEnd() -eq '---') { break }
        $out += $lines[$k]
    }
    return ,$out
}

# Valor de una clave simple del frontmatter (primera ocurrencia), sin comillas
# ni espacios finales.
function Get-FmValue {
    param([string]$Path, [string]$Key)
    foreach ($l in (Get-Frontmatter -Path $Path)) {
        $m = [regex]::Match($l, ('^' + [regex]::Escape($Key) + ':\s*(.*)$'))
        if ($m.Success) {
            $v = $m.Groups[1].Value.Trim()
            if ($v.Length -ge 2 -and $v.StartsWith('"') -and $v.EndsWith('"')) {
                $v = $v.Substring(1, $v.Length - 2)
            }
            elseif ($v.Length -ge 2 -and $v.StartsWith("'") -and $v.EndsWith("'")) {
                $v = $v.Substring(1, $v.Length - 2)
            }
            return $v
        }
    }
    return ''
}

# Líneas de la sección ## OPEN_QUESTIONS (hasta el siguiente encabezado '## ').
function Get-OpenQuestionLines {
    param([string[]]$Lines)
    $inSection = $false
    $out = @()
    foreach ($l in $Lines) {
        if ($l -match '^##[ \t]+OPEN_QUESTIONS') { $inSection = $true; continue }
        if ($inSection -and $l -match '^##[ \t]') { $inSection = $false }
        if ($inSection) { $out += $l }
    }
    return ,$out
}

function Test-OneFeature {
    param([string]$Dir, [string]$Feat)

    $script:FeaturesCount++
    $statusFile = Join-Path $Dir 'status.md'
    $reqFile = Join-Path $Dir 'requirements.md'
    $chkFile = Join-Path (Join-Path $Dir 'checklists') 'requirements.md'
    $state = ''
    $modality = ''
    $stateOk = $false

    # ---- status.md ---------------------------------------------------------
    if (-not (Test-Path -LiteralPath $statusFile -PathType Leaf)) {
        Write-LintError $Feat '[E1] falta status.md'
    }
    else {
        $state = Get-FmValue -Path $statusFile -Key 'state'
        $modality = Get-FmValue -Path $statusFile -Key 'modality'

        # E2: state ausente o fuera del set válido.
        if ($state -eq '') {
            Write-LintError $Feat "[E2] falta 'state:' en el frontmatter de status.md"
        }
        elseif ($state -match '^(not-started|in-progress|feature-complete|live|cancelled|legacy|partial-deploy-[A-Za-z0-9_-]+|deployed:[A-Za-z0-9_-]+)$') {
            $stateOk = $true
        }
        else {
            Write-LintError $Feat "[E2] state '$state' fuera del set válido en status.md"
        }

        # Tasks: líneas "T<n>: <task-state> | ..."
        $statusLines = @(Get-Content -LiteralPath $statusFile -Encoding UTF8)
        $total = 0
        $nCancelled = 0
        $nDoneDep = 0
        $anyDeployed = $false
        $anyProg = $false
        $lastEnv = ''
        foreach ($line in $statusLines) {
            $m = [regex]::Match($line, '^\s*T(\d+):\s*([^\s|]*)')
            if (-not $m.Success) { continue }
            $tnum = $m.Groups[1].Value
            $tstate = $m.Groups[2].Value

            # E3: estado de task no parseable contra el set válido.
            if ($tstate -notmatch '^(pending|blocked|in-progress|done|cancelled|deployed:[A-Za-z0-9_-]+)$') {
                Write-LintError $Feat "[E3] task T$tnum con estado inválido '$tstate'"
                continue
            }
            $total++

            if ($tstate -eq 'blocked') {
                # E4: blocked sin blocked_by: en la misma línea.
                if ($line -notmatch 'blocked_by:') {
                    Write-LintError $Feat "[E4] task T$tnum en 'blocked' sin 'blocked_by:' en la misma línea"
                }
            }
            elseif ($tstate -eq 'in-progress') {
                $anyProg = $true
            }
            elseif ($tstate -eq 'cancelled') {
                $nCancelled++
            }
            elseif ($tstate -eq 'done' -or $tstate -like 'deployed:*') {
                $nDoneDep++
                if ($tstate -eq 'done') {
                    $anyProg = $true
                }
                else {
                    $anyDeployed = $true
                    $lastEnv = $tstate.Substring('deployed:'.Length)
                }
                # W1: done/deployed sin hash de commit (heurística: falta "commit ").
                if (-not $line.Contains('commit ')) {
                    Write-LintWarn $Feat "[W1] task T$tnum '$tstate' sin hash de commit en la línea"
                }
            }
        }

        # W4: drift entre el state declarado y el derivado de las tasks.
        $derived = 'not-started'
        if ($total -gt 0 -and $nCancelled -eq $total) {
            $derived = 'cancelled'
        }
        elseif ($anyDeployed) {
            $derived = "partial-deploy-$lastEnv"
        }
        elseif ($total -gt 0 -and $nDoneDep -eq $total) {
            $derived = 'feature-complete'
        }
        elseif ($anyProg) {
            $derived = 'in-progress'
        }
        if ($stateOk) {
            # live/legacy/cancelled dependen de información que el linter no tiene.
            if ($state -ne 'live' -and $state -ne 'legacy' -and $state -ne 'cancelled') {
                if ($derived -ne $state) {
                    Write-LintWarn $Feat "[W4] drift de estado: declarado '$state' vs derivado de tasks '$derived'"
                }
            }
        }
    }

    # ---- requirements.md ---------------------------------------------------
    if (-not (Test-Path -LiteralPath $reqFile -PathType Leaf)) {
        # W5: falta requirements.md y ni el state ni la modality lo eximen.
        $mod = $modality
        if ($mod -eq '') { $mod = 'code' }
        if ($state -ne 'legacy') {
            $exempt = @('refactor-only', 'docs-only', 'catalog-only', 'config-only')
            if ($exempt -notcontains $mod) {
                Write-LintWarn $Feat "[W5] falta requirements.md (state '$state', modality '$mod')"
            }
        }
    }
    else {
        $rstatus = Get-FmValue -Path $reqFile -Key 'status'
        $reqLines = @(Get-Content -LiteralPath $reqFile -Encoding UTF8)
        $reqText = $reqLines -join "`n"

        # E5: IDs de requirement **R<x>.<y>** duplicados.
        $allIds = @()
        foreach ($m in [regex]::Matches($reqText, '\*\*R\d+\.\d+\*\*')) {
            $allIds += ($m.Value -replace '\*', '')
        }
        $dups = $allIds | Group-Object | Where-Object { $_.Count -gt 1 } | Sort-Object Name
        foreach ($d in $dups) {
            Write-LintError $Feat ("[E5] requirement ID duplicado: " + $d.Name)
        }

        # W2: requirement sin línea 'Tests:' en la misma línea o las 3 siguientes.
        $idFirstLine = @{}
        for ($k = 0; $k -lt $reqLines.Count; $k++) {
            foreach ($m in [regex]::Matches($reqLines[$k], '\*\*R\d+\.\d+\*\*')) {
                $bare = $m.Value -replace '\*', ''
                if (-not $idFirstLine.ContainsKey($bare)) { $idFirstLine[$bare] = $k }
            }
        }
        foreach ($bare in ($idFirstLine.Keys | Sort-Object)) {
            $start = [int]$idFirstLine[$bare]
            $end = [Math]::Min($start + 3, $reqLines.Count - 1)
            $hasTests = $false
            for ($k = $start; $k -le $end; $k++) {
                if ($reqLines[$k] -match 'Tests:') { $hasTests = $true; break }
            }
            if (-not $hasTests) {
                Write-LintWarn $Feat "[W2] requirement $bare sin línea 'Tests:' asociada"
            }
        }

        # E7: más de 3 marcadores [NEEDS CLARIFICATION ...].
        $nclar = [regex]::Matches($reqText, '\[NEEDS CLARIFICATION').Count
        if ($nclar -gt 3) {
            Write-LintError $Feat "[E7] $nclar marcadores [NEEDS CLARIFICATION] en requirements.md (máximo 3)"
        }

        # OPEN_QUESTIONS abiertas: E6 (sin owner/due) y W3 (due vencido).
        $openCount = 0
        foreach ($line in (Get-OpenQuestionLines -Lines $reqLines)) {
            if ($line -notmatch '^\s*- \[ \]') { continue }
            if ($line.Trim() -eq '') { continue }
            $openCount++
            $missing = ''
            if ($line -notmatch 'owner:') { $missing = 'owner:' }
            if ($line -notmatch 'due:') {
                if ($missing -ne '') { $missing = "$missing y due:" } else { $missing = 'due:' }
            }
            if ($missing -ne '') {
                $snippet = $line
                if ($snippet.Length -gt 60) { $snippet = $snippet.Substring(0, 60) }
                Write-LintError $Feat "[E6] OPEN_QUESTION abierta sin $missing ('$snippet')"
            }
            $dm = [regex]::Match($line, 'due:\s*(\d{4}-\d{2}-\d{2})')
            if ($dm.Success) {
                $due = $dm.Groups[1].Value
                if ($due -lt $script:Today) {
                    Write-LintWarn $Feat "[W3] OPEN_QUESTION abierta con due vencido ($due)"
                }
            }
        }

        # E8/E9: requirements en status approved/in-implementation/done.
        if ($rstatus -eq 'approved' -or $rstatus -eq 'in-implementation' -or $rstatus -eq 'done') {
            if ($nclar -gt 0 -or $openCount -gt 0) {
                Write-LintError $Feat "[E8] requirements.md con status '$rstatus' pero contiene [NEEDS CLARIFICATION] u OPEN_QUESTIONS abiertas"
            }
            if (Test-Path -LiteralPath $chkFile -PathType Leaf) {
                $chkLines = @(Get-Content -LiteralPath $chkFile -Encoding UTF8)
                $unchecked = @($chkLines | Where-Object { $_ -match '^\s*- \[ \]' })
                if ($unchecked.Count -gt 0) {
                    Write-LintError $Feat "[E9] requirements.md con status '$rstatus' pero checklists/requirements.md tiene items sin marcar"
                }
            }
        }
    }
}

if ($Feature -ne '') {
    $featDir = Join-Path $SpecsDir $Feature
    if (-not (Test-Path -LiteralPath $featDir -PathType Container)) {
        [Console]::Error.WriteLine("spec-lint: no existe '$featDir'")
        exit 1
    }
    Test-OneFeature -Dir $featDir -Feat $Feature
}
else {
    foreach ($d in (Get-ChildItem -LiteralPath $SpecsDir -Directory | Sort-Object Name)) {
        if ($d.Name -eq 'spikes') { continue }
        Test-OneFeature -Dir $d.FullName -Feat $d.Name
    }
}

Write-Output ("spec-lint: {0} error(es), {1} warning(s) en {2} feature(s)." -f $script:ErrorsCount, $script:WarningsCount, $script:FeaturesCount)
if ($script:ErrorsCount -gt 0) {
    exit 1
}
exit 0
