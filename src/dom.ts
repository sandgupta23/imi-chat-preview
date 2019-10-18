import {ESourceType, IMessageData, ISendApiResponsePayload} from "./typings/send-api";
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

export function domInit() {
    $chatInput = document.getElementById('chat-input') as HTMLInputElement;
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
    const txnId = botResponse && botResponse.transaction_id || 'human';
    const bot_message_id = botResponse && botResponse.bot_message_id || 'human';
    let str = "";
    let frag = document.createDocumentFragment();
    let videoStr = "";
    ;
    if (messages[0].SESSION_EXPIRY) {
        str = getBotMessageTemplateForSessionExpiry(messages[0]);
    } else {
        messages.forEach((message) => {
            if (message.text) {
                str = str + getBotMessageTemplateForText(message.text, message.sourceType);
            }
            if (message.SESSION_EXPIRY) {
                str = str + getBotMessageTemplateForSessionExpiry(message.text, message.sourceType);
            }
            if (message.quick_reply) {

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
        str = `
            <div xmlns="http://www.w3.org/1999/xhtml" data-txn="${txnId}"  data-bot_message_id="${bot_message_id}"
             class="msg-bubble ${humanClass}" style="position:relative;">
                <div class="msg-bubble-options-panel" ${feedbackSTr}>
                    <i class="fa fa-thumbs-up feedback-like ${likeActive}" data-feedback-value="1" title="Helpful"></i>
                    <i class="fa fa-thumbs-down feedback-dislike ${disLikeActive}" title="Not helpful" data-feedback-value="0"></i>
                </div>
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
        debugger;
        let carousalItemCount = carousal.getElementsByClassName('item').length;
        if(carousalItemCount <= Number(dataItemToShow) ){
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

function getBotMessageTemplateForSessionExpiry(text, source?: ESourceType) {
    const htmlStr = `
                <div style="width: 100vw; display: flex; justify-content: center; align-items: center; margin: 10px 0" xmlns="http://www.w3.org/1999/xhtml">
                    <div class="div" style="width: 70%; display: flex" >
                        <hr style="border: none;background: #80808030; flex-grow: 1; ;flex-grow: 1;"/>
                        <div style="padding: 0 10px">Session expired</div>
                        <hr style="border: none;background: #80808030; flex-grow: 1; ;flex-grow: 1;"/>
                        
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
                    <img 
                    style="position:absolute; top: 50%; left: 0; right: 0; bottom: 0;width: 100%; transform: translateY(-50%)" 
                    class="msg-img click-to-zoom" src="${url}" alt=""/>
                </div>
            `;
    return htmlStr;
}


