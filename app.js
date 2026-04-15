const grid = document.getElementById("grid");
const search = document.getElementById("search");
const buttons = document.querySelectorAll(".categories button");

let data = [];
let filtered = [];

async function load(file) {
  const res = await fetch("./brands/" + file);
  const json = await res.json();

  // 🔥 ЖЁСТКАЯ проверка данных
  if (!Array.isArray(json)) {
    console.error("JSON IS NOT ARRAY:", json);
    return;
  }

  data = json;
  filtered = json;

  console.log("TOTAL ITEMS:", data.length);

  render();
}

function render() {
  grid.innerHTML = "";

  const frag = document.createDocumentFragment();

  for (let i = 0; i < filtered.length; i++) {
    const b = filtered[i];

    // 🔥 защита от битых элементов
    if (!b || !b.name || !b.icon) continue;

    const card = document.createElement("a");
    card.className = "card";
    card.href = b.link || "#";
    card.target = "_blank";

    const img = document.createElement("img");
    img.src = b.icon;

    const name = document.createElement("div");
    name.textContent = b.name;

    const origin = document.createElement("div");
    origin.textContent = b.origin || "";

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(origin);

    frag.appendChild(card);
  }

  grid.appendChild(frag);

  console.log("RENDER DONE:", frag.children.length);
}

search?.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();

  filtered = data.filter(b =>
    (b.name || "").toLowerCase().includes(q)
  );

  render();
});

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    load(btn.dataset.file);
  });
});

load("chains.json");