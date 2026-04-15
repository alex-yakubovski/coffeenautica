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

  // 🔥 ВАЖНО: форс decode после первого рендера
  requestAnimationFrame(decodeImages);
}

// ---------- RENDER ----------
function render() {
  if (index >= filtered.length) return;

  const slice = filtered.slice(index, index + BATCH);

  let html = "";

  for (const b of slice) {
    html += `
      <a class="card" href="${b.link}" target="_blank">
        <img src="${b.icon}">
        <div class="name">${b.name}</div>
        <div class="origin">${b.origin}</div>
      </a>
    `;
  }

  grid.insertAdjacentHTML("beforeend", html);

  index += BATCH;
}

// ---------- FIX (КЛЮЧЕВОЙ МОМЕНТ) ----------
function decodeImages() {
  const imgs = document.querySelectorAll("#grid img");

  imgs.forEach(img => {
    // принудительно запускаем decode pipeline
    if (img.decode) {
      img.decode().catch(() => {});
    }
  });
}

// ---------- SCROLL ----------
window.addEventListener("scroll", () => {
  const bottom = window.innerHeight + window.scrollY;
  const height = document.body.offsetHeight;

  if (bottom >= height - 200) {
    render();

    // снова форсим decode
    requestAnimationFrame(decodeImages);
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
    requestAnimationFrame(decodeImages);
  });
}

// ---------- CATEGORY ----------
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    load(btn.dataset.file);
  });
});

// ---------- START ----------
load("chains.json");