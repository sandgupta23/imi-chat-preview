import {ESourceType} from "../typings/send-api";
import {convertStringToDom} from "../utility";

export class TextReply {
    constructor(message){}

    getTemplate(text, source?: ESourceType) {
        const htmlStr = `
                <div class="message-wrapper ${source === ESourceType.human ? 'message-wrapper-human' : ''}">
                    <div class="content">${text}</div>
                </div>
            `;
        return htmlStr;
    }

    getElement(text, source?: ESourceType) {

        const str = this.getTemplate(text.text, source);
        return convertStringToDom(str);
    }
}