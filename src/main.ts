import {$chatBody, $chatInput, $chatInputIcon, AppendMessageInChatBody, setIntroDetails} from "./dom";
import {getBotDetails} from "./bot-details";
import {IBotDetailsApiResp} from "./typings/bot-detaills-api";
import 'regenerator-runtime/runtime'
import {sendMessageToBot, serializeGeneratedMessagesToPreviewMessages} from "./send-api";
import {environment} from "./environment";
import {ESourceType} from "./typings/send-api";
import {getQueryStringValue} from "./utility";

async function initApp() {
    initEvents();
    initLang();
    const botDetails = await getBotDetails<IBotDetailsApiResp>();
    environment.bot_access_token = botDetails.bot_access_token;
    setIntroDetails({description: botDetails.description, logo: botDetails.logo, title: botDetails.name});
}


function initEvents() {
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

function initLang() {
    const lang = getQueryStringValue('lang');
    if (lang === 'ar' || lang === 'rtl') {
        document.body.classList.add('lang-rtl');
        $chatInput.setAttribute("dir", "rtl");
    }
}


setTimeout(() => {
    initApp().then(_ => console.log('app init success'));
}, 2000);
