class ChatApp {
  constructor() {
    // Initialize class properties
    this.chatHistory = [];
    this.messageIdCounter = 1;

    // Register event listeners
    window.addEventListener("scroll", this.handleScroll.bind(this)); // Register scroll event listener
    document.getElementById("input_keyword").addEventListener("keydown", (event) => { // Register enter key event listener
      if (event.key === "Enter") {
        this.sendUserInput();
      }
    });
    document.querySelector(".confirm-button").addEventListener("click", (event) => this.sendUserInput()); // Register click button event listener
  }

  // Handle scroll event
  handleScroll() {
    const headTitle = document.querySelector(".head_title");
    const inputBox = document.querySelector(".input_box");
    const scrollY = window.scrollY;

    inputBox.style.transition = "top 0.4s ease";

    if (scrollY <= headTitle.offsetHeight) {
      inputBox.style.position = "fixed";
      inputBox.style.top = `${headTitle.offsetHeight}px`;
    } else {
      inputBox.style.position = "fixed";
      inputBox.style.top = "0";
    }
  }

  // Send user input and process it
  async sendUserInput() {
    const userInputElement = document.getElementById("input_keyword");
    const userInput = userInputElement.value.trim();
    const chatHistoryElement = document.getElementById("chatHistory");

    // Function to display system messages
    function systemBubbleMsg(chat) {
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
      systemBubbleMsg("There's no content!");
      return;
    }

    // Add a message if the previous response is still being written
    if (this.chatHistory.length > 0 && this.chatHistory[this.chatHistory.length - 1].ai === "Writing a response! Please wait a moment!") {
      systemBubbleMsg("Still writing the previous response!");
      return;
    }

    try {
      // Add user input to chat history
      userInputElement.value = "";
      const messageId = this.messageIdCounter++;
      this.chatHistory.push({id: messageId, user: userInput, ai: ""});
      this.displayChatHistory();

      // Add loading message
      this.chatHistory[this.chatHistory.length - 1].ai = "Writing a response! Please wait a moment!";
      this.displayChatHistory();

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

      // Add actual AI response
      this.chatHistory[this.chatHistory.length - 1].ai = data.response;
      this.displayChatHistory();
    } catch (error) {
      console.error("Error during user input submission:", error);
      this.chatHistory[this.chatHistory.length - 1].ai = "[Error]  " + error;
    }
  }

  // Display chat history
  displayChatHistory() {
    const chatHistoryElement = document.getElementById("chatHistory");

    // Clear previously displayed chat history
    chatHistoryElement.innerHTML = "";

    // Chat box container
    const chatBoxContainer = document.createElement("div");
    chatBoxContainer.classList.add("chat-box-container");
    chatHistoryElement.appendChild(chatBoxContainer);

    // Display chat history
    this.chatHistory.forEach((chat) => {
      this.displayChatBox(chat, chatBoxContainer);
    });
  }

  // Display chat box
  displayChatBox(chat, chatBoxContainer) {
    // Chat box
    const chatBox = document.createElement("div");
    chatBox.classList.add("chat-box");
    chatBoxContainer.appendChild(chatBox);

    // ME message
    const meMessage = this.createChatBubble("me-bubble", `ME > ${chat.user}`);
    chatBox.appendChild(meMessage);

    // AI message
    const aiMessage = this.createChatBubble("ai-bubble", `AI > ${chat.ai}`);
    chatBox.appendChild(aiMessage);
  }

  // Create chat bubble
  createChatBubble(className, text) {
    const message = document.createElement("div");
    message.classList.add("chat-bubble", className);
    message.innerText = text;
    return message;
  }
}

// Create an instance of the ChatApp class
const chatApp = new ChatApp();

/*
Code to check unique chat IDs in the console
chatApp.chatHistory.map(chat => {
  console.log(`ID: ${chat.id}\nMe: ${chat.user}\nAI: ${chat.ai}`);
});
*/
