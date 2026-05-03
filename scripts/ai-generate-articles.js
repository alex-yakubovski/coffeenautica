import OpenAI from "openai";
import fs from "fs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const topics = JSON.parse(fs.readFileSync("./data/topics.json", "utf8"));

const articles = [];

for (const topic of topics) {
  console.log("Generating:", topic);

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a professional coffee culture writer. Output ONLY valid JSON."
      },
      {
        role: "user",
        content: `
Create an article about: "${topic}"

Return JSON:
{
  "title": "...",
  "slug": "...",
  "excerpt": "...",
  "date": "2026-05-02",
  "content": "<p>HTML article content</p>"
}
        `
      }
    ]
  });

  const raw = response.choices[0].message.content;

  try {
    const article = JSON.parse(raw);
    articles.push(article);
  } catch (e) {
    console.log("Parse error:", raw);
  }
}

fs.writeFileSync(
  "./data/articles.json",
  JSON.stringify(articles, null, 2)
);

console.log("AI articles generated");