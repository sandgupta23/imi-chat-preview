import {environment} from "./environment";
import {makeGetReq} from "./ajax";

export function getBotDetails<T>(): Promise<T> {
    const env = environment;
    const url = `https://${env.root}imibot.ai/api/v1/bot/preview/?bot_unique_name=${env.bot_unique_name}&enterprise_unique_name=${env.enterprise_unique_name}`;
    return makeGetReq<T>({url: url});
    // return {
    //     "_id": "5d91e4b72d72be004bbb1e6c",
    //     "active_version_id": 1032,
    //     "advanced_data_protection": false,
    //     "agent_handover_setting": {},
    //     "allow_agent_handover": false,
    //     "allow_anonymization": false,
    //     "allow_curation": true,
    //     "allow_feedback": false,
    //     "avatars": [],
    //     "blanket_consent": false,
    //     "bot_access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NTY1LCJyb2xlIjoiYm90In0.3y1POni2vj4II8u0hUjpFMVfInIm5ItrSba4mXoDmSo",
    //     "bot_disabled_settings": {
    //         "bot_disabled": false
    //     },
    //     "bot_metadata": {},
    //     "bot_type": "chatbot",
    //     "bot_unique_name": "dewa_gitex_en",
    //     "child_bots": [],
    //     "consent_categories": [
    //         "data_retention",
    //         "data_anonymization"
    //     ],
    //     "consent_message": "",
    //     "created_at": "2019-09-30T11:19:18.930000",
    //     "created_by": 165,
    //     "curation_settings": {},
    //     "data_persistence_period": 30,
    //     "description": "Wisdom Virtual Assistant",
    //     "enterprise_id": 99,
    //     "enterprise_logo": "https://upload.wikimedia.org/wikipedia/en/0/0d/DEWA_logo.png",
    //     "enterprise_name": "DEWA",
    //     "error_message": "",
    //     "first_message": "Hi, I am Wisdom, the executive virtual assistance from DEWA. For any inquiry, please type your question.",
    //     "heading": "",
    //     "id": 565,
    //     "integrations": {
    //         "fulfillment_provider_details": {
    //             "imiconnect": {
    //                 "appId": "",
    //                 "appSecret": "",
    //                 "enabled": false,
    //                 "endpoint": "",
    //                 "send_via_connect": "",
    //                 "serviceKey": "",
    //                 "streamName": ""
    //             }
    //         }
    //     },
    //     "is_manager": false,
    //     "logo": "https://upload.wikimedia.org/wikipedia/en/0/0d/DEWA_logo.png",
    //     "name": "DEWA GITEX",
    //     "parent_bots": [],
    //     "room_close_callback": false,
    //     "room_persistence_time": 240,
    //     "updated_at": "2019-10-03T09:57:20.415000",
    //     "updated_by": 165
    // }
}
