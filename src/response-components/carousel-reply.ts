import {ESourceType} from "../typings/send-api";
import {convertStringToDom, isValidUrl, showToaster} from "../utility";
import {convertToLink} from "./link";
import {environment} from "../environment";

export class CarouselReply {
    media;

    constructor(message) {
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
        window.environment = environment;
        if (environment.options.phoneCasing) {
            environment.options.itemInView = 1;
        } else {
            if (window.innerWidth < 470) {
                environment.options.itemInView = 1;
            } else if (window.innerWidth < 680) {
                environment.options.itemInView = 2;
            } else {
                environment.options.itemInView = 3;
            }
        }
        const itemInView = environment.options.itemInView;
        if (this.media.length <= itemInView) {
            controlStr = "";
        }
        return `
               <div class="carousal-container hide-left-control" style="overflow: visible" data-step="0">
                   <div style="overflow:auto;">
                       <div style="overflow: auto; display: block; justify-content: center">
                           <div class="carousal-container-inner">
                                ${carousalStr}
                           </div>
                        </div>
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
        const desc = mediaItem.description ? `<div class="description-text">${mediaItem.description}</div>` : ``;
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

            let payload = button.type === 'url' ? '' : button.payload;
            let btnText = button.type === 'url' ?
                convertToLink(button.url, null, `<i style="margin-right: 5px" class="fa fa-external-link"></i> ${button.title}`)
                : button.title;
            if (!isValidUrl(button.url)) {

            }
            if (button.type === 'url' && !isValidUrl(button.url)) { /*title is not a link*/

                btnText = `<i style="margin-right: 5px" class="fa fa-external-link"></i> ` + button.title;
                payload = "__invalid_link__";
                // btnText = button.title;
            }
            str = str + `
            <li class="action" data-payload="${payload}" data-type="${button.type}">
                <div class="link-wrapper" data-payload="${payload}">${btnText}</div>
            </li>
        `;
        });
        return str;
    }
}
