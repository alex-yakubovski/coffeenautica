const grid = document.getElementById("grid");
const search = document.getElementById("search");

let original = [];
let filtered = [];

const BATCH = 60;
let index = 0;

let currentFile = "chains.json";

// ---------- LOAD ----------
async function load(file) {

  currentFile = file;

  const res = await fetch("./brands/" + file);

  original = await res.json();
  filtered = original;

  grid.innerHTML = "";
  index = 0;

  render();
}

// ---------- RENDER ----------
function render() {

  if(index >= filtered.length) return;

  const slice = filtered.slice(index, index + BATCH);

  const frag = document.createDocumentFragment();

  slice.forEach(b => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <a href="${b.link}" target="_blank" style="text-decoration:none;color:inherit">
        <img src="${b.icon}" loading="lazy">
        <div class="name">${b.name}</div>
        <div class="origin">${b.origin}</div>
      </a>
    `;

    frag.appendChild(card);

  });

  grid.appendChild(frag);

  index += BATCH;
}

// ---------- SCROLL ----------
window.addEventListener("scroll", () => {

  if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 200){
    render();
  }

});

// ---------- SEARCH ----------
search.addEventListener("input",(e)=>{

  const q = e.target.value.toLowerCase();

  filtered = original.filter(b =>
    b.name.toLowerCase().includes(q)
  );

  grid.innerHTML = "";
  index = 0;

  render();

});

// ---------- CATEGORY BUTTONS ----------
document.querySelectorAll(".categories button").forEach(btn => {

  btn.addEventListener("click", () => {

    load(btn.dataset.file);

  });

});

// ---------- START ----------
load("chains.json");