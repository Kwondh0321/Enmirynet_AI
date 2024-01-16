let chatHistory = [];

// 스크롤을 하였을 때 input_box가 젤 위로 가게 하는 이벤트 함수
window.addEventListener("scroll", function () {
  const headTitle = document.querySelector(".head_title");
  const inputBox = document.querySelector(".input_box");
  const scrollY = window.scrollY;

  inputBox.style.transition = "top 0.4s ease";

  if (scrollY <= headTitle.offsetHeight) {
    // 스크롤이 헤더 아래에 있는 경우
    inputBox.style.position = "fixed";
    inputBox.style.top = `${headTitle.offsetHeight}px`;
  } else {
    // 스크롤이 헤더 위로 올라간 경우
    inputBox.style.position = "fixed";
    inputBox.style.top = "0";
  }
});

async function sendUserInput() {
  const userInputElement = document.getElementById("input_keyword");
  const userInput = userInputElement.value.trim();
  let chattingElement = document.getElementById("chatting");
  let chatHistoryElement = document.getElementById("chatHistory");

  // 내용이 없을 시 메시지 추가
  if (!userInput) {
    const placeholderMessage = document.createElement("div");
    placeholderMessage.classList.add("chat-bubble", "system-bubble"); // 새로운 클래스 추가
    placeholderMessage.innerText = "SYSTEM > 내용이 없어요!";

    const chatBoxContainer = document.createElement("div");
    chatBoxContainer.classList.add("chat-box-container");
    chatBoxContainer.appendChild(placeholderMessage);

    chatHistoryElement.appendChild(chatBoxContainer);
    return;
  }

  try {
    // 채팅 기록에 사용자 입력 추가 (Me 메시지)
    userInputElement.value = "";
    chatHistory.push({ user: userInput, ai: "" });
    displayChatHistory();

    // 채팅 기록에 로딩 메시지 추가
    chatHistory[chatHistory.length - 1].ai =
      "답변 중이에요! 잠시만 기다려주세요!";
    displayChatHistory();

    // 실제 AI 응답 크롤링
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

    // 채팅 기록에 실제 AI 응답 추가
    chatHistory[chatHistory.length - 1].ai = data.response;
    displayChatHistory();
  } catch (error) {
    console.error("Error sending user input:", error);
    chatHistory[chatHistory.length - 1].ai = "[Error]  " + error;
  }
}

function displayChatHistory() {
  const chatHistoryElement = document.getElementById("chatHistory");

  // 이전에 표시된 채팅 기록 지우기
  chatHistoryElement.innerHTML = "";

  // 대화창 컨테이너
  const chatBoxContainer = document.createElement("div");
  chatBoxContainer.classList.add("chat-box-container");
  chatHistoryElement.appendChild(chatBoxContainer);

  // 채팅 기록 표시
  chatHistory.forEach((chat, index) => {
    // 대화창 박스
    const chatBox = document.createElement("div");
    chatBox.classList.add("chat-box");
    chatBoxContainer.appendChild(chatBox);

    // ME 메시지
    const meMessage = document.createElement("div");
    meMessage.classList.add("chat-bubble", "me-bubble");
    meMessage.innerText = `ME > ${chat.user}`;
    chatBox.appendChild(meMessage);

    // AI 메시지
    const aiMessage = document.createElement("div");
    aiMessage.classList.add("chat-bubble", "ai-bubble");
    aiMessage.innerText = `AI > ${chat.ai}`;
    chatBox.appendChild(aiMessage);
  });
}
