const grid = document.getElementById("grid");
const search = document.getElementById("search");
const buttons = document.querySelectorAll(".categories button");

let data = [];
let filtered = [];

// ---------- LOAD ----------
async function load(file) {
  try {
    console.log("LOAD START");

    const res = await fetch("./brands/" + file);
    data = await res.json();

    console.log("TOTAL ITEMS:", data.length);

    filtered = data;

    render();

    console.log("LOAD END");
  } catch (e) {
    console.error("LOAD ERROR:", e);
  }
}

// ---------- RENDER ----------
function render() {
  console.log("RENDER START");

  grid.innerHTML = "";

  const frag = document.createDocumentFragment();

  for (let i = 0; i < filtered.length; i++) {
    const b = filtered[i];

    if (!b) {
      console.log("SKIP BROKEN ITEM:", i);
      continue;
    }

    const card = document.createElement("a");
    card.className = "card";
    card.href = b.link || "#";
    card.target = "_blank";

    const img = document.createElement("img");
    img.src = b.icon || "";

    const name = document.createElement("div");
    name.className = "name";
    name.textContent = b.name || "NO NAME";

    const origin = document.createElement("div");
    origin.className = "origin";
    origin.textContent = b.origin || "";

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(origin);

    frag.appendChild(card);
  }

  grid.appendChild(frag);

  console.log("RENDER END:", filtered.length);
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