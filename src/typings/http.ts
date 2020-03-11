export interface IHeaderData {
    'auth-token'?: string;
    'content-length'?: string;
    'content-type'?: string;
    'cookie'?: string;
    'origin'?: string;
    'referer'?: string;
    'user-agent'?: string;
    'user-access-token'?: string;
    'api-key'?: string;
    'bot-access-token'?: string;
    'enterprise_unique_name'?: string;
}

export interface IGetReq {
    url: string,
    headerData?: IHeaderData,
}

export interface IPostReq extends IGetReq {
    body: any
}
