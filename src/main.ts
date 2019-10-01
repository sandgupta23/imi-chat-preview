import {makeGetReq} from "./ajax";
import {$chatInput,$chatSend,$search,$chatBody,$contentClass,$QreplyClass,$ArrowContent,$Arrow,AppendMessageInChatBody,$CarosalButtons,$searchbar,$nohighlight,$paperclip, setIntroDetails} from "./dom";
import {getBotDetails} from "./bot-details";
import {IBotDetailsApiResp} from "./typings/bot-detaills-api";
import 'regenerator-runtime/runtime'
import {sendMessageToBot, serializeGeneratedMessagesToPreviewMessages} from "./send-api";
import {environment} from "./environment";
import {IMessageData,IGeneratedMessageItem} from "./typings/send-api";

let clickcount=0;

//let searchclick=0;


function AttributePayload(MsgObj:IMessageData){
    if(Object.keys(MsgObj)[0]==="media" && MsgObj.messageMediatype=="image"){
    let finalLength=0;
    for(let x=0;x<MsgObj.media.length;x++){
        for(let y=0;y<MsgObj.media[x].buttons.length;y++){
            finalLength++;
        }
    }
    
        for(let z=0;z<$CarosalButtons.length-finalLength;z++){
            $CarosalButtons[z].addEventListener('click',async function(){
                
                let humanMessage = $CarosalButtons[z].getAttribute("payload");
                    AppendMessageInChatBody([{
                        sourceType: "bot",
                        text: humanMessage,
                        time: Date.now()
                    }],1);
                    
                    const botResponse = await sendMessageToBot(environment.bot_access_token, environment.enterprise_unique_name, humanMessage)
                    let messageData: any = serializeGeneratedMessagesToPreviewMessages(botResponse.generated_msg);

                    AppendMessageInChatBody(messageData);
                    
                    for(let x=0;x<messageData.length;x++){
                        if(messageData[x].messageMediatype=="quickReply"){
                            
                            quickreplyclick(messageData[x]);
                        }
                        if(messageData[x].messageMediatype=="image" && Object.keys(messageData[x])[0]=="media"){
                            
                            CarosalReply(messageData[x]);
                        }
                    }
                    for(let y=0;y<messageData.length;y++){
                        
                        AttributePayload(messageData[y]);
                    }
                    setDimensions();
                    });
        
                } 
            }
    if(Object.keys(MsgObj)[0]=="quick_reply"){
        
        for(let i=0;i<$QreplyClass.length-MsgObj.quick_reply.quick_replies.length;i++){
            $QreplyClass[i].addEventListener('click',async function(){
                let humanMessage = $QreplyClass[i].getAttribute('payload');
                AppendMessageInChatBody([{
                    sourceType: "bot",
                    text: humanMessage,
                    time: Date.now()
                }],1);
                
                const botResponse = await sendMessageToBot(environment.bot_access_token, environment.enterprise_unique_name, humanMessage)
                let messageData: any = serializeGeneratedMessagesToPreviewMessages(botResponse.generated_msg);
                AppendMessageInChatBody(messageData);
                for(let x=0;x<messageData.length;x++){
                    if(messageData[x].messageMediatype=="quickReply"){
                        
                        quickreplyclick(messageData[x]);
                    }
                    if(messageData[x].messageMediatype=="image" && Object.keys(messageData[x])[0]=="media"){
                       
                        CarosalReply(messageData[x]);
                    }
                }
                for(let y=0;y<messageData.length;y++){
                    
                    AttributePayload(messageData[y]);
                }
                setDimensions();
                });
        }
    }
    else if(Object.keys(MsgObj)[0]!="quick_reply" && (Object.keys(MsgObj)[0]!="media" && MsgObj.messageMediatype=="image") || (Object.keys(MsgObj)[0]=="media" && MsgObj.messageMediatype!="image") || (Object.keys(MsgObj)[0]!="media" && MsgObj.messageMediatype!="image")){

        for(let z=0;z<$CarosalButtons.length;z++){
            $CarosalButtons[z].addEventListener('click',async function(){
                
                let humanMessage = $CarosalButtons[z].getAttribute("payload");
                    AppendMessageInChatBody([{
                        sourceType: "bot",
                        text: humanMessage,
                        time: Date.now()
                    }],1);
                    
                    const botResponse = await sendMessageToBot(environment.bot_access_token, environment.enterprise_unique_name, humanMessage)
                    let messageData: any = serializeGeneratedMessagesToPreviewMessages(botResponse.generated_msg);

                    AppendMessageInChatBody(messageData);
                    
                    for(let x=0;x<messageData.length;x++){
                        if(messageData[x].messageMediatype=="quickReply"){
                            
                            quickreplyclick(messageData[x]);
                        }
                        if(messageData[x].messageMediatype=="image" && Object.keys(messageData[x])[0]=="media"){
                            
                            CarosalReply(messageData[x]);
                        }
                    }
                    for(let y=0;y<messageData.length;y++){
                        
                        AttributePayload(messageData[y]);
                    }
                    setDimensions();
                    });
        
                } 
                for(let i=0;i<$QreplyClass.length;i++){
                    $QreplyClass[i].addEventListener('click',async function(){
                        let humanMessage = $QreplyClass[i].getAttribute('payload');
                        AppendMessageInChatBody([{
                            sourceType: "bot",
                            text: humanMessage,
                            time: Date.now()
                        }],1);
                        
                        const botResponse = await sendMessageToBot(environment.bot_access_token, environment.enterprise_unique_name, humanMessage)
                        let messageData: any = serializeGeneratedMessagesToPreviewMessages(botResponse.generated_msg);
                        AppendMessageInChatBody(messageData);
                        for(let x=0;x<messageData.length;x++){
                            if(messageData[x].messageMediatype=="quickReply"){ 
                                quickreplyclick(messageData[x]);
                            }
                            if(messageData[x].messageMediatype=="image" && Object.keys(messageData[x])[0]=="media"){
                                
                                CarosalReply(messageData[x]);
                            }
                        }
                        for(let y=0;y<messageData.length;y++){
                            
                            AttributePayload(messageData[y]);
                        }
                        setDimensions();
                        });
                }
    }
}


function Dropdown()
    {
        for(let a=0;a<$Arrow.length;a++){
        $Arrow[a].addEventListener("click",function(){
            clickcount++;
            if(clickcount%2==1){
            (<HTMLButtonElement>$ArrowContent[a]).style.display="block";
            }
            else{
                for(let b=0;b<$Arrow.length;b++){
                    (<HTMLButtonElement>$ArrowContent[b]).style.display="none";
                }
            }
            clickcount=1;
            })
        }
    }

function quickreplyclick(MsgObj:IMessageData){

    for(let m=$QreplyClass.length-MsgObj.quick_reply.quick_replies.length;m<$QreplyClass.length;m++){
        
        
        let d=m-$QreplyClass.length+MsgObj.quick_reply.quick_replies.length;
        $QreplyClass[m].setAttribute("payload",MsgObj.quick_reply.quick_replies[d].payload);
        
    }
        for(let i=$QreplyClass.length-MsgObj.quick_reply.quick_replies.length;i<=$QreplyClass.length-1;i++){
            (<HTMLButtonElement>$QreplyClass[i]).addEventListener('click',async function(){
                let q=i;
                q=q-$QreplyClass.length+MsgObj.quick_reply.quick_replies.length;
                let humanMessage = MsgObj.quick_reply.quick_replies[q].payload;
                AppendMessageInChatBody([{
                    sourceType: "bot",
                    text: humanMessage,
                    time: Date.now()
                }],1);
                const botResponse = await sendMessageToBot(environment.bot_access_token, environment.enterprise_unique_name, humanMessage)
                let messageData: any = serializeGeneratedMessagesToPreviewMessages(botResponse.generated_msg);
                AppendMessageInChatBody(messageData);
                for(let x=0;x<messageData.length;x++){
                    if(messageData[x].messageMediatype=="quickReply"){
                        quickreplyclick(messageData[x]);
                    }
                    if(messageData[x].messageMediatype=="image" && Object.keys(messageData[x])[0]=="media"){
                        CarosalReply(messageData[x]);
                    }
                }
                for(let y=0;y<messageData.length;y++){
                    
                    AttributePayload(messageData[y]);
                }
                setDimensions();
                });
            }
    }

function CarosalReply(MsgObj:IMessageData){
    let finalLength=0;
    for(let x=0;x<MsgObj.media.length;x++){
        for(let y=0;y<MsgObj.media[x].buttons.length;y++){
            finalLength++;
        }
    }
    let z=$CarosalButtons.length-finalLength;
    while(z<$CarosalButtons.length){
        for(let r=0;r<MsgObj.media.length;r++){
            for(let t=0;t<MsgObj.media[r].buttons.length;t++){
                $CarosalButtons[z].setAttribute("payload",MsgObj.media[r].buttons[t].payload);
                z++;
            }  
        }
    }
    for(let z=$CarosalButtons.length-finalLength;z<$CarosalButtons.length;z++){
        $CarosalButtons[z].addEventListener('click',async function(){
            let k=z;
            let w=0;
            k=k-$CarosalButtons.length+finalLength;
            for(let r=0;r<MsgObj.media.length;r++){
                if((k+1-MsgObj.media[r].buttons.length)>0 && k>0){
                    k=k-MsgObj.media[r].buttons.length;
                    w=r;
                }
                else{
                    break;
                }
            }
            let humanMessage = MsgObj.media[w].buttons[k].payload;
                AppendMessageInChatBody([{
                    sourceType: "bot",
                    text: humanMessage,
                    time: Date.now()
                }],1);
                
                const botResponse = await sendMessageToBot(environment.bot_access_token, environment.enterprise_unique_name, humanMessage)
                let messageData: any = serializeGeneratedMessagesToPreviewMessages(botResponse.generated_msg);
                AppendMessageInChatBody(messageData);
                for(let x=0;x<messageData.length;x++){
                    if(messageData[x].messageMediatype=="quickReply"){
                       
                        quickreplyclick(messageData[x]);
                    }
                    if(messageData[x].messageMediatype=="image" && Object.keys(messageData[x])[0]=="media"){
                        
                        CarosalReply(messageData[x]);
                    }
                }
                for(let y=0;y<messageData.length;y++){
                    
                    AttributePayload(messageData[y]);
                }
                setDimensions();
                });
        }
    }

    async function initApp() {
        initEvents();
        const botDetails = await getBotDetails<IBotDetailsApiResp>();
        environment.bot_access_token = botDetails.bot_access_token;
        setIntroDetails({description: botDetails.description, logo: botDetails.logo, title: botDetails.name,lastseen:"online"});
       searchcreate();
       searchcontent();
    }

function initEvents() {
    $chatInput.addEventListener('keypress', async function ($event: KeyboardEvent) {
        if ($event.key === 'Enter') {
            let humanMessage = $chatInput.value;
            AppendMessageInChatBody([{
                sourceType: "bot",
                text: humanMessage,
                time: Date.now()
            }],1);
            
            const botResponse = await sendMessageToBot(environment.bot_access_token, environment.enterprise_unique_name, humanMessage)
            let messageData: any = serializeGeneratedMessagesToPreviewMessages(botResponse.generated_msg);
            AppendMessageInChatBody(messageData);
            for(let x=0;x<messageData.length;x++){
                if(messageData[x].messageMediatype=="quickReply"){
                    
                    quickreplyclick(messageData[x]);
                }
                if(messageData[x].messageMediatype=="image" && Object.keys(messageData[x])[0]=="media"){
                    
                    CarosalReply(messageData[x]);
                }
            }
            for(let y=0;y<messageData.length;y++){
                
                AttributePayload(messageData[y]);
            }
            // document.addEventListener("click",()=>{
            //     clickcount++;
            //     for(let b=0;b<$Arrow.length;b++){
            //         (<HTMLButtonElement>$ArrowContent[b]).style.display="none";
            //     }
            // });
            setDimensions();
        }
    })

    $chatSend.addEventListener('click', async function ($event: MouseEvent) {
        let humanMessage = $chatInput.value;
        AppendMessageInChatBody([{
            sourceType: "bot",
            text: humanMessage,
            time: Date.now()
        }],1);
        const botResponse = await sendMessageToBot(environment.bot_access_token, environment.enterprise_unique_name, humanMessage)
        let messageData: any = serializeGeneratedMessagesToPreviewMessages(botResponse.generated_msg);
        debugger;
        AppendMessageInChatBody(messageData);
        if(messageData.messageMediaType==="quickReply"){
            quickreplyclick(messageData);
        }
    })
        
    }

    
    // $searchbar.addEventListener("keypress",(event2:KeyboardEvent)=>{
    //     $search.style.borderBottomColor="#00abd3";
    //     $search.style.borderBottomWidth="2px";
    //     $search.style.borderBottomStyle="solid";
    //     $searchbar.style.borderBottomColor="#00abd3";
    //     $searchbar.style.borderBottomWidth="2px";
    //     $searchbar.style.borderBottomStyle="solid";
    //     console.log($searchbar.value);
    //     for(let i=0;i<$contentClass.length;i++){
    //         console.log($contentClass[i].textContent);
    //     }
    // });
   
function setDimensions(){
    console.log($contentClass.length);
    for(let i=0;i<$contentClass.length;i++){
        for(let j=0;j<$contentClass[i].children.length;++j){
            if($contentClass[i].children[j].classList.contains("material-icons")){
            $contentClass[i].children[j].remove();
            }
            if($contentClass[i].children[j].classList.contains("arrow-content") || $contentClass[i].children[j].classList.contains("arrow-content2")){
               $contentClass[i].children[j].remove();
            }
        }
    }

    for(let i=0;i<$contentClass.length;i++){
        let x=$contentClass[i].getBoundingClientRect();
        let arrow=document.createElement("i");
        arrow.className="material-icons";
        arrow.textContent="keyboard_arrow_down";
        let arrowdown=document.createElement("div");
        arrowdown.className="arrow-content2"; 
        let a=document.createElement("a");
        let b=document.createElement("a");
        let c=document.createElement("a");
        let d=document.createElement("a");

        a.textContent="Star";
        b.textContent="Delete";
        c.textContent="Reply";
        d.textContent="Forward";
        
        arrowdown.appendChild(a);
        arrowdown.appendChild(b);
        arrowdown.appendChild(c);
        arrowdown.appendChild(d);

        $contentClass[i].appendChild(arrow);
        $contentClass[i].appendChild(arrowdown);
    }

    for(let i=0;i<$contentClass.length;i++){
        $contentClass[i].children[$contentClass[i].children.length-2].addEventListener("click",function(e:MouseEvent){
            let x=0;
        if($contentClass[i].children[$contentClass[i].children.length-1].classList.contains("arrow-content2")){
            for(let j=0;j<$contentClass.length;j++){
                if($contentClass[j].children[$contentClass[j].children.length-1].classList.contains("arrow-content")){
                    $contentClass[j].children[$contentClass[j].children.length-1].classList.remove("arrow-content");
                    $contentClass[j].children[$contentClass[j].children.length-1].classList.add("arrow-content2");
                }
            }
            $contentClass[i].children[$contentClass[i].children.length-1].classList.remove("arrow-content2");
            $contentClass[i].children[$contentClass[i].children.length-1].classList.add("arrow-content");
            x=1;
        }
        if($contentClass[i].children[$contentClass[i].children.length-1].classList.contains("arrow-content") && x==0){
            for(let j=0;j<$contentClass.length;j++){
                if($contentClass[j].children[$contentClass[j].children.length-1].classList.contains("arrow-content")){
                    $contentClass[j].children[$contentClass[j].children.length-1].classList.remove("arrow-content");
                    $contentClass[j].children[$contentClass[j].children.length-1].classList.add("arrow-content2");
                }
            }
        }
        e.stopPropagation();
        });
    }
    document.addEventListener("click",function(e:MouseEvent){
        let m=0;
        for(let i=0;i<$contentClass.length;i++){
        if(e.currentTarget==$contentClass[i].children[$contentClass[i].children.length-1]){
            m=1;
        }
        if(m==0){
        for(let j=0;j<$contentClass.length;j++){
            if($contentClass[j].children[$contentClass[j].children.length-1].classList.contains("arrow-content")){
                $contentClass[j].children[$contentClass[j].children.length-1].classList.remove("arrow-content");
                $contentClass[j].children[$contentClass[j].children.length-1].classList.add("arrow-content2");
            }
    }
}
        }
});
}

function searchcreate(){
    let g=document.createElement("input");
    g.placeholder="search";
    g.type="text";
    g.className="searchbar";
    let h=document.createElement("div");
    h.className+="material-icons";
    h.id="search";
    h.textContent="search";
    $paperclip[0].appendChild(h);
    $paperclip[0].appendChild(g);
}

function searchcontent(){
    (<HTMLInputElement>$paperclip[0].children[1]).addEventListener("keyup",function(e:KeyboardEvent){
        if(e.key=="Enter"){
        let searchQuery=(<HTMLInputElement>$paperclip[0].children[1]).value;
        for(let i=0;i<$nohighlight.length;i++){
                if($nohighlight[i].textContent.search(searchQuery)>=0){
                    //console.log($nohighlight[i].textContent);
                    let str3='';
                    console.log(typeof(searchQuery));
                    str3+=`<span class="highlight">${searchQuery}</span>`;
                    let d=$nohighlight[i].textContent.slice(0,$nohighlight[i].textContent.search(searchQuery))
                    d+=$nohighlight[i].textContent.replace(searchQuery,str3);
                    d+=$nohighlight[i].textContent.slice($nohighlight[i].textContent.search(searchQuery)+searchQuery.length,$nohighlight[i].textContent.length);
                    console.log($nohighlight[i].textContent);
                    console.log(d);
                    (<HTMLDivElement>$nohighlight[i]).innerHTML=d;
                }
            }
               
        }
    }
    );  
}


initApp().then(_ => console.log('app init success'));
