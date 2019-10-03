import {$chatBody, $chatInput, $chatInputIcon, $envOptions, AppendMessageInChatBody, setIntroDetails} from "./dom";
import {getBotDetails} from "./bot-details";
import {IBotDetailsApiResp} from "./typings/bot-detaills-api";
import 'regenerator-runtime/runtime'
import {sendMessageToBot, serializeGeneratedMessagesToPreviewMessages} from "./send-api";
import {environment} from "./environment";
import {ESourceType} from "./typings/send-api";
import {getQueryStringValue} from "./utility";

async function initApp() {
    initEvents();
    initParams();
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

    $envOptions.addEventListener('click', () => {

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

function initParams() {
    const lang = getQueryStringValue('lang');
    if (lang === 'ar' || lang === 'rtl') {
        document.body.classList.add('lang-rtl');
        $chatInput.setAttribute("dir", "rtl");
    }

    debugger;
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
