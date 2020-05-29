import {
    $chatBody, $chatContainer,
    $chatFooter,
    $chatInput,
    $chatInputIcon,
    $envOptions, $knowMoreClose, $knowMoreContainer, $knowMoreOverlay,
    $langSelect,
    $langSubmit,
    $loader,
    $phoneModel,
    AppendMessageInChatBody, botResponses,
    domInit, themeOptions,
    setOptions
} from "./dom";
import {getBotDetails} from "./bot-details";
import {IBotDetailsApiResp} from "./typings/bot-detaills-api";
import 'regenerator-runtime/runtime'
import {sendFeedback, sendMessageToBot, serializeGeneratedMessagesToPreviewMessages} from "./send-api";
import {environment} from "./environment";
import {ESourceType, ISendApiResp, ISendApiResponsePayload} from "./typings/send-api";
import {
    getQueryStringValue,
    scrollBodyToBottom,
    showToaster,
    startRecording,
    updateQueryStringParameter
} from "./utility";

let isModelShown = false;

export enum modes {
    responsive = "responsive",
    full_screen = "full_screen",
}

export function initClientEvents(imiPreview) {

    try {

        $knowMoreOverlay && $knowMoreOverlay.addEventListener('click', ($event) => {
            // $knowMoreOverlay.style.display = 'none';
            $knowMoreOverlay.style.opacity = 0;
            $knowMoreClose.style.display = 'none';
            setTimeout(() => {
                $knowMoreOverlay.style.display = 'none';
            }, 500);
        });
        $knowMoreClose && $knowMoreClose.addEventListener('click', ($event) => {
            // $knowMoreOverlay.style.display = 'none';
            $knowMoreOverlay.style.opacity = 0;
            $knowMoreClose.style.display = 'none';
            setTimeout(() => {
                $knowMoreOverlay.style.display = 'none';
            }, 500);
        });
        $envOptions.addEventListener('click', ($event) => {
            $knowMoreOverlay.style.display = 'block';
            $knowMoreOverlay.style.opacity = 1;
            $knowMoreClose.style.display = 'block';
        });
        $knowMoreContainer && $knowMoreContainer.addEventListener('click', ($event) => {
            $event.stopPropagation();
        });
        $chatInput.addEventListener('keydown', ($event) => {
            setTimeout(() => {
                debugger;
                const faSend = $chatInputIcon.querySelector('.fa-send') as HTMLElement;
                const faMicrophone = $chatInputIcon.querySelector('.fa-microphone') as HTMLElement;
                if ($chatInput.value.trim()) {
                    faSend.style.display = "flex";
                    faMicrophone.style.display = "none";
                } else {
                    faSend.style.display = "none";
                    faMicrophone.style.display = "flex";
                }
            })
            if ($event.key === 'Enter') {
                // const downvoteCommentWrapper = document.querySelectorAll('.downvote-comment.d-flex');
                // Array.from(downvoteCommentWrapper).forEach((downvoteCommentBox: HTMLElement)=>{
                //     const skipButton: HTMLElement = downvoteCommentBox.querySelector('.downvote-comment-skip');
                //     skipButton.click();
                // });

                // const lastButton =
                // if (skipFeedbackButton) {
                //     skipFeedbackButton.click();
                // }
                let humanMessage = $chatInput.value;
                if (!humanMessage || !humanMessage.trim()) {
                    return;
                }
                $chatInput.value = "";

                imiPreview._cb(humanMessage);
                // humanMessageHandler(humanMessage);

            }
        });
    } catch (e) {
        console.log(e)
    }

    const $microphoneStarter = document.getElementById('microphone-starter');
    const $footer = document.getElementById('footer');
    $microphoneStarter.addEventListener('click', () => {

    });

    let sttText = "";
    $footer.addEventListener('click', async function ($event) {
        const target = event.target as HTMLElement;
        const sttPanel = $footer.querySelector('.stt-panel') as HTMLElement;
        if (target.classList.contains('fa-microphone')) {
            try {
                $microphoneStarter.style.display = "none";
                const recordingPanel = document.getElementsByClassName('recording-panel')[0] as HTMLElement;
                recordingPanel.style.display = "flex";
                await startRecording((text) => {
                    sttPanel.innerHTML = text;
                    sttText = text;
                    console.log(text);
                });
            } catch (e) {
                /*reset */
                resetMicPanel(sttPanel, sttText);
            }
        }
        if (target.classList.contains('fa-check-circle')) {
            resetMicPanel(sttPanel, sttText);
        }

        if (target.classList.contains('fa-times-circle')) {
            sttPanel.innerHTML = "";
            const recordingPanel = document.getElementsByClassName('recording-panel')[0] as HTMLElement;
            const microphone = document.getElementsByClassName('fa-microphone')[0] as HTMLElement;
            microphone.style.display = "inline-flex";
            recordingPanel.style.display = "none";
            // humanMessageHandler(sttText);
        }
    });

    try {
        $chatInputIcon.addEventListener('click', () => {
            let humanMessage = $chatInput.value;
            if (!humanMessage || !humanMessage.trim()) {
                return;
            }
            $chatInput.value = "";
            // humanMessageHandler(humanMessage);
            imiPreview._cb(humanMessage);
        });
    } catch (e) {
        console.log(e)
    }
}

function resetMicPanel(sttPanel, sttText) {
    sttPanel.innerHTML = "";
    const recordingPanel = document.getElementsByClassName('recording-panel')[0] as HTMLElement;
    const microphone = document.getElementsByClassName('fa-microphone')[0] as HTMLElement;
    recordingPanel.style.display = "none";
    microphone.style.display = "inline-flex";
    humanMessageHandler(sttText);
}

async function initApp(imiPreview: ImiPreview) {
    console.log('imi-chat-preview init');
    initEvents(imiPreview);
}

class ImiPreview {
    _cb;
    _feedbackCB;
    _roomInactiveMap;

    viewInit(selector, fullBody = true, phoneCasing = true) {
        let mainParent = document.querySelector(selector) as HTMLElement;
        mainParent.innerHTML = mainBodyTemplate(fullBody, phoneCasing);
    }

    initAdditionalDom(dom) {
        domInit(dom);
        initApp(this);
    }

    setSendHumanMessageCallback(cb) {

        this._cb = (humanMessage) => {
            try {
                const downvoteCommentWrapper = document.querySelectorAll('.downvote-comment.d-flex');
                Array.from(downvoteCommentWrapper).forEach((downvoteCommentBox: HTMLElement) => {
                    const skipButton: HTMLElement = downvoteCommentBox.querySelector('.downvote-comment-skip');
                    skipButton.click();
                });
            } catch (e) {

            }
            cb(humanMessage);
        }
    }

    setSendFeedback(cb) {
        this._feedbackCB = cb;
    }

    setRoomInactiveMap(obj) {
        this._roomInactiveMap = {...obj, ...this._roomInactiveMap};
    }

    hideFeedbackPanelForTxnId(id) {
        // data-id="1583252563496"
        const $parent: HTMLElement = document.querySelector(`[data-bot_message_id='${id}']`);
        const $feedback = $parent.querySelector(".msg-bubble-options-panel");
        $feedback.parentElement.removeChild($feedback);
    }

    setOptions(botDetails: { description: string, logo: string, title: string }, theme: {
        brandColor: string, feedbackEnabled: boolean, showOptionsEllipsis: boolean, time24HrFormat: boolean
    }) {
        if ($envOptions) {
            // $envOptions.style.display = "block"
            // if (theme.showOptionsEllipsis === true) {
            //     $envOptions.style.display = "block"
            // } else {
            //     $envOptions.style.display = "none"
            // }
        }
        themeOptions = theme;
        setOptions(botDetails);
        initEnvironment(botDetails);

        if (theme.feedbackEnabled) {
            $chatBody.classList.remove('feedbackDisabled');
        } else {
            $chatBody.classList.add('feedbackDisabled');
        }
        this.setTheme(theme);
    }

    setTheme(theme: { brandColor: string }) {
        let root = document.documentElement;
        root.style.setProperty('--color-brand', theme.brandColor || 'red');
    }

    appendMessageInChatBody(generated_msg, sendApiResp: ISendApiResponsePayload, hideFeedback) {

        AppendMessageInChatBody(generated_msg, sendApiResp, hideFeedback);
    }

    removeAllChatMessages() {
        $chatBody.innerHTML = "";
    }
}

(<any>window).ImiPreview = ImiPreview;


function removeModal() {
    $phoneModel.classList.add('d-none');
    $phoneModel.classList.remove('d-flex');
    $chatBody.classList.remove('bg-opaque');
    $chatFooter.classList.remove('opacity-0');
}


function initEvents(imiPreview: ImiPreview) {

    try {
        document.getElementById('close-modal1').addEventListener('click', ($event) => {
            removeModal();
        });
    } catch (e) {
        // console.log(e);
    }

    $chatBody.addEventListener('keyup', ($event) => {
        const target = $event.target as HTMLElement;

        if (target.classList.contains('downvote-comment-textarea')) {
            const $form = target.parentElement.parentElement;
            const $error: HTMLElement = target.parentElement.parentElement.parentElement.querySelector('.form-error');
            if ($event.target.value.length > 2000) {
                $form.classList.add('feedback-form-diabled');
                $error.style.display = 'block';
            } else if ($event.target.value.length === 0 || $event.target.value.trim().length === 0) {
                $form.classList.add('feedback-form-diabled');
                $error.style.display = 'none';
            } else {
                $form.classList.remove('feedback-form-diabled');
                $error.style.display = 'none';
            }
        }
    }

    $chatBody.addEventListener('click', async ($event) => {
        const target = $event.target as HTMLElement;

        if (target.classList.contains('feedback-like')
            || target.classList.contains('feedback-dislike')
            || target.classList.contains('downvote-comment-submit')
            || target.classList.contains('downvote-comment-skip')) {

            const parent = findParentWithClass(target, 'feedback');
            if (parent && parent.classList.contains('active')) {
                return;
            }

            const $feedbackWrapper = findParentWithClass(target, 'msg-bubble-options-panel');
            const $feedbackWrapperParent = $feedbackWrapper.parentElement;
            const $commentTextArea: HTMLTextAreaElement = $feedbackWrapperParent.querySelector('.downvote-comment-textarea');
            const $downvoteCommentWrapper = $feedbackWrapperParent.querySelector('.downvote-comment');
            // $feedbackWrapper.classList.remove('ask-feedback');
            const oldFeedback = $feedbackWrapper.getAttribute('data-feedback');
            const $messageBubble = findParentWithClass(target, 'msg-bubble');
            const feedback = target.getAttribute('data-feedback-value');
            const feedbackNumber = Number(feedback);
            let x = $messageBubble.querySelector(`[data-feedback-value="${feedbackNumber}"]`);
            let y = $messageBubble.querySelector(`[data-feedback-value="${feedbackNumber === 1 ? 0 : 1}"]`);
            y && y.parentElement.removeChild(y);
            const txn = $messageBubble.getAttribute('data-txn');
            const bot_message_id = $messageBubble.getAttribute('data-bot_message_id');
            // target.parentElement.classList.add('active');//
            if (target.classList.contains('feedback-dislike')) {
                $downvoteCommentWrapper.classList.remove('d-none');
                $downvoteCommentWrapper.classList.add('d-flex');
                $commentTextArea.focus();
                $feedbackWrapper.setAttribute('data-feedback', feedback);
                $feedbackWrapper.classList.remove('temp-div');
                scrollBodyToBottom();
            }
            const comment = $commentTextArea.value as string;
            if (target.classList.contains('downvote-comment-submit')
                || target.classList.contains('downvote-comment-skip')
                || target.classList.contains('feedback-like')) {
                if (target.classList.contains('downvote-comment-submit')) {
                    if (!comment || !comment.trim()) {
                        $commentTextArea.style.border = '1px solid red';
                        return;
                    }
                }
                const feedbackNumber = Number(feedback);
                // let x;
                // x = $messageBubble.querySelector(`[data-feedback-value="${feedbackNumber}"]`);
                $messageBubble.querySelector('.fa-spinner').classList.remove('d-none');
                try {
                    if (feedbackNumber === 0 && target.classList.contains('downvote-comment-submit')) {
                        await imiPreview._feedbackCB({txn, bot_message_id, comment}, feedbackNumber);
                        x.querySelector('.final-label').innerText = 'Downvoted with comment';

                    } else {
                        await imiPreview._feedbackCB({txn, bot_message_id}, feedbackNumber);
                    }

                    $feedbackWrapper.classList.remove('ask-feedback');
                    $feedbackWrapper.classList.remove('temp-div');
                    (x).classList.add('active');
                    $downvoteCommentWrapper.classList.remove('d-flex');
                    $downvoteCommentWrapper.classList.add('d-none');
                } catch (e) {
                    $feedbackWrapper.parentElement.removeChild($feedbackWrapperParent);
                } finally {
                    $messageBubble.querySelector('.fa-spinner').classList.add('d-none');
                }

            }
        }
        if (target.hasAttribute('data-payload')) {
            imiPreview._cb(target.getAttribute('data-payload'));
            return;
        }

        try {
            removeModal();
        } catch (e) {
            console.log(e);
        }

        try {
            let img = $event.target as HTMLImageElement;
            if (img.classList.contains('click-to-zoom')) {
                /*zoom the div  */
                // Get the modal
                const modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
                const modalImg = document.getElementById("img01") as HTMLImageElement;
                const captionText = document.getElementById("caption");
                // img.onclick = function(){
                modal.style.display = "block";
                modalImg.src = img.src;
                // captionText.innerHTML = this.alt;
                // }

// Get the <span> element that closes the modal
                const span = document.getElementsByClassName("close")[0] as HTMLElement;

// When the user clicks on <span> (x), close the modal
                span.onclick = function () {
                    modal.style.display = "none";
                }
            }

            if (img.classList) {
            }
        } catch (e) {
            console.log(e);
        }

        try {
            if (target.classList.contains('control')) {
                const itemInView = 2;
                const $carasalContainer = findParentWithClass(target, 'carousal-container') as HTMLElement;
                const shouldMoveRight = target.classList.contains('control-right');
                const $carasalInner = $carasalContainer.querySelector('.carousal-container-inner') as HTMLElement;
                const $carasalItemLength = ($carasalContainer.querySelectorAll('.item')).length;
                let dataStep = Number($carasalContainer.getAttribute('data-step'));
                $carasalContainer.classList.remove('hide-left-control');
                $carasalContainer.classList.remove('hide-right-control');
                if ((dataStep < $carasalItemLength - itemInView) && shouldMoveRight) {
                    dataStep++;
                    if (dataStep === ($carasalItemLength - itemInView)) {
                        setTimeout(() => {
                            $carasalContainer.classList.add('hide-right-control');
                        }, 350);
                    }
                } else if ((dataStep > 0) && !shouldMoveRight) {
                    dataStep--;
                    if (dataStep === 0) {
                        setTimeout(() => {
                            $carasalContainer.classList.add('hide-left-control');
                        }, 350);
                    }
                } else {
                    return;
                }

                $carasalContainer.setAttribute('data-step', dataStep.toString());
                const carasalContainerWidth = $carasalContainer.offsetWidth;
                const itemWidth = ($carasalInner.querySelector('.item') as HTMLElement).offsetWidth;
                const base = (itemWidth * 100) / carasalContainerWidth;
                $carasalInner.style.transform = `translateX(${-1 * base * dataStep}%)`;
            }
        } catch (e) {
            console.log(e);
        }


    });
    try {
        $langSubmit.addEventListener('click', ($event) => {
            const lang = $langSelect.value;
            if (lang) {

                let splits = environment.bot_unique_name.split("_");
                splits.pop();
                environment.bot_unique_name = splits.join("_") + '_' + lang;
                let newUrl = updateQueryStringParameter(location.href, "bot_unique_name", environment.bot_unique_name);
                newUrl = updateQueryStringParameter(newUrl, "lang", lang);
                location.href = newUrl;
                initEnvironment();
            }
        });
    } catch (e) {
        console.log(e)
    }

    try {
        const langOption = document.getElementsByClassName('lang-option')[0];
        langOption.addEventListener('click', function (event) {
            const target = event.target as HTMLElement;
            let lang;
            if (target.classList.contains('lang-option-ar')) {
                lang = 'ar';
            } else {
                lang = 'en';
            }

            const newUrl = updateQueryStringParameter(location.href, 'lang', lang);
            location.href = newUrl;
        });
    } catch (e) {

    }


    try {
        $envOptions.addEventListener('click', () => {
            return;
            let $phoneView = document.getElementsByClassName('chat-body')[0];
            let $langPanel = $phoneModel.querySelector('.lang-panel') as HTMLElement;
            if (!isModelShown) {
                $phoneView.classList.add('bg-opaque');
                $phoneModel.classList.add('d-flex');
                $phoneModel.classList.remove('d-none');
                $chatFooter.classList.add('opacity-0');
                $langPanel.classList.add('d-flex');
            } else {
                $phoneView.classList.remove('bg-opaque');
                $phoneModel.classList.remove('d-flex');
                $phoneModel.classList.add('d-none');
                $chatFooter.classList.remove('opacity-0');
                $langPanel.classList.remove('d-flex');
            }
            isModelShown = !isModelShown
        });
    } catch (e) {
        console.log(e);
    }


}

export async function humanMessageHandler(humanMessage: string, sourceType?) {
    // alert();
    AppendMessageInChatBody([{
        sourceType: sourceType || ESourceType.human,
        text: humanMessage,
        time: Date.now()
    }]);

    const botResponse = await sendMessageToBot(environment.bot_access_token, environment.enterprise_unique_name, humanMessage);
    // if (environment.room && environment.room.id && botResponse.room.id !== environment.room.id) {
    //     AppendMessageInChatBody(<any>[{SESSION_EXPIRY: true}], null);
    //     console.log(`previous room : ${environment.room}. new room ${botResponse.room.id}`);
    // }
    // console.log(environment.room, botResponse.room);
    // environment.room = botResponse.room;
    botResponses.push(botResponse);

    let messageData: any[] = serializeGeneratedMessagesToPreviewMessages(botResponse.generated_msg);
    messageData.forEach((message) => {
        AppendMessageInChatBody([message], botResponse);
    });

}

function getBotResponseByTxnId(txn) {
    return botResponses.find(res => res.transaction_id === txn)
}

export async function sendFeedbackHandler(resp: { txn: string, bot_message_id: string, comment: string }, feedback: number, imiPreview) {
    let parsedFeedback;
    // showToaster("e.message");
    if (feedback === 0) {
        parsedFeedback = 'NEGATIVE'
    } else if (feedback === 1) {
        parsedFeedback = 'POSITIVE'
    }

    const res = getBotResponseByTxnId(resp.txn);
    let p;
    try {
        p = await sendFeedback({
            consumer_id: res.room.consumer_id,
            feedback: parsedFeedback,
            bot_message_id: res.bot_message_id,
            feedback_comment: resp.comment,
        });
    } catch (e) {
        /*todo: remove like from view*/
        await imiPreview.hideFeedbackPanelForTxnId(resp.bot_message_id);

        showToaster(e.message);
    }
    return p;
}

export function initEnvironment(botDetails: any = {}) {
    // const lang = getQueryStringValue('lang');
    const lang = getQueryStringValue('language') || getQueryStringValue('lang') || botDetails.language || 'en';

    if (lang === 'ar' || lang === 'rtl') {

        $chatContainer && $chatContainer.classList.add('lang-rtl');
        if ($chatInput) {
            $chatInput.setAttribute("dir", "rtl");
            $chatInput.placeholder = "أكتب السؤال ..";
        }
    } else {
        $chatContainer && $chatContainer.classList.remove('lang-rtl');
        if ($chatInput) {
            $chatInput.setAttribute("dir", "ltr");
            $chatInput.placeholder = "Type a message";
        }
    }

    environment.bot_access_token = botDetails.bot_access_token;
    environment.logo = botDetails.logo;
    const root = getQueryStringValue('root');

    if (root) {
        if (root === '.') {
            environment.root = "";
        } else {
            environment.root = root + '.';
        }

    }
    const enterprise_unique_name = botDetails.enterprise_unique_name || getQueryStringValue('enterprise_unique_name');
    if (enterprise_unique_name) {
        environment.enterprise_unique_name = enterprise_unique_name;
    }
    const bot_unique_name = botDetails.bot_unique_name || getQueryStringValue('bot_unique_name');
    if (bot_unique_name) {
        environment.bot_unique_name = bot_unique_name;
    }

}

function findParentWithClass($child, className) {
    while ($child) {
        if ($child.classList.contains(className)) {
            return $child;
        }
        $child = $child.parentElement;
    }
}

// initApp().then(_ => console.log('app init success'));
// setTimeout(() => {
//
// }, 2000);


function mainBodyTemplate(fullBody, phoneCasing) {
    let str = "";
    if (fullBody) {
        // phoneCasing = false;
        str = phoneCasing ? getPhoneCoverTemplate() : getFullBodyExceptPhoneCover();
    } else {
        str = `
    <!-- The Modal -->
            <div id="myModal" class="modal2">
                <span class="close">&times;</span>
                <img class="modal-content" id="img01">
                <div id="caption"></div>
            </div>

                <div class="imi-preview-grid-container">

                       
                        <!--chat body starts-->
                        <div class="chat-body" id="body"
                             style="padding: 8px 12px; display: flex; flex-direction: column; z-index: 0">

                        </div>
                        
                    </div>
    
    
    `
    }

    return str;
}

function getModelTemplate() {
    return `
        <div id="myModal" class="modal2">
                <span class="close">&times;</span>
                <img class="modal-content" id="img01">
                <div id="caption"></div>
            </div>
    `;
}

//
function getFullBodyExceptPhoneCover(isRtl?) {

    return `
        <div class="imi-preview-grid-container">
        <div id="snackbar"></div>
                        <div class="header" style="z-index: 1">
                            <div class="bot-intro" id="botIntro" dir="${isRtl ? 'rtl' : 'ltr'}">
                                <span class="bot-logo">
                                    <img id="bot-logo"
                                    onerror="this.src='https://imibot-production.s3-eu-west-1.amazonaws.com/integrations/v2/default-fallback-image.png'" 
                                    src="https://whizkey.ae/wisdom/static/media/rammas.42381205.gif"
                                         alt="">
                                </span>
                                <div class="bot-details">
                                    <div id="bot-title" ></div>
                                    <div id="bot-description">hello</div>
                                </div>
                                <div class="options"  id="env-options">
                                    <i class="fa fa-ellipsis-v"></i>
                                </div>
                            </div>
                        </div>
                        <!--chat body starts-->
                        <div class="chat-body" id="body"
                             style="padding: 8px 22px; display: flex; flex-direction: column; z-index: 0">

                        </div>
                        <!--chat body ends-->
                        <div class="footer">
                            <input placeholder="Type a message" id="chat-input" dir="ltr" autocomplete="off" autofocus
                                   type="text">
                            <span class="icon" id="chat-input-icon">
                                <span class="fa fa-send"></span>
                            </span>
                        </div>
                    </div>
      <!--know more starts-->
        <div class="chat-img-overlay" id="chat-img-overlay" style="display: none">
          <span class="fa fa-times close-chat-img-overlay"></span>
          <div class="chat-know-more-overlay">
            <header class="chat-know-more-overlay-header">
              <div class="description-top" style="text-align: center">This bot was built using</div>
              <div><img src="https://staging.imibot.ai/static/assets/img/IMI_logo.png" alt=""></div>
              <strong class="description-bottom">The enterprise bot building platform to automate conversations</strong>
            </header>
    
            <div class="chat-know-more-overlay-item">
              <img src="https://staging.imibot.ai/static/assets/img/chat/bot.svg" alt="">
              <div>Contextualise bot interactions with artificial intelligence</div>
            </div>
            <div class="chat-know-more-overlay-item">
              <img src="https://staging.imibot.ai/static/assets/img/chat/group-5.svg" alt="">
              <div>Provide seamless omnichannel experience</div>
            </div>
            <div class="chat-know-more-overlay-item">
              <img src="https://staging.imibot.ai/static/assets/img/chat/browser.svg" alt="">
              <div>Orchestrate individual bots using a controller</div>
            </div>
            <div class="chat-know-more-overlay-item">
              <img src="https://staging.imibot.ai/static/assets/img/chat/group-2.svg" alt="">
              <div>Integrate various services within your flow to help user</div>
            </div>
    
            <a href="https://imimobile.com/products/ai-automation" target="_blank">
            <button  class="imi-button-primary" style="width: 100px;background: #00abd3; border: none; color: white" mat-flat-button color="primary"> Know more</button></a>
    
          </div>
        </div>
    `
}


function getPhoneCoverTemplate(isRtl?) {
    return `
    <div class="page1">
    <div class="page__content">
        <div class="phone">
        <div id="snackbar"></div>
            <div class="phone__body">
                <div class="phone__view">
                    <div id="phone-modal" class="modal1" style="">
                        <i class="fa fa-times" id="close-modal1"></i>
                        <div class="lang-panel">
                            <h1>Select language</h1>
                            <div>
                                <select id="lang-select">
                                    <option value="en">English</option>
                                    <option value="ar" style="direction: rtl;">عربي</option>
                                </select>
                            </div>
                            <button class="imi-button-primary" id="lang-submit">Submit</button>
                        </div>
                    </div>
                    <div class="imi-preview-grid-container">

                        <div class="header" dir="${isRtl ? 'rtl' : 'ltr'}" style="z-index: 1">
                            <div class="basel-bg"></div>
                            <div class="bot-intro" id="botIntro">
                                <span class="bot-logo">
                                    <img id="bot-logo"
                                    onerror="this.src='https://imibot-production.s3-eu-west-1.amazonaws.com/integrations/v2/default-fallback-image.png'" 
                                       alt="">
                                </span>
                                <div class="bot-details" style="margin-left: ${isRtl ? '42px' : '-42px'}">
                                    <div id="bot-title" style="text-align: center" ></div>
                                </div>
                                <div style="width: 50px">
                                <div class="options" id="env-options">
                                    <i class="fa fa-ellipsis-v"></i>
                                </div>
</div>
                            </div>
                        </div>
                        <!--chat body starts-->
                        <div class="chat-body" id="body"
                             style="padding: 8px 12px; display: flex; flex-direction: column; z-index: 0">

                        </div>
                        <!--chat body ends-->
                        <div class="footer" id="footer" style="position: relative">
                        <div class="recording-panel" ">
                            <span class="fa fa-times-circle"></span>
                            <span class="record-text">Listening ...</span>
                            <span class="fa fa-check-circle"></span>
                            <div class="stt-panel"></div>
                        </div>
                            <input placeholder="Type a message" id="chat-input" dir="ltr" autocomplete="off" autofocus
                                   type="text">
                            <span class="icon" id="chat-input-icon">
                                <span style="display: none;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;" class="fa fa-send"></span>
                                <span id="microphone-starter"
                                 style="display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;"
                                 class="fa fa-microphone"></span>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="phone__notch">
                    <div class="phone__speaker"></div>
                    <div class="phone__camera"></div>
                </div>
            </div>
            <div class="phone__btn">
                <button class="phone__btn--power"></button>
                <div class="phone__btn--volume">
                    <button class="phone__btn--volume-up"></button>
                    <button class="phone__btn--volume-down"></button>
                </div>
                <button class="phone__btn--mute"></button>
            </div>
        </div>
    </div>
</div>
    `;
}


function getHeaderTemplate() {
    return `
    <div class="header" style="z-index: 1">
                            <div class="basel-bg"></div>
                            <div class="bot-intro" id="botIntro">
                                <span class="bot-logo">
                                    <img id="bot-logo" src="https://whizkey.ae/wisdom/static/media/rammas.42381205.gif"
                                         alt="">
                                </span>
                                <div class="bot-details">
                                    <div id="bot-title" ></div>
                                </div>
                                <div class="options" id="env-options">
                                    <i class="fa fa-ellipsis-v"></i>
                                </div>
                            </div>
                        </div>
    `;
}

function getFooterTemplate() {
    return `
    <div class="footer">
                            <input placeholder="Type a message" id="chat-input" dir="ltr" autocomplete="off" autofocus
                                   type="text">
                            <span class="icon" id="chat-input-icon">
                                <span class="fa fa-send"></span>
                            </span>
                        </div>`
}
