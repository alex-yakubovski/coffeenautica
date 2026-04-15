// ---------- ELEMENTS ----------
const grid = document.querySelector("#grid");
const search = document.querySelector("#search");
const buttons = document.querySelectorAll(".categories button");

// ---------- STATE ----------
let original = [];
let filtered = [];

const BATCH = 60;
let index = 0;

// ---------- LOAD CATEGORY ----------
async function load(file) {

  try {

    const res = await fetch("./brands/" + file);
    original = await res.json();
    filtered = original;

    grid.innerHTML = "";
    index = 0;

    render();

  } catch (err) {

    console.error("JSON LOAD ERROR:", err);

  }

}

// ---------- RENDER ----------
function render() {

  if (!grid) return;

  const slice = filtered.slice(index, index + BATCH);

  const frag = document.createDocumentFragment();

  slice.forEach(b => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <a href="${b.link}" target="_blank" style="text-decoration:none;color:inherit">
        <img src="${b.icon}">
        <div class="name">${b.name}</div>
        <div class="origin">${b.origin}</div>
      </a>
    `;

    frag.appendChild(card);

  });

  grid.appendChild(frag);

  index += BATCH;

}

// ---------- SCROLL LOAD ----------
window.addEventListener("scroll", () => {

  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
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

// ---------- CATEGORY BUTTONS ----------
buttons.forEach(btn => {

  btn.addEventListener("click", () => {

    const file = btn.dataset.file;

    load(file);

  });

});

// ---------- START ----------
load("chains.json");