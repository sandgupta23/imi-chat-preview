import {ESourceType} from "../typings/send-api";
import {convertStringToDom} from "../utility";

export class CarouselReply {
    media;
    constructor(message){
        this.media = message;
    }

    getElement(text, source?: ESourceType) {
        const str = this.getTemplate(text, source);
        let x = convertStringToDom(str);
        return x;
    }

    getTemplate(text, source?: ESourceType) {
        const carousalStr = this.createCarousalStr(this.media);
        let controlStr = `<div class="fa fa-angle-left control control-left"></div>
                   <div class="fa fa-angle-right control control-right"></div>`;
        if(this.media.length <= 2){
            controlStr = "";
        }
        return `
               <div class="carousal-container hide-left-control" data-step="0">
                   <div class="carousal-container-inner">
                        ${carousalStr}
                   </div>
                    ${controlStr}
                </div>
            `;
    }

    createCarousalStr(media) {
        let str = "";
        media.forEach((mediaItem) => {
            str = str + this.createCarousalItems(mediaItem);
        });
        return str;
    }

    createCarousalItems(mediaItem: any) {
        let url = mediaItem.url.split("&").join("&amp;");
        return `
    <div class="item">
            <div class="bot-carousal-item shadow-theme">
                <div class="banner" style="background-image: url(${url})"></div>
                <ul style="list-style: none">
                    <li class="title" style="text-align: center">
                        ${mediaItem.title}
                    </li>
                    ${this.createCarousalButtons(mediaItem.buttons)}
                </ul>
            </div>
        </div>
    `
    }

    createCarousalButtons(buttons) {
        let str = "";
        buttons.forEach((button) => {
            str = str + `
            <li class="action" data-payload="${button.payload}" data-type="${button.type}">${button.title}</li>
        `;
        });
        return str;
    }
}
