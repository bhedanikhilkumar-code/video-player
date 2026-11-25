#!/usr/bin/env bash
set -euo pipefail
: "${VP_TAG:?Set VP_TAG to the verified source tag}"
node scripts/release-version.mjs "$VP_TAG"
VERSION=$(node -p 'require("./package.json").version')
NAME=$(node -p 'require("./package.json").name')
REGISTRY=https://npm.pkg.github.com
npm run build:package
# Archive metadata follows the source commit, making safe reruns byte-identical.
SOURCE_TIME=$(git show -s --format=%ct HEAD)
find dist/video-player -exec touch -h -d "@$SOURCE_TIME" {} +
(cd dist && find video-player -type f -print | LC_ALL=C sort | zip -X -q "video-player-$VERSION.zip" -@)
npm pack ./dist/video-player --pack-destination dist
(cd dist && sha256sum ./*.zip ./*.tgz > SHA256SUMS.txt)
cat > dist/release-notes.md <<'NOTES'
Static browser app distribution. The ZIP and npm tarball contain the same allowlisted app files. See the bundled README for static hosting, BUILD-INFO.json for the exact source commit, and SHA256SUMS.txt for archive checksums.

No backend, media files, native installer or credentials are bundled. Online playback needs internet. Player effects do not alter original media files.
NOTES
if gh release view "$VP_TAG" --json isDraft,tagName > dist/existing-release.json 2>dist/release-error.log; then
  test "$(node -p 'require("./dist/existing-release.json").tagName')" = "$VP_TAG"
else
  if ! grep -qi 'release not found' dist/release-error.log; then cat dist/release-error.log; exit 1; fi
  gh release create "$VP_TAG" --verify-tag --draft --title "Video Player $VP_TAG" --notes-file dist/release-notes.md
fi
mkdir -p dist/remote-assets
for file in dist/*.zip dist/*.tgz dist/SHA256SUMS.txt; do
  asset=$(basename "$file")
  if gh release download "$VP_TAG" --pattern "$asset" --dir dist/remote-assets >dist/asset-download.log 2>&1; then
    cmp "$file" "dist/remote-assets/$asset"
  else
    if ! grep -Eqi 'no assets|no matches' dist/asset-download.log; then cat dist/asset-download.log; exit 1; fi
    gh release upload "$VP_TAG" "$file"
  fi
done
# An authentication/network error is never treated as a missing version.
if npm view "$NAME@$VERSION" version --registry="$REGISTRY" >dist/registry-version.txt 2>dist/registry-error.log; then
  test "$(tr -d '\r\n' < dist/registry-version.txt)" = "$VERSION"
else
  if ! grep -q E404 dist/registry-error.log; then cat dist/registry-error.log; exit 1; fi
  npm publish ./dist/video-player --registry="$REGISTRY"
fi
mkdir -p dist/registry-check
(cd dist/registry-check && npm pack "$NAME@$VERSION" --registry="$REGISTRY" && tar -xzf ./*.tgz)
diff -rq dist/video-player dist/registry-check/package
# Only a byte-for-byte verified registry download makes the release visible.
if gh release view "$VP_TAG" --json isDraft --jq .isDraft | grep -qx true; then
  gh release edit "$VP_TAG" --draft=false
fi
gh release view "$VP_TAG" --json url,isDraft,tagName
