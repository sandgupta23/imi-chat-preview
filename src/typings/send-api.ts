export interface ISendApiReq {
    "consumer": {
        "uid": string
    },
    "type": "human" | "bot",
    "msg": string,
    "platform": "web",
    "is_test": false
}

export interface ISendApiResp {
    "TimeStamp"?: 1567167604976,
    "bot_message_id"?: 750126,
    "bot_msg"?: "",
    "extra_params"?: {},
    "extras"?: {},
    "generated_msg"?: IGeneratedMessageItem[],
    "messageStore"?: {
        "agent_handover_by_rules": true,
        "corpus_id": 183,
        "n_sections": [
            {
                "first_question": "What can you do?",
                "score": 0,
                "section_id": "help"
            },
            {
                "first_question": "Talk to an agent",
                "score": 0,
                "section_id": "agent"
            },
            {
                "first_question": "hi",
                "score": 0,
                "section_id": "3"
            }
        ],
        "partial_match_sections"?: [],
        "response_type": "",
        "sendtoagent": true,
        "thresholding_scores": {
            "n_results": 3,
            "threshold_diff_score": 0.05,
            "threshold_min_score": 0.3
        },
        "top_match_section": {
            "first_question": "Fallback Message",
            "score": 0,
            "section_id": "fallback"
        }
    },
    "partial_match": false,
    "platform": "web",
    "progressive": false,
    "response_flag": true,
    "room"?: {
        "_id": "5d6914615f6218003a58df90",
        "agent_handover": false,
        "agent_handover_rules_count": {
            "consecutive_count": 0,
            "fallback_count": 0,
            "last_triggered": "",
            "partial_match_count": 0
        },
        "allow_anonymization": false,
        "bot_disabled": false,
        "bot_id": 579,
        "callback": false,
        "channels": [
            "web"
        ],
        "consent_permissions": [],
        "consumer_id": 51598,
        "created_at": 1567167585592,
        "cross_retention_period": false,
        "data_store": {},
        "df_state": {},
        "downvoted_message_count": 0,
        "error_message_count": 0,
        "feedback_count": {
            "downvote": 0,
            "upvote": 0
        },
        "id": 178123,
        "imichat_agent": {},
        "imiconnect_conversation_id": "",
        "is_anonymized": false,
        "is_test": true,
        "last_message_time": "2019-08-30T12:20:04.972483",
        "last_updated_job_id": "5d6914745d2301cf1b2f3e22",
        "manager_bot_room_id": 0,
        "message_count": {
            "agent": 0,
            "bot": 3,
            "total": 5,
            "user": 2
        },
        "room_state_closed": false,
        "selected_avatar": {},
        "sendtoagent_count": 1,
        "session_id": "",
        "total_message_count": 5,
        "updated_at": 1567167604972,
        "upvoted_message_count": 0
    },
    "section_matched": [
        {
            "first_question": "Fallback Message",
            "score": 0,
            "section_id": "fallback"
        }
    ],
    "sendtoagent": true,
    "thresholding_scores": {
        "n_results": 3,
        "threshold_diff_score": 0.05,
        "threshold_min_score": 0.3
    },
    "transaction_id": "27095eaec4624e63bab672d9e9002771"
}

/*from bot project*/


export interface ISendApiRequestPayload {
    'bot_id': string;
    'consumer': {
        '_id'?: string,
        'botId': string,
        'consentAcknowledged': boolean,
        'consentPermissions': any[],
        'consumerDataStore': object,
        'created_at': string,
        'email': string,
        'extra_params': string,
        'facebookId': string,
        'lineId': string,
        'name': string,
        'phone': string,
        'skypeId': string,
        'uid': string,
        'updated_at': string
    };

    'type': string;
    'msg': string;
    'platform': string;
}

export interface IGeneratedMessageItem {
    'text'?: string;
    bot_message_id?: number;
    'media'?: any;
    // {
    //   'buttons': [
    //     {
    //       'title': 'URL Button',
    //       'type': 'web_url', //title
    //       'url': 'https://www.messenger.com/'/*TODO: we are not getting payload*/
    //     }
    //     ],
    //   'title': 'this is sample text for image ,it is optional', //use this
    //   'type': EBotMessageMediaType//"image",//use this
    //   'url': 'https://wallpaperbrowse.com/media/images/soap-bubble-1958650_960_720.jpg'//use this
    //   'video_url': string
    //   'audio_url': string
    //   'image_url': string
    // }[],

    quick_reply?: {
        'quick_replies': [
            {
                'content_type': 'text',
                'payload': 'Play Game',
                'title': 'Play Game'
            }],
        'text': 'Do you want to play game or validate coupon?<br>Select any'
    };

}

export interface ISendApiResponsePayload {
    'TimeStamp': 1533902788.0;
    'bot_msg': string;
    isLast: boolean,
    bot_message_id: number;
    'generated_msg': IGeneratedMessageItem[];
    'messageStore': { 'endflow': true, 'templateKey': 'A1', response_language: string };
    'room': {
        'agent_handover': false,
        'allow_anonymization': false,
        'bot_id': number// 1,
        'consent_permissions': any[],
        'consumer_id': number, // 43,
        'cross_retention_period': false,
        'data_store': {},
        'df_state': {
            'answer': 'hi', 'question': 'hi'
        },
        'id': number,
        'imichat_agent': {},
        'is_anonymized': false,
        'last_updated_job_id': '5b6d7fc4736453000587246a',
        'manager_bot_room_id': 0,
        'resource_uri': '/api/v1/room/64/',
        'room_state_closed': false,
        'selected_avatar': any
    };
    'sendtoagent': false;
    'templateKey': 'A1';
    'transaction_id': '79f2707b0d2c419198febf0ccaaa4b99';
    // 'generated_msg': [{
    //     'text': string
    //   }],
    // 'room': {
    //   '_id': string,
    //   'agentHandOver': false,
    //   'botId': number,
    //   'consentAcknowledged': true,
    //   'consumerId': {
    //     '_id': string,
    //     'botId': string,
    //     'consentAcknowledged': true,
    //     'consentPermissions': {
    //         'permission': string,
    //         'status': string
    //       }[],
    //     'consumerDataStore': {},
    //     'created_at': string,
    //     'email': string,
    //     'extra_params': string,
    //     'facebookId': string,
    //     'lineId': string,
    //     'name': string,
    //     'phone': string,
    //     'skypeId': string,
    //     'uid': string,
    //     'updated_at': string
    //   },
    //   'created_at': string,
    //   'managerBotRoomId': null,
    //   'room_state_closed': false,
    //   'bot': {
    //     'roomId': 1,
    //     'imageUrl': string,
    //     'name': string
    //   },
    //   'updated_at': string
    // },
    // 'transaction_id': string
}

export enum EChatFrame {
    WELCOME_BOX = 'WELCOME_BOX',
    CHAT_LIST = 'CHAT_LIST',
    CHAT_BOX = 'CHAT_BOX',
}

export enum EBotMessageMediaType {
    image = 'image',
    text = 'text',
    quickReply = 'quickReply',
    bot_thinking = 'bot_thinking'
}

export enum ESourceType {
    bot = "bot",
    human = "human",
}

export interface IMessageData extends IGeneratedMessageItem {
    /*custom fields*/
    SESSION_EXPIRY: true
    sourceType?: ESourceType; // TODO: "timePeriod" ||"human", gives error, see why
    time?: number;
    messageMediaType?: EBotMessageMediaType;
    bot_message_id?: number;
    feedback?: any;
    isLast?: boolean;
    response_language?: string;
    video: {url:string},
    audio: {url:string},
    image: {url:string},
    media?: {
        audio_url: string,
        image_url: string,
        video_url: string,
        length: null
    }
}
