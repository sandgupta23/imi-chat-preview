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
    let videoStr = "";
    messages.forEach((message) => {
        if (message.text) {
            str = str + getBotMessageTemplateForText(message.text, message.sourceType);
        }
        if (message.quick_reply) {
            debugger;
            str = str + getBotMessageTemplateForQuickReply(message.quick_reply, message.sourceType);
        }
        if (message.media) {
            if (message.media.audio_url) {
                str = str + getBotMessageTemplateForAudio(message.media.audio_url);
            }
            if (message.media.video_url) {
                str = str + getBotMessageTemplateForVideo(message.media.video_url);
                videoStr = videoStr + `<video autoplay="autoplay" muted="muted"  class="msg-video" controls="true" playsinline="playsinline">
                <source src="${message.media.video_url}"/>
                    Your browser does not support HTML5 video.
                </video>`;
            }
            if (message.media.image_url) {
                str = str + getBotMessageTemplateForImage(message.media.image_url);
            }

            if (message.media.length) {
                str = str + getBotMessageTemplateForCarousal(message.media);
            }
        }
    });

    let humanClass = messages[0].sourceType === ESourceType.human ? 'msg-bubble-human' : '';
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

    // $chatBody.innerHTML = $chatBody.innerHTML + str;
    const el = getElementsFromHtmlStr(str) as HTMLElement;
    const carousal = el.querySelector('.carousal-container') as HTMLElement;
    frag.appendChild(el);
    carousal.style.opacity = '0';
    $chatBody.appendChild(frag);


    let carousalWidth = $chatBody.offsetWidth as any - 60;
    debugger;
    if (carousalWidth > 0 && carousalWidth < 225) {
        // carousalWidth = carousal;
        // carousalWidth = 225;
        carousal.setAttribute('data-itemToShow', '1');
    } else {
        if (carousalWidth > 0 && carousalWidth < 450) {
            carousalWidth = 225;
            carousal.setAttribute('data-itemToShow', '1');
        } else if (carousalWidth >= 450 && carousalWidth < 675) {
            carousalWidth = 450;
            carousal.setAttribute('data-itemToShow', '2');
        } else if (carousalWidth >= 675) {
            carousalWidth = 675;
            carousal.setAttribute('data-itemToShow', '3');
        }
    }
    carousal.style.width = carousalWidth + 'px';
    carousal.style.opacity = '1';

    let msgVid = document.getElementsByClassName('msg-video');
    if (videoStr) {
        const lastMsgVid = msgVid[msgVid.length - 1];
        lastMsgVid.innerHTML = videoStr;
    }
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

function createQuickReplyButtons(quick_reply) {
    let str = "";
    quick_reply.quick_replies.forEach((quick_reply)=>{
        str = str + `<button data-payload="${quick_reply.payload}">${quick_reply.title}</button>`
    });
    debugger;
    return str;
}

function getBotMessageTemplateForQuickReply(quick_replies, source?: ESourceType) {
    const htmlStr = `
                <div class="message-wrapper-quick-reply">
                    ${createQuickReplyButtons(quick_replies)}
                </div>
            `;
    return htmlStr;
}


function getBotMessageTemplateForText(text, source?: ESourceType) {
    const htmlStr = `
                <div class="message-wrapper ${source === ESourceType.human ? 'message-wrapper-human' : ''}">
                    <div class="content">${text}</div>
                </div>
            `;
    return htmlStr;
}

function createCarousalButtons(buttons) {
    let str = "";
    buttons.forEach((button) => {
        str = str + `
            <li class="title" data-payload="${button.payload}" data-type="${button.type}">${button.title}</li>
        `;
    });
    return str;
}

function createCarousalItems(mediaItem: any) {
    return `
    <div class="item">
            <div class="bot-carousal-item shadow-theme">
                <div class="banner">
                    <img src="https://s3.eu-west-1.amazonaws.com/imibot-production/assets/search-bot-icon.svg" alt=""/>
                </div>
                <ul style="list-style: none">
                    <li class="title">
                        ${mediaItem.title}
                    </li>
                    ${createCarousalButtons(mediaItem.buttons)}
                </ul>
            </div>
        </div>
    `
}

function createCarousalStr(media) {
    let str = "";
    media.forEach((mediaItem) => {
        str = str + createCarousalItems(mediaItem);
    });
    return str;
}

function getBotMessageTemplateForCarousal(media, source?: ESourceType) {

    const carousalStr = createCarousalStr(media);
    return `
               <div class="carousal-container hide-left-control" data-step="0">
                   <div class="carousal-container-inner">
                        ${carousalStr}
                   </div>
                   <div class="fa fa-angle-left control control-left"></div>
                   <div class="fa fa-angle-right control control-right"></div>
                </div>
            `;
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
    // const htmlStr = `
    //             <div class="message-wrapper  message-wrapper-bot">
    //                 <video autoplay="autoplay" muted="muted"  class="msg-video" controls="true" playsinline="playsinline">
    //                     <source src="${url}"/>
    //                     Your browser does not support HTML5 video.
    //                 </video>
    //             </div>
    //         `;
    const htmlStr = `
                <div class="message-wrapper  message-wrapper-bot msg-video">
                    
                </div>
            `;
    return htmlStr;
}

function getBotMessageTemplateForImage(url: string) {
    const htmlStr = `
                <div class="message-wrapper message-wrapper-bot msg-shadow" 
                style="width: 100%; padding-top: 105%; position: relative; margin-bottom: 20px; background:#80808017; border-radius: 8px; overflow: hidden">
                    <img style="position:absolute; top: 50%; left: 0; right: 0; bottom: 0;width: 100%; transform: translateY(-50%)" class="msg-img click-to-zoom" src="${url}" alt=""/>
                </div>
            `;
    return htmlStr;
}

