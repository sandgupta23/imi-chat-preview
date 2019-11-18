import {getBotDetails} from "./bot-details";
import {IBotDetailsApiResp} from "./typings/bot-detaills-api";
import {$chatFooter, $loader} from "./dom";
import {getQueryStringValue} from "./utility";
import {sendMessageToBot} from "./send-api";
import {environment} from "./environment";
import {ESourceType} from "./typings/send-api";
import {humanMessageHandler, initClientEvents, initEnvironment, sendFeedbackHandler} from "./main";

document.addEventListener('DOMContentLoaded', async function () {
    //
    initEnvironment();
    const botDetails = await getBotDetails<IBotDetailsApiResp>();
    initEnvironment(botDetails);


    // $chatFooter.classList.add('d-none');
    try {
        $loader && $loader.classList.add('d-none');
        $chatFooter && $chatFooter.classList.remove('d-none');
    } catch (e) {
        console.log(e);
    }

    const imiPreview = new ImiPreview();
    imiPreview.setSendHumanMessageCallback((val) => {
        humanMessageHandler(val);
    });
    imiPreview.setSendFeedback((val, feedback) => {
        sendFeedbackHandler(val, feedback);
    });
    debugger;
    const fullBody = true;//getQueryStringValue('fullbody') === "true";
    const phoneCasing = getQueryStringValue('phonecasing') === "true";
    const brandColor = getQueryStringValue('brandcolor') || "#2b4f70";
    brandColor = brandColor.replace('_', '#');

    imiPreview.viewInit('.test-container', fullBody, phoneCasing);
    const $chatInput = document.getElementById('chat-input') as HTMLInputElement;
    imiPreview.initAdditionalDom({$chatInput});
    // imiPreview.appendMessageInChatBody(data.generated_msg, data);
    // const botDetails = {description: "dummy description", logo: "dummy logo", title: "dummy title"};
    // const languageApi =
    const theme = {
        brandColor: brandColor || 'green',
        showMenu: false,
        feedbackEnabled: botDetails.allow_feedback,
        showOptionsEllipsis: true
    };
    imiPreview.setOptions(botDetails, theme);
    const firstMessageData = await sendMessageToBot(environment.bot_access_token, environment.enterprise_unique_name, 'hi', ESourceType.bot);

    imiPreview.appendMessageInChatBody(firstMessageData.generated_msg);
    initClientEvents();
});
