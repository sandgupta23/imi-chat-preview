import {environment} from "../environment";
import {ESourceType} from "../typings/send-api";
import {convertStringToDom} from "../utility";

export class Feedback {
    constructor() {
    }

    getElement(obj, source?: ESourceType) {

        const str = this.getTemplate(obj);
        return convertStringToDom(str);
    }

    getTemplate({txnId, bot_message_id, humanClass, isLast, feedbackSTr, likeActive, disLikeActive, time, str, randomNumber, hideFeedback}) {
        debugger;
        const askFeedbackClass = (likeActive || disLikeActive) ? '' : 'ask-feedback';
        let feedbackHtml = `
        <div class="msg-bubble-options-panel ${askFeedbackClass}" ${feedbackSTr}>
                    <div class="feedback  ${likeActive}" data-feedback-value="1" title="Helpful">
                         <i class="fa fa-thumbs-up feedback-like"></i>
                         <span>Upvote</span>
                    </div>
                    <div class="feedback ${disLikeActive}" title="Not helpful" data-feedback-value="0">
                        <i class="fa fa-thumbs-down feedback-dislike"></i>
                        <span>Downvote</span>
                    </div>
                </div>
        `;

        if (hideFeedback) {
            feedbackHtml = ``;
        }

        return `<div xmlns="http://www.w3.org/1999/xhtml" data-txn="${txnId}"  data-bot_message_id="${bot_message_id}"
             class="msg-bubble ${humanClass}" style="position:relative;">
                
                <div class="message-container" data-id="${randomNumber}">
                  
                    <div ">
                    ${isLast ? feedbackHtml : ''}
                    <div class="time" style="font-size: 9px">${time}</div>
                    </div>
                </div>
            </div>`;
    }
}
