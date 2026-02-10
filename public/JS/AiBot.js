document.addEventListener("DOMContentLoaded", () => {
  let toggleOpen = false;

  const aiToggle = document.getElementById("Ai-bot");
  const chatbox = document.getElementById("chat-box");
  const close = chatbox.querySelector("#close-btn");
  const sendBtn = chatbox.querySelector("#send-btn");
  const userInput = document.getElementById("user-input");
  const msgList = document.getElementById("msg-list");

  // Initially hide chatbox
  if (!toggleOpen) {
    chatbox.style.display = "none";
  }

  // Open chatbox
  aiToggle.addEventListener("click", () => {
    chatbox.style.display = "flex";
    toggleOpen = true;
    userInput.focus(); // Auto-focus input when chat opens
  });

  // Close chatbox
  close.addEventListener("click", () => {
    chatbox.style.display = "none";
    toggleOpen = false;
  });

  // Auto-scroll to bottom of chat
  function scrollToBottom() {
    const chatMsg = chatbox.querySelector(".chat-msg");
    chatMsg.scrollTop = chatMsg.scrollHeight;
  }

  // Auto-resize textarea as user types
  userInput.addEventListener("input", function() {
    this.style.height = "auto";
    this.style.height = Math.min(this.scrollHeight, 100) + "px";
  });

  // Function to send message
  async function sendMessage() {
    const message = userInput.value.trim();
    
    // Don't send empty messages
    if (message === "") return;

    // Create and append user message
    const newMsg = document.createElement("li");
    newMsg.classList.add("send-msg");
    newMsg.innerText = message;
    msgList.appendChild(newMsg);
    
    // Clear input and reset height
    userInput.value = "";
    userInput.style.height = "auto";
    
    // Scroll to bottom to show new message
    scrollToBottom();

    // Show typing indicator (if you have one in your HTML)
    const typingIndicator = document.getElementById("typing-indicator");
    if (typingIndicator) {
      typingIndicator.classList.add("active");
      scrollToBottom();
    }

    // Disable send button while waiting for response
    sendBtn.disabled = true;
    sendBtn.style.opacity = "0.6";
    sendBtn.style.cursor = "not-allowed";

    try {
      // Send message to backend
      const response = await fetch("/ai/assistance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message }),
      });

      // Hide typing indicator
      if (typingIndicator) {
        typingIndicator.classList.remove("active");
      }

      // Check if response is OK
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.text();

      // Create and append bot response
      const newResponse = document.createElement("li");
      newResponse.classList.add("received-msg");
      newResponse.innerHTML = marked.parse(data);
      msgList.appendChild(newResponse);
      
      // Scroll to show new response
      scrollToBottom();

    } catch (error) {
      // Hide typing indicator on error
      if (typingIndicator) {
        typingIndicator.classList.remove("active");
      }

      // Show error message to user
      const errorMsg = document.createElement("li");
      errorMsg.classList.add("received-msg");
      errorMsg.style.backgroundColor = "#fee";
      errorMsg.style.color = "#c33";
      errorMsg.innerText = "Sorry, something went wrong. Please try again.";
      msgList.appendChild(errorMsg);
      
      scrollToBottom();
      console.error("Error sending message:", error);
    } finally {
      // Re-enable send button
      sendBtn.disabled = false;
      sendBtn.style.opacity = "1";
      sendBtn.style.cursor = "pointer";
      userInput.focus(); // Return focus to input
    }
  }

  // Send message on button click
  sendBtn.addEventListener("click", sendMessage);

  // Send message on Enter key (Shift+Enter for new line)
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
});