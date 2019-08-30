import {environment} from "./environment";
import {makeGetReq} from "./ajax";

export function getBotDetails<T>():Promise<T> {
    const env = environment;
    const url = `https://staging.imibot.ai/api/v1/bot/preview/?bot_unique_name=${env.bot_unique_name}&enterprise_unique_name=${env.enterprise_unique_name}`;
    return makeGetReq<T>({url: url});
}
