// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"typings/send-api.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var EChatFrame;

(function (EChatFrame) {
  EChatFrame["WELCOME_BOX"] = "WELCOME_BOX";
  EChatFrame["CHAT_LIST"] = "CHAT_LIST";
  EChatFrame["CHAT_BOX"] = "CHAT_BOX";
})(EChatFrame = exports.EChatFrame || (exports.EChatFrame = {}));

var EBotMessageMediaType;

(function (EBotMessageMediaType) {
  EBotMessageMediaType["image"] = "image";
  EBotMessageMediaType["text"] = "text";
  EBotMessageMediaType["quickReply"] = "quickReply";
  EBotMessageMediaType["bot_thinking"] = "bot_thinking";
})(EBotMessageMediaType = exports.EBotMessageMediaType || (exports.EBotMessageMediaType = {}));

var ESourceType;

(function (ESourceType) {
  ESourceType["bot"] = "bot";
  ESourceType["human"] = "human";
})(ESourceType = exports.ESourceType || (exports.ESourceType = {}));
},{}],"utility.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function getTimeInHHMM() {
  var time = new Date();
  return ("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2);
}

exports.getTimeInHHMM = getTimeInHHMM;

function getQueryStringValue(key) {
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

exports.getQueryStringValue = getQueryStringValue;

function updateQueryStringParameter(uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";

  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  } else {
    return uri + separator + key + "=" + value;
  }
}

exports.updateQueryStringParameter = updateQueryStringParameter;
},{}],"environment.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.environment = {
  bot_access_token: null,
  bot_unique_name: "weatherytesting",
  enterprise_unique_name: "ayeshreddy.k",
  root: "dev.",
  consumer: {
    uid: Date.now().toString()
  },
  room: {
    id: null
  },
  logo: ""
};
},{}],"dom.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var send_api_1 = require("./typings/send-api");

var utility_1 = require("./utility");

var environment_1 = require("./environment");

function domInit(dom) {
  exports.$chatContainer = document.querySelector('.imi-preview-grid-container');
  exports.$chatInput = dom.$chatInput;
  exports.$chatInputIcon = document.getElementById('chat-input-icon');
  exports.$botIntro = document.getElementById('botIntro');
  exports.$chatBody = document.getElementById('body');
  exports.$chatFooter = document.getElementsByClassName('footer')[0];
  exports.$loader = document.getElementsByClassName('loader')[0];
  exports.$envOptions = document.getElementById('env-options');
  exports.$botTitle = document.getElementById('bot-title');
  exports.$botDescription = document.getElementById('bot-description');
  exports.$botLogo = document.getElementById('bot-logo');
  exports.$phoneModel = document.getElementById('phone-modal');
  exports.$langSelect = document.getElementById('lang-select');
  exports.$langSubmit = document.getElementById('lang-submit');
  exports.$knowMoreContainer = document.getElementsByClassName('chat-know-more-overlay')[0];
  exports.$knowMoreClose = document.getElementsByClassName('close-chat-img-overlay')[0];
  exports.$knowMoreOverlay = document.getElementsByClassName('chat-img-overlay')[0];
}

exports.domInit = domInit;

function setOptions(intro) {
  if (exports.$botLogo) {
    exports.$botLogo.src = intro.logo;
  }

  if (exports.$botTitle) {
    exports.$botTitle.textContent = intro.name;
  }

  if (exports.$botDescription) {
    exports.$botDescription.textContent = intro.description;
  }
}

exports.setOptions = setOptions;

function AppendMessageInChatBody(messages, botResponse) {
  if (botResponse) {
    if (environment_1.environment.room && environment_1.environment.room.id && botResponse.room.id !== environment_1.environment.room.id) {
      AppendMessageInChatBody([{
        SESSION_EXPIRY: true
      }], null);
      console.log("previous room : " + environment_1.environment.room + ". new room " + botResponse.room.id);
    }

    console.log(environment_1.environment.room, botResponse.room);
    environment_1.environment.room = JSON.parse(JSON.stringify(botResponse.room));
  }

  var txnId = botResponse && botResponse.transaction_id || 'human';
  var bot_message_id = botResponse && botResponse.bot_message_id || 'human';
  var str = "";
  var frag = document.createDocumentFragment();
  var videoStr = "";

  if (messages[0].SESSION_EXPIRY) {
    str = getBotMessageTemplateForSessionExpiry(messages[0]);
  } else {
    if (messages.length === 1 && messages[0].sourceType === "session_expired") {
      return;
    }

    messages.forEach(function (message) {
      if (message.text) {
        str = str + getBotMessageTemplateForText(message.text, message.sourceType);
      }

      if (message.SESSION_EXPIRY) {
        str = str + getBotMessageTemplateForSessionExpiry(message.text, message.sourceType);
      }

      if (message.quick_reply) {
        str = str + getBotMessageTemplateForQuickReply(message.quick_reply, message.sourceType);
      }

      if (message.media) {
        if (message.media.audio_url) {
          str = str + getBotMessageTemplateForAudio(message.media.audio_url);
        }

        if (message.media.video_url) {
          str = str + getBotMessageTemplateForVideo(message.media.video_url);
          videoStr = videoStr + ("<video autoplay=\"autoplay\" muted=\"muted\"  class=\"msg-video\" controls=\"true\" playsinline=\"playsinline\">\n                <source src=\"" + message.media.video_url + "\"/>\n                    Your browser does not support HTML5 video.\n                </video>");
        }

        if (message.media.image_url) {
          str = str + getBotMessageTemplateForImage(message.media.image_url);
        }

        if (message.media.length) {
          str = str + getBotMessageTemplateForCarousal(message.media);
        }
      }
    });
    console.log(str);
    var humanClass = messages[0].sourceType === send_api_1.ESourceType.human ? 'msg-bubble-human' : '';
    var time = utility_1.getTimeInHHMM();
    var feedbackSTr = "";
    var messageWithFeedback = messages.find(function (message) {
      return message.feedback != null;
    });
    var likeActive = void 0;
    var disLikeActive = void 0;

    if (messageWithFeedback) {
      var feedback = messageWithFeedback.feedback;
      likeActive = feedback === "1" || feedback === "POSITIVE" ? 'active' : '';
      disLikeActive = feedback === "0" || feedback === "NEGATIVE" ? 'active' : '';
      feedbackSTr = "data-feedback=\"" + feedback + "\"";
    }

    console.log('==>', str);
    str = "\n            <div xmlns=\"http://www.w3.org/1999/xhtml\" data-txn=\"" + txnId + "\"  data-bot_message_id=\"" + bot_message_id + "\"\n             class=\"msg-bubble " + humanClass + "\" style=\"position:relative;\">\n                <div class=\"msg-bubble-options-panel\" " + feedbackSTr + ">\n                    <i class=\"fa fa-thumbs-up feedback-like " + likeActive + "\" data-feedback-value=\"1\" title=\"Helpful\"></i>\n                    <i class=\"fa fa-thumbs-down feedback-dislike " + disLikeActive + "\" title=\"Not helpful\" data-feedback-value=\"0\"></i>\n                </div>\n<!--                <div class=\"msg-bubble-options\">-->\n<!--                    <i class=\"fa fa-ellipsis-h\"></i>-->\n<!--                </div>-->\n                <div class=\"msg-bot-logo\">\n                    <img \n                    src=\"" + environment_1.environment.logo + "\"\n                    onerror=\"this.src='https://imibot-production.s3-eu-west-1.amazonaws.com/integrations/v2/default-fallback-image.png'\"\n                     style=\"height: 100%; width: 100%\" />\n                </div>\n                <div class=\"message-container\">\n                    " + str + "\n                    <div class=\"time\" style=\"font-size: 9px\">" + time + "</div>\n                </div>\n            </div>  \n            \n        ";
  }

  var el = getElementsFromHtmlStr(str);
  var carousal = el.querySelector('.carousal-container');
  frag.appendChild(el);

  if (carousal) {
    carousal.style.opacity = '0';
  }

  exports.$chatBody.appendChild(frag);

  if (carousal) {
    var carousalWidth = exports.$chatBody.offsetWidth - 60;
    var dataItemToShow = '1';

    if (carousalWidth > 0 && carousalWidth < 225) {
      dataItemToShow = '1';
    } else {
      if (carousalWidth > 0 && carousalWidth < 450) {
        dataItemToShow = '2';
      } else if (carousalWidth >= 450 && carousalWidth < 675) {
        carousalWidth = 450;
        dataItemToShow = '2';
      } else if (carousalWidth >= 675) {
        carousalWidth = 675;
        dataItemToShow = '3';
      }
    }

    carousal.setAttribute('data-itemToShow', dataItemToShow);
    var carousalItemCount = carousal.getElementsByClassName('item').length;

    if (carousalItemCount <= Number(dataItemToShow)) {
      carousal.classList.add('no-controls');
    }

    carousal.style.width = carousalWidth + 'px';
    carousal.style.opacity = '1';
  }

  var msgVid = document.getElementsByClassName('msg-video');

  if (videoStr) {
    var lastMsgVid = msgVid[msgVid.length - 1];
    lastMsgVid.innerHTML = videoStr;
  }

  scrollBodyToBottom();
}

exports.AppendMessageInChatBody = AppendMessageInChatBody;

function scrollBodyToBottom() {
  exports.$chatBody.scrollTop = exports.$chatBody.scrollHeight;
}

function resetChatInput() {
  exports.$chatInput.value = "";
}

exports.resetChatInput = resetChatInput;

function getElementsFromHtmlStr(htmlStr) {
  var doc = new DOMParser().parseFromString(htmlStr, "text/xml");
  return doc.firstChild;
}

function createQuickReplyButtons(quick_reply) {
  var str = "";
  quick_reply.quick_replies.forEach(function (quick_reply) {
    str = str + ("<button data-payload=\"" + quick_reply.payload + "\">" + quick_reply.title + "</button>");
  });
  return str;
}

function getBotMessageTemplateForQuickReply(quick_replies, source) {
  var htmlStr = "\n                <div class=\"message-wrapper-quick-reply\">\n                    " + createQuickReplyButtons(quick_replies) + "\n                </div>\n            ";
  return htmlStr;
}

function getBotMessageTemplateForText(text, source) {
  var htmlStr = "\n                <div class=\"message-wrapper " + (source === send_api_1.ESourceType.human ? 'message-wrapper-human' : '') + "\">\n                    <div class=\"content\">" + text + "</div>\n                </div>\n            ";
  return htmlStr;
}

function getBotMessageTemplateForSessionExpiry(text, source) {
  var htmlStr = "\n                <div style=\"width: 100%; display: flex; justify-content: center; align-items: center; margin: 10px 0\" xmlns=\"http://www.w3.org/1999/xhtml\">\n                    <div class=\"div\" style=\"width: 70%; display: flex; align-items: center;\" >\n                        <hr style=\"border: 1px solid #80808030; flex-grow: 1; \"/>\n                        <div style=\"padding: 0 10px\">Session expired</div>\n                        <hr style=\"border: 1px solid #80808030; flex-grow: 1;\"/>\n                        \n                    </div>\n                </div>\n            ";
  return htmlStr;
}

function createCarousalButtons(buttons) {
  var str = "";
  buttons.forEach(function (button) {
    str = str + ("\n            <li class=\"action\" data-payload=\"" + button.payload + "\" data-type=\"" + button.type + "\">" + button.title + "</li>\n        ");
  });
  return str;
}

function createCarousalItems(mediaItem) {
  var url = mediaItem.url.split("&").join("&amp;");
  return "\n    <div class=\"item\">\n            <div class=\"bot-carousal-item shadow-theme\">\n                <div class=\"banner\" style=\"background-image: url(" + url + ")\"></div>\n                <ul style=\"list-style: none\">\n                    <li class=\"title\">\n                        " + mediaItem.title + "\n                    </li>\n                    " + createCarousalButtons(mediaItem.buttons) + "\n                </ul>\n            </div>\n        </div>\n    ";
}

function createCarousalStr(media) {
  var str = "";
  media.forEach(function (mediaItem) {
    str = str + createCarousalItems(mediaItem);
  });
  return str;
}

function getBotMessageTemplateForCarousal(media, source) {
  var carousalStr = createCarousalStr(media);
  return "\n               <div class=\"carousal-container hide-left-control\" data-step=\"0\">\n                   <div class=\"carousal-container-inner\">\n                        " + carousalStr + "\n                   </div>\n                   <div class=\"fa fa-angle-left control control-left\"></div>\n                   <div class=\"fa fa-angle-right control control-right\"></div>\n                </div>\n            ";
}

function getBotMessageTemplateForAudio(url) {
  var htmlStr = "\n                <div class=\"message-wrapper  message-wrapper-bot\">\n                    <audio class=\"msg-audio\" src=\"" + url + "\"></audio>\n                </div>\n            ";
  return htmlStr;
}

function getBotMessageTemplateForVideo(url) {
  var htmlStr = "\n                <div class=\"message-wrapper  message-wrapper-bot msg-video\">\n                    \n                </div>\n            ";
  return htmlStr;
}

function getBotMessageTemplateForImage(url) {
  var htmlStr = "\n                <div class=\"message-wrapper message-wrapper-bot msg-shadow\" \n                style=\"width: 100%; padding-top: 105%; position: relative; margin-bottom: 20px; background:#80808017; border-radius: 8px; overflow: hidden\">\n                    <img \n                    style=\"position:absolute; top: 50%; left: 0; right: 0; bottom: 0;width: 100%; transform: translateY(-50%)\" \n                    class=\"msg-img click-to-zoom\" src=\"" + url + "\" alt=\"\"/>\n                </div>\n            ";
  return htmlStr;
}
},{"./typings/send-api":"typings/send-api.ts","./utility":"utility.ts","./environment":"environment.ts"}],"ajax.ts":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

function makeGetReq(reqObj) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", reqObj.url, true);
  setHeaders(xmlHttp, reqObj.headerData);
  xmlHttp.send(null);
  return new Promise(function (resolve, reject) {
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) resolve(JSON.parse(xmlHttp.responseText));
    };
  });
}

exports.makeGetReq = makeGetReq;

function makePostReq(reqObj) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", reqObj.url, true);
  setHeaders(xmlHttp, reqObj.headerData);
  xmlHttp.send(JSON.stringify(reqObj.body));
  return new Promise(function (resolve, reject) {
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) resolve(JSON.parse(xmlHttp.responseText));
    };
  });
}

exports.makePostReq = makePostReq;

function makePutReq(reqObj) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("PUT", reqObj.url, true);
  setHeaders(xmlHttp, reqObj.headerData);
  xmlHttp.send(JSON.stringify(reqObj.body));
  return new Promise(function (resolve, reject) {
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) resolve(JSON.parse(xmlHttp.responseText));
    };
  });
}

exports.makePutReq = makePutReq;

function setHeaders(xmlHttp, headerData) {
  if (!headerData) {
    return;
  }

  headerData = __assign(__assign({}, headerData), {
    'content-type': 'application/json'
  });
  Object.keys(headerData).forEach(function (key) {
    var val = headerData[key];

    if (val) {
      xmlHttp.setRequestHeader(key, val);
    }
  });
}
},{}],"bot-details.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var environment_1 = require("./environment");

var ajax_1 = require("./ajax");

function getBotDetails() {
  var env = environment_1.environment;
  var url = "https://" + env.root + "imibot.ai/api/v1/bot/preview/?bot_unique_name=" + env.bot_unique_name + "&enterprise_unique_name=" + env.enterprise_unique_name;
  return ajax_1.makeGetReq({
    url: url
  });
}

exports.getBotDetails = getBotDetails;
},{"./environment":"environment.ts","./ajax":"ajax.ts"}],"../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"send-api.ts":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ajax_1 = require("./ajax");

var environment_1 = require("./environment");

var send_api_1 = require("./typings/send-api");

function sendMessageToBot(bot_access_token, enterprise_unique_name, humanMessage, sourceType) {
  var url = "https://" + environment_1.environment.root + "imibot.ai/api/v1/webhook/web/";
  var body = {
    "consumer": environment_1.environment.consumer,
    "type": sourceType || send_api_1.ESourceType.human,
    "msg": humanMessage,
    "platform": "web",
    "is_test": false
  };
  var headerData = {
    "bot-access-token": bot_access_token
  };
  return ajax_1.makePostReq({
    url: url,
    body: body,
    headerData: headerData
  });
}

exports.sendMessageToBot = sendMessageToBot;

function sendFeedback(body) {
  var url = "https://" + environment_1.environment.root + "imibot.ai/api/v1/message/feedback/";
  var headerData = {
    "bot-access-token": environment_1.environment.bot_access_token
  };
  return ajax_1.makePutReq({
    url: url,
    body: body,
    headerData: headerData
  });
}

exports.sendFeedback = sendFeedback;

function serializeGeneratedMessagesToPreviewMessages(generatedMessage, bot_message_id, response_language) {
  return generatedMessage.map(function (message, index) {
    var isLast = index === generatedMessage.length - 1;

    var messageData = __assign(__assign({}, message), {
      bot_message_id: bot_message_id,
      time: Date.now(),
      messageMediaType: null,
      sourceType: send_api_1.ESourceType.bot,
      isLast: isLast,
      response_language: response_language
    });

    if (Object.keys(message)[0] === 'media') {
      messageData = __assign(__assign({}, messageData), {
        messageMediaType: message.media[0] && message.media[0].type
      });
    } else if (Object.keys(message)[0] === 'quick_reply') {
      messageData = __assign(__assign({}, messageData), {
        messageMediaType: send_api_1.EBotMessageMediaType.quickReply
      });
    } else {
      messageData = __assign(__assign({}, messageData), {
        messageMediaType: send_api_1.EBotMessageMediaType.text
      });
    }

    return messageData;
  });
}

exports.serializeGeneratedMessagesToPreviewMessages = serializeGeneratedMessagesToPreviewMessages;
},{"./ajax":"ajax.ts","./environment":"environment.ts","./typings/send-api":"typings/send-api.ts"}],"main.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var dom_1 = require("./dom");

var bot_details_1 = require("./bot-details");

require("regenerator-runtime/runtime");

var send_api_1 = require("./send-api");

var environment_1 = require("./environment");

var send_api_2 = require("./typings/send-api");

var utility_1 = require("./utility");

var isModelShown = false;
var modes;

(function (modes) {
  modes["responsive"] = "responsive";
  modes["full_screen"] = "full_screen";
})(modes = exports.modes || (exports.modes = {}));

var botResponses = [];
document.addEventListener('DOMContentLoaded', function () {
  return __awaiter(this, void 0, void 0, function () {
    var botDetails, imiPreview, fullBody, phoneCasing, brandColor, $chatInput, theme, firstMessageData;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          initEnvironment();
          return [4, bot_details_1.getBotDetails()];

        case 1:
          botDetails = _a.sent();
          initEnvironment(botDetails);

          try {
            dom_1.$loader && dom_1.$loader.classList.add('d-none');
            dom_1.$chatFooter && dom_1.$chatFooter.classList.remove('d-none');
          } catch (e) {
            console.log(e);
          }

          imiPreview = new ImiPreview();
          imiPreview.setSendHumanMessageCallback(function (val) {
            humanMessageHandler(val);
          });
          imiPreview.setSendFeedback(function (val, feedback) {
            sendFeedbackHandler(val, feedback);
          });
          fullBody = true;
          phoneCasing = false;
          brandColor = utility_1.getQueryStringValue('brandcolor') || "#2b4f70";
          imiPreview.viewInit('.test-container', fullBody, phoneCasing);
          $chatInput = document.getElementById('chat-input');
          imiPreview.initAdditionalDom({
            $chatInput: $chatInput
          });
          theme = {
            brandColor: brandColor || 'green',
            showMenu: false,
            feedbackEnabled: botDetails.allow_feedback,
            showOptionsEllipsis: true
          };
          imiPreview.setOptions(botDetails, theme);
          return [4, send_api_1.sendMessageToBot(environment_1.environment.bot_access_token, environment_1.environment.enterprise_unique_name, 'hi', send_api_2.ESourceType.bot)];

        case 2:
          firstMessageData = _a.sent();
          imiPreview.appendMessageInChatBody(firstMessageData.generated_msg);
          initClientEvents();
          return [2];
      }
    });
  });
});

function initClientEvents() {
  try {
    debugger;
    dom_1.$knowMoreOverlay.addEventListener('click', function ($event) {
      dom_1.$knowMoreOverlay.style.opacity = 0;
      dom_1.$knowMoreClose.style.display = 'none';
      setTimeout(function () {
        dom_1.$knowMoreOverlay.style.display = 'none';
      }, 500);
    });
    dom_1.$knowMoreClose.addEventListener('click', function ($event) {
      dom_1.$knowMoreOverlay.style.opacity = 0;
      dom_1.$knowMoreClose.style.display = 'none';
      setTimeout(function () {
        dom_1.$knowMoreOverlay.style.display = 'none';
      }, 500);
    });
    dom_1.$envOptions.addEventListener('click', function ($event) {
      dom_1.$knowMoreOverlay.style.display = 'block';
      dom_1.$knowMoreOverlay.style.opacity = 1;
      dom_1.$knowMoreClose.style.display = 'block';
    });
    dom_1.$knowMoreContainer.addEventListener('click', function ($event) {
      $event.stopPropagation();
    });
    dom_1.$chatInput.addEventListener('keypress', function ($event) {
      if ($event.key === 'Enter') {
        var humanMessage = dom_1.$chatInput.value;

        if (!humanMessage || !humanMessage.trim()) {
          return;
        }

        dom_1.$chatInput.value = "";
        humanMessageHandler(humanMessage);
      }
    });
  } catch (e) {
    console.log(e);
  }

  try {
    dom_1.$chatInputIcon.addEventListener('click', function () {
      var humanMessage = dom_1.$chatInput.value;

      if (!humanMessage || !humanMessage.trim()) {
        return;
      }

      humanMessageHandler(humanMessage);
    });
  } catch (e) {
    console.log(e);
  }
}

function initApp(imiPreview) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      console.log('imi-chat-preview init');
      initEvents(imiPreview);
      return [2];
    });
  });
}

var ImiPreview = function () {
  function ImiPreview() {}

  ImiPreview.prototype.viewInit = function (selector, fullBody, phoneCasing) {
    if (fullBody === void 0) {
      fullBody = true;
    }

    if (phoneCasing === void 0) {
      phoneCasing = true;
    }

    var mainParent = document.querySelector(selector);
    mainParent.innerHTML = mainBodyTemplate(fullBody, phoneCasing);
  };

  ImiPreview.prototype.initAdditionalDom = function (dom) {
    dom_1.domInit(dom);
    debugger;
    initApp(this);
  };

  ImiPreview.prototype.setSendHumanMessageCallback = function (cb) {
    this._cb = cb;
  };

  ImiPreview.prototype.setSendFeedback = function (cb) {
    this._feedbackCB = cb;
  };

  ImiPreview.prototype.setOptions = function (botDetails, theme) {
    if (theme.showOptionsEllipsis === true) {
      dom_1.$envOptions.style.display = "block";
    }

    dom_1.setOptions(botDetails);
    initEnvironment(botDetails);

    if (theme.feedbackEnabled) {
      dom_1.$chatBody.classList.remove('feedbackDisabled');
    } else {
      dom_1.$chatBody.classList.add('feedbackDisabled');
    }

    this.setTheme(theme);
  };

  ImiPreview.prototype.setTheme = function (theme) {
    var root = document.documentElement;
    root.style.setProperty('--color-brand', theme.brandColor || 'red');
  };

  ImiPreview.prototype.appendMessageInChatBody = function (generated_msg, sendApiResp) {
    dom_1.AppendMessageInChatBody(generated_msg, sendApiResp);
  };

  ImiPreview.prototype.removeAllChatMessages = function () {
    dom_1.$chatBody.innerHTML = "";
  };

  return ImiPreview;
}();

window.ImiPreview = ImiPreview;

function removeModal() {
  dom_1.$phoneModel.classList.add('d-none');
  dom_1.$phoneModel.classList.remove('d-flex');
  dom_1.$chatBody.classList.remove('bg-opaque');
  dom_1.$chatFooter.classList.remove('opacity-0');
}

function initEvents(imiPreview) {
  console.log(dom_1.$chatBody);
  dom_1.$chatBody.addEventListener('click', function ($event) {
    var target = $event.target;

    if (target.classList.contains('feedback-like') || target.classList.contains('feedback-dislike')) {
      var $feedbackWrapper = findParentWithClass(target, 'msg-bubble-options-panel');
      var oldFeedback = $feedbackWrapper.getAttribute('data-feedback');

      if (oldFeedback != null) {
        return;
      }

      var $messageBubble = findParentWithClass(target, 'msg-bubble');
      var feedback = target.getAttribute('data-feedback-value');
      var txn = $messageBubble.getAttribute('data-txn');
      var bot_message_id = $messageBubble.getAttribute('data-bot_message_id');
      $feedbackWrapper.setAttribute('data-feedback', feedback);
      target.classList.add('active');

      imiPreview._feedbackCB({
        txn: txn,
        bot_message_id: bot_message_id
      }, Number(feedback));
    }

    if (target.hasAttribute('data-payload')) {
      imiPreview._cb(target.getAttribute('data-payload'));

      return;
    }

    try {
      removeModal();
    } catch (e) {
      console.log(e);
    }

    try {
      var img = $event.target;

      if (img.classList.contains('click-to-zoom')) {
        var modal_1 = document.getElementById("myModal");
        var modalImg = document.getElementById("img01");
        var captionText = document.getElementById("caption");
        modal_1.style.display = "block";
        modalImg.src = img.src;
        var span = document.getElementsByClassName("close")[0];

        span.onclick = function () {
          modal_1.style.display = "none";
        };
      }

      if (img.classList) {}
    } catch (e) {
      console.log(e);
    }

    try {
      if (target.classList.contains('control')) {
        var itemInView = 2;
        var $carasalContainer_1 = findParentWithClass(target, 'carousal-container');
        var shouldMoveRight = target.classList.contains('control-right');
        var $carasalInner = $carasalContainer_1.querySelector('.carousal-container-inner');
        var $carasalItemLength = $carasalContainer_1.querySelectorAll('.item').length;
        var dataStep = Number($carasalContainer_1.getAttribute('data-step'));
        $carasalContainer_1.classList.remove('hide-left-control');
        $carasalContainer_1.classList.remove('hide-right-control');

        if (dataStep < $carasalItemLength - itemInView && shouldMoveRight) {
          dataStep++;

          if (dataStep === $carasalItemLength - itemInView) {
            setTimeout(function () {
              $carasalContainer_1.classList.add('hide-right-control');
            }, 350);
          }
        } else if (dataStep > 0 && !shouldMoveRight) {
          dataStep--;

          if (dataStep === 0) {
            setTimeout(function () {
              $carasalContainer_1.classList.add('hide-left-control');
            }, 350);
          }
        } else {
          return;
        }

        $carasalContainer_1.setAttribute('data-step', dataStep.toString());
        var carasalContainerWidth = $carasalContainer_1.offsetWidth;
        var itemWidth = $carasalInner.querySelector('.item').offsetWidth;
        var base = itemWidth * 100 / carasalContainerWidth;
        $carasalInner.style.transform = "translateX(" + -1 * base * dataStep + "%)";
      }
    } catch (e) {
      console.log(e);
    }
  });

  try {
    dom_1.$langSubmit.addEventListener('click', function ($event) {
      var lang = dom_1.$langSelect.value;

      if (lang) {
        var splits = environment_1.environment.bot_unique_name.split("_");
        splits.pop();
        environment_1.environment.bot_unique_name = splits.join("_") + '_' + lang;
        var newUrl = utility_1.updateQueryStringParameter(location.href, "bot_unique_name", environment_1.environment.bot_unique_name);
        newUrl = utility_1.updateQueryStringParameter(newUrl, "lang", lang);
        location.href = newUrl;
        initEnvironment();
      }
    });
  } catch (e) {
    console.log(e);
  }

  try {
    dom_1.$envOptions.addEventListener('click', function () {
      return;
      var $phoneView = document.getElementsByClassName('chat-body')[0];
      var $langPanel = dom_1.$phoneModel.querySelector('.lang-panel');

      if (!isModelShown) {
        $phoneView.classList.add('bg-opaque');
        dom_1.$phoneModel.classList.add('d-flex');
        dom_1.$phoneModel.classList.remove('d-none');
        dom_1.$chatFooter.classList.add('opacity-0');
        $langPanel.classList.add('d-flex');
      } else {
        $phoneView.classList.remove('bg-opaque');
        dom_1.$phoneModel.classList.remove('d-flex');
        dom_1.$phoneModel.classList.add('d-none');
        dom_1.$chatFooter.classList.remove('opacity-0');
        $langPanel.classList.remove('d-flex');
      }

      isModelShown = !isModelShown;
    });
  } catch (e) {
    console.log(e);
  }
}

function humanMessageHandler(humanMessage, sourceType) {
  return __awaiter(this, void 0, void 0, function () {
    var botResponse, messageData;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          dom_1.AppendMessageInChatBody([{
            sourceType: sourceType || send_api_2.ESourceType.human,
            text: humanMessage,
            time: Date.now()
          }]);
          return [4, send_api_1.sendMessageToBot(environment_1.environment.bot_access_token, environment_1.environment.enterprise_unique_name, humanMessage)];

        case 1:
          botResponse = _a.sent();
          botResponses.push(botResponse);
          messageData = send_api_1.serializeGeneratedMessagesToPreviewMessages(botResponse.generated_msg);
          dom_1.AppendMessageInChatBody(messageData, botResponse);
          return [2];
      }
    });
  });
}

function getBotResponseByTxnId(txn) {
  return botResponses.find(function (res) {
    return res.transaction_id === txn;
  });
}

function sendFeedbackHandler(resp, feedback) {
  return __awaiter(this, void 0, void 0, function () {
    var parsedFeedback, res, e_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (feedback === 0) {
            parsedFeedback = 'NEGATIVE';
          } else if (feedback === 1) {
            parsedFeedback = 'POSITIVE';
          }

          res = getBotResponseByTxnId(resp.txn);
          _a.label = 1;

        case 1:
          _a.trys.push([1, 3,, 4]);

          return [4, send_api_1.sendFeedback({
            consumer_id: res.room.consumer_id,
            feedback: parsedFeedback,
            bot_message_id: res.bot_message_id
          })];

        case 2:
          _a.sent();

          return [3, 4];

        case 3:
          e_1 = _a.sent();
          return [3, 4];

        case 4:
          return [2];
      }
    });
  });
}

function initEnvironment(botDetails) {
  if (botDetails === void 0) {
    botDetails = {};
  }

  var lang = utility_1.getQueryStringValue('language') || utility_1.getQueryStringValue('lang') || botDetails.language || 'en';

  if (lang === 'ar' || lang === 'rtl') {
    dom_1.$chatContainer && dom_1.$chatContainer.classList.add('lang-rtl');

    if (dom_1.$chatInput) {
      dom_1.$chatInput.setAttribute("dir", "rtl");
      dom_1.$chatInput.placeholder = "أكتب السؤال ..";
    }
  } else {
    dom_1.$chatContainer && dom_1.$chatContainer.classList.remove('lang-rtl');

    if (dom_1.$chatInput) {
      dom_1.$chatInput.setAttribute("dir", "ltr");
      dom_1.$chatInput.placeholder = "Type a message";
    }
  }

  environment_1.environment.bot_access_token = botDetails.bot_access_token;
  environment_1.environment.logo = botDetails.logo;
  var root = utility_1.getQueryStringValue('root');

  if (root) {
    if (root === '.') {
      environment_1.environment.root = "";
    } else {
      environment_1.environment.root = root + '.';
    }
  }

  var enterprise_unique_name = botDetails.enterprise_unique_name || utility_1.getQueryStringValue('enterprise_unique_name');

  if (enterprise_unique_name) {
    environment_1.environment.enterprise_unique_name = enterprise_unique_name;
  }

  var bot_unique_name = botDetails.bot_unique_name || utility_1.getQueryStringValue('bot_unique_name');

  if (bot_unique_name) {
    environment_1.environment.bot_unique_name = bot_unique_name;
  }
}

function findParentWithClass($child, className) {
  while ($child) {
    if ($child.classList.contains(className)) {
      return $child;
    }

    $child = $child.parentElement;
  }
}

function mainBodyTemplate(fullBody, phoneCasing) {
  var str = "";

  if (fullBody) {
    str = phoneCasing ? getPhoneCoverTemplate() : getFullBodyExceptPhoneCover();
  } else {
    str = "\n    <!-- The Modal -->\n            <div id=\"myModal\" class=\"modal2\">\n                <span class=\"close\">&times;</span>\n                <img class=\"modal-content\" id=\"img01\">\n                <div id=\"caption\"></div>\n            </div>\n\n                <div class=\"imi-preview-grid-container\">\n\n                       \n                        <!--chat body starts-->\n                        <div class=\"chat-body\" id=\"body\"\n                             style=\"padding: 8px 6px; display: flex; flex-direction: column; z-index: 0\">\n\n                        </div>\n                        \n                    </div>\n    \n    \n    ";
  }

  return str;
}

function getModelTemplate() {
  return "\n        <div id=\"myModal\" class=\"modal2\">\n                <span class=\"close\">&times;</span>\n                <img class=\"modal-content\" id=\"img01\">\n                <div id=\"caption\"></div>\n            </div>\n    ";
}

function getChatBodyTemplate() {
  return "\n    <div class=\"imi-preview-grid-container\">\n\n                       \n                        <!--chat body starts-->\n                        <div class=\"chat-body\" id=\"body\"\n                             style=\"padding: 8px 6px; display: flex; flex-direction: column; z-index: 0\">\n\n                        </div>\n                        \n                    </div>\n";
}

function getFullBodyExceptPhoneCover() {
  return "\n        <div class=\"imi-preview-grid-container\">\n                        <div class=\"header\" style=\"z-index: 1\">\n                            <div class=\"bot-intro\" id=\"botIntro\">\n                                <span class=\"bot-logo\">\n                                    <img id=\"bot-logo\"\n                                    onerror=\"this.src='https://imibot-production.s3-eu-west-1.amazonaws.com/integrations/v2/default-fallback-image.png'\" \n                                    src=\"https://whizkey.ae/wisdom/static/media/rammas.42381205.gif\"\n                                         alt=\"\">\n                                </span>\n                                <div class=\"bot-details\">\n                                    <div id=\"bot-title\" ></div>\n                                    <div id=\"bot-description\">hello</div>\n                                </div>\n                                <div class=\"options\" style=\"display: none\" id=\"env-options\">\n                                    <i class=\"fa fa-ellipsis-v\"></i>\n                                </div>\n                            </div>\n                        </div>\n                        <!--chat body starts-->\n                        <div class=\"chat-body\" id=\"body\"\n                             style=\"padding: 8px 6px; display: flex; flex-direction: column; z-index: 0\">\n\n                        </div>\n                        <!--chat body ends-->\n                        <div class=\"footer\">\n                            <input placeholder=\"Type a message\" id=\"chat-input\" dir=\"ltr\" autocomplete=\"off\" autofocus\n                                   type=\"text\">\n                            <span class=\"icon\" id=\"chat-input-icon\">\n                                <span class=\"fa fa-send\"></span>\n                            </span>\n                        </div>\n                    </div>\n      <!--know more starts-->\n        <div class=\"chat-img-overlay\" id=\"chat-img-overlay\" style=\"display: none\">\n          <span class=\"fa fa-times close-chat-img-overlay\"></span>\n          <div class=\"chat-know-more-overlay\">\n            <header class=\"chat-know-more-overlay-header\">\n              <div class=\"description-top\" style=\"text-align: center\">This bot was built using</div>\n              <div><img src=\"https://staging.imibot.ai/static/assets/img/IMI_logo.png\" alt=\"\"></div>\n              <strong class=\"description-bottom\">The enterprise bot building platform to automate conversations</strong>\n            </header>\n    \n            <div class=\"chat-know-more-overlay-item\">\n              <img src=\"https://staging.imibot.ai/static/assets/img/chat/bot.svg\" alt=\"\">\n              <div>Contextualise bot interactions with artificial intelligence</div>\n            </div>\n            <div class=\"chat-know-more-overlay-item\">\n              <img src=\"https://staging.imibot.ai/static/assets/img/chat/group-5.svg\" alt=\"\">\n              <div>Provide seamless omnichannel experience</div>\n            </div>\n            <div class=\"chat-know-more-overlay-item\">\n              <img src=\"https://staging.imibot.ai/static/assets/img/chat/browser.svg\" alt=\"\">\n              <div>Orchestrate individual bots using a controller</div>\n            </div>\n            <div class=\"chat-know-more-overlay-item\">\n              <img src=\"https://staging.imibot.ai/static/assets/img/chat/group-2.svg\" alt=\"\">\n              <div>Integrate various services within your flow to help user</div>\n            </div>\n    \n            <a href=\"https://imimobile.com/products/ai-automation\" target=\"_blank\">\n            <button  class=\"imi-button-primary\" style=\"width: 100px;background: #00abd3; border: none; color: white\" mat-flat-button color=\"primary\"> Know more</button></a>\n    \n          </div>\n        </div>\n    ";
}

function getPhoneCoverTemplate() {
  return "\n    <div class=\"page1\">\n    <div class=\"page__content\">\n        <div class=\"phone\">\n            <div class=\"phone__body\">\n                <div class=\"phone__view\">\n                    <div id=\"phone-modal\" class=\"modal1\" style=\"\">\n                        <i class=\"fa fa-times\" id=\"close-modal1\"></i>\n                        <div class=\"lang-panel\">\n                            <h1>Select language</h1>\n                            <div>\n                                <select id=\"lang-select\">\n                                    <option value=\"en\">English</option>\n                                    <option value=\"ar\" style=\"direction: rtl;\">\u0639\u0631\u0628\u064A</option>\n                                </select>\n                            </div>\n                            <button class=\"imi-button-primary\" id=\"lang-submit\">Submit</button>\n                        </div>\n                    </div>\n                    <div class=\"imi-preview-grid-container\">\n\n                        <div class=\"header\" style=\"z-index: 1\">\n                            <div class=\"basel-bg\"></div>\n                            <div class=\"bot-intro\" id=\"botIntro\">\n                                <span class=\"bot-logo\">\n                                    <img id=\"bot-logo\"\n                                    onerror=\"this.src='https://imibot-production.s3-eu-west-1.amazonaws.com/integrations/v2/default-fallback-image.png'\" \n                                       alt=\"\">\n                                </span>\n                                <div class=\"bot-details\">\n                                    <div id=\"bot-title\" ></div>\n                                </div>\n                                <div class=\"options\" id=\"env-options\">\n                                    <i class=\"fa fa-ellipsis-v\"></i>\n                                </div>\n                            </div>\n                        </div>\n                        <!--chat body starts-->\n                        <div class=\"chat-body\" id=\"body\"\n                             style=\"padding: 8px 6px; display: flex; flex-direction: column; z-index: 0\">\n\n                        </div>\n                        <!--chat body ends-->\n                        <div class=\"footer\">\n                            <input placeholder=\"Type a message\" id=\"chat-input\" dir=\"ltr\" autocomplete=\"off\" autofocus\n                                   type=\"text\">\n                            <span class=\"icon\" id=\"chat-input-icon\">\n                                <span class=\"fa fa-send\"></span>\n                            </span>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"phone__notch\">\n                    <div class=\"phone__speaker\"></div>\n                    <div class=\"phone__camera\"></div>\n                </div>\n            </div>\n            <div class=\"phone__btn\">\n                <button class=\"phone__btn--power\"></button>\n                <div class=\"phone__btn--volume\">\n                    <button class=\"phone__btn--volume-up\"></button>\n                    <button class=\"phone__btn--volume-down\"></button>\n                </div>\n                <button class=\"phone__btn--mute\"></button>\n            </div>\n        </div>\n    </div>\n</div>\n    ";
}

function getHeaderTemplate() {
  return "\n    <div class=\"header\" style=\"z-index: 1\">\n                            <div class=\"basel-bg\"></div>\n                            <div class=\"bot-intro\" id=\"botIntro\">\n                                <span class=\"bot-logo\">\n                                    <img id=\"bot-logo\" src=\"https://whizkey.ae/wisdom/static/media/rammas.42381205.gif\"\n                                         alt=\"\">\n                                </span>\n                                <div class=\"bot-details\">\n                                    <div id=\"bot-title\" ></div>\n                                </div>\n                                <div class=\"options\" id=\"env-options\">\n                                    <i class=\"fa fa-ellipsis-v\"></i>\n                                </div>\n                            </div>\n                        </div>\n    ";
}

function getFooterTemplate() {
  return "\n    <div class=\"footer\">\n                            <input placeholder=\"Type a message\" id=\"chat-input\" dir=\"ltr\" autocomplete=\"off\" autofocus\n                                   type=\"text\">\n                            <span class=\"icon\" id=\"chat-input-icon\">\n                                <span class=\"fa fa-send\"></span>\n                            </span>\n                        </div>";
}
},{"./dom":"dom.ts","./bot-details":"bot-details.ts","regenerator-runtime/runtime":"../node_modules/regenerator-runtime/runtime.js","./send-api":"send-api.ts","./environment":"environment.ts","./typings/send-api":"typings/send-api.ts","./utility":"utility.ts"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57868" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","main.ts"], null)
//# sourceMappingURL=/main.c39d6dcf.js.map