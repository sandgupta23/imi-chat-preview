import {makeGetReq} from "./ajax";
import {$chatInput, AppendMessageInChatBody, setIntroDetails} from "./dom";
import {getBotDetails} from "./bot-details";
import {IBotDetailsApiResp} from "./typings/bot-detaills-api";
import 'regenerator-runtime/runtime'
import {sendMessageToBot, serializeGeneratedMessagesToPreviewMessages} from "./send-api";
import {environment} from "./environment";
import {IMessageData} from "./typings/send-api";

async function initApp() {
    initEvents();
    const botDetails = await getBotDetails<IBotDetailsApiResp>();
    environment.bot_access_token = botDetails.bot_access_token;
    setIntroDetails({description: botDetails.description, logo: botDetails.logo, title: botDetails.name});
}


function initEvents() {
    $chatInput.addEventListener('keypress', async function ($event: KeyboardEvent) {
        if ($event.key === 'Enter') {
            let humanMessage = $chatInput.value;
            AppendMessageInChatBody([{
                sourceType: "bot",
                text: humanMessage,
                time: Date.now()
            }]);
            const botResponse = await sendMessageToBot(environment.bot_access_token, environment.enterprise_unique_name, humanMessage)
            let messageData: any = serializeGeneratedMessagesToPreviewMessages(botResponse.generated_msg);
            debugger;
            AppendMessageInChatBody(messageData);
        }
    })
}


initApp().then(_ => console.log('app init success'));
