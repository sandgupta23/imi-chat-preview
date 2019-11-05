import {ESourceType, IMessageData, ISendApiResp, ISendApiResponsePayload} from "./typings/send-api";
import {getTimeInHHMM} from "./utility";
import {IBotDetailsApiResp} from "./typings/bot-detaills-api";
import {environment} from "./environment";

export let $chatInput;
export let $chatInputIcon;
export let $botIntro;
export let $chatBody;
export let $chatFooter;
export let $loader;
export let $envOptions;
export let $botTitle;
export let $botDescription;
export let $botLogo;
export let $phoneModel;
export let $langSelect;
export let $langSubmit;
export let $chatContainer;
export let $knowMoreContainer;
export let $knowMoreClose;
export let $knowMoreOverlay;
export const botResponses: ISendApiResp[] = [];

export function domInit(dom) {
    $chatContainer = document.querySelector('.imi-preview-grid-container');
    // $chatInput = document.getElementById('chat-input') as HTMLInputElement;
    $chatInput = dom.$chatInput;
    $chatInputIcon = document.getElementById('chat-input-icon') as HTMLInputElement;
    $botIntro = document.getElementById('botIntro');
    $chatBody = document.getElementById('body');
    $chatFooter = document.getElementsByClassName('footer')[0];
    $loader = document.getElementsByClassName('loader')[0];
    $envOptions = document.getElementById('env-options');
    $botTitle = document.getElementById('bot-title');
    $botDescription = document.getElementById('bot-description');
    $botLogo = document.getElementById('bot-logo') as HTMLImageElement;
    $phoneModel = document.getElementById('phone-modal');
    $langSelect = document.getElementById('lang-select') as HTMLSelectElement;
    $langSubmit = document.getElementById('lang-submit');

    $knowMoreContainer = document.getElementsByClassName('chat-know-more-overlay')[0];
    $knowMoreClose = document.getElementsByClassName('close-chat-img-overlay')[0];
    $knowMoreOverlay = document.getElementsByClassName('chat-img-overlay')[0];
}

export function setOptions(intro: IBotDetailsApiResp) {

    if ($botLogo) {
        $botLogo.src = intro.logo;//intro.logo;
    }
    if ($botTitle) {
        $botTitle.textContent = intro.name;
    }

    if ($botDescription) {
        $botDescription.textContent = intro.description;
    }
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

export function AppendMessageInChatBody(messages: IMessageData[], botResponse: ISendApiResponsePayload) {

    debugger;
    const isLast = messages[0].isLast;
    if (botResponse) {
        if (environment.room && environment.room.id && botResponse.room.id !== environment.room.id) {
            AppendMessageInChatBody(<any>[{SESSION_EXPIRY: true}], null);
            console.log(`previous room : ${environment.room}. new room ${botResponse.room.id}`);
        }
        console.log(environment.room, botResponse.room);
        environment.room = JSON.parse(JSON.stringify(botResponse.room));
    }

    const txnId = botResponse && botResponse.transaction_id || 'human';
    const bot_message_id = botResponse && botResponse.bot_message_id || 'human';
    let str = "";
    let frag = document.createDocumentFragment();
    let videoStr = "";
    if (messages[0].SESSION_EXPIRY) {
        debugger;
        if (document.getElementsByClassName('msg-bubble').length > 0) {
            str = getBotMessageTemplateForSessionExpiry(messages[0]);
        } else {
            return;
        }
    } else {
        if (messages.length === 1 && (<any>messages[0]).sourceType === "session_expired") {
            return;
        }
        messages.forEach((message) => {
            // if (message.SESSION_EXPIRY || (<any>message).sourceType === "session_expired") {
            //     return;
            // }
            if (message.text) {
                str = str + getBotMessageTemplateForText(message.text, message.sourceType);
            }
            if (message.SESSION_EXPIRY) {
                str = str + getBotMessageTemplateForSessionExpiry(message.text, message.sourceType);
            }
            if (message.quick_reply) {

                str = str + getBotMessageTemplateForQuickReply(message.quick_reply, message.sourceType);
            }
            if (message.media || message.image || message.audio || message.video) {

                let url = "";
                let type = "";
                if (message.media) {
                    if (Object.keys(message.media)[0].startsWith('audio')) {
                        type = 'audio'
                    }
                    if (Object.keys(message.media)[0].startsWith('video')) {
                        type = 'audio'
                    }
                    if (Object.keys(message.media)[0].startsWith('image')) {
                        type = 'audio'
                    }
                    url = message.media.audio_url || message.media.video_url || message.media.image_url;

                    if (message.media.length) {
                        str = str + getBotMessageTemplateForCarousal(message.media);
                    }
                } else {
                    if (Object.keys(message)[0].startsWith('audio')) {
                        type = 'audio'
                    }
                    if (Object.keys(message)[0].startsWith('video')) {
                        type = 'video'
                    }
                    if (Object.keys(message)[0].startsWith('image')) {
                        type = 'image'
                    }
                    url = message[type].url;
                }
                if (type === "audio") {
                    str = str + getBotMessageTemplateForAudio(url);
                }
                if (type === "video") {
                    str = str + getBotMessageTemplateForVideo(url);
                    videoStr = videoStr + `<video muted="muted"  class="msg-video" controls="true" playsinline="playsinline">
                <source src="${url}"/>
                    Your browser does not support HTML5 video.
                </video>`;
                }
                if (type === "image") {
                    str = str + getBotMessageTemplateForImage(url);
                }
            }
        });

        console.log(str);

        let humanClass = messages[0].sourceType === ESourceType.human ? 'msg-bubble-human' : '';
        let time = getTimeInHHMM();

        let feedbackSTr = "";
        const messageWithFeedback = (messages.find((message) => message.feedback != null));
        let likeActive;
        let disLikeActive;
        if (messageWithFeedback) {
            const feedback = messageWithFeedback.feedback
            likeActive = (feedback === "1" || feedback === "POSITIVE") ? 'active' : '';
            disLikeActive = (feedback === "0" || feedback === "NEGATIVE") ? 'active' : '';
            feedbackSTr = `data-feedback="${feedback}"`;
        }

        console.log('==>', str);


        const feedbackHtml = `
        <div class="msg-bubble-options-panel" ${feedbackSTr}>
                    <i class="fa fa-thumbs-up feedback-like ${likeActive}" data-feedback-value="1" title="Helpful"></i>
                    <i class="fa fa-thumbs-down feedback-dislike ${disLikeActive}" title="Not helpful" data-feedback-value="0"></i>
                </div>
        `;

        str = `
            <div xmlns="http://www.w3.org/1999/xhtml" data-txn="${txnId}"  data-bot_message_id="${bot_message_id}"
             class="msg-bubble ${humanClass}" style="position:relative;">
                ${isLast ? feedbackHtml : ''}
<!--                <div class="msg-bubble-options">-->
<!--                    <i class="fa fa-ellipsis-h"></i>-->
<!--                </div>-->
                <div class="msg-bot-logo">
                    <img 
                    src="${environment.logo}"
                    onerror="this.src='https://imibot-production.s3-eu-west-1.amazonaws.com/integrations/v2/default-fallback-image.png'"
                     style="height: 100%; width: 100%" />
                </div>
                <div class="message-container">
                    ${str}
                    <div class="time" style="font-size: 9px">${time}</div>
                </div>
            </div>  
            
        `;
    }

    // $chatBody.innerHTML = $chatBody.innerHTML + str;
    const el = getElementsFromHtmlStr(str) as HTMLElement;
    const carousal = el.querySelector('.carousal-container') as HTMLElement;
    frag.appendChild(el);
    if (carousal) {
        carousal.style.opacity = '0';
    }
    $chatBody.appendChild(frag);


    if (carousal) {
        let carousalWidth = $chatBody.offsetWidth as any - 60;
        let dataItemToShow = '1';
        if (carousalWidth > 0 && carousalWidth < 225) {
            dataItemToShow = '1';
        } else {
            if (carousalWidth > 0 && carousalWidth < 450) {
                dataItemToShow = '2';
            } else if (carousalWidth >= 450 && carousalWidth < 675) {
                carousalWidth = 450;
                dataItemToShow = '2';
            } else if (carousalWidth >= 675) {
                carousalWidth = 675;
                dataItemToShow = '3';
            }
        }
        carousal.setAttribute('data-itemToShow', dataItemToShow);

        let carousalItemCount = carousal.getElementsByClassName('item').length;
        if (carousalItemCount <= Number(dataItemToShow)) {
            carousal.classList.add('no-controls');
        }
        carousal.style.width = carousalWidth + 'px';
        carousal.style.opacity = '1';
    }
    let msgVid = document.getElementsByClassName('msg-video');
    if (videoStr) {
        const lastMsgVid = msgVid[msgVid.length - 1];
        lastMsgVid.innerHTML = videoStr;
    }
    // resetChatInput();
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
    quick_reply.quick_replies.forEach((quick_reply) => {
        str = str + `<button data-payload="${quick_reply.payload}">${quick_reply.title}</button>`
    });

    return str;
}

function getBotMessageTemplateForQuickReply(quick_replies, source?: ESourceType) {
    debugger;
    const htmlStr = `
                <div class="message-wrapper ${source === ESourceType.human ? 'message-wrapper-human' : ''}">
                    <div class="content">${quick_replies.text}</div>
                </div>
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

function getBotMessageTemplateForSessionExpiry(text, source?: ESourceType) {
    const htmlStr = `
                <div class="session-expiry-message" xmlns="http://www.w3.org/1999/xhtml">
                    <div class="div" style="width: 70%; display: flex; align-items: center;" >
                        <hr style="border: 1px solid #80808030; flex-grow: 1; "/>
                        <div style="padding: 0 10px">Session expired</div>
                        <hr style="border: 1px solid #80808030; flex-grow: 1;"/>
                        
                    </div>
                </div>
            `;
    return htmlStr;
}

function createCarousalButtons(buttons) {
    let str = "";
    buttons.forEach((button) => {
        str = str + `
            <li class="action" data-payload="${button.payload}" data-type="${button.type}">${button.title}</li>
        `;
    });
    return str;
}

function createCarousalItems(mediaItem: any) {
    let url = mediaItem.url.split("&").join("&amp;");
    return `
    <div class="item">
            <div class="bot-carousal-item shadow-theme">
                <div class="banner" style="background-image: url(${url})"></div>
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
                    <audio controls="controls">
                          <source src="${url}"/>
                        Your browser does not support the audio element.
                    </audio>
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
                style="min-width: 220px;width: 100%; padding-top: 105%; position: relative; margin-bottom: 20px; background:#80808017; border-radius: 8px; overflow: hidden">
                    <img 
                    style="position:absolute; top: 50%; left: 0; right: 0; bottom: 0;width: 100%;height: 100%;transform: translateY(-50%)" 
                    class="msg-img click-to-zoom" src="${url}" alt=""/>
                </div>
            `;
    return htmlStr;
}


