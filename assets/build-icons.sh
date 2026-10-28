   #!/usr/bin/env bash
   # builds assets/icons.svg from Font Awesome Free 6.5.0 
   set -e
   tmp=$(mktemp -d)
   (cd "$tmp" && npm pack @fortawesome/fontawesome-free@6.5.0 --silent >/dev/null && tar -xzf fortawesome-*.tgz)
   src="$tmp/package/svgs"
   out="assets/icons.svg"
   {
     echo '<svg xmlns="http://www.w3.org/2000/svg">'
     # requires attribution
     echo '<!-- Icons: Font Awesome Free 6.5.0, CC BY 4.0, https://fontawesome.com/license/free -->'
     for i in brands/discord brands/github solid/arrow-up-right-from-square solid/gear solid/share-nodes solid/thumbtack; do
       id=$(basename "$i")
       vb=$(grep -o 'viewBox="[^"]*"' "$src/$i.svg")
       d=$(grep -o '<path d="[^"]*"' "$src/$i.svg" | sed 's/<path d="//;s/"$//')
       echo "<symbol id=\"$id\" $vb><path d=\"$d\"/></symbol>"
     done
     echo '</svg>'
   } > "$out"
   rm -rf "$tmp"