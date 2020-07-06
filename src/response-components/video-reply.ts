import {ESourceType} from "../typings/send-api";
import {convertStringToDom} from "../utility";
import {Reply} from "./reply";

export class VideoReply {

    getTemplate(url) {
        const htmlStr = `
                <div class="message-wrapper  message-wrapper-bot msg-video" style="animation-fill-mode: none!important;">
                     <video muted="muted"  class="msg-video" controls="true" playsinline="playsinline" >
                            <source src="${url}"/>
                                Your browser does not support HTML5 video.
                       </video>           
                </div>
            `;
        return htmlStr;
    }

    getElement(url) {
        const str = this.getTemplate(url);
        return convertStringToDom(str);
    }
}
