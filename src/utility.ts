import {$chatBody} from "./dom";
import {languageDetection, transliteration} from "./recording-api";
import {environment} from "./environment";

export function getTimeInHHMM(timeMS) {
    const time = timeMS ? new Date(timeMS) : new Date();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

export function getTimeIn24HrFormat(timeMS) {
    const time = timeMS ? new Date(timeMS) : new Date();
    return time.getHours() + ":" + time.getMinutes();
}

export function getQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

export function updateQueryStringParameter(uri, key, value) {
    let re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    let separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        return uri + separator + key + "=" + value;
    }
}

export function encodeUrlForDomParser(url) {
    url = url.split("&").join("&amp;");
    return url;
}

export function scrollBodyToBottom() {
    $chatBody.scrollTop = $chatBody.scrollHeight
}

export function convertStringToDom(str: string) {

    var div = document.createElement('div');
    div.innerHTML = str.trim();

    // Change this to div.childNodes to support multiple top-level nodes
    // if (div.children.length === 0) {
    //     return [div.firstChild];
    // }else {
    return div.children;
    // }
}

export function removeInActiveFeedbackPanel($chatbody: HTMLElement) {

    const askFeedbackPanels = $chatbody.querySelectorAll('.msg-bubble-options-panel.temp-div');

    Array.from(askFeedbackPanels).forEach((panel: HTMLElement) => {
        // const isActive = panel && panel.querySelector('.feedback.active');
        // if (!isActive) {
        panel && panel.parentElement.removeChild(panel);
        // }
    })
}

export function showToaster(message) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
    x.innerText = message;
    // Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 3000);
}

export async function checkForTransliteration(input: string) {
    let finalInput = input;
    debugger;
    let x
    if (!environment.use_lang_detection) {
        x = {
            inputParams:{
                language: window.language
            }
        }
    } else {
        x = await languageDetection({
            "msg_type": "text",
            "msg": input
        });
    }
    let y;
    if (x.inputParams.language !== 'en') {
        y = await transliteration({
            "source_lang": "eng",
            "target_lang": "hin",
            "input": input
        });
        finalInput = y.transliterated_text;
    }
    return finalInput;
}

export async function stopRecording() {

    // window.dictate.cancel();
    window.dictate.stopListening();

    const stream = window.stream;
    stream.getTracks().forEach(function (track) {
        track.stop();
    });
}

export async function startRecording(cb, connectionOpenForFirstTimeCB) {
    window.isFinalDone = false;
    window.finalMessage = null;
    const $check = document.querySelector('.stt-panel-check');
    const $recordText = document.querySelector('.record-text');
    $check.classList.add('custom-disable');
    $recordText.innerHTML = `Connecting...`;

    const startCB = async function (data, connectionOpenForFirstTime) {
        if (connectionOpenForFirstTime) {
            $recordText.innerHTML = `Speak now`;
            setTimeout(() => {
                $recordText.innerHTML = `<div class="record-text-listening">Listening...</div>`;
            }, 1.5 * 1000)
            connectionOpenForFirstTimeCB();
        }
        if (data && data[0].transcript) {
            $check.classList.remove('custom-disable');
            cb(data[0].transcript);
        }
    }
    const endCB = async function (data) {
        if (data[0].transcript) {
            $check.classList.remove('custom-disable');
            cb(data[0].transcript);
            const sttPanel = document.querySelector('.stt-panel') as HTMLElement;
            const x = await checkForTransliteration(data[0].transcript);
            if (sttPanel.tagName === "INPUT") {
                sttPanel.value = x;
            } else {
                sttPanel.innerHTML = x;
            }
        }
    }
    // window.dictate.init();

    window.dictate.init(startCB, endCB);
    /*https://codepen.io/Nishith/pen/ZxGBew*/
    if (false && 'webkitSpeechRecognition' in window) {
        var speechRecognizer = new webkitSpeechRecognition();
        speechRecognizer.continuous = true;
        speechRecognizer.interimResults = true;
        speechRecognizer.lang = 'en-US';
        speechRecognizer.start();

        var finalTranscripts = '';

        speechRecognizer.onresult = function (event) {
            console.log(event);
            var interimTranscripts = '';
            for (var i = event.resultIndex; i < event.results.length; i++) {
                var transcript = event.results[i][0].transcript;
                transcript.replace("\n", "<br>");
                if (event.results[i].isFinal) {
                    finalTranscripts += transcript;
                } else {
                    interimTranscripts += transcript;
                }
            }
            // const innerHTML = finalTranscripts + '<span style="color: #999">' + interimTranscripts + '</span>';
            cb(finalTranscripts || interimTranscripts);
        };
        speechRecognizer.onerror = function (event) {

        };
    } /*else {
        const innerHTML = 'Your browser is not supported. Please download Google chrome or Update your Google chrome!!';
        alert(innerHTML);
    }*/
    else {


    }
}
