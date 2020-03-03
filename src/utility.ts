import {$chatBody} from "./dom";

export function getTimeInHHMM(timeMS) {
    const time = timeMS ? new Date(timeMS) : new Date();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
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

    const el = document.createElement('template');
    // const el = document.createElement('DIV');
    el.innerHTML = str;
    let x = el.content.children;
    return x;
}

export function removeInActiveFeedbackPanel($chatbody: HTMLElement) {

    const askFeedbackPanels = $chatBody.getElementsByClassName('msg-bubble-options-panel');
    Array.from(askFeedbackPanels).forEach((panel: HTMLElement) => {
        const isActive = panel && panel.querySelector('.feedback.active');
        if (!isActive) {
            panel && panel.parentElement.removeChild(panel);
        }
    })
}

export function showToaster(message) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
    x.innerText = message;
    // Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}
