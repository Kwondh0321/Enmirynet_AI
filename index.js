// Imported from "REST API of Enmirynet"

const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());

app.listen(port, () => {
  console.log(`서버는 ${port} Port에서 정상작동 중입니다`);
});

app.post("/chat", async (req, res) => {
  const express = require("express");
  const app = express();
  const allowedOrigins = [
    "https://ai.ournicerver.com"
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
  const apiKey = "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";
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4-0613",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          {
            role: "user",
            content: prompt
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

