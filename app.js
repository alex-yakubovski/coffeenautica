const grid = document.getElementById("grid");
const search = document.getElementById("search");
const buttons = document.querySelectorAll(".categories button");

let original = [];
let filtered = [];

const BATCH = 60;
let index = 0;

// ---------- LOAD ----------
async function load(file) {
  const res = await fetch("./brands/" + file);
  original = await res.json();

  filtered = original;

  grid.innerHTML = "";
  index = 0;

  render();
}

// ---------- RENDER ----------
function render() {
  if (index >= filtered.length) return;

  const slice = filtered.slice(index, index + BATCH);

  const frag = document.createDocumentFragment();

  for (const b of slice) {
    const card = document.createElement("a");
    card.className = "card";
    card.href = b.link;
    card.target = "_blank";

    const img = document.createElement("img");
    img.src = b.icon;

    const name = document.createElement("div");
    name.className = "name";
    name.textContent = b.name;

    const origin = document.createElement("div");
    origin.className = "origin";
    origin.textContent = b.origin;

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(origin);

    frag.appendChild(card);
  }

  grid.appendChild(frag);

  index += BATCH;

  // 🔥 ключ: форсируем загрузку картинок (реально рабочий метод)
  forceImageReload();
}

// ---------- FIX (НЕ resize, НЕ DOM, А IMAGE PIPELINE) ----------
function forceImageReload() {
  const imgs = grid.querySelectorAll("img");

  imgs.forEach(img => {
    const src = img.src;
    img.src = "";
    img.src = src;
  });
}

// ---------- SCROLL ----------
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
    render();
  }
});

// ---------- SEARCH ----------
search.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();

  filtered = original.filter(b =>
    b.name.toLowerCase().includes(q)
  );

  grid.innerHTML = "";
  index = 0;

  render();
});

// ---------- CATEGORY ----------
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    load(btn.dataset.file);
  });
});

// ---------- START ----------
load("chains.json");