const grid = document.getElementById("grid");
const search = document.getElementById("search");

let original = [];
let filtered = [];

const BATCH = 60;
let index = 0;

// безопасный путь для GitHub Pages
const BASE = "/coffeenautica/";

async function load() {
  const res = await fetch(BASE + "brands.json");
  original = await res.json();
  filtered = original;

  render();
}

function render() {
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

// infinite scroll (без дублей)
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
    if (index < filtered.length) render();
  }
});

// search (без потери данных)
search.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();

  filtered = original.filter(b =>
    b.name.toLowerCase().includes(q)
  );

  grid.innerHTML = "";
  index = 0;

  render();
});

load();