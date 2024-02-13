let chatHistory = [];
let messageIdCounter = 1; // Unique ID for each chat message

// Detect Enter key
function DataTransfer(event, num) {
  if (num == 1 && event && event.key === "Enter") {
    sendUserInput();
  } else if (num == 2) {
    sendUserInput();
  }
}

// Event function to move the input_box to the top when scrolling
window.addEventListener("scroll", function () {
  const headTitle = document.querySelector(".head_title");
  const inputBox = document.querySelector(".input_box");
  const scrollY = window.scrollY;

  inputBox.style.transition = "top 0.4s ease";

  if (scrollY <= headTitle.offsetHeight) {
    // If the scroll is below the header
    inputBox.style.position = "fixed";
    inputBox.style.top = `${headTitle.offsetHeight}px`;
  } else {
    // If the scroll is above the header
    inputBox.style.position = "fixed";
    inputBox.style.top = "0";
  }
});

async function sendUserInput() {
  const userInputElement = document.getElementById("input_keyword");
  const userInput = userInputElement.value.trim();
  let chattingElement = document.getElementById("chatting");
  let chatHistoryElement = document.getElementById("chatHistory");

  function system_bubble_msg(chat) {
    const placeholderMessage = document.createElement("div");
    placeholderMessage.classList.add("chat-bubble", "system-bubble");
    placeholderMessage.innerText = `SYSTEM > ${chat}`;

    const chatBoxContainer = document.createElement("div");
    chatBoxContainer.classList.add("chat-box-container");
    chatBoxContainer.appendChild(placeholderMessage);

    chatHistoryElement.appendChild(chatBoxContainer);
  }

  // Add a message if there is no content
  if (!userInput) {
    system_bubble_msg("There is no content!");
    return;
  }

  if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].ai === "I'm still composing a response! Please wait a moment!") {
    system_bubble_msg("I'm still composing the previous response!");
    return;
  }

  try {
    // Add user input to chat history (Me message)
    userInputElement.value = "";
    const messageId = messageIdCounter++;
    chatHistory.push({
      id: messageId,
      user: userInput,
      ai: "",
    });
    displayChatHistory();

    // Add loading message to chat history
    chatHistory[chatHistory.length - 1].ai =
      "I'm composing a response! Please wait a moment!";
    displayChatHistory();

    // Fetch actual AI response
    const response = await fetch("https://api.ournicerver.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userInput: userInput,
      }),
    });

    const data = await response.json();

    // Add actual AI response to chat history
    chatHistory[chatHistory.length - 1].ai = data.response;
    displayChatHistory();
  } catch (error) {
    console.error("Error sending user input:", error);
    chatHistory[chatHistory.length - 1].ai = "[Error]  " + error;
  }
}

function displayChatHistory() {
  const chatHistoryElement = document.getElementById("chatHistory");

  // Clear previously displayed chat history
  chatHistoryElement.innerHTML = "";

  // Conversation container
  const chatBoxContainer = document.createElement("div");
  chatBoxContainer.classList.add("chat-box-container");
  chatHistoryElement.appendChild(chatBoxContainer);

  // Display chat history
  chatHistory.forEach((chat) => {
    // Chat box
    const chatBox = document.createElement("div");
    chatBox.classList.add("chat-box");
    chatBoxContainer.appendChild(chatBox);

    // ME message
    const meMessage = document.createElement("div");
    meMessage.classList.add("chat-bubble", "me-bubble");
    meMessage.innerText = `ME > ${chat.user}`;
    chatBox.appendChild(meMessage);

    // AI message
    const aiMessage = document.createElement("div");
    aiMessage.classList.add("chat-bubble", "ai-bubble");
    aiMessage.innerText = `AI > ${chat.ai}`;
    chatBox.appendChild(aiMessage);
  });
}
