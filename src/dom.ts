export const $chatInput = document.getElementById('chat-input') as HTMLInputElement;
export const $botIntro = document.getElementById('botIntro');
export const $chatBody = document.getElementById('body');

export function setIntroDetails(intro: { logo: string, title: string, description: string }) {
    $botIntro.innerHTML = `<span class="bot-logo">
                    <img src="${intro.logo}" alt="">
                </span>
                <div class="bot-details">
                    <div class="title">${intro.title}</div>
                    <div class="description">${intro.description}</div>
                </div>`;
}

export function AppendMessageInChatBody(messages: any[]) {
    let str = "";
    messages.forEach((message) => {
        str = str + getBotMessageTemplate(message.text);
    });
    $chatBody.innerHTML = $chatBody.innerHTML + str;
    resetChatInput();
    scrollBodyToBottom();
}

function scrollBodyToBottom(){
    $chatBody.scrollTop = $chatBody.scrollHeight
}

export function resetChatInput() {
    $chatInput.value = ""
}


function getBotMessageTemplate(text) {
    return `<div class="message-container">
                <div class="message-wrapper">
                    <div class="content">${text}</div>
                </div>
            </div>`
}

