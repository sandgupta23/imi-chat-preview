//roomid=(typeof roomid === 'undefined') ? null : roomid
//botaccesstoken=null
//platformurl=null
//lang_local= null
//alt_lang= null
//sample_rate="16000"
//model_name="google_beta"
t_lang = null
var synth = window.speechSynthesis;
var voices = []
var isConnected = false; //true if we are connected to worker web socket

var tt = new Transcription(); //object for maintaining list of hypotheses;not necessary for our use-case

var startPosition = 0;
var endPosition = 0;
var doUpper = false;
var doPrependSpace = true;


function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function prettyfyHyp(text, doCapFirst, doPrependSpace) {
    if (doCapFirst) {
        text = capitaliseFirstLetter(text);
    }
    tokens = text.split(" ");
    text = "";
    if (doPrependSpace) {
        text = " ";
    }
    doCapitalizeNext = false;
    tokens.map(function (token) {
        if (text.trim().length > 0) {
            text = text + " ";
        }
        if (doCapitalizeNext) {
            text = text + capitaliseFirstLetter(token);
        } else {
            text = text + token;
        }
        if (token == "." || /\n$/.test(token)) {
            doCapitalizeNext = true;
        } else {
            doCapitalizeNext = false;
        }
    });

    text = text.replace(/ ([,.!?:;])/g, "\$1");
    text = text.replace(/ ?\n ?/g, "\n");
    return text;
}


var dictate = window.dictate = new Dictate({
    server: 'wss://dev-frontend-1093425665.us-east-1.elb.amazonaws.com/client/ws/speech',
    serverStatus: 'wss://dev-frontend-1093425665.us-east-1.elb.amazonaws.com/client/ws/status',
    recorderWorkerPath: 'recorderWorker.js',
    //model_name : model_name,
    //lang_local : lang_local,
    //alt_lang : alt_lang,
    //sample_rate : sample_rate,
    onReadyForSpeech: function () {
        isConnected = true;

        $("#buttonToggleListening").css('color', 'red');

        $("#buttonToggleListening").prop("disabled", false);

        startPosition = $("#trans").prop("selectionStart");
        endPosition = startPosition;
        var textBeforeCaret = $("#trans").val().slice(0, startPosition);
        if ((textBeforeCaret.length == 0) || /\. *$/.test(textBeforeCaret) || /\n *$/.test(textBeforeCaret)) {
            doUpper = true;
        } else {
            doUpper = false;
        }
        doPrependSpace = (textBeforeCaret.length > 0) && !(/\n *$/.test(textBeforeCaret));
    },
    onEndOfSpeech: function () {

        $("#buttonToggleListening").css('color', 'orange');
        $("#buttonToggleListening").prop("disabled", true);
    },
    onEndOfSession: function () {
        isConnected = false;

        $("#buttonToggleListening").css('color', 'green');

        $("#buttonToggleListening").prop("disabled", false);

    },
    onServerStatus: function (json) {

        if (json.num_workers_available == 0 && !isConnected) {
            $("#buttonToggleListening").prop("disabled", true);
        } else {
            $("#buttonToggleListening").prop("disabled", false);
        }
    },
    onPartialResults: function (hypos) {
        hypText = prettyfyHyp(hypos[0].transcript.toLowerCase(), doUpper, doPrependSpace);
        val = $("#trans").val();
        $("#trans").val(val.slice(0, startPosition) + hypText + val.slice(endPosition));
        endPosition = startPosition + hypText.length;
        $("#trans").prop("selectionStart", endPosition);
    },
    onResults: function (hypos) {
        hypText = prettyfyHyp(hypos[0].transcript.toLowerCase(), doUpper, doPrependSpace);

        val = $("#trans").val();
        $("#trans").val(val.slice(0, startPosition) + hypText + val.slice(endPosition));
        startPosition = 0;
        endPosition = 0;
        $("#trans").prop("selectionStart", endPosition);
        if (/\. *$/.test(hypText) || /\n *$/.test(hypText)) {
            doUpper = true;
        } else {
            doUpper = false;
        }
        doPrependSpace = (hypText.length > 0) && !(/\n *$/.test(hypText));
        $("#trans").val("");
        // needed, otherwise selectionStart will retain its old value
        $("#trans").prop("selectionStart", 0);
        $("#trans").prop("selectionEnd", 0);
        $("#transcripts").append('<div  style="width:100%;"><p class="msg1">' + hypText + '</p></div>');
        $("#transcripts").append('<div style="clear:both;"></div>')
        /* ***modify this ajax request for sending text to translation service instead of bot***/
        $.ajax({
            type: 'POST',
            url: 'gts',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify({"text": hypText, "t_lang": t_lang}),
            cache: false,
            processData: false,
            contentType: 'application/json'

        }).done(function (datafl1) {
            $("#transcripts").append('<div style="width:100%;"><p class="msg2">' + datafl1["t_text"] + '</p></div>')
            $("#transcripts").append('<div style="clear:both;"></div>')

            //roomid=(datafl1["room"]!==undefined)?datafl1["room"]["_id"]:null
            $("#transcripts").scrollTop($("#transcripts").prop('scrollHeight'));
            //speak(datafl1["generated_msg"][0]["text"])

        });

    },
    onError: function (code, data) {
        dictate.cancel();

    },
    onEvent: function (code, data) {

    }
});


function __updateTranscript(text) {
    $("#trans").val(text);
}


window.toggleListening1 = function toggleListening1(startCB, endCB) {

    if (isConnected) {
        dictate.stopListening(endCB);
        console.log("dictate.stopListening();");
    } else {
        // dictate.init();
        dictate.startListening(startCB);
        console.log("dictate.startListening()");
        console.log(dictate.startListening);
    }
}

window.cancel = function cancel() {
    dictate.cancel();
}

window.setParams = function setParams() {
//platformurl="https://"+$("#platformurl").val()+".imibot.ai/send";

//botaccesstoken=$("#bottoken").val();
//lang_local=$("#langlocal").val();
//alt_lang=$("#altlang").val();
//sample_rate=$("#samplerate").val();
//model_name=$("#modelname").val();
    dictate.setParams();
// dictate.init();
    t_lang = $("#tlang").val();
    $(".bottomcontainer").show();

}

function clearTranscription() {
    $("#trans").val("");
    // needed, otherwise selectionStart will retain its old value
    $("#trans").prop("selectionStart", 0);
    $("#trans").prop("selectionEnd", 0);
}

function speak(text) {
    if (text !== '') {
        voices = synth.getVoices();
        var utterThis = new SpeechSynthesisUtterance(text);
        for (i = 0; i < voices.length; i++) {


            if (voices[i].name == "Google US English") {
                utterThis.voice = voices[i];
                break;
            }


        }

        utterThis.pitch = "1";
        utterThis.rate = "1";
        synth.speak(utterThis);
    }
}

$(document).ready(function () {
    //dictate.init();


});
