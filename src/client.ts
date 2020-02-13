import {getBotDetails} from "./bot-details";
import {IBotDetailsApiResp} from "./typings/bot-detaills-api";
import {$chatFooter, $loader} from "./dom";
import {getQueryStringValue} from "./utility";
import {sendMessageToBot, socketKey} from "./send-api";
import {environment} from "./environment";
import {ESourceType} from "./typings/send-api";
import {humanMessageHandler, initClientEvents, initEnvironment, sendFeedbackHandler} from "./main";
import {createAndAppendStyles} from "./rammas.style";

let socket;
let imiPreviewTemp;

const style = {
    themeClass: {
        'font-family': "'DUBAI-REGULAR', 'IBM Plex Sans', sans-serif",
        "message-wrapper": {},
        "& .msg-bubble-human": {
            "& .content": {
                "background-color": "#087b36 !important",
                "color": "#fff",
                "border-radius": "20px 0 20px 20px !important",
                "border-top-left-radius": "20px !important",
            }
        },
        "& .message-container": {
            "& .content": {
                "background-color": "#fff",
                "color": "#4e4e4e",
                "padding": "12px !important",
                "borderRadius": "0 20px 20px 20px !important",
                "box-shadow": "0 1px 1px 0 rgba(0,0,0,.2) !important",
                "&::after": {
                    "display": "none !important"
                }
            },

            '& .message-wrapper-quick-reply': {
                "& button": { /*styles for quick reply button*/
                    "background": "transparent",
                    "border": "solid 1px #268126",
                    "color": "#268126",
                    "font-weight": 600,
                    "border-radius": "10px",
                    "padding": "10px 10px",
                    "&:hover": {
                        "background": "#268126",
                        "color": "white",
                        "transition": "color .3s ease,background-color .3s ease",
                    },
                    "box-shadow": "none !important",
                }
            },
            "& .time": {
                "display": "none"
            }
        },

        "& .imi-preview-grid-container": {
            "& .header": {/*header*/
                "background-image": "-webkit-linear-gradient(left,#065726,#07682d,#087b36) !important",
                "& .options": {
                    "display": "none !important"
                },
                "& .bot-intro": {
                    "background": "none",
                    "& #bot-title": {
                        "text-transform": "uppercase",
                        "font-weight": "bold !important",
                    }
                }
            },
            "& .icon": {
                "margin-left": "-44px",
                "background": "none",
                "& .fa": {
                    "font-size": "25px",
                    "color": "#717173"
                }
            },
        },

        "& .lang-rtl": {
            "& #chat-input-icon": {}
        },


        "& .footer": {
            "justify-content": "center",
            "background": "#eee",
            "border-top": "1px solid #aaa !important",
            "box-shadow": "0 1px 5px 0 #9b9b9b !important",
            "& input": {
                "cursor": "auto",
                "border-radius": "30px",
                "height": "45px",
                "background": "#fff",
                "padding": "5px 15px !important",
                "padding-right": "45px !important",

                '@media (min-width: 500px)': {
                    "max-width": "70% !important",
                    "min-width": "300px !important",
                }
            }
        },

        "& .phone": {
            "& .msg-bot-logo": {
                "display": "none"
            },
            "& .footer": {
                "justify-content": "center",
                "background": "none",
                "border-top": "1px solid #aaa !important",
                "box-shadow": "none !important",
                "& input": {
                    "cursor": "auto",
                    "border-radius": "30px",
                    "height": "45px",
                    "background": "#fff",
                    "padding": "5px 15px !important",
                    "padding-right": "45px !important",

                    '@media (min-width: 500px)': {
                        "max-width": "100% !important",
                        "min-width": "00px !important",
                    }
                }
            }

        }

    },
}

function changeFavicon(img) {
    (function () {
        var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = img;
        document.getElementsByTagName('head')[0].appendChild(link);
    })();
}

document.addEventListener('DOMContentLoaded', async function () {
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
    imiPreview.setSendFeedback((val, feedback) => {
        sendFeedbackHandler(val, feedback);
    });

    const fullBody = true;//getQueryStringValue('fullbody') === "true";
    const phoneCasing = getQueryStringValue('phonecasing') === "true";
    const brandColor = getQueryStringValue('brandcolor') || "#087b36";
    const isRtl = getQueryStringValue('lang') === "ar";
    brandColor = brandColor.replace('_', '#');

    imiPreview.viewInit('.test-container', fullBody, phoneCasing, isRtl);
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
    initClientEvents();
    const data = {
        'connectionConfig': {
            'namespace': 'BOT',
            'enterprise_id': botDetails.enterprise_id,
            socket_key: socketKey
        },
        'imi_bot_middleware_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiVGhpcyBpcyBJTUkgQk9UIG1pZGRsZXdhcmUiLCJpYXQiOjE1Njc4ODc5MTAsImV4cCI6NDE1OTg4NzkxMH0.dYbMaf8HYMD5K532p7DpHN0cmru-JKMjst-WS9zi7u8'
    };

    // initializeSocketConnection(data);
});

let eventInit = false;

function initializeSocketConnection(socketData) {

    // const url = 'https://rtm.imibot.ai';
    const url = 'https://imi-bot-middleware.herokuapp.com';
    // const url = 'http://localhost:3000';

    socket = window.io(url, {query: `data=${JSON.stringify(socketData)}`});
    socket.on('connect', () => {
        console.log('Client has CONNECTED to the server!');
        if (eventInit === false) {
            initAllEvents();
            eventInit = true;
        }
    });
    socket.on('disconnect', () => {
        console.log('Client has DISCONNECTED to the server!');
    });
}

function initAllEvents() {
    // socket.on('preview', (data) => {
    //     console.log('preview event preview :-)', data);
    //     imiPreviewTemp.appendMessageInChatBody(data.generated_msg, null, false);
    // });
    //
    // socket.on('previewStyle', (data) => {
    //     if (location.search.includes('test')) {
    //         console.log('chatStyle event preview :-)', data);
    //         const $style = document.querySelector("[data-jss]");
    //         $style.parentElement.removeChild($style);
    //         let style;
    //         try {
    //             style = JSON.parse(data.style);
    //         } catch (e) {
    //             console.log('invalid style, resetting to default');
    //             style = null;
    //         }
    //         createAndAppendStyles(style);
    //     }
    // });
}

createAndAppendStyles(style);
