#!/usr/bin/env bash
#
# spec-lint.sh — Linter mecánico de specs AI-DLC.
#
# Capa "Garantía" de la metodología AI-DLC (§7 del methodology): verificación
# mecánica de la consistencia estructural de las specs en specs/<feature>/
# (status.md, requirements.md, checklists/requirements.md). Pensado para
# correr local (pre-commit) o en CI. Self-contained: solo bash + coreutils
# (grep/sed/awk portables).
#
# Uso:
#   spec-lint.sh [<repo-root>|.] [--feature <slug>]
#   spec-lint.sh --help
#
# Salida: una línea por hallazgo con formato "ERROR <feature>: <mensaje>" o
# "WARN <feature>: <mensaje>", más un resumen final.
# Exit 0 si no hay errores; exit 1 si hay >= 1 error (los warnings no afectan).
#
# Equivalente PowerShell: spec-lint.ps1 (mismo comportamiento).

set -u

usage() {
  cat <<'EOF'
spec-lint — linter mecánico de specs AI-DLC (capa "Garantía", §7 del methodology).

Uso: spec-lint.sh [<repo-root>|.] [--feature <slug>]

  <repo-root>        Raíz del repo adoptado (default: directorio actual).
  --feature <slug>   Lintea solo specs/<slug>/ en lugar de todas las features.
  --help, -h         Muestra esta ayuda.

Checks: E1-E9 (errores) y W1-W5 (warnings). Ignora specs/README.md,
specs/spikes/ y archivos sueltos bajo specs/.
Exit code: 0 si no hay errores, 1 si hay >= 1 error.
EOF
}

ROOT="."
FEATURE=""

while [ $# -gt 0 ]; do
  case "$1" in
    --help|-h)
      usage
      exit 0
      ;;
    --feature)
      if [ $# -lt 2 ]; then
        echo "spec-lint: --feature requiere un <slug>" >&2
        exit 1
      fi
      FEATURE="$2"
      shift 2
      ;;
    --*)
      echo "spec-lint: opción desconocida '$1'" >&2
      usage >&2
      exit 1
      ;;
    *)
      ROOT="$1"
      shift
      ;;
  esac
done

SPECS_DIR="$ROOT/specs"
if [ ! -d "$SPECS_DIR" ]; then
  echo "spec-lint: no existe el directorio '$SPECS_DIR'" >&2
  exit 1
fi

ERRORS=0
WARNINGS=0
NFEATURES=0
TODAY=$(date +%Y-%m-%d)

err() { # $1=feature $2=mensaje
  printf 'ERROR %s: %s\n' "$1" "$2"
  ERRORS=$((ERRORS + 1))
}

warn() { # $1=feature $2=mensaje
  printf 'WARN %s: %s\n' "$1" "$2"
  WARNINGS=$((WARNINGS + 1))
}

# Imprime el frontmatter YAML de un archivo (líneas entre el primer '---' en
# la línea 1 y el siguiente '---'). Tolera BOM UTF-8 y finales CRLF.
frontmatter() { # $1=file
  awk 'NR==1 {
         if (substr($0, 1, 3) == "\357\273\277") $0 = substr($0, 4)
         if ($0 !~ /^---[ \t\r]*$/) exit
         next
       }
       /^---[ \t\r]*$/ { exit }
       { print }' "$1"
}

# Valor de una clave simple del frontmatter (primera ocurrencia), sin comillas
# ni espacios finales.
fm_value() { # $1=file $2=key
  frontmatter "$1" \
    | sed -n "s/^$2:[[:space:]]*//p" \
    | head -n 1 \
    | sed -e 's/\r$//' -e 's/[[:space:]]*$//' -e 's/^"\(.*\)"$/\1/' -e "s/^'\(.*\)'\$/\1/"
}

# Imprime la sección ## OPEN_QUESTIONS (hasta el siguiente encabezado '## ').
open_questions_section() { # $1=file
  awk '/^##[ \t]+OPEN_QUESTIONS/ { f = 1; next }
       f && /^##[ \t]/ { f = 0 }
       f { print }' "$1"
}

lint_feature() { # $1=dir $2=feature-slug
  local dir="$1" feat="$2"
  local status_file="$dir/status.md"
  local req_file="$dir/requirements.md"
  local chk_file="$dir/checklists/requirements.md"
  local state="" modality="" state_ok=0
  local line tnum tstate env derived
  local total=0 n_cancelled=0 n_done_dep=0 any_deployed=0 any_prog=0 last_env=""

  NFEATURES=$((NFEATURES + 1))

  # ---- status.md -----------------------------------------------------------
  if [ ! -f "$status_file" ]; then
    err "$feat" "[E1] falta status.md"
  else
    state=$(fm_value "$status_file" "state")
    modality=$(fm_value "$status_file" "modality")

    # E2: state ausente o fuera del set válido.
    if [ -z "$state" ]; then
      err "$feat" "[E2] falta 'state:' en el frontmatter de status.md"
    elif printf '%s\n' "$state" | grep -Eq '^(not-started|in-progress|feature-complete|live|cancelled|legacy|partial-deploy-[A-Za-z0-9_-]+|deployed:[A-Za-z0-9_-]+)$'; then
      state_ok=1
    else
      err "$feat" "[E2] state '$state' fuera del set válido en status.md"
    fi

    # Tasks: líneas "T<n>: <task-state> | ..."
    while IFS= read -r line; do
      line=${line%$'\r'}
      tnum=$(printf '%s\n' "$line" | sed -E 's/^[[:space:]]*T([0-9]+):.*/\1/')
      tstate=$(printf '%s\n' "$line" | sed -E 's/^[[:space:]]*T[0-9]+:[[:space:]]*//; s/[[:space:]|].*//')

      # E3: estado de task no parseable contra el set válido.
      if ! printf '%s\n' "$tstate" | grep -Eq '^(pending|blocked|in-progress|done|cancelled|deployed:[A-Za-z0-9_-]+)$'; then
        err "$feat" "[E3] task T$tnum con estado inválido '$tstate'"
        continue
      fi
      total=$((total + 1))

      case "$tstate" in
        pending)
          : ;;
        blocked)
          # E4: blocked sin blocked_by: en la misma línea.
          case "$line" in
            *blocked_by:*) : ;;
            *) err "$feat" "[E4] task T$tnum en 'blocked' sin 'blocked_by:' en la misma línea" ;;
          esac
          ;;
        in-progress)
          any_prog=1 ;;
        cancelled)
          n_cancelled=$((n_cancelled + 1)) ;;
        done|deployed:*)
          n_done_dep=$((n_done_dep + 1))
          if [ "$tstate" = "done" ]; then
            any_prog=1
          else
            any_deployed=1
            last_env=${tstate#deployed:}
          fi
          # W1: done/deployed sin hash de commit (heurística: falta "commit ").
          case "$line" in
            *"commit "*) : ;;
            *) warn "$feat" "[W1] task T$tnum '$tstate' sin hash de commit en la línea" ;;
          esac
          ;;
      esac
    done < <(grep -E '^[[:space:]]*T[0-9]+:' "$status_file" || true)

    # W4: drift entre el state declarado y el derivado de las tasks.
    derived="not-started"
    if [ "$total" -gt 0 ] && [ "$n_cancelled" -eq "$total" ]; then
      derived="cancelled"
    elif [ "$any_deployed" -eq 1 ]; then
      derived="partial-deploy-$last_env"
    elif [ "$total" -gt 0 ] && [ "$n_done_dep" -eq "$total" ]; then
      derived="feature-complete"
    elif [ "$any_prog" -eq 1 ]; then
      derived="in-progress"
    fi
    if [ "$state_ok" -eq 1 ]; then
      case "$state" in
        live|legacy|cancelled) : ;; # dependen de información que el linter no tiene
        *)
          if [ "$derived" != "$state" ]; then
            warn "$feat" "[W4] drift de estado: declarado '$state' vs derivado de tasks '$derived'"
          fi
          ;;
      esac
    fi
  fi

  # ---- requirements.md -----------------------------------------------------
  if [ ! -f "$req_file" ]; then
    # W5: falta requirements.md y ni el state ni la modality lo eximen.
    local mod="$modality"
    [ -n "$mod" ] || mod="code"
    if [ "$state" != "legacy" ]; then
      case "$mod" in
        refactor-only|docs-only|catalog-only|config-only) : ;;
        *) warn "$feat" "[W5] falta requirements.md (state '$state', modality '$mod')" ;;
      esac
    fi
  else
    local rstatus nclar open_count=0 missing due id ln seg dup

    rstatus=$(fm_value "$req_file" "status")

    # E5: IDs de requirement **R<x>.<y>** duplicados.
    for dup in $(grep -oE '\*\*R[0-9]+\.[0-9]+\*\*' "$req_file" | sort | uniq -d | tr -d '*'); do
      err "$feat" "[E5] requirement ID duplicado: $dup"
    done

    # W2: requirement sin línea 'Tests:' en la misma línea o las 3 siguientes.
    for id in $(grep -oE '\*\*R[0-9]+\.[0-9]+\*\*' "$req_file" | tr -d '*' | sort -u); do
      ln=$(grep -nF "**$id**" "$req_file" | head -n 1 | cut -d: -f1)
      [ -n "$ln" ] || continue
      seg=$(sed -n "${ln},$((ln + 3))p" "$req_file")
      if ! printf '%s\n' "$seg" | grep -q 'Tests:'; then
        warn "$feat" "[W2] requirement $id sin línea 'Tests:' asociada"
      fi
    done

    # E7: más de 3 marcadores [NEEDS CLARIFICATION ...].
    nclar=$(grep -o '\[NEEDS CLARIFICATION' "$req_file" | wc -l | tr -d '[:space:]')
    if [ "$nclar" -gt 3 ]; then
      err "$feat" "[E7] $nclar marcadores [NEEDS CLARIFICATION] en requirements.md (máximo 3)"
    fi

    # OPEN_QUESTIONS abiertas: E6 (sin owner/due) y W3 (due vencido).
    while IFS= read -r line; do
      line=${line%$'\r'}
      [ -n "$line" ] || continue
      open_count=$((open_count + 1))
      missing=""
      case "$line" in *owner:*) : ;; *) missing="owner:" ;; esac
      case "$line" in *due:*) : ;; *) missing="${missing:+$missing y }due:" ;; esac
      if [ -n "$missing" ]; then
        err "$feat" "[E6] OPEN_QUESTION abierta sin $missing ('${line:0:60}')"
      fi
      due=$(printf '%s\n' "$line" | sed -nE 's/.*due:[[:space:]]*([0-9]{4}-[0-9]{2}-[0-9]{2}).*/\1/p')
      if [ -n "$due" ] && [[ "$due" < "$TODAY" ]]; then
        warn "$feat" "[W3] OPEN_QUESTION abierta con due vencido ($due)"
      fi
    done < <(open_questions_section "$req_file" | grep -E '^[[:space:]]*- \[ \]' || true)

    # E8/E9: requirements en status approved/in-implementation/done.
    case "$rstatus" in
      approved|in-implementation|done)
        if [ "$nclar" -gt 0 ] || [ "$open_count" -gt 0 ]; then
          err "$feat" "[E8] requirements.md con status '$rstatus' pero contiene [NEEDS CLARIFICATION] u OPEN_QUESTIONS abiertas"
        fi
        if [ -f "$chk_file" ] && grep -Eq '^[[:space:]]*- \[ \]' "$chk_file"; then
          err "$feat" "[E9] requirements.md con status '$rstatus' pero checklists/requirements.md tiene items sin marcar"
        fi
        ;;
    esac
  fi
}

if [ -n "$FEATURE" ]; then
  if [ ! -d "$SPECS_DIR/$FEATURE" ]; then
    echo "spec-lint: no existe '$SPECS_DIR/$FEATURE'" >&2
    exit 1
  fi
  lint_feature "$SPECS_DIR/$FEATURE" "$FEATURE"
else
  for d in "$SPECS_DIR"/*/; do
    [ -d "$d" ] || continue
    feat=$(basename "$d")
    [ "$feat" = "spikes" ] && continue
    lint_feature "$d" "$feat"
  done
fi

printf 'spec-lint: %d error(es), %d warning(s) en %d feature(s).\n' "$ERRORS" "$WARNINGS" "$NFEATURES"
if [ "$ERRORS" -gt 0 ]; then
  exit 1
fi
exit 0
