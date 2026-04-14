fetch('./brands.json')
  .then(res => res.json())
  .then(brands => {

    const grid = document.getElementById('grid');

    brands.forEach(b => {
      const card = document.createElement('a');
      card.href = `brand.html?slug=${b.slug}`;
      card.className = 'card';

      card.innerHTML = `
        <img src="${b.logo}" />
        <div>${b.name}</div>
      `;

      grid.appendChild(card);
    });

  });