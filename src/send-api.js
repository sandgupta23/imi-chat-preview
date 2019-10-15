"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var ajax_1 = require("./ajax");
var environment_1 = require("./environment");
var send_api_1 = require("./typings/send-api");
function sendMessageToBot(bot_access_token, enterprise_unique_name, humanMessage) {
    var url = "https://" + environment_1.environment.root + "imibot.ai/api/v1/webhook/web/";
    var body = {
        "consumer": environment_1.environment.consumer,
        "type": "human",
        "msg": humanMessage,
        "platform": "web",
        "is_test": false
    };
    var headerData = {
        // enterprise_unique_name: enterprise_unique_name,
        "bot-access-token": bot_access_token
    };
    return ajax_1.makePostReq({ url: url, body: body, headerData: headerData });
}
exports.sendMessageToBot = sendMessageToBot;
function serializeGeneratedMessagesToPreviewMessages(generatedMessage, bot_message_id, response_language) {
    return generatedMessage.map(function (message, index) {
        var isLast = index === generatedMessage.length - 1;
        var messageData = __assign(__assign({}, message), { bot_message_id: bot_message_id, time: Date.now(), messageMediaType: null, sourceType: send_api_1.ESourceType.bot, isLast: isLast,
            response_language: response_language });
        if (Object.keys(message)[0] === 'media') {
            messageData = __assign(__assign({}, messageData), { messageMediaType: message.media[0] && message.media[0].type });
        }
        else if (Object.keys(message)[0] === 'quick_reply') {
            messageData = __assign(__assign({}, messageData), { messageMediaType: send_api_1.EBotMessageMediaType.quickReply });
        }
        else {
            /*if message type = text*/
            messageData = __assign(__assign({}, messageData), { messageMediaType: send_api_1.EBotMessageMediaType.text });
        }
        return messageData;
    });
}
exports.serializeGeneratedMessagesToPreviewMessages = serializeGeneratedMessagesToPreviewMessages;
