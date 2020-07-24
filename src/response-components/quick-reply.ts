import {ESourceType} from "../typings/send-api";
import {convertStringToDom, isValidUrl} from "../utility";
import {convertToLink} from "./link";

export class QuickReply {
    constructor(message) {
    }
    getElement(quick_reply, source?: ESourceType) {
        const str = this.getTemplate(quick_reply, source);
        return convertStringToDom(str);
    }

    getTemplate(quick_reply, source?: ESourceType) {
        const htmlStr = `
                <div class="message-wrapper ${source === ESourceType.human ? 'message-wrapper-human' : ''}">
                    <div class="content">
                        ${convertToLink(quick_reply.text, 'text-link')}
                    </div>
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
            let payload = quick_reply.content_type === 'url'? '' : quick_reply.payload;
            let btnText = quick_reply.content_type === 'url'?
                convertToLink(quick_reply.url, null , `<i style="margin-right: 5px" class="fa fa-external-link"></i> ${quick_reply.title}`)
                : quick_reply.title;
            if(quick_reply.content_type === 'url' && !isValidUrl(quick_reply.url)){ /*title is not a link*/
                btnText = `<i style="margin-right: 5px" class="fa fa-external-link"></i> ` + btnText;
                payload = "__invalid_link__";
                // btnText = quick_reply.title;
            }
            str = str + `<button class="link-wrapper bot-link" data-payload="${payload}">${btnText}</button>`
        });

        return str;
    }
}