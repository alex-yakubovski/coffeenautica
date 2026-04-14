const grid = document.getElementById("grid");
const search = document.getElementById("search");

let original = [];
let filtered = [];

const BATCH = 60;
let index = 0;

// GitHub Pages base (важно)
const BASE = "/coffeenautica/";

// -------- LOAD DATA --------
async function load() {
  try {
    const res = await fetch(BASE + "brands.json");
    original = await res.json();

    filtered = original;

    // первый рендер сразу
    render();

    // сразу подгрузить дальше если экран высокий
    lazyFill();
  } catch (e) {
    console.error("LOAD ERROR:", e);
  }
}

// -------- RENDER --------
function render() {
  if (index >= filtered.length) return;

  const slice = filtered.slice(index, index + BATCH);

  const frag = document.createDocumentFragment();

  slice.forEach(b => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <a href="${b.link}" target="_blank" style="text-decoration:none;color:inherit">
        <img src="${b.icon}" loading="lazy" />
        <div class="name">${b.name}</div>
        <div class="origin">${b.origin}</div>
      </a>
    `;

    frag.appendChild(card);
  });

  grid.appendChild(frag);
  index += BATCH;
}

// -------- AUTO FILL (чтобы не было “пусто пока не скроллишь”) --------
function lazyFill() {
  const sentinel = document.getElementById("sentinel");

  if (!sentinel) {
    const el = document.createElement("div");
    el.id = "sentinel";
    el.style.height = "1px";
    document.body.appendChild(el);

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        render();
      }
    });

    observer.observe(el);
  }
}

// -------- SEARCH --------
search.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();

  filtered = original.filter(b =>
    b.name.toLowerCase().includes(q)
  );

  grid.innerHTML = "";
  index = 0;

  render();
  lazyFill();
});

// -------- START --------
load();