const fs = require('fs');
const path = require('path');

// paths
const brandsPath = path.join(__dirname, '../data/brands.json');
const templatePath = path.join(__dirname, '../templates/brand-template.html');
const outputDir = path.join(__dirname, '../brands');

// load files
const brands = JSON.parse(fs.readFileSync(brandsPath, 'utf8'));
const template = fs.readFileSync(templatePath, 'utf8');

// create brands directory if not exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// generate pages
brands.forEach(brand => {
  let html = template;

  html = html.replace(/{{NAME}}/g, brand.name);
  html = html.replace(/{{COUNTRY}}/g, brand.country);
  html = html.replace(/{{DESCRIPTION}}/g, brand.description);
  html = html.replace(/{{LOGO}}/g, brand.logo);

  const outputPath = path.join(outputDir, `${brand.slug}.html`);

  fs.writeFileSync(outputPath, html);

  console.log(`Generated: ${brand.slug}.html`);
});

console.log('Done.');