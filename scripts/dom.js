// dom - Manages DOM interactions
import { generateBotResponse } from "./apis.js";

const mode = document.querySelector("#mode");
const setting = document.querySelector("#setting");
const settingBar = document.querySelector(".setting");
const nondisplay = document.querySelector("#non-display");
const sendMesssag = document.querySelector("#send-messsag");
const chatbody = document.querySelector(".chat-message");
const userData = {
        message: null,
        file: {
            data: null,
            mime_type: null
        }
    }
    //EVENT CLICK
mode.addEventListener("click", () => {
    if (!document.body.classList.contains("mode-nght")) {
        document.body.classList.add("mode-nght");
        mode.querySelector(".fa-solid").classList.replace("fa-sun", "fa-moon");

    } else {
        document.body.classList.remove("mode-nght");
        mode.querySelector(".fa-solid").classList.replace("fa-moon", "fa-sun");
    }
})
setting.addEventListener("click", function() {
    if (!settingBar.classList.contains("settingBar")) {
        settingBar.classList.add("settingBar");

    }
})
nondisplay.addEventListener("click", function() {
    if (settingBar.classList.contains("settingBar")) {
        settingBar.classList.remove("settingBar");

    }
})
const messageInput = document.querySelector("#message-input");
const h1 = document.querySelector(".title");
messageInput.addEventListener("keydown", function(e) {
    const userMessage = e.target.value.trim();
    if (e.key === "Enter" && userMessage !== "") {
        strtSend();
    }

})
sendMesssag.addEventListener("click", (e) => {
        e.preventDefault();
        if (messageInput.value !== "") {
            strtSend();
        }
    })
    // function
function handleOutGoingMessag() {

    userData.message = messageInput.value.trim();
    const messageUser = `   <div >
                <div class="message">
                    <p>${userData.message} </p>
                </div> ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" alt="">` : ""}`
    chatbody.appendChild(creatUserMessage(messageUser, "boit-message-user"));
    setTimeout(function() {
        const incomingOutMesage = ` <div>
                    <div class="message">
                       <span class="loader"></span>
                    </div>
                </div>`
        const incomingMessageDiv = creatUserMessage(incomingOutMesage, "boit-message-ai");
        chatbody.appendChild(incomingMessageDiv);
        responsedataAI(incomingMessageDiv, userData.message);
        chatbody.appendChild(incomingMessageDiv);
    }, 300)

}

function creatUserMessage(content, classes) {
    const div = document.createElement("div");
    div.innerHTML = content;
    div.classList.add(classes);
    return div;

}

function strtSend() {
    h1.classList.add("display-non");
    document.querySelector(".chatbody").style.marginTop = "10px";
    document.querySelector("footer").classList.add("hight");
    handleOutGoingMessag()
    messageInput.value = "";
}
async function responsedataAI(incomingMessageDiv, userDatamessage) {
    const ResponseDATA = await generateBotResponse(userData.file.data, userData.file.mime_type, userDatamessage);
    incomingMessageDiv.innerHTML = `  <div class="respose">  <div class="message"></div></div>`
    incomingMessageDiv.querySelector(".message").innerHTML = `${ResponseDATA}`;
    chatbody.scrollTo({ top: chatbody.scrollHeight, behavior: "smooth" })
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

    open.addEventListener("click", function() {
        if (!nav.classList.contains("nav_display")) {
            nav.classList.add("nav_display");
        }
    })
    close.addEventListener("click", function() {
        if (nav.classList.contains("nav_display")) {
            nav.classList.remove("nav_display");
        }
    })