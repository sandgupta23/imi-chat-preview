import {IGetReq, IHeaderData, IPostReq} from "./typings/http";

export function makeGetReq<T>(reqObj: IGetReq): Promise<T> {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", reqObj.url, true); // true for asynchronous
    setHeaders(xmlHttp, reqObj.headerData);
    xmlHttp.send(null);
    return new Promise((resolve, reject) => {
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                resolve(JSON.parse(xmlHttp.responseText));
        }
    })
}

export function makePostReq<T>(reqObj: IPostReq): Promise<T> {

    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", reqObj.url, true); // true for asynchronous
    setHeaders(xmlHttp, reqObj.headerData);
    xmlHttp.send(JSON.stringify(reqObj.body));
    return new Promise((resolve, reject) => {
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                resolve(JSON.parse(xmlHttp.responseText));
        }
    })
}
export function makePutReq<T>(reqObj: IPostReq): Promise<T> {

    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("PUT", reqObj.url, true); // true for asynchronous
    setHeaders(xmlHttp, reqObj.headerData);
    xmlHttp.send(JSON.stringify(reqObj.body));
    return new Promise((resolve, reject) => {
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                resolve(JSON.parse(xmlHttp.responseText));
        }
    })
}


function setHeaders(xmlHttp: XMLHttpRequest, headerData: IHeaderData) {
    if(!headerData){
        return;
    }
    headerData = {
        ...headerData,
        'content-type': 'application/json'
    }
    Object.keys(headerData).forEach((key) => {
        const val = headerData[key];
        if (val) {
            xmlHttp.setRequestHeader(key, val);
        }
    })
}
