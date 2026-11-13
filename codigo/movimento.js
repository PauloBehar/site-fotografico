// Movimento ao rolar a página: elementos surgem suavemente e o filme "se afasta".
// Tudo desligado para quem pede menos movimento nas preferências do sistema.
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("has-motion");

  // 1. o que surge ao entrar na tela
  const selectors = [
    ".hero__copy > *",
    ".section-heading",
    ".project-card",
    ".closing-note > *:not(p)",
    ".gallery-intro > *",
    ".gallery__head",
    ".gallery__item",
    ".gold-rule",
    ".hub__title",
    ".door",
    ".shows__title",
    ".shows__list li",
    ".page-intro > *",
    ".expo__text",
    ".expo__media",
    ".about__portrait",
    ".about__text",
  ];
  const targets = document.querySelectorAll(selectors.join(","));

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.01 });

  // fotos da galeria e cartões chegam em cascata (atraso pela posição no grupo)
  const stagger = (el) => {
    const siblings = [...el.parentElement.children];
    return Math.min(siblings.indexOf(el), 8) * 90;
  };

  // as fotos da galeria são criadas por galeria.js: espera o DOM ficar pronto
  const start = () => {
    for (const el of document.querySelectorAll(selectors.join(","))) {
      if (el.closest(".intro") || el.closest(".film") || el.closest(".lightbox")) continue;
      el.classList.add("reveal");
      if (el.matches(".gallery__item, .project-card, .door, .shows__list li, .gallery-intro > *")) {
        el.style.transitionDelay = `${stagger(el)}ms`;
      }
      observer.observe(el);
    }
  };
  if (targets.length || document.querySelector("[data-galeria]")) {
    requestAnimationFrame(() => requestAnimationFrame(start));
  }

  // 3. foto que cresce até a tela cheia (a onça-preta do livro):
  //    o progresso da rolagem dentro de cada seção leva a foto de 50% a 100%
  //    e faz surgir o título no fim
  const zooms = [...document.querySelectorAll(".zoom")];
  if (zooms.length) {
    let zTicking = false;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const updateZooms = () => {
      zTicking = false;
      for (const zoom of zooms) {
        const r = zoom.getBoundingClientRect();
        if (r.bottom < -100 || r.top > window.innerHeight + 100) continue;
        const range = zoom.offsetHeight - window.innerHeight;
        const raw = Math.min(Math.max(-r.top / (range * 0.7), 0), 1);
        zoom.style.setProperty("--zs", String(0.5 + ease(raw) * 0.5));
        zoom.style.setProperty("--zc", String(Math.max(0, (raw - 0.75) / 0.25)));
      }
    };
    window.addEventListener("scroll", () => {
      if (!zTicking) { zTicking = true; requestAnimationFrame(updateZooms); }
    }, { passive: true });
    window.addEventListener("resize", updateZooms);
    updateZooms();
  }

  // 3b. fotos em cortina (galerias e exposições): abrem uma vez ao entrar na tela
  const bandObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-open");
      bandObserver.unobserve(entry.target);
    }
  }, { threshold: 0.35 });
  for (const band of document.querySelectorAll(".band")) bandObserver.observe(band);

  // 4. frase final: cada linha acende em sequência
  const closing = document.querySelector(".closing-note p");
  if (closing) {
    closing.innerHTML = closing.innerHTML
      .split(/<br\s*\/?>/i)
      .map((line, i) => `<span class="line reveal" style="transition-delay:${i * 450}ms">${line.trim()}</span>`)
      .join("<br>");
    for (const line of closing.querySelectorAll(".line")) observer.observe(line);
  }

  // 2. o filme se afasta levemente ao rolar para baixo
  const film = document.querySelector(".film__video");
  if (film) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const h = film.offsetHeight || 1;
      const p = Math.min(Math.max(window.scrollY / h, 0), 1); // 0 = topo, 1 = filme fora da tela
      film.style.transform = `scale(${1 - p * 0.06}) translateY(${p * 6}%)`;
      film.style.opacity = String(1 - p * 0.55);
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }
})();
