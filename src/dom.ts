import {ESourceType, IMessageData, ISendApiResp, ISendApiResponsePayload} from "./typings/send-api";
import {
    encodeUrlForDomParser,
    getTimeIn24HrFormat,
    getTimeInHHMM,
    removeInActiveFeedbackPanel,
    scrollBodyToBottom
} from "./utility";
import {IBotDetailsApiResp} from "./typings/bot-detaills-api";
import {environment} from "./environment";
import {TextReply} from "./response-components/text-reply";
import {SessionExpiry} from "./response-components/session-expiry";
import {QuickReply} from "./response-components/quick-reply";
import {CarouselReply} from "./response-components/carousel-reply";
import {AudioReply} from "./response-components/audio-reply";
import {ImageReply} from "./response-components/image-reply";
import {Feedback} from "./response-components/feedback";
import {VideoReply} from "./response-components/video-reply";

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

export const themeOptions;

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
}

export function AppendMessageInChatBody(messages: IMessageData[], botResponse: ISendApiResponsePayload, hideFeedback) {

    // if (botResponse) {
    //     if (environment.room && environment.room.id && botResponse.room.id !== environment.room.id) {
    //         AppendMessageInChatBody(<any>[{SESSION_EXPIRY: true}], null, true);
    //         console.log(`previous room : ${environment.room.id}. new room ${botResponse.room.id}`);
    //     }
    //     console.log(environment.room, botResponse.room);
    //     environment.room = JSON.parse(JSON.stringify(botResponse.room));
    // }

    const txnId = botResponse && botResponse.transaction_id || 'human';
    const bot_message_id = botResponse && botResponse.bot_message_id || 'human';
    let str = "";
    let wrapper;
    const replies = [];
    let randomNumber;
    let frag = document.createDocumentFragment();
    let videoStr = "";
    if (messages[0].SESSION_EXPIRY) {
        if (document.getElementsByClassName('msg-bubble').length > 0) {
            const reply = new SessionExpiry(messages[0]);
            // str = str + reply.getTemplate(messages[0]);
            const el = reply.getElement(messages[0]);
            replies.push(el);
        } else {
            return;
        }
    } else {
        if (messages.length === 1 && (<any>messages[0]).sourceType === "session_expired") {
            return;
        }
        messages.forEach((message) => {
            if (message.text) {
                // str = str + getBotMessageTemplateForText(message.text, message.sourceType);
                const reply = new TextReply(message);
                // str = str + textReply.getTemplate(message.text, message.sourceType);
                const el = reply.getElement(message);
                replies.push(el);
            }
            if (message.SESSION_EXPIRY) {
                const reply = new SessionExpiry(messages[0]);
                // str = str + reply.getTemplate(messages[0]);
                const el = reply.getElement(messages[0]);
                replies.push(el);
                // str = str + getBotMessageTemplateForSessionExpiry(message.text, message.sourceType);
            }
            if (message.quick_reply) {

                const reply = new QuickReply(messages[0]);

                // str = str + reply.getTemplate(message.quick_reply, message.sourceType);
                const el = reply.getElement(message.quick_reply, message.sourceType);
                replies.push(el);
                // str = str + getBotMessageTemplateForQuickReply(message.quick_reply, message.sourceType);
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
                        type = 'image'
                    }
                    url = message.media.audio_url || message.media.video_url || message.media.image_url;

                    if (message.media.length) {
                        // str = str + getBotMessageTemplateForCarousal(message.media);
                        const reply = new CarouselReply(message.media);
                        // str = str + reply.getTemplate(message.quick_reply, message.sourceType);
                        const el = reply.getElement(message);
                        replies.push(el);
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
                    // str = str + getBotMessageTemplateForAudio(url);
                    const reply = new AudioReply(message);
                    // str = str + reply.getTemplate(url);
                    const el = reply.getElement(url);
                    replies.push(el);
                }
                if (type === "video") {
                    const reply = new VideoReply();
                    const el = reply.getElement(url);
                    replies.push(el);
                    // str = str + getBotMessageTemplateForVideo(url);
                    // url = encodeUrlForDomParser(url);
                    //     videoStr = videoStr + `<video muted="muted"  class="msg-video" controls="true" playsinline="playsinline">
                    // <source src="${url}"/>
                    //     Your browser does not support HTML5 video.
                    // </video>`;
                }
                if (type === "image") {
                    // str = str + getBotMessageTemplateForImage(url);
                    const reply = new ImageReply(message);
                    // str = str + reply.getTemplate(url);
                    const el = reply.getElement(url);
                    replies.push(el);
                }
            }
        });

        let humanClass = messages[0].sourceType === ESourceType.human ? 'msg-bubble-human' : '';
        let time = themeOptions.time24HrFormat ? getTimeIn24HrFormat(messages[0].time) : getTimeInHHMM(messages[0].time);

        let feedbackSTr = "";
        const messageWithFeedback = messages.find((message) => message.feedback != null);
        let likeActive;
        let disLikeActive;
        let feedback_comment;
        if (messageWithFeedback) {
            const feedback = messageWithFeedback.feedback;
            feedback_comment = messageWithFeedback.feedback_comment;
            likeActive = (feedback === "1" || feedback === "POSITIVE") ? 'active' : '';
            disLikeActive = (feedback === "0" || feedback === "NEGATIVE") ? 'active' : '';
            feedbackSTr = `data-feedback="${feedback}"`;
        }

        const feedback = new Feedback();
        randomNumber = Date.now() + Math.floor(Math.random() * 100000000);
        const isLast = true;
        // str =  feedback.getTemplate({txnId, bot_message_id, humanClass, isLast, feedbackSTr, likeActive, disLikeActive, time, str, randomNumber });
        wrapper = feedback.getElement({
            txnId,
            bot_message_id,
            humanClass,
            isLast,
            feedbackSTr,
            likeActive,
            disLikeActive,
            feedback_comment,
            time,
            str,
            randomNumber,
            hideFeedback
        })[0];
    }


    // const el = getElementsFromHtmlStr(str) as HTMLElement;
    // const el = document.createElement('DIV');
    let carousal;
    if (str) {
        const el = document.createElement('template');
        el.innerHTML = str;
        carousal = el.content.querySelector('.carousal-container') as HTMLElement;
    }

    replies.forEach((children: HTMLElement[]) => {
        try {
            Array.from(children).forEach((child) => {
                try {
                    frag.appendChild(child);
                }catch (e) {
                    debugger;
                    console.log(e);
                }
            })
        }catch (e) {
            console.log(e);
        }
    });
    let location;
    location = wrapper.querySelector(`[data-id="${randomNumber}"]`) as HTMLElement;
    // location.appendChild(frag);
    location.insertBefore(frag, location.firstElementChild);
    // frag.appendChild(el.content);
    // const askFeedback = $chatBody.querySelector('.msg-bubble-options-panel');
    // const isActive = askFeedback && askFeedback.querySelector('.feedback.active');
    // if (!isActive) {
    //     askFeedback && askFeedback.parentElement.removeChild(askFeedback);
    // }
    removeInActiveFeedbackPanel($chatBody);
    $chatBody.appendChild(wrapper);


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
    // let msgVid = document.getElementsByClassName('msg-video');
    // if (videoStr) {
    //     const lastMsgVid = msgVid[msgVid.length - 1];
    //     lastMsgVid.innerHTML = videoStr;
    // }
    // resetChatInput();
    scrollBodyToBottom();
}


// function getBotMessageTemplateForVideo(url: string) {
//     const htmlStr = `
//                 <div class="message-wrapper  message-wrapper-bot msg-video">
//                      <video muted="muted"  class="msg-video" controls="true" playsinline="playsinline">
//                             <source src="${url}"/>
//                                 Your browser does not support HTML5 video.
//                        </video>
//                 </div>
//             `;
//     return htmlStr;
// }
