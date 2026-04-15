const grid = document.getElementById("grid");
const search = document.getElementById("search");

let allItems = [];

async function load(file) {
  const res = await fetch(file);
  const data = await res.json();

  allItems = data;
  render(allItems);
}

function render(items) {
  grid.innerHTML = "";

  const html = items.map(b => `
    <a class="card" href="${b.url}" target="_blank">
      <img src="https://www.google.com/s2/favicons?domain=${b.domain}&sz=64">
      <div class="name">${b.name}</div>
      <div class="country">${b.country}</div>
    </a>
  `).join("");

  grid.innerHTML = html;

  console.log("RENDER DONE:", items.length);
}

search.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();

  const filtered = allItems.filter(b =>
    b.name.toLowerCase().includes(q)
  );

  render(filtered);
});

document.querySelectorAll(".categories button").forEach(btn => {
  btn.addEventListener("click", () => {
    load(btn.dataset.file);
  });
});

// 🔥 ВАЖНО: старт
load("chains.json");