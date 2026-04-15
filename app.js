const grid = document.getElementById("grid");
const search = document.getElementById("search");
const buttons = document.querySelectorAll(".categories button");

let original = [];
let filtered = [];

const BATCH = 60;
let index = 0;

async function load(file) {
  const res = await fetch("./brands/" + file);
  original = await res.json();

  filtered = original;

  grid.innerHTML = "";
  index = 0;

  render();

  // 🔥 ключ: заставляем браузер пересчитать layout ОДИН раз
  void grid.offsetHeight;
}

function render() {
  if (index >= filtered.length) return;

  const slice = filtered.slice(index, index + BATCH);

  const frag = document.createDocumentFragment();

  for (const b of slice) {
    const a = document.createElement("a");
    a.className = "card";
    a.href = b.link;
    a.target = "_blank";

    a.innerHTML = `
      <img src="${b.icon}">
      <div class="name">${b.name}</div>
      <div class="origin">${b.origin}</div>
    `;

    frag.appendChild(a);
  }

  grid.appendChild(frag);

  index += BATCH;
}

window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
    render();
  }
});

search.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();

  filtered = original.filter(b =>
    b.name.toLowerCase().includes(q)
  );

  grid.innerHTML = "";
  index = 0;

  render();

  void grid.offsetHeight;
});

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    load(btn.dataset.file);
  });
});

load("chains.json");