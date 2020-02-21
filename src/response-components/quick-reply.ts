import {ESourceType} from "../typings/send-api";
import {convertStringToDom} from "../utility";

export class QuickReply {
    constructor(message) {
    }
    getElement(quick_reply, source?: ESourceType) {
        const str = this.getTemplate(quick_reply, source);
        return convertStringToDom(str);
    }

    getTemplate(quick_reply, source?: ESourceType) {
        const quickReplyTitleHtml = quick_reply.text? `<div class="content">${quick_reply.text}</div>`: '';
        const htmlStr = `
                <div class="message-wrapper ${source === ESourceType.human ? 'message-wrapper-human' : ''}">
                    ${quickReplyTitleHtml}
                </div>
                <div class="message-wrapper-quick-reply">
                    ${this.createQuickReplyButtons(quick_reply)}
                </div>
            `;
        return htmlStr;
    }

    createQuickReplyButtons(quick_reply) {
        let str = "";
        quick_reply.quick_replies.forEach((quick_reply) => {
            str = str + `<button data-payload="${quick_reply.payload}">${quick_reply.title}</button>`
        });

        return str;
    }
}
