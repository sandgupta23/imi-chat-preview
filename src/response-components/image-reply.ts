import {ESourceType} from "../typings/send-api";
import {convertStringToDom, encodeUrlForDomParser} from "../utility";

export class ImageReply {
    constructor(message){}

    getTemplate(url) {
        url = encodeUrlForDomParser(url);
        const htmlStr = `
                <div class="message-wrapper message-wrapper-bot msg-shadow" style="max-width: 357px; border-radius: 8px; overflow: hidden">
                    <img 
                    style="width: 100%" 
                    class="msg-img click-to-zoom" src="${url}" alt=""/>
                </div>
            `;
        return htmlStr;
    }
    getElement(text, source?: ESourceType) {
        const str = this.getTemplate(text);
        return convertStringToDom(str);
    }
}
