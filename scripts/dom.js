// dom - Manages DOM interactions
import { generateBotResponse, generateBotResponseStream } from "./apis.js";
import { loadChat, saveChat, addMessage, clearChat } from "./localstorage.js";

const mode = document.querySelector("#mode");
const setting = document.querySelector("#setting");
const settingBar = document.querySelector(".setting");
const nondisplay = document.querySelector("#non-display");
const sendMesssag = document.querySelector("#send-messsag");
const chatbody = document.querySelector(".chat-message");
const messageInput = document.querySelector("#message-input");
const h1 = document.querySelector(".title");
const newChatBtn = document.querySelector("#new-chat");

const userData = {
    message: null,
    file: {
        data: null,
        mime_type: null
    }
};

let abortController = null;
let messages = loadChat();

function createUserMessage(content, classes) {
    const div = document.createElement("div");
    div.innerHTML = content;
    div.classList.add(classes);
    return div;
}

function renderMessages() {
    chatbody.innerHTML = "";
    messages.forEach(msg => {
        if (msg.role === "user") {
            const messageUser = `   <div >
                <div class="message">
                    <p>${msg.content} </p>
                </div> ${msg.file ? `<img src="data:${msg.file.mime_type};base64,${msg.file.data}" class="attachment" alt="">` : ""}`;
            chatbody.appendChild(createUserMessage(messageUser, "boit-message-user"));
        } else {
            const incomingMessageDiv = createUserMessage(`<div class="respose"><div class="message">${msg.content}</div></div>`, "boit-message-ai");
            chatbody.appendChild(incomingMessageDiv);
        }
    });
    scrollToBottom();
    if (messages.length > 0) {
        h1.classList.add("display-non");
        document.querySelector(".chatbody").style.marginTop = "10px";
        document.querySelector("footer").classList.add("hight");
    }
}

function scrollToBottom() {
    chatbody.scrollTo({ top: chatbody.scrollHeight, behavior: "smooth" });
}

function handleOutGoingMessage() {
    userData.message = messageInput.value.trim();
    if (!userData.message && !userData.file.data) return;

    const userMessage = {
        role: "user",
        content: userData.message,
        file: userData.file.data ? { data: userData.file.data, mime_type: userData.file.mime_type } : null
    };
    messages.push(userMessage);
    saveChat(messages);

    const messageUser = `   <div >
                <div class="message">
                    <p>${userData.message} </p>
                </div> ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" alt="">` : ""}`;

    chatbody.appendChild(createUserMessage(messageUser, "boit-message-user"));

    setTimeout(() => {
        const incomingOutMessage = ` <div>
                    <div class="message">
                       <span class="loader"></span>
                    </div>
                </div>`;
        const incomingMessageDiv = createUserMessage(incomingOutMessage, "boit-message-ai");
        chatbody.appendChild(incomingMessageDiv);
        responseDataAI(incomingMessageDiv, userData.message);
        scrollToBottom();
    }, 300);
}

async function responseDataAI(incomingMessageDiv, userDatamessage) {
    abortController = new AbortController();
    const messageElement = incomingMessageDiv.querySelector(".message") || incomingMessageDiv;
    messageElement.innerHTML = '<span class="loader"></span>';

    try {
        incomingMessageDiv.innerHTML = `  <div class="respose">  <div class="message"></div></div>`;
        const messageDiv = incomingMessageDiv.querySelector(".message");
        let fullResponse = "";

        for await (const chunk of generateBotResponseStream(userData.file.data, userData.file.mime_type, userDatamessage, abortController.signal)) {
            fullResponse += chunk;
            messageDiv.innerHTML = fullResponse;
            scrollToBottom();
        }

        messages.push({ role: "assistant", content: fullResponse });
        saveChat(messages);
    } catch (error) {
        if (error.name !== "AbortError") {
            incomingMessageDiv.innerHTML = `  <div class="respose">  <div class="message error">Error: ${error.message}</div></div>`;
        }
    } finally {
        userData.file = { data: null, mime_type: null };
        scrollToBottom();
    }
}

function startSend() {
    h1.classList.add("display-non");
    document.querySelector(".chatbody").style.marginTop = "10px";
    document.querySelector("footer").classList.add("hight");
    handleOutGoingMessage();
    messageInput.value = "";
}
//
const fileUpload = document.querySelector("#file-upload");
const fileInput = document.querySelector("#file-input");

fileUpload.addEventListener("click", () => { fileInput.click() })
fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64String = e.target.result.split(",")[1];
            userData.file = {
                    data: base64String,
                    mime_type: file.type
                }
                // fileInput.value = "";
        }

        reader.readAsDataURL(file);
    })
    //
    // ...existing code...
    
const picker = new EmojiMart.Picker({
  theme: "dark",
  skinTonePosition: "none",
  previewPosition: "none",
  onEmojiSelect:(emoji)=>{
    const {selectionStart:start,selectionEnd:end}=messageInput;
    messageInput.setRangeText(emoji.native,start,end,"end");
    messageInput.focus();
  }
});
const emojiElement=document.createElement("div");
emojiElement.className="emoji-tab";
document.querySelector(".chat-footer").appendChild(emojiElement);
 emojiElement.appendChild(picker)
 const emojichatBtn=document.querySelector(".emoji-chat");

 emojichatBtn.addEventListener("click",(e)=>{
                e.preventDefault()
                emojiElement.classList.toggle("display-emoji");
                
 })

 const nav = document.querySelector("nav ");
const open = document.querySelector("#open");
const close = document.querySelector("#close");

mode.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("mode-nght");
    mode.querySelector(".fa-solid").classList.replace(isDark ? "fa-sun" : "fa-moon", isDark ? "fa-moon" : "fa-sun");
    mode.setAttribute("aria-pressed", isDark);
    mode.setAttribute("aria-label", isDark ? "Toggle light mode" : "Toggle dark mode");
});

setting.addEventListener("click", () => {
    const isOpen = settingBar.classList.toggle("settingBar");
    settingBar.hidden = !isOpen;
    setting.setAttribute("aria-expanded", isOpen);
});

nondisplay.addEventListener("click", () => {
    settingBar.classList.remove("settingBar");
    settingBar.hidden = true;
    setting.setAttribute("aria-expanded", "false");
});

messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && messageInput.value.trim() !== "") {
        e.preventDefault();
        startSend();
    }
});

sendMesssag.addEventListener("click", (e) => {
    e.preventDefault();
    if (messageInput.value.trim() !== "") {
        startSend();
    }
});

open.addEventListener("click", () => {
    const isOpen = !nav.classList.contains("nav_display");
    nav.classList.toggle("nav_display", isOpen);
    open.setAttribute("aria-expanded", isOpen);
    close.setAttribute("aria-expanded", isOpen);
});

close.addEventListener("click", () => {
    nav.classList.remove("nav_display");
    open.setAttribute("aria-expanded", "false");
    close.setAttribute("aria-expanded", "false");
});

// Cancel request on Escape key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && abortController) {
        abortController.abort();
    }
});

// New chat button
newChatBtn.addEventListener("click", (e) => {
    e.preventDefault();
    clearChat();
    messages = [];
    renderMessages();
    h1.classList.remove("display-non");
    document.querySelector(".chatbody").style.marginTop = "";
    document.querySelector("footer").classList.remove("hight");
});

// Initialize chat on load
renderMessages();