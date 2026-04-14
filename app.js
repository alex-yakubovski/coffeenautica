const grid = document.getElementById("grid");
const searchInput = document.getElementById("search");

let allBrands = [];
let renderedCount = 0;

const BATCH_SIZE = 50; // важно: не 1000 сразу

// загрузка JSON
async function loadBrands() {
  const res = await fetch("./brands.json");
  allBrands = await res.json();

  renderNextBatch();
}

// рендер пачками (lazy render)
function renderNextBatch() {
  const slice = allBrands.slice(renderedCount, renderedCount + BATCH_SIZE);

  const fragment = document.createDocumentFragment();

  slice.forEach(brand => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <a href="${brand.link}" target="_blank">
        <img src="${brand.icon}" alt="${brand.name}" loading="lazy" />
        <div class="name">${brand.name}</div>
        <div class="origin">${brand.origin}</div>
      </a>
    `;

    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
  renderedCount += BATCH_SIZE;
}

// scroll lazy loading
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
    if (renderedCount < allBrands.length) {
      renderNextBatch();
    }
  }
});

// search
searchInput.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();

  const filtered = allBrands.filter(b =>
    b.name.toLowerCase().includes(q)
  );

  grid.innerHTML = "";
  renderedCount = 0;
  allBrands = filtered;

  renderNextBatch();
});

// старт
loadBrands();