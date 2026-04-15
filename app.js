const grid = document.getElementById("grid");
const search = document.getElementById("search");

let original = [];
let filtered = [];

async function load(file) {
  const res = await fetch("./brands/" + file);
  original = await res.json();

  filtered = original;

  grid.innerHTML = "";
  renderAll();
}

function renderAll() {
  const frag = document.createDocumentFragment();

  for (const b of filtered) {
    const card = document.createElement("a");
    card.className = "card";
    card.href = b.link;
    card.target = "_blank";

    const img = document.createElement("img");
    img.src = b.icon;

    const name = document.createElement("div");
    name.textContent = b.name;
    name.className = "name";

    const origin = document.createElement("div");
    origin.textContent = b.origin;
    origin.className = "origin";

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(origin);

    frag.appendChild(card);
  }

  grid.appendChild(frag);
}

search.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();

  filtered = original.filter(b =>
    b.name.toLowerCase().includes(q)
  );

  grid.innerHTML = "";
  renderAll();
});

load("chains.json");