const grid = document.getElementById("grid");
const search = document.getElementById("search");
const buttons = document.querySelectorAll(".categories button");

let original = [];
let filtered = [];

const BATCH = 60;
let index = 0;

let currentFile = "chains.json";

// ---------- LOAD CATEGORY ----------
async function load(file) {
  try {
    currentFile = file;

    const res = await fetch("./brands/" + file);
    original = await res.json();

    filtered = original;

    grid.innerHTML = "";
    index = 0;

    render();

  } catch (err) {
    console.error("LOAD ERROR:", err);
  }
}

// ---------- RENDER ----------
function render() {
  if (!grid) return;
  if (index >= filtered.length) return;

  const slice = filtered.slice(index, index + BATCH);

  const frag = document.createDocumentFragment();

  slice.forEach(b => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = b.icon;
    img.loading = "eager"; // важно: убрали lazy, чтобы не было багов

    const name = document.createElement("div");
    name.className = "name";
    name.textContent = b.name;

    const origin = document.createElement("div");
    origin.className = "origin";
    origin.textContent = b.origin;

    const link = document.createElement("a");
    link.href = b.link;
    link.target = "_blank";
    link.style.textDecoration = "none";
    link.style.color = "inherit";

    link.appendChild(img);
    link.appendChild(name);
    link.appendChild(origin);

    card.appendChild(link);
    frag.appendChild(card);
  });

  grid.appendChild(frag);
  index += BATCH;
}

// ---------- SCROLL (SIMPLE + STABLE) ----------
window.addEventListener("scroll", () => {
  const bottom = window.innerHeight + window.scrollY;
  const height = document.body.offsetHeight;

  if (bottom >= height - 200) {
    render();
  }
});

// ---------- SEARCH ----------
if (search) {
  search.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();

    filtered = original.filter(b =>
      b.name.toLowerCase().includes(q)
    );

    grid.innerHTML = "";
    index = 0;

    render();
  });
}

// ---------- CATEGORY SWITCH ----------
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    load(btn.dataset.file);
  });
});

// ---------- START ----------
load(currentFile);