// Imported from "REST API of Enmirynet"
// If you want to use this service, please visit "https://ai.ournicerver.com/"

const gptKey = process.env["GPT_Key"];
const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());

app.listen(port, () => {
  console.log(`The Server is running on PORT '${port}'`);
});

app.post("/chat", async (req, res) => {
  const express = require("express");
  const app = express();
  const allowedOrigins = [
    "", // Enter the Front-end domain link (cors policy)
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );

  const userInput = req.body.userInput;

  try {
    const response = await getChatGPTResponse(userInput);
    res.json({ response: response });
  } catch (error) {
    console.error("Error in ChatGPT response:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function getChatGPTResponse(prompt) {
  const apiKey = gptKey; // Obtain an API key from OpenAI
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4-0613", // Replace `gpt-4-0613` with `gpt-3.5-turbo` if you don't have early access to GPT-4
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    const answer = data.choices && data.choices[0]?.message?.content;

    if (!answer) {
      throw new Error("No valid data in the API response.");
    }
    return answer;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}
