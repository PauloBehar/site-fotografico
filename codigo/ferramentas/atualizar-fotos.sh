#!/bin/bash
# Atualiza as galerias a partir de selecao.tsv (na raiz do site)
# Uso (no Terminal, dentro da pasta do site):  bash codigo/ferramentas/atualizar-fotos.sh
# - gera a versão web (2000px, com copyright) e a miniatura (900px) de cada foto, sem metadados/GPS
# - recorta molduras pretas
# - coluna "efeito" = pb converte para preto e branco (o original não é tocado)
# - reescreve site-midia/galerias.js, que as páginas leem
set -e
cd "$(dirname "$0")/../.."
FOTOS="$(cd ../.. && pwd)"            # Dropbox/Fotos
BIN="codigo/ferramentas/.webexport"
[ "$BIN" -nt codigo/ferramentas/webexport.swift ] || swiftc -O codigo/ferramentas/webexport.swift -o "$BIN"

tail -n +2 selecao.tsv | while IFS=$'\t' read -r gal slug titulo origem efeito; do
  [ -z "$slug" ] && continue
  mkdir -p "site-midia/fotos/fine-art/$gal/mini"
  dst="site-midia/fotos/fine-art/$gal/$slug.jpg"
  if [ ! -f "$dst" ] || [ "$FOTOS/$origem" -nt "$dst" ]; then
    "$BIN" "$FOTOS/$origem" "$dst" 2000 trim $efeito < /dev/null > /dev/null
  fi
  if [ ! -f "site-midia/fotos/fine-art/$gal/mini/$slug.jpg" ] || [ "$dst" -nt "site-midia/fotos/fine-art/$gal/mini/$slug.jpg" ]; then
    "$BIN" "$dst" "site-midia/fotos/fine-art/$gal/mini/$slug.jpg" 900 < /dev/null > /dev/null
  fi
done

python3 - <<'PY'
import json, subprocess
gal = {}
for line in open("selecao.tsv", encoding="utf-8").read().splitlines()[1:]:
    p = line.split("\t")
    if len(p) < 3 or not p[1]: continue
    g, slug, titulo = p[0], p[1], p[2].replace(" (?)", "")   # "(?)" = título a confirmar; não aparece no site
    src = f"site-midia/fotos/fine-art/{g}/{slug}.jpg"
    out = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", src], capture_output=True, text=True).stdout
    w = int(out.split("pixelWidth:")[1].split()[0]); h = int(out.split("pixelHeight:")[1].split()[0])
    gal.setdefault(g, []).append({"src": src, "mini": f"site-midia/fotos/fine-art/{g}/mini/{slug}.jpg", "titulo": titulo, "w": w, "h": h})
open("site-midia/galerias.js", "w", encoding="utf-8").write(
    "// Gerado por codigo/ferramentas/atualizar-fotos.sh a partir de selecao.tsv. Não edite à mão.\n"
    "window.GALERIAS = " + json.dumps(gal, ensure_ascii=False, indent=1) + ";\n")
print({k: len(v) for k, v in gal.items()})
PY
