import {getBotDetails} from "./bot-details";
import {IBotDetailsApiResp} from "./typings/bot-detaills-api";
import {$chatFooter, $loader} from "./dom";
import {getQueryStringValue} from "./utility";
import {sendMessageToBot, socketKey} from "./send-api";
import {environment} from "./environment";
import {ESourceType} from "./typings/send-api";
import * as f from './main';
import {humanMessageHandler, initClientEvents, initEnvironment, sendFeedbackHandler} from "./main";

let socket;
let imiPreviewTemp;

function changeFavicon(img) {
    console.log(f);
    (function () {
        var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = img;
        document.getElementsByTagName('head')[0].appendChild(link);
    })();
}

function loadCss(href) {
    var link = document.createElement( "link" );
    link.href = href;
    link.type = "text/css";
    link.rel = "stylesheet";
    link.media = "screen,print";

    document.getElementsByTagName( "head" )[0].appendChild( link );
}

function loadJS(file) {
    return new Promise((resolve, reject)=>{
        // DOM: Create the script element
        var jsElm = document.createElement("script");
        // set the type attribute
        jsElm.type = "application/javascript";
        // make the script element load file
        jsElm.src = file;
        // finally insert the element to the body element in order to load the script
        document.body.appendChild(jsElm);
        jsElm.onload = function () {
            resolve();
        }
    })
}

document.addEventListener('DOMContentLoaded', async function () {

    await loadJS('https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.2.5/polyfill.min.js');
    await loadJS('https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.slim.js');
    await loadCss('https://fonts.googleapis.com/css?family=IBM+Plex+Sans');
    await loadCss('https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    initEnvironment();
    const botDetails = await getBotDetails<IBotDetailsApiResp>();
    initEnvironment(botDetails);
    document.title = botDetails.name || 'IMIBot.ai';
    changeFavicon(botDetails.logo);
    // $chatFooter.classList.add('d-none');
    try {
        $loader && $loader.classList.add('d-none');
        $chatFooter && $chatFooter.classList.remove('d-none');
    } catch (e) {
        console.log(e);
    }

    const imiPreview = new ImiPreview();
    imiPreviewTemp = imiPreview;
    imiPreview.setSendHumanMessageCallback((val) => {
        humanMessageHandler(val);
    });
    imiPreview.setSendFeedback(async (val, feedback) => {
        console.log(environment);

        await sendFeedbackHandler(val, feedback, imiPreview, botDetails);
    });

    const fullBody = true;//getQueryStringValue('fullbody') === "true";
    const phoneCasing = getQueryStringValue('phonecasing') === "true";
    const brandColor = getQueryStringValue('brandcolor') || "#2b4f70";
    brandColor = brandColor.replace('_', '#');

    imiPreview.viewInit('#embed-chat-container', fullBody, phoneCasing);
    const $chatInput = document.getElementById('chat-input') as HTMLInputElement;
    imiPreview.initAdditionalDom({$chatInput});
    // imiPreview.
    // appendMessageInChatBody(data.generated_msg, data);
    // const botDetails = {description: "dummy description", logo: "dummy logo", title: "dummy title"};
    // const languageApi =
    const theme = {
        brandColor: brandColor || 'green',
        showMenu: false,
        feedbackEnabled: botDetails.allow_feedback,
        showOptionsEllipsis: !phoneCasing,
        time24HrFormat: false
    };

    imiPreview.setOptions(botDetails, theme);
    const firstMessageData = await sendMessageToBot(environment.bot_access_token, environment.enterprise_unique_name, 'hi', ESourceType.bot);

    imiPreview.appendMessageInChatBody(firstMessageData.generated_msg, null, true);
    initClientEvents(imiPreview);
    const data = {
        'connectionConfig': {
            'namespace': 'BOT',
            'enterprise_id': botDetails.enterprise_id,
            socket_key: socketKey
        },
        'imi_bot_middleware_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiVGhpcyBpcyBJTUkgQk9UIG1pZGRsZXdhcmUiLCJpYXQiOjE1Njc4ODc5MTAsImV4cCI6NDE1OTg4NzkxMH0.dYbMaf8HYMD5K532p7DpHN0cmru-JKMjst-WS9zi7u8'
    };
    
    initializeSocketConnection(data);
});

let eventInit = false;
function initializeSocketConnection(socketData) {
    
    const url = 'https://rtm.imibot.ai';
    // const url = 'https://imi-bot-middleware.herokuapp.com';
    // const url = 'http://localhost:3000';

    socket = window.io(url, {query: `data=${JSON.stringify(socketData)}`});
    socket.on('connect', () => {
        console.log('Client has CONNECTED to the server!');
        if(eventInit === false){
            initAllEvents();
            eventInit = true;
        }
    });
    socket.on('disconnect', () => {
        console.log('Client has DISCONNECTED to the server!');
    });
}

}

function initAllEvents() {
    socket.on('preview', (data) => {
        console.log('preview event preview :-)', data);
        imiPreviewTemp.appendMessageInChatBody(data.generated_msg, null, false);
    });
}
