const translations = {
  pt: {
    navAbout: "sobre",
    aboutTitle: "sobre o fotógrafo",
    introRole: "fotografia · fine art",
    galleryTitle: "galerias",
    galWildlife: "vida selvagem",
    galLandscapes: "paisagens",
    galArchitecture: "arquitetura &amp; cidades",
    galBlackWhite: "preto &amp; branco",
    filmTitle: "felinos do brasil · o livro",
    soundOn: "ligar o som",
    soundOff: "desligar o som",
    enterWithSound: "entrar com som",
    skip: "Pular para o conteúdo",
    role: "Fotografia",
    navLabel: "Navegação principal",
    languageLabel: "Selecionar idioma",
    navFineArt: "galerias",
    navBooks: "Livros",
    navExhibitions: "Exposições",
    heroEyebrow: "Arquivo visual · Brasil",
    heroTitle: "Fotografias para olhar <em>com calma.</em>",
    doorGalleries: "galerias",
    bookKicker: "o livro",
    heroDescription: "Um espaço para imagens, histórias e projetos autorais de Paulo Behar.",
    heroLink: "Explore o portfólio",
    heroArtLabel: "Composição gráfica abstrata em tons escuros",
    heroArtCaption: "IMAGENS<br>EM BREVE",
    heroArtNote: "Uma imagem, muitas maneiras de ver.",
    heroFooter: "Fotografia autoral · Fine art · Publicações",
    scroll: "Desça para explorar",
    portfolioEyebrow: "O trabalho",
    portfolioTitle: "Imagens em diferentes <em>capítulos.</em>",
    portfolioNote: "Fine art, livros e exposições: três caminhos para o mesmo olhar.",
    fineArtCategory: "Coleção",
    booksCategory: "Publicações",
    exhibitionsCategory: "Encontros",
    fineArtLink: "Ver a galeria Fine Art",
    booksLink: "Ver os livros",
    exhibitionsLink: "Ver as exposições",
    closingLabel: "Nota do fotógrafo",
    closingText: "Toda fotografia começa com um instante.<br>O olhar é o que fica.",
    copyright: "© Paulo Behar",
    rights: "Todas as fotografias são protegidas por direitos autorais (Lei 9.610/98). Reprodução proibida sem autorização. Ampliações fine art sob consulta.",
    backToTop: "Voltar ao início ↑"
  },
  en: {
    navAbout: "about",
    aboutTitle: "about the photographer",
    introRole: "photography · fine art",
    galleryTitle: "galleries",
    galWildlife: "wildlife",
    galLandscapes: "landscapes",
    galArchitecture: "architecture &amp; cities",
    galBlackWhite: "black &amp; white",
    filmTitle: "felinos do brasil · the book",
    soundOn: "turn sound on",
    soundOff: "turn sound off",
    enterWithSound: "enter with sound",
    skip: "Skip to content",
    role: "Photography",
    navLabel: "Main navigation",
    languageLabel: "Select language",
    navFineArt: "galleries",
    navBooks: "Books",
    navExhibitions: "Exhibitions",
    heroEyebrow: "Visual archive · Brazil",
    heroTitle: "Photographs to look at <em>slowly.</em>",
    doorGalleries: "galleries",
    bookKicker: "the book",
    heroDescription: "A space for images, stories and personal projects by Paulo Behar.",
    heroLink: "Explore the portfolio",
    heroArtLabel: "Abstract graphic composition in dark tones",
    heroArtCaption: "IMAGES<br>COMING SOON",
    heroArtNote: "One image, many ways of seeing.",
    heroFooter: "Personal photography · Fine art · Publications",
    scroll: "Scroll to explore",
    portfolioEyebrow: "The work",
    portfolioTitle: "Images in different <em>chapters.</em>",
    portfolioNote: "Fine art, books and exhibitions: three paths to the same eye.",
    fineArtCategory: "Collection",
    booksCategory: "Publications",
    exhibitionsCategory: "Gatherings",
    fineArtLink: "View the Fine Art gallery",
    booksLink: "View the books",
    exhibitionsLink: "View the exhibitions",
    closingLabel: "Photographer's note",
    closingText: "Every photograph begins with a moment.<br>The way we see is what remains.",
    copyright: "© Paulo Behar",
    rights: "All photographs are protected by copyright. Reproduction without permission is prohibited. Fine art prints available on request.",
    backToTop: "Back to top ↑"
  },
  es: {
    navAbout: "sobre mí",
    aboutTitle: "sobre el fotógrafo",
    introRole: "fotografía · fine art",
    galleryTitle: "galerías",
    galWildlife: "vida salvaje",
    galLandscapes: "paisajes",
    galArchitecture: "arquitectura y ciudades",
    galBlackWhite: "blanco y negro",
    filmTitle: "felinos do brasil · el libro",
    soundOn: "activar el sonido",
    soundOff: "desactivar el sonido",
    enterWithSound: "entrar con sonido",
    skip: "Saltar al contenido",
    role: "Fotografía",
    navLabel: "Navegación principal",
    languageLabel: "Seleccionar idioma",
    navFineArt: "galerías",
    navBooks: "Libros",
    navExhibitions: "Exposiciones",
    heroEyebrow: "Archivo visual · Brasil",
    heroTitle: "Fotografías para mirar <em>con calma.</em>",
    doorGalleries: "galerías",
    bookKicker: "el libro",
    heroDescription: "Un espacio para imágenes, historias y proyectos personales de Paulo Behar.",
    heroLink: "Explora el portafolio",
    heroArtLabel: "Composición gráfica abstracta en tonos oscuros",
    heroArtCaption: "IMÁGENES<br>PRÓXIMAMENTE",
    heroArtNote: "Una imagen, muchas maneras de ver.",
    heroFooter: "Fotografía personal · Fine art · Publicaciones",
    scroll: "Desplázate para explorar",
    portfolioEyebrow: "El trabajo",
    portfolioTitle: "Imágenes en distintos <em>capítulos.</em>",
    portfolioNote: "Fine art, libros y exposiciones: tres caminos hacia la misma mirada.",
    fineArtCategory: "Colección",
    booksCategory: "Publicaciones",
    exhibitionsCategory: "Encuentros",
    fineArtLink: "Ver la galería Fine Art",
    booksLink: "Ver los libros",
    exhibitionsLink: "Ver las exposiciones",
    closingLabel: "Nota del fotógrafo",
    closingText: "Toda fotografía comienza con un instante.<br>La mirada es lo que permanece.",
    copyright: "© Paulo Behar",
    rights: "Todas las fotografías están protegidas por derechos de autor. Prohibida su reproducción sin autorización. Copias fine art bajo consulta.",
    backToTop: "Volver al inicio ↑"
  }
};

const languageButtons = document.querySelectorAll("[data-language]");
const translatableElements = document.querySelectorAll("[data-i18n]");
const ariaTranslatableElements = document.querySelectorAll("[data-i18n-aria]");

function setLanguage(language) {
  const messages = translations[language];
  if (!messages) return;

  document.documentElement.lang = language === "pt" ? "pt-BR" : language;

  for (const element of translatableElements) {
    const message = messages[element.dataset.i18n];
    if (message) element.innerHTML = message;
  }

  for (const element of ariaTranslatableElements) {
    const message = messages[element.dataset.i18nAria];
    if (message) element.setAttribute("aria-label", message);
  }

  for (const button of languageButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.language === language));
  }

  currentLanguage = language;
  updateSoundLabel();
}

// Filme de entrada com a música do livro.
// Os navegadores só deixam tocar som depois de um clique/toque/tecla da pessoa,
// então: tentamos com som; se bloquear, toca mudo e o primeiro gesto liga a música.
let currentLanguage = "pt";
const film = document.querySelector("#film");
const filmVideo = document.querySelector("#film-video");
const soundButton = document.querySelector("#film-sound");
let mutedOnPurpose = false;
let filmStarted = false;

function updateSoundLabel() {
  if (!filmVideo || !soundButton) return;
  const key = filmVideo.muted ? "soundOn" : "soundOff";
  soundButton.querySelector(".film__sound-label").textContent = translations[currentLanguage][key];
  soundButton.setAttribute("aria-pressed", String(!filmVideo.muted));
  film.classList.toggle("is-muted", filmVideo.muted);
}

function playFilm({ withSound }) {
  if (!filmVideo) return;
  filmStarted = true;
  filmVideo.muted = !withSound;
  filmVideo.play()
    .catch(() => {
      // som bloqueado pelo navegador: segue mudo, com o botão em destaque
      filmVideo.muted = true;
      return filmVideo.play();
    })
    .catch(() => {})
    .finally(updateSoundLabel);
}

if (filmVideo && soundButton) {
  soundButton.addEventListener("click", () => {
    mutedOnPurpose = !filmVideo.muted;
    playFilm({ withSound: filmVideo.muted });
  });

  // primeiro gesto em qualquer lugar da página liga a música
  const firstGesture = (event) => {
    if (event.target.closest && event.target.closest("#film-sound")) return;
    if (!filmStarted) return;   // gesto na abertura: quem cuida é a própria abertura
    if (filmVideo.muted && !mutedOnPurpose) playFilm({ withSound: true });
    for (const type of ["pointerdown", "keydown", "touchend"]) window.removeEventListener(type, firstGesture);
  };
  for (const type of ["pointerdown", "keydown", "touchend"]) window.addEventListener(type, firstGesture);

  // pausa quando o filme sai da tela (a música não acompanha a navegação)
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      if (!filmStarted) return;               // durante a abertura o filme espera
      if (entry.isIntersecting) filmVideo.play().catch(() => {});
      else filmVideo.pause();
    }, { threshold: 0.25 }).observe(filmVideo);
  }
}

for (const button of languageButtons) {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
}

document.querySelector("#year").textContent = String(new Date().getFullYear());

// Abertura com assinatura.
// O título aparece primeiro e o filme carrega por trás, parado e invisível.
// A abertura só se despede quando (a) o título já teve seu tempo e (b) o filme
// tem dados suficientes para tocar sem engasgar (ou passou o tempo máximo).
// Aí o filme começa do zero, de uma vez só: sem pular, sem recomeçar.
const intro = document.querySelector("#intro");
const introVisible = intro && !document.documentElement.classList.contains("intro-seen")
  && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (introVisible && filmVideo) {
  const MIN_MS = 2600;     // tempo mínimo do título na tela
  const MAX_MS = 7000;     // nunca espera mais que isso
  const t0 = performance.now();
  let leaving = false;
  let wantsSound = true;

  // celulares só baixam o vídeo quando ele toca: toca mudo um instante e para,
  // só para o download começar
  filmVideo.muted = true;
  filmVideo.play().then(() => {
    if (!leaving) { filmVideo.pause(); filmVideo.currentTime = 0; }
  }).catch(() => {});

  const ready = () => {
    // o navegador calcula sozinho se já dá para tocar até o fim sem parar
    if (filmVideo.readyState >= 4) return true;
    // ou: 8 s já baixados. O começo do filme são letreiros sobre fundo escuro,
    // muito leves, então o resto chega antes de ser preciso.
    const b = filmVideo.buffered;
    return b.length > 0 && b.end(0) >= 8;
  };

  const leave = () => {
    if (leaving) return;
    leaving = true;
    filmVideo.pause();
    filmVideo.currentTime = 0;
    intro.classList.add("is-leaving");
    playFilm({ withSound: wantsSound });
  };
  intro.addEventListener("animationend", (event) => {
    if (event.animationName === "intro-out") intro.classList.add("is-done");
  });

  const check = () => {
    if (leaving) return;
    const elapsed = performance.now() - t0;
    if ((elapsed >= MIN_MS && ready()) || elapsed >= MAX_MS) leave();
    else setTimeout(check, 200);
  };
  setTimeout(check, MIN_MS);

  // clique ou tecla: a pessoa escolheu entrar com som. O gesto libera o áudio
  // agora; se o filme ainda não carregou, a abertura espera um pouco mais.
  const enter = () => {
    if (leaving) return;
    wantsSound = true;
    if (ready()) { leave(); return; }      // já carregou: entra direto, com som
    intro.classList.add("is-waiting");
    filmVideo.muted = false;
    filmVideo.play().then(() => {
      if (!leaving) { filmVideo.pause(); filmVideo.currentTime = 0; }
    }).catch(() => {}).finally(() => {
      if (ready()) leave();
    });
  };
  intro.addEventListener("click", enter);
  window.addEventListener("keydown", enter, { once: true });
} else {
  if (intro) intro.classList.add("is-done");
  playFilm({ withSound: true });
}

// Celular: o filme aparece quadrado. Na cena final (a capa com o título),
// mostra o quadro inteiro para "felinos do brasil" não ser cortado.
if (filmVideo) {
  const COVER_AT = 101.15; // corte para a capa do livro (entra escura, a troca não aparece)
  const syncCover = () => {
    film.classList.toggle("is-cover", filmVideo.currentTime >= COVER_AT);
  };
  if ("requestVideoFrameCallback" in HTMLVideoElement.prototype) {
    const onFrame = () => { syncCover(); filmVideo.requestVideoFrameCallback(onFrame); };
    filmVideo.requestVideoFrameCallback(onFrame);
  } else {
    filmVideo.addEventListener("timeupdate", syncCover);
  }
  filmVideo.addEventListener("seeked", syncCover);
}

// Proteção das fotos: sem "Salvar imagem" (clique direito) e sem arrastar a foto para fora.
// Não impede quem realmente quer copiar, mas complica a cópia casual. As fotos do site
// têm no máximo 2000 px e levam o copyright gravado no arquivo.
document.addEventListener("contextmenu", (e) => {
  if (e.target.closest("img, video, picture, figure, .door__img")) e.preventDefault();
});
document.addEventListener("dragstart", (e) => {
  if (e.target.closest("img, video")) e.preventDefault();
});
