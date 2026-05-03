const OpenAI = require("openai");
const fs = require("fs");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const topics = JSON.parse(fs.readFileSync("./data/topics.json", "utf8"));

const articles = [];

async function run() {
  for (const topic of topics) {
    console.log("Generating:", topic);

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "Return ONLY valid JSON with title, slug, excerpt, date, content"
        },
        {
          role: "user",
          content: `Write article about: ${topic}`
        }
      ]
    });

    const article = JSON.parse(response.choices[0].message.content);
    articles.push(article);
  }

  fs.writeFileSync(
    "./data/articles.json",
    JSON.stringify(articles, null, 2)
  );

  console.log("AI articles generated");
}

run();