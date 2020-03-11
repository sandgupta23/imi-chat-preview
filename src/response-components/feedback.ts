import {environment} from "../environment";
import {ESourceType} from "../typings/send-api";
import {convertStringToDom} from "../utility";

export class Feedback {
    constructor() {
        console.log('feedback');
    }

    getElement(obj, source?: ESourceType) {
        const str = this.getTemplate(obj);
        return convertStringToDom(str);
    }

    getTemplate({txnId, bot_message_id, humanClass, isLast, feedbackSTr, likeActive, disLikeActive, time, str, randomNumber, hideFeedback, feedback_comment}) {
        
        const askFeedbackClass = (likeActive || disLikeActive) ? '' : 'ask-feedback temp-div';
        let feedbackHtml = `
        <div class="msg-bubble-options-panel ${askFeedbackClass}" ${feedbackSTr}>
                    <div>
                    <div style="display: flex; align-items: center">
                        <div class="feedback  ${likeActive}" data-feedback-value="1" title="Helpful">
                             <i class="fa fa-thumbs-up feedback-like" data-feedback-value="1"></i>
                             <span class="feedback-like ask-label" data-feedback-value="1">Upvote</span>
                             <span class="feedback-like final-label" data-feedback-value="1">Upvoted</span>
                        </div>
                        <div class="feedback ${disLikeActive}" title="Not helpful" data-feedback-value="0">
                            <i class="fa fa-thumbs-down feedback-dislike" data-feedback-value="0"></i>
                            <span class="feedback-dislike ask-label" data-feedback-value="0">Downvote</span>
                            <span class="feedback-dislike final-label" data-feedback-value="0">Downvoted ${feedback_comment? 'with comment':''}</span>
                        </div>
                        <i class="fa fa-spinner fa-spin d-none" style="opacity: 0.5; margin-left: 5px; font-size: 15px"></i>
                    </div>
                    <div class="downvote-comment d-none feedback-form-diabled"
                     style="display: none; min-width: 200px; margin-top: 4px; border: 1px solid #d8d8d8; flex-direction: column; padding: 4px 10px; border-radius: 2px">
                        <div style="display: flex;height: 28px;align-items: center;">
                            <div class="${disLikeActive}" title="Not helpful" data-feedback-value="0">
                                <i class="fa fa-thumbs-down feedback-dislike" data-feedback-value="0"></i>
                            </div>
                            <div style="margin-left: 3px">Please leave feedback if any</div>
                        </div>
                        <div>
                            <textarea  placeholder="Share your thoughts.." class="downvote-comment-textarea" 
                            style="border: 1px solid #d8d8d8;background: #f8f8f8;
      height: 52px;
      border-radius: 3px;
      width: 100%;
      /*width: 210px;*/
      padding: 4px;"  rows="4"></textarea>
                             <span class="form-error">Max limit is 2000</span>
                        </div>
                        <div style="display: flex">
                            <button style="width: 68px;
                            border-color: #d8d8d8;
        height: 28px; margin-right: 6px" class="imi-button-primary downvote-comment-skip">Skip</button>
                            <button style="flex: 1;background: #00abd3;
        height: 28px; border-color: #00abd3; color: white" class="imi-button-primary downvote-comment-submit">Submit</button>
                        </div>
                    </div>
</div>
                </div>
                
        `;

        if (hideFeedback) {
            feedbackHtml = ``;
        }


        return `<div xmlns="http://www.w3.org/1999/xhtml" data-txn="${txnId}"  data-bot_message_id="${bot_message_id}"
             class="msg-bubble ${humanClass}" style="position:relative;">
                
                <div class="message-container" data-id="${randomNumber}">
                  
                    <div>
                    ${(isLast && (bot_message_id!== 0 && bot_message_id!=='human')) ? feedbackHtml : ''}
                    <div class="time" style="font-size: 9px">${time}</div>
                    </div>
                </div>
            </div>`;
    }
}
