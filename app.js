const grid = document.getElementById("grid");
const search = document.getElementById("search");
const buttons = document.querySelectorAll(".categories button");

let data = [];
let filtered = [];

// ---------- LOAD ----------
async function load(file) {
  const res = await fetch("./brands/" + file);
  data = await res.json();

  filtered = data;

  render();
}

// ---------- RENDER ----------
function render() {
  grid.innerHTML = "";

  for (const b of filtered) {
    const card = document.createElement("a");
    card.className = "card";
    card.href = b.link;
    card.target = "_blank";

    const img = document.createElement("img");
    img.src = b.icon;

    const name = document.createElement("div");
    name.textContent = b.name;

    const origin = document.createElement("div");
    origin.textContent = b.origin;

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(origin);

    grid.appendChild(card);
  }
}

// ---------- SEARCH ----------
search.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();

  filtered = data.filter(b =>
    b.name.toLowerCase().includes(q)
  );

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