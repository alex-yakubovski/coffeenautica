// ----- elements -----
const grid = document.getElementById("grid");
const search = document.getElementById("search");
const buttons = document.querySelectorAll(".categories button");

// ----- state -----
let original = [];
let filtered = [];

// ----- load json -----
async function load(file) {
  try {
    const res = await fetch("./brands/" + file);
    original = await res.json();
    filtered = original;

    render();
  } catch (e) {
    console.error("JSON load error:", e);
  }
}

// ----- render -----
function render() {

  grid.innerHTML = "";

  filtered.forEach(b => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <a href="${b.link}" target="_blank" style="text-decoration:none;color:inherit">
        <img src="${b.icon}">
        <div class="name">${b.name}</div>
        <div class="origin">${b.origin}</div>
      </a>
    `;

    grid.appendChild(card);

  });

}

// ----- search -----
if (search) {
  search.addEventListener("input", e => {

    const q = e.target.value.toLowerCase();

    filtered = original.filter(b =>
      b.name.toLowerCase().includes(q)
    );

    render();

  });
}

// ----- category buttons -----
buttons.forEach(btn => {

  btn.addEventListener("click", () => {
    load(btn.dataset.file);
  });

});

// ----- start -----
load("chains.json");