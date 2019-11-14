import { IMessageData } from "./typings/send-api";

export const $chatInput = document.getElementById('chat-input') as HTMLInputElement;
export const $botIntro = document.getElementById('botIntro');
export const $chatBody = document.getElementById('body');
export const $chatSend = document.getElementById('icon');
export const $search = document.getElementById("search");
export const $contentClass = document.getElementsByClassName("content");
export const $QreplyClass = document.getElementsByClassName("Qreply");
export const $Arrow=document.getElementsByClassName("material-icons");
export const $ArrowContent=document.getElementsByClassName("arrow-content");
export const $CarosalButtons=document.getElementsByClassName("CarosalButton");
export const $searchbar = document.getElementById("searchbar") as HTMLInputElement;
export const $paperclip = document.getElementsByClassName("paperclip");
export const $nohighlight =document.getElementsByClassName("nohighlight");
export const $highlight =document.getElementsByClassName("highlight");
export const $modal = document.getElementById("myModal");
export const $modalBtn = document.getElementById("modalButton");
export const $close=document.getElementsByClassName("close")[0];
export const $modalcontent = document.getElementsByClassName("modal-content")[0];
export const $Ename=document.getElementsByClassName("Ename")[0] as HTMLSelectElement;
export const $Bname=document.getElementsByClassName("Bname")[0] as HTMLInputElement;
export const $ok=document.getElementsByClassName("ok")[0] as HTMLButtonElement;
export const $WallpaperBtn=document.getElementsByClassName("ChangeWall")[0] as HTMLButtonElement;
export const $modal2 = document.getElementById("myModal2");
export const $close2=document.getElementsByClassName("close2")[0];
export const $modalcontent2 = document.getElementsByClassName("modal-content2")[0];
export const $Wname=document.getElementsByClassName("Wname")[0] as HTMLInputElement;
export const $Hname=document.getElementsByClassName("Hname")[0] as HTMLInputElement;
export const $Fname=document.getElementsByClassName("Fname")[0] as HTMLInputElement;
export const $ok2=document.getElementsByClassName("ok2")[0] as HTMLButtonElement;
export const $header= document.getElementsByClassName("header")[0] as HTMLElement;
export const $footer= document.getElementsByClassName("footer")[0] as HTMLElement;
export const $DefaultBtn= document.getElementsByClassName("ok2")[1] as HTMLButtonElement;

export function setIntroDetails(intro: { logo: string, title: string, description: string,lastseen?:string }) {
    $botIntro.innerHTML = `<span class="bot-logo">
                    <img src="${intro.logo}" alt="">
                </span>
                <div class="bot-details">
                    <div class="title">${intro.title}</div>
                    <div class="description">${intro.description}</div>
                    <div class="lastseen">${intro.lastseen}</div>
                </div>`;
}

function addZero(i:number):any{
    var k: any='';
    if(i<10){
        k='0'+i;
    }
    else{
        k=i;
    }
    return k;
}

export function AppendMessageInChatBody(messages: any[],source?:number) {
    let str = "";
    var d1=new Date();
    var d2=addZero(d1.getHours())+':'+addZero(d1.getMinutes());
    if(source==1){
        messages.forEach((message) => {
            str = str + getBotMessageTemplateReq(message.text,d2);
        });
        $chatBody.innerHTML = $chatBody.innerHTML + str;
        //removed old EL
        //add new EL
        resetChatInput();
        scrollBodyToBottom();
    }
    else{
    messages.forEach((message) => {
        str = str + getBotMessageTemplateResp(message.text,d2,message);
    });
    $chatBody.innerHTML = $chatBody.innerHTML + str;
    resetChatInput();
    scrollBodyToBottom();
    }
}

function scrollBodyToBottom(){
    $chatBody.scrollTop = $chatBody.scrollHeight
}

export function resetChatInput() {
    $chatInput.value = "";
}

function getBotMessageTemplate(text,timestamp?:string) {
    return `<div class="message-container" >
                <div class="message-wrapper" >
                    <div class="content" >${text}<hr color="green">
                    <div class="timestamp">${timestamp}</div>
                    </div>
                </div>
            </div>` 
}

function getBotMessageTemplateReq(text,timestamp?:string) {
    return `<div class="message-container" style="justify-content:flex-end;">
                <div class="message-wrapper">
                    <div class="content" style="background: #e1ffc7;direction: rtl;border-radius:10px 0 10px 10px;">
                <div class="nohighlight">${text}</div>
                    <div class="timestamp">${timestamp}</div>
                    </div>
                </div>
                <div class="tick1" style="margin-right:120px;"></div>
            </div>`
}
function getBotMessageTemplateResp(text1,timestamp?:string,MsgObj?:IMessageData) {
   if(Object.keys(MsgObj)[0]==="quick_reply"){
        $chatBody.style.paddingLeft="80px";
        var str1=`<hr style="color:transparent;border:none;"><div class="Qreplypar">`;
        for(let i=0;i<MsgObj.quick_reply.quick_replies.length;i++){
            str1+=`<button class="Qreply"><div class="nohighlight">${MsgObj.quick_reply.quick_replies[i].title}</div></button>`;
        }
        str1+=`</div>`;

        return `<div class="message-container" style="justify-content:flex-start;">
                    <div class="tick2"></div>           
                    <div class="message-wrapper">
                        <div class="content" style="border-radius:0 10px 10px 10px;">
                            <div class="nohighlight">${text1}</div>${str1}
                            <div class="timestamp">${timestamp}</div>
                        </div>
                    </div> 
                </div>`
    }

    else if(Object.keys(MsgObj)[0]==="media" && MsgObj.messageMediatype=="image"){
        
        var str2=`<div class="message-container style="padding-left:8px;">`;
        var str3='';
        $chatBody.style.paddingLeft="80px";
        for(let l=0;l<MsgObj.media.length;l++){
            str2+=`<span><div class="message-wrapper" style="padding-left:5px;"><div class="content" style="border-radius:10px 10px 10px 10px;padding-bottom:4px;padding-top:8px;padding-left:3px;padding-right:3px;"><img alt="the image cannot be displayed in html5"  onerror=this.src="data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E" src=${MsgObj.media[l].url} style="height:150px;width:60px;">`;
            str2+=`<div class="CarosalTitle"><div class="nohighlight">${MsgObj.media[l].title}</div></div>`;
            for(let s=0;s<MsgObj.media[l].buttons.length;s++){
                str2+=`<div class="CarosalButton"><div class="nohighlight">${MsgObj.media[l].buttons[s].title}</div></div>`;
            }
            str2+='</div></div></span></div>';
        }
        return `<div class="message-container">${str2}</div>`;
    }

    else if(Object.keys(MsgObj)[0]==="media" && MsgObj.messageMediatype==undefined){
        var str2='';
        var str3='';
        $chatBody.style.paddingLeft="80px";
        str3+=`<span><div class="message-container"></span>         
        <div class="tick2" style=""></div>`
            if(MsgObj.media.hasOwnProperty("video_url")){
                str2=`<br><div><video controls><source src=${MsgObj.media.video_url}>your browser doesn't support html5 video</video><div>`;
                str3+=`<div class="message-container" style="justify-content:flex-start;flex-direction:column;">         
                <div class="message-wrapper">
                    <div class="content" style="border-radius:0 10px 10px 10px;padding-bottom:1.5px;padding-top:8px;padding-left:3px;padding-right:3px;">
                    <div class="nohighlight">${text1}</div>${str2}
                            <div class="timestamp" style="color:grey;bottom:6px;">${timestamp}</div>
                    </div>
                </div> 
                </div>
                `;
            }
            if(MsgObj.media.hasOwnProperty("audio_url")){
                str2=`<br><div><audio controls><source src=${MsgObj.media.audio_url}>your browser doesn't support html5 audio</audio></div>`;
                str3+=`<br> <div class="message-container" style="justify-content:flex-start;flex-direction:column;">         
                <div class="message-wrapper">
                    <div class="content" style="border-radius:0 10px 10px 10px;padding-bottom:1.5px;padding-top:8px;padding-left:3px;padding-right:3px;">
                    <div class="nohighlight">${text1}</div>${str2}
                            <div class="timestamp" style="color:grey;bottom:6px;right:47px;">${timestamp}</div>
                    </div>
                </div> 
                </div>
                `;
            }
            if(MsgObj.media.hasOwnProperty("image_url")){
                console.log("yo man"+MsgObj.media.image_url);
                str2=`<br><div><img alt="this browser doesn't support html5 image" src=${MsgObj.media.image_url}></div>`;
                str3+=`<br><div class="message-container" style="justify-content:flex-start;flex-direction:column;">           
                <div class="message-wrapper">
                    <div class="content" style="border-radius:0 10px 10px 10px;padding-bottom:1.5px;padding-top:8px;padding-left:3px;padding-right:3px;">
                    <div class="nohighlight">${text1}</div>${str2}
                            <div class="timestamp" style="color:grey;bottom:6px;">${timestamp}</div>
                    </div>
                </div>
                <div>
                 `;
            }
            if(MsgObj.media.hasOwnProperty("text")){
                str2=`<br><div class="content">MsgObj.text</div>`;
                str3+=`<br> <div class="message-container" style="justify-content:flex-start;flex-direction:column;">        
                <div class="message-wrapper">
                    <div class="content" style="border-radius:0 10px 10px 10px;padding-bottom:1.5px;padding-top:8px;padding-left:3px;padding-right:3px;">
                    <div class="nohighlight">${text1}<br>${str2}<div>
                            <div class="timestamp">${timestamp}</div>
                    </div>
                </div>
                </div>`;
            }

            str3+=`<br>`;

        return `${str3}`
                   
        }

   else{
    $chatBody.style.paddingLeft="80px";
        return `<div class="message-container" style="justify-content:flex-start;">
                    <div class="tick2"></div>           
                    <div class="message-wrapper">
                        <div class="content" style="border-radius:0 10px 10px 10px;">  
                        <div class="nohighlight">${text1}</div>
                            <div class="timestamp">${timestamp}</div>
                        </div>
                    </div> 
                </div>`
    }
}



