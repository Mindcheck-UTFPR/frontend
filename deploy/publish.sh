#!/usr/bin/env bash
set -euo pipefail
root=${1:?Diretorio de deploy ausente}
sha=${2:?Commit ausente}
[[ "$root" =~ ^/[a-zA-Z0-9/_-]+$ && "$root" != / ]]
[[ "$sha" =~ ^[a-f0-9]{40}$ ]]
test -d "$root"
mkdir -p "$root/releases"
exec 9>"$root/deploy.lock"
flock -w 120 9
release="$root/releases/$sha"
if [[ ! -d "$release" ]]; then
  staging=$(mktemp -d "$root/releases/.incoming.XXXXXXXX")
  tar -xzf "$HOME/frontend-$sha.tgz" -C "$staging"
  test -s "$staging/index.html"
  mv "$staging" "$release"
fi
test -s "$release/index.html"
chmod -R a+rX "$release"
ln -sfn "$release" "$root/current.next"
mv -Tf "$root/current.next" "$root/current"
echo "Frontend publicado: $sha"
