fetch('./brands.json')
  .then(r => {
    if (!r.ok) throw new Error("brands.json not loaded");
    return r.json();
  })
  .then(brands => {
    const grid = document.getElementById('grid');

    if (!grid) {
      console.log("NO GRID FOUND");
      return;
    }

    grid.innerHTML = brands.map(b => `
      <a href="${b.link}" class="card">
        <img src="${b.icon}" width="64" height="64">
        <div>${b.name}</div>
      </a>
    `).join('');
  })
  .catch(err => {
    console.error("ERROR:", err);
  });