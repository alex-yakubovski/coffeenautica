const grid = document.getElementById("grid");
const search = document.getElementById("search");
const buttons = document.querySelectorAll(".categories button");

let data = [];
let filtered = [];

// ---------- LOAD ----------
async function load(file) {
  try {
    const res = await fetch("./brands/" + file);
    data = await res.json();

    // 🔥 диагностика
    console.log("TOTAL ITEMS:", data.length);
    console.log("FIRST ITEM:", data[0]);
    console.log("LAST ITEM:", data[data.length - 1]);

    filtered = data;

    render();
  } catch (err) {
    console.error("LOAD ERROR:", err);
  }
}

// ---------- RENDER ----------
function render() {
  grid.innerHTML = "";

  const frag = document.createDocumentFragment();

  for (let i = 0; i < filtered.length; i++) {
    const b = filtered[i];

    // защита от битых данных
    if (!b) continue;

    const card = document.createElement("a");
    card.className = "card";
    card.href = b.link || "#";
    card.target = "_blank";

    const img = document.createElement("img");
    img.src = b.icon || "";

    const name = document.createElement("div");
    name.className = "name";
    name.textContent = b.name || "";

    const origin = document.createElement("div");
    origin.className = "origin";
    origin.textContent = b.origin || "";

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(origin);

    frag.appendChild(card);
  }

  grid.appendChild(frag);

  console.log("RENDERED:", filtered.length);
}

// ---------- SEARCH ----------
if (search) {
  search.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();

    filtered = data.filter(b =>
      (b.name || "").toLowerCase().includes(q)
    );

    render();
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