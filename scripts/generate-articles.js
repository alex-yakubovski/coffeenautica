const fs = require("fs");
const path = require("path");

// input
const topics = JSON.parse(fs.readFileSync("./data/topics.json", "utf8"));

// output
const articles = topics.map((topic, i) => {
  const slug = topic.toLowerCase().replace(/\s+/g, "-");

  return {
    title: topic,
    slug,
    date: new Date().toISOString().split("T")[0],
    excerpt: `Everything about ${topic} in modern coffee culture.`,
    content: `
      <p>${topic} is one of the key themes in modern coffee culture.</p>
      <p>This article explores its origins, trends, and global impact.</p>
      <p>More insights coming soon.</p>
    `
  };
});

fs.writeFileSync(
  "./data/articles.json",
  JSON.stringify(articles, null, 2)
);

console.log("Static articles generated");