import {makePostReq} from "./ajax";
import {IHeaderData} from "./typings/http";
import {environment} from "./environment";

export async function transliteration(body) {
    const url = 'https://dev.imibot.ai/transliterate/text';
    const headerData: IHeaderData = {
        "content-type": 'application/json',
        // "bot-access-token": environment.bot_access_token
    }
    const x = await makePostReq({url, body, headerData});
    console.log(x);
    return x;
}

export async function languageDetection(body) {

    const url = 'https://prod.imibot.ai/api/v1/webhook/intelligent/';
    const headerData: IHeaderData = {
        "content-type": 'application/json',
        "bot-access-token": environment.bot_access_token
    }
    const x = await makePostReq({url, body, headerData});
    console.log(x);
    return x;
}