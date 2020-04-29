import {makePostReq, makePutReq} from "./ajax";
import {environment} from "./environment";
import {IHeaderData} from "./typings/http";
import {EBotMessageMediaType, ESourceType, IGeneratedMessageItem, IMessageData, ISendApiResp} from "./typings/send-api";

export const socketKey = createRandomString(15);

export function sendMessageToBot(bot_access_token: string, enterprise_unique_name: string, humanMessage: string, sourceType: ESourceType): Promise<ISendApiResp> {
    debugger;
    const url = `https://${environment.root}imibot.ai/api/v1/webhook/web/`;
    const body = {
        "consumer": {
            ...(environment.consumer || {}),
            "extra_params": {
                "socket_key": socketKey
            }
        },
        "type": sourceType || ESourceType.human,
        "msg": humanMessage,
        "platform": "web",
        "is_test": false
    };

    const headerData: IHeaderData = {
        // enterprise_unique_name: enterprise_unique_name,
        "bot-access-token": bot_access_token
    };
    return makePostReq<ISendApiResp>({url, body, headerData})
        .then((data) => {
            environment.room = data.room;
            return data;
        })
}


export async function sendFeedback(body: { "bot_message_id": number, "feedback": string, "consumer_id": number, feedback_comment?: string }): Promise<ISendApiResp> {

    const useAirTableForFeedback = body.feedback_comment;
    let url, headerData: IHeaderData = {};
    let ajaxPromises: Promise<any>[] = [];
    if (useAirTableForFeedback) {
        url = `https://api.airtable.com/v0/app8sonGMEZ8VaGpj/Table%201`;//https://dev.imibot.ai/api/v1/message/feedback/
        const headerDataAirtable = <any>{
            // enterprise_unique_name: enterprise_unique_name,
            // "bot-access-token": environment.bot_access_token,
            // "Content-Type": "application/json",
            'Authorization': 'Bearer keyXxUio5tZMzQJgx'
        };
        const bodyAirtable = ({
            "records": [{
                "fields": {
                    "comment": body.feedback_comment,
                    "message_id": body.bot_message_id.toString(),
                    "room_id": environment.room.id.toString(),
                    "bot_unique_name": environment.bot_unique_name
                }
            }]
        } as any);
        const p = makePostReq<ISendApiResp>({url, body: bodyAirtable, headerData: headerDataAirtable});
        ajaxPromises.push(p);
    }
    url = `https://${environment.root}imibot.ai/api/v1/message/feedback/`;//https://dev.imibot.ai/api/v1/message/feedback/
    headerData = {
        "bot-access-token": environment.bot_access_token,
    };
    const p = makePutReq<ISendApiResp>({url, body, headerData});
    ajaxPromises.push(p);
    await Promise.all(ajaxPromises) as any;
    return  p;
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

        try {
            if (Object.keys(message)[0] === 'media') {
                messageData = {
                    ...messageData,
                    messageMediaType: message.media[0] && message.media[0].type,
                    // text: EBotMessageMediaType.image, // this is for preview of last message in chat room list,
                };
            } else if (Object.keys(message)[0] === 'quick_reply') {
                messageData = {
                    ...messageData,
                    messageMediaType: EBotMessageMediaType.quickReply, //
                    // text: (<any>message).quick_reply.text || EBotMessageMediaType.quickReply, // this is for preview of last message in chat room list
                };
            } else {
                /*if message type = text*/
                messageData = {
                    ...messageData,
                    messageMediaType: EBotMessageMediaType.text,
                };
            }
        } catch (e) {

        }

        return messageData;


    });
}

function createRandomString(length: number = 10) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}
