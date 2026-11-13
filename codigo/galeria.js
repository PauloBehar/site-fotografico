// Galerias Fine Art: monta as grades a partir de fotos/galerias.js e controla a foto ampliada.
(() => {
  const data = window.GALERIAS || {};
  const lightbox = document.querySelector("#lightbox");
  const img = document.querySelector("#lightbox-img");
  const title = document.querySelector("#lightbox-title");
  const count = document.querySelector("#lightbox-count");
  let current = [];
  let index = 0;
  let lastFocus = null;

  // Mosaico: cada foto vai para a coluna mais curta, na ordem da lista.
  // Assim as primeiras fotos da lista ficam lado a lado no topo (ordem lida da esquerda para a direita).
  const grids = [];
  for (const grid of document.querySelectorAll("[data-galeria]")) {
    const fotos = data[grid.dataset.galeria] || [];
    const items = fotos.map((foto, i) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gallery__item";
      button.style.aspectRatio = `${foto.w} / ${foto.h}`;
      button.innerHTML = `
        <img src="${foto.mini}" alt="${foto.titulo}" width="${foto.w}" height="${foto.h}" loading="lazy" decoding="async">
        <span class="gallery__caption">${foto.titulo}</span>`;
      button.addEventListener("click", () => open(fotos, i, button));
      return { button, ratio: foto.h / foto.w };
    });
    grids.push({ grid, items, cols: 0 });
  }

  const columnCount = (grid) => {
    if (window.matchMedia("(max-width: 650px)").matches) return 1;
    const w = grid.clientWidth || window.innerWidth;
    return Math.max(1, Math.min(3, Math.floor((w + 14) / (320 + 14))));
  };

  function layout() {
    for (const g of grids) {
      const n = columnCount(g.grid);
      if (n === g.cols) continue;
      g.cols = n;
      const cols = Array.from({ length: n }, () => {
        const col = document.createElement("div");
        col.className = "gallery__col";
        return col;
      });
      const heights = new Array(n).fill(0);
      for (const item of g.items) {
        // coluna mais curta; em empate, a mais à esquerda
        let k = 0;
        for (let c = 1; c < n; c++) if (heights[c] < heights[k] - 0.02) k = c;
        cols[k].append(item.button);
        heights[k] += item.ratio;
      }
      g.grid.replaceChildren(...cols);
    }
  }
  layout();
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 150);
  });

  function show() {
    const foto = current[index];
    img.src = foto.src;
    img.alt = foto.titulo;
    title.textContent = foto.titulo;
    count.textContent = `${index + 1} / ${current.length}`;
    // pré-carrega a próxima
    const next = current[(index + 1) % current.length];
    if (next) new Image().src = next.src;
  }

  function open(fotos, i, from) {
    current = fotos;
    index = i;
    lastFocus = from;
    show();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    document.querySelector("#lightbox-close").focus();
  }

  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    img.removeAttribute("src");
    if (lastFocus) lastFocus.focus();
  }

  function step(delta) {
    index = (index + delta + current.length) % current.length;
    show();
  }

  document.querySelector("#lightbox-close").addEventListener("click", close);
  document.querySelector("#lightbox-prev").addEventListener("click", () => step(-1));
  document.querySelector("#lightbox-next").addEventListener("click", () => step(1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  });

  // deslizar o dedo no celular
  let startX = null;
  lightbox.addEventListener("touchstart", (event) => { startX = event.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener("touchend", (event) => {
    if (startX === null) return;
    const dx = event.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    startX = null;
  });
})();
