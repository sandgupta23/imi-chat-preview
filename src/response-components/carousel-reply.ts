import {ESourceType} from "../typings/send-api";
import {convertStringToDom} from "../utility";
import {convertToLink} from "./link";

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
        debugger;
        let url = mediaItem.url.split("&").join("&amp;");
        const desc = mediaItem.description? `<div class="description-text">${mediaItem.description}</div>`: `<div class="description-text">hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo hrllo </div>`;
        return `
    <div class="item">
            <div class="bot-carousal-item shadow-theme">
                <div class="banner" style="background-image: url(${url})"></div>
                <ul style="list-style: none">
                    <li class="title-wrapper">
                        <div class="title-text">${mediaItem.title}</div>
                        ${desc}
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
            <li class="action" data-payload="${button.payload}" data-type="${button.type}">
                <div class="link-wrapper" data-payload="${button.payload}">${convertToLink(button.title, null , `<i style="margin-right: 5px" class="fa fa-external-link"></i> `)}</div>
            </li>
        `;
        });
        return str;
    }
}
