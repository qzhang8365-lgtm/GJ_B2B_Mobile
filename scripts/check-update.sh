#!/usr/bin/env bash
# Mobile Skill updater. Bash 3.2; curl, unzip and system utilities only.
# Source: origin https://github.com/qzhang8365-lgtm/GJ_B2B_Mobile.git
# Contract: vX.Y.Z / gj-b2b-mobile-design-skill-vX.Y.Z.zip / package.json.
REPO='qzhang8365-lgtm/GJ_B2B_Mobile'
PREFIX='gj-b2b-mobile-design-skill-v'
FORCE=0 CHECK_ONLY=0
WORK='' STAGE='' LOCK='' RESTORE_BACKUP=''
for arg in "$@"; do
  case "$arg" in --force) FORCE=1 ;; --check-only) CHECK_ONLY=1 ;; esac
done
valid_version() { printf '%s\n' "$1" | grep -Eq '^(0|[1-9][0-9]{0,8})\.(0|[1-9][0-9]{0,8})\.(0|[1-9][0-9]{0,8})$'; }
read_version() {
  # Only the package's top-level version; ignore nested dependency versions.
  [ -f "$1" ] || return 0
  awk 'BEGIN { depth=0; quoted=0; escape=0; key=""; want=0 }
  { for(i=1;i<=length($0);i++) { c=substr($0,i,1)
    if(quoted) {
      if(escape) { token=token c; escape=0; continue }
      if(c=="\\") { escape=1; continue }
      if(c=="\"") { quoted=0; if(depth==1) { if(want) { print token; exit }; key=token }; continue }
      token=token c; continue
    }
    if(c=="\"") { quoted=1; token="" }
    else if(c=="{") depth++
    else if(c=="}") depth--
    else if(c==":" && depth==1 && key=="version") want=1
    else if(c==",") {key="";want=0}
  }}' "$1"
}
version_gt() {
  local a="$1" b="$2" x y
  while [ -n "$a" ] || [ -n "$b" ]; do
    x=${a%%.*}; y=${b%%.*}
    [ "$a" = "${a#*.}" ] && a='' || a=${a#*.}
    [ "$b" = "${b#*.}" ] && b='' || b=${b#*.}
    [ "${x:-0}" -gt "${y:-0}" ] && return 0
    [ "${x:-0}" -lt "${y:-0}" ] && return 1
  done
  return 1
}
cleanup() {
  if [ -n "$RESTORE_BACKUP" ] && [ ! -e "$SKILL_DIR" ] && [ -d "$RESTORE_BACKUP" ]; then
    mv "$RESTORE_BACKUP" "$SKILL_DIR" 2>/dev/null || printf '旧版本仍保留在 %s，请恢复安装目录。\n' "$RESTORE_BACKUP"
  fi
  [ -n "$WORK" ] && rm -rf "$WORK"
  [ -n "$STAGE" ] && rm -rf "$STAGE"
  [ -n "$LOCK" ] && rmdir "$LOCK" 2>/dev/null
  :
}
notice() { printf '发现新版本但未自动升级：V%s（%s）。继续当前任务。\n' "$REMOTE" "$1"; }
latest() {
  local loc tag
  # Limit network failure to 5 seconds; no API retry doubles offline latency.
  loc=$(curl -q -fsSI --connect-timeout 3 --max-time 5 "https://github.com/$REPO/releases/latest" 2>/dev/null) || return 0
  loc=$(printf '%s\n' "$loc" | tr -d '\r' | sed -n 's/^[Ll]ocation:[[:space:]]*//p' | tail -n 1)
  case "$loc" in "https://github.com/$REPO/releases/tag/v"*) tag=${loc##*/tag/} ;; *) return 0 ;; esac
  valid_version "${tag#v}" && printf '%s\n' "${tag#v}"
}
upgrade() {
  local zip top newdir backup entries
  command -v unzip >/dev/null 2>&1 || { notice '缺少 unzip'; return; }
  [ -n "$HOME" ] && [ -d "$HOME" ] || { notice '无法确定缓存备份目录'; return; }
  WORK=$(mktemp -d "${TMPDIR:-/tmp}/gj-mobile-update.XXXXXX") || { notice '无法创建临时目录'; return; }
  zip="$WORK/release.zip"; top="$PREFIX$REMOTE"
  if ! curl -q -fsSL --connect-timeout 3 --max-time 60 --proto '=https' --proto-redir '=https' \
    -o "$zip" "https://github.com/$REPO/releases/download/v$REMOTE/$top.zip"; then
    notice '下载失败'; return
  fi
  # Validate paths BEFORE extraction: single expected root, no traversal or symlinks.
  entries=$(unzip -Z1 "$zip") || { notice 'ZIP 无效'; return; }
  printf '%s\n' "$entries" | awk -v root="$top" '
    $0 != root "/" && index($0,root "/") != 1 {bad=1}
    /\\/ || /(^|\/)\.\.?($|\/)/ || /(^|\/)(\.git|node_modules|\.update-check)($|\/)/ {bad=1}
    END {exit bad}' || { notice 'ZIP 路径或内容不符合发布约定'; return; }
  if unzip -Z -l "$zip" | grep -q '^l'; then notice 'ZIP 含符号链接'; return; fi
  unzip -tq "$zip" >/dev/null || { notice 'ZIP 完整性校验失败'; return; }
  unzip -q "$zip" -d "$WORK/extracted" || { notice 'ZIP 解压失败'; return; }
  newdir="$WORK/extracted/$top"
  [ -f "$newdir/SKILL.md" ] && [ -f "$newdir/scripts/check-update.sh" ] && \
    [ "$(read_version "$newdir/package.json")" = "$REMOTE" ] || { notice 'ZIP 包内版本或结构与 Release Tag 不一致'; return; }
  # Prepare a sibling staging directory, not an installed duplicate or a backup.
  STAGE=$(mktemp -d "$PARENT/.gj-mobile-stage.XXXXXX") || { notice '安装父目录不可写'; return; }
  cp -pR "$newdir/." "$STAGE/" || { notice '新版本复制失败'; return; }
  if [ -e "$SKILL_DIR/node_modules" ] || [ -L "$SKILL_DIR/node_modules" ]; then
    cp -pR "$SKILL_DIR/node_modules" "$STAGE/node_modules" || { notice '保留 node_modules 失败'; return; }
  fi
  printf '%s\n' "$NOW" > "$STAGE/.update-check" || { notice '无法写入检查时间'; return; }
  # Backup only in ~/.cache, never fall back beside installed skills.
  mkdir -p "$HOME/.cache/gj-b2b-mobile-design-skill" || { notice '备份目录不可写'; return; }
  backup=$(mktemp -d "$HOME/.cache/gj-b2b-mobile-design-skill/backup-v$LOCAL-XXXXXX") || { notice '无法创建备份'; return; }
  # An empty reserved directory gives a unique destination; keep the old tree intact until staging is ready.
  rmdir "$backup" || { notice '无法预留备份路径'; return; }
  [ ! -e "$SKILL_DIR/.git" ] && [ ! -L "$SKILL_DIR/.git" ] || { notice '开发仓库跳过'; return; }
  RESTORE_BACKUP="$backup"
  if ! mv "$SKILL_DIR" "$backup"; then notice '旧版本备份失败'; return; fi
  if ! mv "$STAGE" "$SKILL_DIR"; then
    if mv "$backup" "$SKILL_DIR"; then notice '安装失败，已恢复旧版本';
    else notice "安装失败，旧版本保留在 $backup，请恢复安装目录"; fi
    return
  fi
  STAGE='' RESTORE_BACKUP=''
  printf '已更新到 V%s（原 V%s 已备份到 %s）\n' "$REMOTE" "$LOCAL" "$backup"
}
main() {
  local script_dir last
  script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P) || return
  SKILL_DIR=$(cd "$script_dir/.." && pwd -P) || return
  if [ -e "$SKILL_DIR/.git" ] || [ -L "$SKILL_DIR/.git" ]; then printf '开发仓库含 .git，跳过升级自检。\n'; return; fi
  [ -f "$SKILL_DIR/SKILL.md" ] || return
  LOCAL=$(read_version "$SKILL_DIR/package.json")
  valid_version "$LOCAL" || return
  NOW=$(date +%s); STAMP="$SKILL_DIR/.update-check"; PARENT=$(dirname "$SKILL_DIR")
  if [ "$FORCE" -eq 0 ] && [ -f "$STAMP" ]; then
    last=$(cat "$STAMP")
    case "$last" in ''|*[!0-9]*|????????????*) last=0 ;; esac
    if [ "$NOW" -ge "$last" ] && [ $((NOW-last)) -lt 43200 ]; then printf '12 小时内已检查，跳过。\n'; return; fi
  fi
  command -v curl >/dev/null 2>&1 || return
  # Throttle failed requests as well. An unwritable timestamp must not block use.
  (printf '%s\n' "$NOW" > "$STAMP") 2>/dev/null || :
  REMOTE=$(latest)
  [ -n "$REMOTE" ] || { printf 'GitHub latest 不可达或版本无效，跳过升级检查。\n'; return; }
  version_gt "$REMOTE" "$LOCAL" || { printf '已是最新版本 V%s。\n' "$LOCAL"; return; }
  [ "$CHECK_ONLY" -eq 0 ] || { notice '--check-only，仅检查'; return; }
  [ -w "$SKILL_DIR" ] && [ -w "$PARENT" ] || { notice '安装目录或父目录不可写'; return; }
  # Serialize updates of this installation; never delete another process's lock.
  local candidate="$PARENT/.gj-mobile-update-$(printf '%s' "$SKILL_DIR" | cksum | awk '{print $1}').lock"
  mkdir "$candidate" || { notice '已有升级进行中或无写入权限'; return; }
  LOCK="$candidate"
  upgrade
}
trap cleanup EXIT
trap 'exit 0' HUP INT TERM
main 2>/dev/null
exit 0
