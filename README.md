# Paulo Behar — Fotografia

Site fotográfico de Paulo Behar, em HTML, CSS e JavaScript, sem dependências.
Publicado pelo GitHub Pages.

## Organização das pastas

| Pasta / arquivo | O que é | Quem mexe |
|---|---|---|
| `index.html`, `fine-art.html` | As páginas do site (precisam ficar na raiz) | Claude |
| `selecao.tsv` | **A lista das fotos do site**: galeria, nome, título e origem | Você |
| `NOTAS.md` | Decisões do projeto e onde está cada material | Os dois |
| `material-divulgacao/` | Caixa de entrada: fotos, vídeos, retratos, imprensa. Fica só no Dropbox | Você |
| `site-midia/` | Fotos e vídeo já otimizados que o site usa. Gerado automaticamente | Ninguém |
| `codigo/` | Visual (`styles.css`), comportamento (`script.js`, `galeria.js`) e ferramentas | Claude |

## Trocar fotos das galerias

1. Edite `selecao.tsv` (uma linha por foto; a origem é o caminho dentro de `Dropbox/Fotos`).
2. Rode no Terminal, dentro desta pasta: `bash codigo/ferramentas/atualizar-fotos.sh`

A ferramenta gera a versão web e a miniatura de cada foto (sem GPS, sem moldura
preta) e atualiza `site-midia/galerias.js`, que as páginas leem.

## Pré-visualização

Abra `index.html` no navegador. O seletor no cabeçalho alterna entre português,
inglês e espanhol.
