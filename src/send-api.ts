import {makePostReq} from "./ajax";
import {environment} from "./environment";
import {IHeaderData} from "./typings/http";
import {EBotMessageMediaType, ESourceType, IGeneratedMessageItem, IMessageData, ISendApiResp} from "./typings/send-api";

export function sendMessageToBot(bot_access_token: string, enterprise_unique_name: string, humanMessage: string): Promise<ISendApiResp> {
    const url = `https://${environment.root}imibot.ai/api/v1/webhook/web/`;
    const body = {
        "consumer": environment.consumer,
        "type": "human",
        "msg": humanMessage,
        "platform": "web",
        "is_test": false
    };

    const headerData:IHeaderData = {
        enterprise_unique_name: enterprise_unique_name,
        "bot-access-token": bot_access_token
    }
    return makePostReq<ISendApiResp>({url, body, headerData})
}


export function serializeGeneratedMessagesToPreviewMessages(generatedMessage: IGeneratedMessageItem[], bot_message_id?: number, response_language?): IMessageData[] {

    return generatedMessage.map((message: IGeneratedMessageItem, index) => {
        const isLast = index === generatedMessage.length - 1;
        let messageData: IMessageData = {
            ...message,
            bot_message_id,
            time: Date.now(),
            messageMediaType: null,
            sourceType: ESourceType.bot,
            isLast,
            response_language
        };

        if (Object.keys(message)[0] === 'media') {
            messageData = {
                ...messageData,
                messageMediaType: message.media[0] && message.media[0].type,
                text: EBotMessageMediaType.image, // this is for preview of last message in chat room list,
            };
        } else if (Object.keys(message)[0] === 'quick_reply') {
            messageData = {
                ...messageData,
                messageMediaType: EBotMessageMediaType.quickReply, //
                text: (<any>message).quick_reply.text || EBotMessageMediaType.quickReply, // this is for preview of last message in chat room list
            };
        } else {
            /*if message type = text*/
            messageData = {
                ...messageData,
                messageMediaType: EBotMessageMediaType.text,
            };
        }

        return messageData;


    });
}

