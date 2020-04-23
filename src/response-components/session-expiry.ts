import {ESourceType} from "../typings/send-api";
import {convertStringToDom} from "../utility";

export class SessionExpiry {
    constructor(message){}

    getTemplate(text, source?: ESourceType) {
        const htmlStr = `
                <div class="session-expiry-message" xmlns="http://www.w3.org/1999/xhtml">
                    <div class="div" style="width: 70%; display: flex; align-items: center;" >
                        <hr style="border: 1px solid #80808030; flex-grow: 1; "/>
                        <div style="padding: 0 10px">Session expired</div>
                        <hr style="border: 1px solid #80808030; flex-grow: 1;"/>
                        
                    </div>
                </div>
            `;
        return htmlStr;
    }

    getElement(text, source?: ESourceType) {
        const str = this.getTemplate(text, source);
        return convertStringToDom(str);
    }
}