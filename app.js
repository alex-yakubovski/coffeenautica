document.addEventListener("DOMContentLoaded", () => {

  const grid = document.getElementById("grid");
  const searchInput = document.getElementById("search");

  let allBrands = [];
  let filtered = [];
  let index = 0;

  const BATCH = 50;

  const BASE_URL = "/coffeenautica/";

  async function load() {
    const res = await fetch(BASE_URL + "brands.json");
    allBrands = await res.json();
    filtered = allBrands;

    render();
  }

  function render() {
    const slice = filtered.slice(index, index + BATCH);

    const frag = document.createDocumentFragment();

    slice.forEach(b => {
      const el = document.createElement("div");
      el.className = "card";

      el.innerHTML = `
        <a href="${b.link}" target="_blank">
          <img src="${b.icon}" loading="lazy" />
          <div>${b.name}</div>
          <small>${b.origin}</small>
        </a>
      `;

      frag.appendChild(el);
    });

    grid.appendChild(frag);
    index += BATCH;
  }

  window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
      render();
    }
  });

  searchInput.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();

    filtered = allBrands.filter(b =>
      b.name.toLowerCase().includes(q)
    );

    grid.innerHTML = "";
    index = 0;
    render();
  });

  load();
});