   #!/usr/bin/env bash
   # stages the site into _site, minifies js/css, writes build.json
   set -e
   rm -rf _site && mkdir _site

   # copy only what should be public
   tar --exclude='./.git' --exclude='./.github' --exclude='./_site' \
       --exclude='./node_modules' --exclude='./build.sh' --exclude='./build-icons.sh' \
       -cf - . | tar -xf - -C _site

   # minify in the output copy only; sources stay readable
   npx --yes esbuild@0.24.0 \
     $(find _site/assets \( -name '*.js' ! -name '*.min.js' \) -o \( -name '*.css' ! -name '*.min.css' \)) \
     --minify --allow-overwrite --outbase=_site --outdir=_site

   # sha and date of this commit; host env vars are the fallback when .git is missing
   if git rev-parse HEAD >/dev/null 2>&1; then
     sha=$(git rev-parse --short=7 HEAD)
     date=$(TZ=UTC date -d "$(git log -1 --format=%cI)" '+%b %-d, %Y')
   else
     full=${VERCEL_GIT_COMMIT_SHA:-${COMMIT_REF:-${CF_PAGES_COMMIT_SHA:-unknown}}}
     sha=${full:0:7}
     date=$(TZ=UTC date '+%b %-d, %Y')
   fi
   printf '{"sha":"%s","date":"%s"}\n' "$sha" "$date" > _site/build.json