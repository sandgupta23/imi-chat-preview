import {ESourceType, IMessageData} from "./typings/send-api";
import {getTimeInHHMM} from "./utility";

export const $chatInput = document.getElementById('chat-input') as HTMLInputElement;
export const $chatInputIcon = document.getElementById('chat-input-icon') as HTMLInputElement;
export const $botIntro = document.getElementById('botIntro');
export const $chatBody = document.getElementById('body');
export const $chatFooter = document.getElementsByClassName('footer')[0];
export const $loader = document.getElementsByClassName('loader')[0];
export const $envOptions = document.getElementById('env-options');
export const $botTitle = document.getElementById('bot-title');
export const $botLogo = document.getElementById('bot-logo') as HTMLImageElement;
export const $phoneModel = document.getElementById('phone-modal');
export const $langSelect = document.getElementById('lang-select') as HTMLSelectElement;
export const $langSubmit = document.getElementById('lang-submit');

export function setIntroDetails(intro: { logo: string, title: string, description: string }) {
    $botLogo.src = 'https://whizkey.ae/wisdom/static/media/rammas.42381205.gif';//intro.logo;
    $botTitle.textContent = intro.title;
    // $botIntro.innerHTML = `<span class="bot-logo">
    //                 <img src="${'https://whizkey.ae/wisdom/static/media/rammas.42381205.gif'}" alt="">
    //             </span>
    //             <div class="bot-details">
    //                 <div class="title">${intro.title}</div>
    //             </div>
    //             <div class="options">
    //                 <i class="fa fa-ellipsis-v"></i>
    //             </div>

// `;
}

export function AppendMessageInChatBody(messages: IMessageData[]) {
    let str = "";
    let frag = document.createDocumentFragment();
    debugger;
    messages.forEach((message) => {
        if (message.text) {
            str = str + getBotMessageTemplateForText(message.text, message.sourceType);
        }
        if (message.media) {
            if (message.media.audio_url) {
                str = str + getBotMessageTemplateForAudio(message.media.audio_url);
            }
            if (message.media.video_url) {
                str = str + getBotMessageTemplateForVideo(message.media.video_url);
            }
            if (message.media.image_url) {
                str = str + getBotMessageTemplateForImage(message.media.image_url);
            }
        }
    });

    let humanClass = messages[0].sourceType === ESourceType.human? 'msg-bubble-human': '';
    let time = getTimeInHHMM();
    str = `
            <div xmlns="http://www.w3.org/1999/xhtml" class="msg-bubble ${humanClass}">
                <div class="msg-bot-logo">
                    <img style="height: 100%; width: 100%" src="https://whizkey.ae/wisdom/static/media/rammas.42381205.gif" alt=""/>
                </div>
                <div class="message-container">
                    ${str}
                    <div class="time" style="font-size: 9px">${time}</div>
                </div>
            </div>  
            
        `;
    debugger;
    // $chatBody.innerHTML = $chatBody.innerHTML + str;
    frag.appendChild(getElementsFromHtmlStr(str));
    $chatBody.appendChild(frag);
    resetChatInput();
    scrollBodyToBottom();
}

function scrollBodyToBottom() {
    $chatBody.scrollTop = $chatBody.scrollHeight
}

export function resetChatInput() {
    $chatInput.value = ""
}

function getElementsFromHtmlStr(htmlStr: string) {
    const doc = new DOMParser().parseFromString(htmlStr, "text/xml");
    return doc.firstChild;
}


function getBotMessageTemplateForText(text, source?: ESourceType) {
    const fragment = document.createDocumentFragment();
    let botLogoStr = `<!--<div class="msg-bot-logo">-->
<!--                        <img style="height: 100%; width: 100%" src="https://whizkey.ae/wisdom/static/media/rammas.42381205.gif" alt=""/>-->
<!--                    </div>-->`;
    // if(source === ESourceType.human){
    //     botLogoStr = "";
    // }
    const htmlStr = `
                <div class="message-wrapper ${source === ESourceType.human ? 'message-wrapper-human' : ''}">
                    <div class="content">${text}</div>
                </div>
            `;
    return htmlStr;
}

function getBotMessageTemplateForAudio(url: string) {
    const htmlStr = `
                <div class="message-wrapper  message-wrapper-bot">
                    <audio class="msg-audio" src="${url}"></audio>
                </div>
            `;
    return htmlStr;
}

function getBotMessageTemplateForVideo(url: string) {
    const htmlStr = `
                <div class="message-wrapper  message-wrapper-bot">
                    <video class="msg-video" controls="">
                        <source src="${url}"/> 
                        Your browser does not support HTML5 video. 
                    </video>
                </div>
            `;
    return htmlStr;
}

function getBotMessageTemplateForImage(url: string) {
    const htmlStr = `
                <div class="message-wrapper message-wrapper-bot">
                    <img class="msg-img click-to-zoom" src="${url}" alt=""/>
                </div>
            `;
    return htmlStr;
}

