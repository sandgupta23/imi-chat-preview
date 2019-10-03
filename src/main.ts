import {
    $chatBody,
    $chatFooter,
    $chatInput,
    $chatInputIcon,
    $envOptions,
    $langSelect,
    $langSubmit,
    $loader,
    $phoneModel,
    AppendMessageInChatBody,
    setIntroDetails
} from "./dom";
import {getBotDetails} from "./bot-details";
import {IBotDetailsApiResp} from "./typings/bot-detaills-api";
import 'regenerator-runtime/runtime'
import {sendMessageToBot, serializeGeneratedMessagesToPreviewMessages} from "./send-api";
import {environment} from "./environment";
import {ESourceType, IMessageData} from "./typings/send-api";
import {getQueryStringValue, updateQueryStringParameter} from "./utility";

let isModelShown = false;

async function initApp() {
    initEvents();
    initEnvironment();
    $chatFooter.classList.add('d-none');
    const botDetails = await getBotDetails<IBotDetailsApiResp>();
    $loader.classList.add('d-none');
    $chatFooter.classList.remove('d-none');
    environment.bot_access_token = botDetails.bot_access_token;
    setIntroDetails({description: botDetails.description, logo: botDetails.logo, title: botDetails.name});
    const messageData: IMessageData[] = [{
        sourceType: ESourceType.bot,
        'text': botDetails.first_message
    }];
    AppendMessageInChatBody(messageData);
}


function removeModal() {
    $phoneModel.classList.add('d-none');
    $phoneModel.classList.remove('d-flex');
    $chatBody.classList.remove('bg-opaque');
    $chatFooter.classList.remove('opacity-0');
}


function initEvents() {

    document.getElementById('close-modal1').addEventListener('click', ($event) => {
        removeModal();
    });
    $chatBody.addEventListener('click', ($event) => {
        removeModal();
        let img = $event.target as HTMLElement;
        if(img.classList.contains('click-to-zoom')){
            /*zoom the div  */
            // Get the modal
            const modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
            const modalImg = document.getElementById("img01");
            const captionText = document.getElementById("caption");
            img.onclick = function(){
                modal.style.display = "block";
                modalImg.src = this.src;
                captionText.innerHTML = this.alt;
            }

// Get the <span> element that closes the modal
            const span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
            span.onclick = function() {
                modal.style.display = "none";
            }
        }
    });
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
    $chatInput.addEventListener('keypress', ($event) => {
        if ($event.key === 'Enter') {
            let humanMessage = $chatInput.value;
            if (!humanMessage || !humanMessage.trim()) {
                return;
            }
            humanMessageHandler(humanMessage);
        }
    });
    $chatInputIcon.addEventListener('click', () => {
        let humanMessage = $chatInput.value;
        if (!humanMessage || !humanMessage.trim()) {
            return;
        }
        humanMessageHandler(humanMessage);
    });

    $envOptions.addEventListener('click', () => {
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



}

async function humanMessageHandler(humanMessage: string) {
    AppendMessageInChatBody([{
        sourceType: ESourceType.human,
        text: humanMessage,
        time: Date.now()
    }]);
    const botResponse = await sendMessageToBot(environment.bot_access_token, environment.enterprise_unique_name, humanMessage)
    let messageData: any = serializeGeneratedMessagesToPreviewMessages(botResponse.generated_msg);
    AppendMessageInChatBody(messageData);

}

function initEnvironment() {
    const lang = getQueryStringValue('lang');
    if (lang === 'ar' || lang === 'rtl') {
        document.body.classList.add('lang-rtl');
        $chatInput.setAttribute("dir", "rtl");
        $chatInput.placeholder = 'نوشتن یک پیغام...';
    }
    const root = getQueryStringValue('root');
    if (root) {
        if (root === '.') {
            environment.root = "";
        } else {
            environment.root = root + '.';
        }

    }
    const enterprise_unique_name = getQueryStringValue('enterprise_unique_name');
    if (enterprise_unique_name) {
        environment.enterprise_unique_name = enterprise_unique_name;
    }
    const bot_unique_name = getQueryStringValue('bot_unique_name');
    if (bot_unique_name) {
        environment.bot_unique_name = bot_unique_name;
    }
}

initApp().then(_ => console.log('app init success'));
// setTimeout(() => {
//
// }, 2000);
