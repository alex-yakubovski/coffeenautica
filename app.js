const grid = document.getElementById("grid");
const search = document.getElementById("search");
const buttons = document.querySelectorAll(".categories button");

let original = [];
let filtered = [];

const BATCH = 60;
let index = 0;

let currentFile = "chains.json";

// ---------- LOAD ----------
async function load(file) {
  try {
    const res = await fetch("./brands/" + file);
    original = await res.json();

    filtered = original;

    grid.innerHTML = "";
    index = 0;

    render();

    // 🔥 ВАЖНО: форс пересчёта layout + image pipeline
    forceReflow();

  } catch (e) {
    console.error(e);
  }
}

// ---------- RENDER ----------
function render() {
  if (index >= filtered.length) return;

  const slice = filtered.slice(index, index + BATCH);
  const frag = document.createDocumentFragment();

  slice.forEach(b => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = b.icon;

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

// ---------- FIX (КЛЮЧЕВОЙ) ----------
function forceReflow() {
  // заставляем браузер пересчитать layout + images
  requestAnimationFrame(() => {
    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("resize"));
  });
}

// ---------- SCROLL ----------
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
    forceReflow();
  });
}

// ---------- CATEGORY ----------
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    load(btn.dataset.file);
  });
});

// ---------- START ----------
load(currentFile);