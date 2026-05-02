const fs = require('fs');
const path = require('path');

// paths
const articlesPath = path.join(__dirname, '../data/articles.json');
const templatePath = path.join(__dirname, '../templates/article-template.html');
const outputDir = path.join(__dirname, '../journal');
const latestPostsPath = path.join(__dirname, '../data/latest-posts.json');

// load data
const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
const template = fs.readFileSync(templatePath, 'utf8');

// create journal directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// generate article pages
articles.forEach(article => {
  let html = template;

  html = html.replace(/{{TITLE}}/g, article.title);
  html = html.replace(/{{DATE}}/g, article.date);
  html = html.replace(/{{EXCERPT}}/g, article.excerpt);
  html = html.replace(/{{CONTENT}}/g, article.content);

  const outputPath = path.join(outputDir, `${article.slug}.html`);

  fs.writeFileSync(outputPath, html);

  console.log(`Generated article: ${article.slug}.html`);
});

// generate latest-posts.json automatically
const latestPosts = articles.map(article => ({
  title: article.title,
  slug: article.slug
}));

fs.writeFileSync(
  latestPostsPath,
  JSON.stringify(latestPosts, null, 2)
);

console.log('Updated latest-posts.json');

console.log('Done.');