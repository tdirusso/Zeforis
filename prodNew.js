"use strict";

var _this = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

var configInWidget = {
  env: 'English',
  script: 'in-widget',
  debug: false,
  threshold: 3,
  intentScoreThreshold: 0.6,
  articleCount: 0,
  intentScoreCount: 0,
  articleCountTimeout: 3000,
  isNewHire: false,
  liveAgentRefer: 2036500301,
  liveAgentReferPreText: 2036501311,
  alertFlags: {
    vietnamese: 'isVietnamese',
    MsBrowser: 'isMSBrowser',
    languageIsNotAvailable: 'languageIsNotAvailable'
  },
  postFollowUpTimer: 7000,
  // 7 seconds after the last question.
  excludedArticles: ["0"],
  closeChatSurveyTimer: 60000 * 5,
  // 5 minutes after.
  deflectArticleId: 1357300191,
  noHelpulnessLabelId: 2437864621,
  helpfulArticleId: 2437869991,
  helpfulTimeoutTrigger: 30000,
  // 30 seconds after the last question.
  helpfulArticleTriggerOn: false,
  helpfulArticleTimeout: false,
  queueSize: 10,
  inQueue: false,
  queueMsgDelay: 3000,
  appointyLoc: 'https://jnjits-booking.appointy.com/jj3l',
  highVolumeMsg: '<p>We are currently experiencing a high volume of users</p>',
  scheduleQuestionMsg: '<p>If you would like someone to call you back at a later time, please click on the <strong>Schedule a Call Back</strong> button below to select a time that works best for you. Otherwise, click on <strong>Stay in Queue</strong> to wait to be connected to an agent.</p>',
  scheduleButtonText: 'Schedule a Call Back',
  confirmScheduleMsg: '<p>Are you sure you want to schedule a call back? Please click the “<strong>I confirm- I want to schedule a call back</strong>” button below. Once you click on this button, you will be taken to a new page to schedule an appointment and this chat window will close immediately. Thank you!</p>',
  confirmScheduleButtonText: 'I confirm - I want to schedule a call back',
  waitInQueueMsg: '<p>The next available agent will assist you as soon as possible based on your spot in queue below. Please hold for further assistance</p>',
  waitInQueueButtonText: 'Stay in Queue',
  confirmWaitInQueueButtonText: 'I want to wait in queue',
  enterpriseBotAlternativeMessage: 2326112421
};
window.boldObject = window.boldObject || {};
window.boldObject.fn = window.boldObject.fn || {};

window.boldObject.fn.hideInputText = function () {
  _newArrowCheck(this, _this);

  var widgetInput = document.querySelector('.conversation-ui__query-field .query-field');

  if (widgetInput) {
    widgetInput.style.visibility = 'hidden';
  }
}.bind(void 0);

window.boldObject.fn.showInputText = function () {
  _newArrowCheck(this, _this);

  var widgetInput = document.querySelector('.conversation-ui__query-field .query-field');

  if (widgetInput) {
    widgetInput.style.visibility = 'visible';
  }
}.bind(void 0); // on the "was this answer helpful" this variable is to manage the close bot in 30 seconds


window.closeSessionOnTimeout = false;
var languageNameMap = {
  id: 'Indonesian',
  de: 'German',
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  'fr-ca': 'French - Canada',
  it: 'Italian',
  hu: 'Hungarian',
  nl: 'Dutch',
  pl: 'Polish ',
  pt: 'Portuguese',
  sv: 'Swedish',
  vi: 'Vietnamese',
  tr: 'Turkish',
  cs: 'Czech ',
  el: 'Greek',
  ru: 'Russian',
  iw: 'Hebrew ',
  'ar-eg': 'Arabic - Egypt',
  th: 'Thai',
  zh: 'Chinese',
  ja: 'Japanese',
  'ko-kr': 'Korean - South Korea'
};
var unavailableLanguages = ['ms', 'uk-ua', 'zh-tw'];

try {
  var openBold360Widget = function openBold360Widget(type) {
    var accountId = boldObject.account.account;
    var websiteId = boldObject.account.website;

    switch (type) {
      case 'JP':
        buttonId = boldObject.account.buttonJP;
        break;

      case 'ZH':
        buttonId = boldObject.account.buttonZH;
        break;

      default:
        buttonId = boldObject.account.button;
        break;
    }

    window._bcvma = window._bcvma || [];

    _bcvma.push(['setAccountID', accountId]);

    _bcvma.push(['setParameter', 'WebsiteID', websiteId]);

    _bcvma.push(['addFloat', {
      type: 'chat',
      id: buttonId
    }]);

    _bcvma.push(['pageViewed', document.location.href, document.referrer]);

    var bcLoad = function bcLoad() {
      if (window.bcLoaded) return;
      window.bcLoaded = true;
      var vms = document.createElement('script');
      vms.type = 'text/javascript';
      vms.async = true; // ---- Pablo Rovelo: Add condition for Preview Account ----

      if (boldObject.isPreview === 'true') {
        vms.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'vmss-preview.boldchat.com/aid/' + boldObject.account.account + '/bc.vms4/vms.js';
      } else {
        vms.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'vmss.boldchat.com/aid/' + boldObject.account.account + '/bc.vms4/vms.js';
      }

      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(vms, s);
    };

    if (window.pageViewer && pageViewer.load) pageViewer.load(); else if (document.readyState == 'complete') bcLoad(); else if (window.addEventListener) window.addEventListener('load', bcLoad, false); else window.attachEvent('onload', bcLoad);
  }; // ************************END TODO*********************************************


  // Triggers follow up article based on the ticket type
  var triggerFollowUpMessage = function triggerFollowUpMessage() {
    clearTimeout(followUpTimer);
    var statusEntity = getEntity('STATUS');

    if (statusEntity) {
      // If there is already an incident selected
      if (statusEntity.value === 'POST_FOLLOWUP_INC' && !nanorep.floatingWidget.isLiveChatActive()) {
        nanorep.floatingWidget.expand();
        nanorep.floatingWidget.api.conversation.sendStatement({
          statement: 'post followup ticket'
        });
      } // If there is already an incident selected


      if (statusEntity.value === 'POST_FOLLOWUP_RITM' && !nanorep.floatingWidget.isLiveChatActive()) {
        nanorep.floatingWidget.expand();
        nanorep.floatingWidget.api.conversation.sendStatement({
          statement: 'post followup ticket'
        });
      }
    }
  }; // Triggers end session if the user has asked at least 2 questions and it's not a live chat


  var triggerEndSession = function triggerEndSession() {
    if (configInWidget.debug) {
      console.log('end session triggered');
    }

    if (!nanorep.floatingWidget.isLiveChatActive() && queryCount >= 2) {
      queryCount = 0;
      window.clearCookiesAndSession();
    }
  }; // Returns a specific entity in memory


  var getEntity = function getEntity(entityName) {
    var entities = getEntities();

    for (var key in entities) {
      var entity = entities[key];

      if (entity.kind === entityName) {
        if (configInWidget.debug) console.log("Entity: ".concat(entity.kind, " / ").concat(entity.value));
        return entity;
      }
    }
  }; // Gets all the Entities from memory


  var getEntities = function getEntities() {
    var conversationSession = {
      entries: []
    };
    var index;
    var entities = {};

    for (index = 0; index < nanorep.floatingWidget.$children.length; index++) {
      var child = nanorep.floatingWidget.$children[index]; // If there is a conversationSession property on the child, we
      // found the one with the entity data on it

      if (child.conversationSession) {
        conversationSession = child.conversationSession;
        break;
      }
    } // Loop through backwords to find the most recent entities


    for (index = conversationSession.entries.length - 1; index; index--) {
      var entry = conversationSession.entries[index];

      if (entry.entities) {
        entities = entry.entities;
        break;
      }
    }

    if (configInWidget.debug) {
      console.log(entities);
    }

    return entities;
  }; // Retrieves the intent score and article id from the lamba function


  var getData = function getData(query) {
    var _this2 = this;

    var url = "https://5ib7wlqakd.execute-api.us-east-1.amazonaws.com/".concat(configInWidget.env, "/analysis?query=").concat(query);
    return new Promise(function (resolve) {
      var _this3 = this;

      _newArrowCheck(this, _this2);

      var xmlHttp = new XMLHttpRequest();

      xmlHttp.onreadystatechange = function () {
        _newArrowCheck(this, _this3);

        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
          resolve(xmlHttp.responseText);
        }
      }.bind(this);

      xmlHttp.open('GET', url, true);
      xmlHttp.send(null);
    }.bind(this));
  }; // Retrieves the list of articles with a specific label


  var getArticlesLabelsList = function getArticlesLabelsList() {
    var _this4 = this;

    var labelId = configInWidget.noHelpulnessLabelId;
    var kb = configInWidget.env;
    var path = 'https://73otkec07f.execute-api.us-east-1.amazonaws.com/dev/searchbylabelid';
    var url = "".concat(path, "?kb=").concat(kb, "&labelId=").concat(labelId);
    return new Promise(function (resolve) {
      var _this5 = this;

      _newArrowCheck(this, _this4);

      var xmlHttp = new XMLHttpRequest();

      xmlHttp.onreadystatechange = function () {
        _newArrowCheck(this, _this5);

        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
          resolve(xmlHttp.responseText);
        }
      }.bind(this);

      xmlHttp.open('GET', url, true);
      xmlHttp.send(null);
    }.bind(this));
  }; // checks the intent score value in order to validate useful information


  var analyzeIntentScore = function analyzeIntentScore(intentScore) {
    // an intentScore above 0.5 means the response data was not useful
    if (intentScore > configInWidget.intentScoreThreshold) {
      configInWidget.intentScoreCount++;
    } else {
      configInWidget.intentScoreCount = 0;
    }

    if (configInWidget.intentScoreCount > configInWidget.threshold) {
      showDeflectionArticle();
    }
  }; // it starts the deflect process by calling the apiCall function
  // it also disables the input text box for the configInWidget.articleCountTimeout
  // param, or until a bot response comes into the chat


  var getAnalysis = function getAnalysis(query) {
    var _this6 = this;

    // despite the query type and length, the input should always be disabled for all user queries
    disableTextBox(true);
    clearTimeout(resetCallCount);
    resetCallCount = setTimeout(function () {
      _newArrowCheck(this, _this6);

      return disableTextBox(false);
    }.bind(this), configInWidget.articleCountTimeout); // deflection analysis should be triggered when there are 3 or more words

    if (query.split(' ').length >= 3) {
      apiCall(query);
    }
  }; // it checks for the article id in order to validate same article call


  var handleResponse = function handleResponse(response) {
    var _this7 = this;

    var data = response.data && response.data.answers; // if any article with a score above 0.5 it's considered a hit

    var intentScore = data.reduce(function (previous, current) {
      _newArrowCheck(this, _this7);

      return previous.score < current.score ? previous : current;
    }.bind(this), {
      score: 1
    }); // if the id is the same as on the previous call, it's the same article

    if (intentScore.id === articleId) {
      configInWidget.articleCount++;
    } else {
      articleId = intentScore.id;
      configInWidget.articleCount = 0;
    }

    if (configInWidget.articleCount >= configInWidget.threshold) {
      showDeflectionArticle();
    } else {
      var score = intentScore && intentScore.score;
      analyzeIntentScore(score);
    } // enable input text box


    setTimeout(function () {
      _newArrowCheck(this, _this7);

      return disableTextBox(false);
    }.bind(this), 500);
  }; // calls the getData function as a promise


  var apiCall = function apiCall(query) {
    var _this8 = this;

    getData(query).then(function (res) {
      _newArrowCheck(this, _this8);

      return handleResponse(JSON.parse(res));
    }.bind(this))["catch"](function () {
      _newArrowCheck(this, _this8);

      return disableTextBox(false);
    }.bind(this));
  }; // toggles the textbox based on the disable argument


  var disableTextBox = function disableTextBox(disable) {
    if (disable) {
      widgetInput.disabled = true;
      textBox.style.background = '#eeeeee';
    } else {
      widgetInput.disabled = false;
      textBox.style.background = '';
      widgetInput.focus();
    }
  }; // set all the deflection counter values to the initial state


  var resetDeflectCounters = function resetDeflectCounters() {
    articleId = null;
    configInWidget.articleCount = 0;
    configInWidget.intentScoreCount = 0;
  }; // shows the 'are you satisfied' article


  var showDeflectionArticle = function showDeflectionArticle() {
    resetDeflectCounters();
    nanorep.floatingWidget.showArticle(configInWidget.deflectArticleId);
  }; // Appointy STARTS HERE


  // loggable function to add message to chat window.
  var addMessage = function addMessage(obj) {
    if (configInWidget.debug) console.log('Adding message to chat window');
    if (configInWidget.debug) console.log(obj);
    setTimeout(function () {
      nanorep.floatingWidget.$refs.core.conversationSession.addEntry(obj);
    }, 1000);
  }; // Close the chat window


  var confirmSchedule = function confirmSchedule() {
    if (configInWidget.debug) console.log('confirmSchedule() called');
    window.open(configInWidget.appointyLoc);
    closeLiveChat();
  }; // Appointy End
  // Geofluent STARTS HERE


  var PSalertMessage = function PSalertMessage(alertType) {
    var _this14 = this;

    var selectedLang = null;
    var messageContent = null; // normalize global window.g_lang codes

    selectedLang = window.g_lang;

    if (window.g_lang === 'vi') {
      selectedLang = 'vi-vn';
    }

    var PSWarningMessage = document.createElement('div');
    PSWarningMessage.className = 'widget-alert-message'; // depending on the alertType flag is the content of the message

    switch (alertType) {
      case configInWidget.alertFlags.vietnamese:
        PSWarningMessage.id = 'PSAlertIsVietnamese';
        messageContent = '<p>Daha iyi çeviri için lütfen bilgisayarınızdaki “UNIKEY” yazılımını kullanın.</p>';
        break;

      case configInWidget.alertFlags.MsBrowser:
        PSWarningMessage.id = 'PSAlertIsMSBrowser';
        messageContent = langMap[selectedLang].MSBrowserAlertMessage;
        break;

      case configInWidget.alertFlags.languageIsNotAvailable:
        PSWarningMessage.id = 'PSAlertLanguageIsNotAvailable';
        messageContent = '<p>Sorry, your previous selected chat language is not supported in the Iris Chat platform. You have been defaulted to English.</p>';
        break;
    }

    PSWarningMessage.innerHTML = messageContent;
    var PSWarningMessageInterval = setInterval(function () {
      var _this15 = this;

      _newArrowCheck(this, _this14);

      var chatFirstEntry = document.querySelector('.conversation-log__entry');

      if (chatFirstEntry) {
        clearInterval(PSWarningMessageInterval); // inser new alert message

        chatFirstEntry.parentNode.insertBefore(PSWarningMessage, chatFirstEntry); // auto delete the new alert messages after 10 secconds

        setTimeout(function () {
          _newArrowCheck(this, _this15);

          removeAlertMessage(configInWidget.alertFlags.vietnamese);
          removeAlertMessage(configInWidget.alertFlags.MsBrowser);
          removeAlertMessage(configInWidget.alertFlags.languageIsNotAvailable);
        }.bind(this), 10000);
      }
    }.bind(this), 500);
  }; // removes a dom element searching by id with a fade out effect


  var fadeOutAndDelete = function fadeOutAndDelete(elementId) {
    var _this16 = this;

    var alertNotification = document.querySelector('#' + elementId);

    if (alertNotification) {
      // transition effect
      alertNotification.style.transition = 'opacity 1s';
      alertNotification.style.opacity = '0'; // remove from the dom

      setTimeout(function () {
        _newArrowCheck(this, _this16);

        alertNotification.remove();
      }.bind(this), 1500);
    }
  };

  var removeAlertMessage = function removeAlertMessage(alertType) {
    // remove alert messages
    switch (alertType) {
      case configInWidget.alertFlags.vietnamese:
        fadeOutAndDelete('PSAlertIsVietnamese');
        break;

      case configInWidget.alertFlags.MsBrowser:
        fadeOutAndDelete('PSAlertIsMSBrowser');
        break;

      case configInWidget.alertFlags.languageIsNotAvailable:
        fadeOutAndDelete('PSAlertLanguageIsNotAvailable');
        break;
    }
  }; // the auto-translation is not being applied to article feedback options if the
  // visitor’s ServiceNow language is set to a different language than the one
  // they have selected for the chat (from the Language Selector).


  // Geofluent ENDS HERE
  // adds a Coronavirus COVID-19 hyperlink to the widget footer after the user text input
  var addCovid19Link = function addCovid19Link() {
    // Create div element.
    var covid19 = document.createElement('div');
    covid19.className = 'covid19';
    covid19.style.position = 'relative';
    covid19.style.backgroundColor = '#fff';
    covid19.style.height = '30px';
    covid19.style.borderTop = '1px solid #dfdfdf';
    covid19.style.zIndex = '2';
    covid19.style.textAlign = 'center';
    covid19.style.lineHeight = '30px';

    if (!nanorep.floatingWidget.expanded) {
      covid19.style.display = 'none';
    } // Create anchor element.


    var a = document.createElement('a');
    covid19.appendChild(a); // Create the text node for anchor element.

    var link = document.createTextNode('J&J Responds - Coronavirus Information'); // Append the text node to anchor element.

    a.appendChild(link); // Set the title.

    a.title = 'J&J Responds - Coronavirus Information'; // Set the href property.

    a.href = 'https://jnj.sharepoint.com/teams/JJResponds/coronavirus/';
    a.target = '_blank';
    a.style.position = 'absolute !important';
    a.style.top = '6px !important';
    a.style.right = '0 !important';
    a.style.left = '0 !important';
    a.style.color = '#445f9d !important';
    a.style.textDecoration = 'none !important';
    a.style.fontWeight = 'bold !important';
    a.style.fontFamily = 'sans-serif !important';
    var wrapper = document.querySelector('.widget-floating__wrapper');
    wrapper.parentNode.insertBefore(covid19, wrapper.nextSibling);
  };

  var getChatId = function getChatId() {
    var _this17 = this;

    return _bcvm.getCookieAsync('_bc-curl').then(function (value) {
      _newArrowCheck(this, _this17);

      if (!value && !value.substr(0, value.indexOf('T'))) {
        return false;
      }

      return value.substr(0, value.indexOf('T'));
    }.bind(this));
  };

  var createStarsSection = function createStarsSection(name, label, controlledDropdownId) {
    var starsRateTemplate = "<div class=\"bc-label-and-star\" onclick=\"window.setRating(event, '".concat(controlledDropdownId, "')\">\n      <label class=\"bc-star-label\" id=\"bc-rating-1d080-custom\" nr=\"\">").concat(label, "</label>\n      <div class=\"bc-starrating-component\" role=\"group\" aria-labelledby=\"bc-rating-1d080-custom\">\n        <input type=\"hidden\" id=\"bc-input-1a47e-custom\">\n        <input id=\"bc-star-").concat(name, "5-custom\" class=\"bc-star-val\" type=\"radio\" name=\"bc-star-").concat(name, "-custom\" value=\"5\" aria-label=\"5\">\n        <label for=\"bc-star-").concat(name, "5-custom\" class=\"bc-star\" title=\"5\"></label>\n        <input id=\"bc-star-").concat(name, "4-custom\" class=\"bc-star-val\" type=\"radio\" name=\"bc-star-").concat(name, "-custom\" value=\"4\" aria-label=\"4\">\n        <label for=\"bc-star-").concat(name, "4-custom\" class=\"bc-star\" title=\"4\"></label>\n        <input id=\"bc-star-").concat(name, "3-custom\" class=\"bc-star-val\" type=\"radio\" name=\"bc-star-").concat(name, "-custom\" value=\"3\" aria-label=\"3\">\n        <label for=\"bc-star-").concat(name, "3-custom\" class=\"bc-star\" title=\"3\"></label>\n        <input id=\"bc-star-").concat(name, "2-custom\" class=\"bc-star-val\" type=\"radio\" name=\"bc-star-").concat(name, "-custom\" value=\"2\" aria-label=\"2\">\n        <label for=\"bc-star-").concat(name, "2-custom\" class=\"bc-star\" title=\"2\"></label>\n        <input id=\"bc-star-").concat(name, "1-custom\" class=\"bc-star-val\" type=\"radio\" name=\"bc-star-").concat(name, "-custom\" value=\"1\" aria-label=\"1\">\n        <label for=\"bc-star-").concat(name, "1-custom\" class=\"bc-star\" title=\"1\"></label>\n      </div>\n    </div>");
    var starsRateComponent = document.createElement('div');
    starsRateComponent.className = 'bc-input-container';
    starsRateComponent.innerHTML = starsRateTemplate;
    return starsRateComponent;
  }; // set the rating for the clicked element


  // show comment section if translation rating is under 3
  var toggleTranslationCommentsSection = function toggleTranslationCommentsSection(event, translationCommentsSection) {
    var rating = parseInt(event.target.title, 10);

    if (isNaN(rating)) {
      return false;
    }

    if (rating < 3) {
      translationCommentsSection.style.display = 'block';
    } else {
      translationCommentsSection.style.display = 'none';
      translationCommentsSection.querySelector('textarea').value = '';
    }
  };

  var customizePostChatForm = function customizePostChatForm() {
    var _this27 = this;

    var isEnglishLanguage = !window.g_lang || window.g_lang.toLowerCase() === 'en';
    var languageDictionary = langMap[window.g_lang] || langMap['en']; // the widget can have multiple forms at the same time, filter out the invalid forms

    var postChatForm = Array.prototype.slice.call(document.querySelectorAll('.bc-form.boldchat-form')).filter(function (form) {
      _newArrowCheck(this, _this27);

      return form.length > 3;
    }.bind(this)).pop();
    var formInputs = postChatForm.querySelectorAll('.bc-input-container');
    var introSection = formInputs[0];
    var emailInputSection = formInputs[1];
    var responsivenessStarsSection = formInputs[2];
    var profesionalismStarsSection = formInputs[3];
    var virtualAgentStarsSection = formInputs[4]; // knowledge is used for virtual agent

    var overallStarsSection = formInputs[5];
    var translationDropdownSection = formInputs[6]; // custom dropdown defined in the window (called virtual agent)

    var translationCommentsSection = formInputs[7]; // used for translation input

    var commentsInputSection = formInputs[8];
    var submitButtonSection = formInputs[9]; // reset isLangSupported value because sometimes it contained an incorrect value

    isLangSupported = allowedLangs.indexOf(window.g_lang) > -1;
    virtualAgentStarsSection.style.display = isEnglishLanguage || isLangSupported ? 'block' : 'none';
    virtualAgentStarsSection.querySelector('.bc-star-label').innerText = languageDictionary.virtualAgent; // translationDropdownSection is controlled by the translation stars section and is always hidden

    translationDropdownSection.style.display = 'none'; // Visibility of this section will be toggled based on the amount of stars selected on the translation stars section

    translationCommentsSection.style.display = 'none'; // translation stars section and translation comments only applies for non english languages

    if (!isEnglishLanguage) {
      translationDropdownSection.id = 'postChatTranslationDropdown'; // Update labels based on the language

      translationDropdownSection.querySelector('.bc-input-label').innerText = languageDictionary.translation;
      translationCommentsSection.querySelector('.bc-input-label').innerText = languageDictionary.tranlationComments;
      var translationStarsSection = createStarsSection('translation', languageDictionary.translation, translationDropdownSection.id);
      postChatForm.insertBefore(translationStarsSection, translationDropdownSection);
      translationStarsSection.addEventListener('click', function (event) {
        _newArrowCheck(this, _this27);

        toggleTranslationCommentsSection(event, translationCommentsSection);
      }.bind(this));
    }
  };

  if (configInWidget.debug) {
    console.log(configInWidget);
  }

  var toBoolean = function toBoolean(value) {
    _newArrowCheck(this, _this);

    if (value === 'false') {
      return false;
    }

    return !!value;
  }.bind(void 0); // mobile flags


  var isMobile = toBoolean(boldObject.isMobile);
  var isWeb = !isMobile; // Hotfix: Force the widget to fullscreen

  var forceFullScreenInterval;

  if (isMobile) {
    forceFullScreenInterval = setInterval(function () {
      _newArrowCheck(this, _this);

      var widgetContainer = document.querySelector('.widget-floating--state-6');

      if (!widgetContainer) {
        return;
      }

      widgetContainer.style.bottom = '0px';
      widgetContainer.style.right = '0px';
      widgetContainer.style.left = '0px';
      var wrapperContainer = document.querySelector('.widget-floating__wrapper');
      wrapperContainer.style.height = document.documentElement.clientHeight + 'px';
      wrapperContainer.style.width = document.documentElement.clientWidth + 'px';
      var uiContent = document.querySelector('.conversation-ui__content');
      uiContent.parentNode.style.height = document.documentElement.clientHeight + 100 + 'px'; // document.querySelector('.conversation-ui__toolbar--dialog-active') checks if there is a notification prompt active

      if (document.querySelector('.conversation-ui__toolbar') && !document.querySelector('.conversation-ui__toolbar--dialog-active')) {
        uiContent.style.height = document.documentElement.clientHeight - 141 + 'px';
      } else {
        uiContent.style.height = document.documentElement.clientHeight - 100 + 'px';
      }

      var returnToChatButton = document.querySelector('.conversation-article__close');

      if (returnToChatButton) {
        document.querySelector('.conversation-article__body').style.height = document.documentElement.clientHeight - 100 + 'px';
      }
    }.bind(void 0), 100);
  } // if diffDays is lower than 120 days, is a new hired


  if (boldObject.context && boldObject.context.createdOn) {
    var hiredDate = new Date(boldObject.context.createdOn);
    var todayDate = new Date();
    var diffTime = Math.abs(hiredDate - todayDate);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // if diffDays is lower than 120 days, is a new hired

    if (diffDays < 60) {
      configInWidget.isNewHire = true;
    }
  }

  var escalationButtonText = 'Chat with a Live Agent';
  var escalationButtonText2 = 'Chat with an Agent about this ticket';

  var queueMessages = {
    highVolume: {
      type: 2,
      html: configInWidget.highVolumeMsg
    },
    scheduleQuestion: {
      type: 2,
      html: configInWidget.scheduleQuestionMsg,
      quickOptions: [{
        kind: 'other',
        postback: '{}',
        text: configInWidget.scheduleButtonText,
        type: 'postback',
        customFunction: function customFunction() {
          addMessage(queueMessages.confirmSchedule);
        }
      }, {
        kind: 'other',
        postback: '{}',
        text: configInWidget.waitInQueueButtonText,
        type: 'postback',
        customFunction: function customFunction() {
          addMessage(queueMessages.wait);
        }
      }]
    },
    confirmSchedule: {
      type: 2,
      html: configInWidget.confirmScheduleMsg,
      quickOptions: [{
        kind: 'other',
        postback: '{}',
        text: configInWidget.confirmScheduleButtonText,
        type: 'postback',
        customFunction: function customFunction() {
          confirmSchedule();
        }
      }, {
        kind: 'other',
        postback: '{}',
        text: configInWidget.confirmWaitInQueueButtonText,
        type: 'postback',
        customFunction: function customFunction() {
          addMessage(queueMessages.wait);
        }
      }]
    },
    wait: {
      type: 2,
      html: configInWidget.waitInQueueMsg
    }
  };
  var followUpTimer;
  var surveyTimer;
  var isLiveAgent = false;
  var queryCount = 0; // deflect the undeflectable

  var widgetInput = document.querySelector('.query-field__input');
  var textBox = document.querySelector('.query-field__inner');
  var resetCallCount = null;
  var articleId = null; // geofluent

  var isLangSupported = null;
  var langMap = {
    en: {
      BCCode: null,
      virtualAgent: 'Virtual Agent (Chatbot):',
      translation: 'Translation:',
      tranlationComments: 'Please let us know how we can improve the translation:',
      preferedLang: 'Preferred Chat Language',
      MSBrowserAlertMessage: '<p>For a better chat experience please chat in Chrome. You can click here to open a chat in <a href="chromerun://jnjprod.service-now.com/iris?id=irisgl_home&livechat=1&jnjsource=ietransfer">Chrome</a></p>'
    },
    es: {
      BCCode: 'es-ES',
      virtualAgent: 'Agente Virtual (Chatbot):',
      translation: 'Traducción:',
      tranlationComments: 'Por favor, háganos saber cómo podemos mejorar la traducción:',
      preferedLang: 'Idioma de Chat Preferido',
      MSBrowserAlertMessage: '<p>Para una mejor experiencia de chat, chatee en Chrome. Puede hacer clic aquí para abrir un chat en <a href="chromerun://jnjprod.service-now.com/iris?id=irisgl_home&livechat=1&jnjsource=ietransfer"> Chrome</a></p>'
    },
    pt: {
      BCCode: 'pt-BR',
      virtualAgent: 'Agente Virtual (Chatbot):',
      translation: 'Tradução:',
      tranlationComments: 'Por favor, deixe-nos saber como podemos melhorar a tradução:',
      preferedLang: 'Idioma de Bate-papo Preferido',
      MSBrowserAlertMessage: '<p> Para uma melhor experiência de bate-papo, converse no Chrome. Você pode clicar aqui para abrir um bate-papo no <a href="chromerun://jnjprod.service-now.com/iris?id=irisgl_home&livechat=1&jnjsource=ietransfer"> Chrome </a> </p>'
    },
    id: {
      BCCode: 'in-ID',
      virtualAgent: 'Agen Virtual (Chatbot):',
      translation: 'terjemahan:',
      tranlationComments: 'Tolong beri tahu kami bagaimana kami dapat meningkatkan terjemahan:',
      preferedLang: 'Bahasa Obrolan Yang Disukai',
      MSBrowserAlertMessage: '<p> Untuk pengalaman obrolan yang lebih baik, silakan mengobrol di Chrome. Anda dapat mengklik di sini untuk membuka obrolan di <a href="chromerun://jnjprod.service-now.com/iris?id=irisgl_home&livechat=1&jnjsource=ietransfer"> Chrome </a> </p>'
    },
    de: {
      BCCode: 'de-DE',
      virtualAgent: 'Virtueller Agent (Chatbot):',
      translation: 'Übersetzung:',
      tranlationComments: 'Bitte lassen Sie uns wissen, wie wir die Übersetzung verbessern können:',
      preferedLang: 'Foretrukket Chatsprog',
      MSBrowserAlertMessage: '<p>Für eine bessere Chat-Erfahrung chatten Sie bitte in Chrome. Klicken Sie hier, um einen Chat in <a href="chromerun://jnjprod.service-now.com/iris?id=irisgl_home&livechat=1&jnjsource=ietransfer">Chrome</a> zu öffnen</p>'
    },
    it: {
      BCCode: 'it-IT',
      virtualAgent: 'Agente virtuale (Chatbot):',
      translation: 'Traduzione:',
      tranlationComments: 'Fateci sapere come possiamo migliorare la traduzione:',
      preferedLang: 'Lingua di Chat Preferita',
      MSBrowserAlertMessage: '<p> Per una migliore esperienza di chat, chattare su Chrome. Puoi fare clic qui per aprire una chat in <a href="chromerun://jnjprod.service-now.com/iris?id=irisgl_home&livechat=1&jnjsource=ietransfer">Chrome</a> </p>'
    },
    fr: {
      BCCode: 'fr-FR',
      virtualAgent: 'Agent virtuel (Chatbot):',
      translation: 'Traduction:',
      tranlationComments: "S'il vous plaît laissez-nous savoir comment nous pouvons améliorer la traduction:",
      preferedLang: 'Langue de Chat Préférée',
      MSBrowserAlertMessage: '<p> Pour une meilleure expérience de chat, veuillez chatter sous Chrome. Vous pouvez cliquer ici pour ouvrir un chat dans <a href="chromerun://jnjprod.service-now.com/iris?id=irisgl_home&livechat=1&jnjsource=ietransfer"> Chrome </a> </ p>.'
    },
    'fr-ca': {
      BCCode: 'fr-CA',
      virtualAgent: 'Agent virtuel (Chatbot):',
      translation: 'Traduction:',
      tranlationComments: "S'il vous plaît laissez-nous savoir comment nous pouvons améliorer la traduction:",
      preferedLang: 'Langue de Chat Préférée',
      MSBrowserAlertMessage: '<p> Pour une meilleure expérience de chat, veuillez chatter sous Chrome. Vous pouvez cliquer ici pour ouvrir un chat dans <a href="chromerun://jnjprod.service-now.com/iris?id=irisgl_home&livechat=1&jnjsource=ietransfer"> Chrome </a> </ p>.'
    },
    hu: {
      BCCode: 'hu-HU',
      virtualAgent: 'virtuális ügynök (Chatbot):',
      translation: 'Fordítás:',
      tranlationComments: 'Kérjük, tudassa velünk, hogyan javíthatjuk a fordítást:',
      preferedLang: 'Preferált Csevegési Nyelv',
      MSBrowserAlertMessage: '<p>A jobb csevegési élmény érdekében kérjük, csevegjen a Chrome-ban. Ide kattintva csevegést nyithat meg a <a href="chromerun://jnjprod.service-now.com/iris?id=irisgl_home&livechat=1&jnjsource=ietransfer">Chrome-ban</a></p>'
    },
    nl: {
      BCCode: 'nl-NL',
      virtualAgent: 'Virtuele agent (Chatbot):',
      translation: 'Vertaling:',
      tranlationComments: 'Laat ons weten hoe we de vertaling kunnen verbeteren:',
      preferedLang: 'Gewenste Chattaal',
      MSBrowserAlertMessage: '<p>Chat voor een betere chatervaring in Chrome. U kunt hier klikken om een chat in <a href="chromerun://jnjprod.service-now.com/iris?id=irisgl_home&livechat=1&jnjsource=ietransfer">Chrome</a> te openen</p>'
    },
    pl: {
      BCCode: 'pl-PL',
      virtualAgent: 'Agent Wirtualny (Chatbot):',
      translation: 'Tłumaczenie:',
      tranlationComments: 'Daj nam znać, jak możemy ulepszyć tłumaczenie:',
      preferedLang: 'Preferowany Język Czatu',
      MSBrowserAlertMessage: '<p>Aby uzyskać lepszą jakość czatu, czatuj w Chrome. Możesz kliknąć tutaj, aby otworzyć czat w <a href="chromerun://jnjprod.service-now.com/iris?id=irisgl_home&livechat=1&jnjsource=ietransfer">Chrome</a></p>'
    },
    'vi-vn': {
      BCCode: 'vi-VN',
      virtualAgent: 'Tác nhân ảo (Chatbot):',
      translation: 'Dịch:',
      tranlationComments: 'Vui lòng cho chúng tôi biết cách chúng tôi có thể cải thiện bản dịch:',
      preferedLang: 'Ngôn ngữ trò chuyện ưa thích',
      MSBrowserAlertMessage: '<p>Để có trải nghiệm trò chuyện tốt hơn, vui lòng trò chuyện trong Chrome. Bạn có thể nhấp vào đây để mở một cuộc trò chuyện trong <a href="chromerun://jnjprod.service-now.com/iris?id=irisgl_home&livechat=1&jnjsource=ietransfer">Chrome</a></p>'
    },
    sv: {
      BCCode: 'sv-SE',
      virtualAgent: 'Virtual Agent (Chatbot):',
      translation: 'Översättning:',
      tranlationComments: 'Låt oss veta hur vi kan förbättra översättningen:',
      preferedLang: 'Föredraget Chatt Språk',
      MSBrowserAlertMessage: '<p>För en bättre chattupplevelse, chatta i Chrome. Du kan klicka här för att öppna en chatt i <a href="chromerun://jnjprod.service-now.com/iris?id=irisgl_home&livechat=1&jnjsource=ietransfer">Chrome</a></p>'
    },
    tr: {
      BCCode: 'tr-TR',
      virtualAgent: 'Sanal Ajan (Chatbot):',
      translation: 'Çeviri:',
      tranlationComments: 'Lütfen çeviriyi nasıl geliştirebileceğimizi bize bildirin:',
      preferedLang: 'Tercih Edilen Sohbet Dili',
      MSBrowserAlertMessage: '<p>Daha iyi bir sohbet deneyimi için lütfen Chrome\'ta sohbet edin. <a href="chromerun://jnjprod.service-now.com/iris?id=irisgl_home&livechat=1&jnjsource=ietransfer">Chrome</a>\'da bir sohbet açmak için burayı tıklayabilirsiniz.</p>'
    },
    el: {
      BCCode: 'el-GR',
      virtualAgent: 'εικονικό πράκτορα (Chatbot):',
      translation: 'Μετάφραση:',
      tranlationComments: 'Ενημερώστε μας πώς μπορούμε να βελτιώσουμε τη μετάφραση:',
      preferedLang: 'Προτιμώμενη γλώσσα συνομιλίας',
      MSBrowserAlertMessage: '<p>Για καλύτερη εμπειρία συνομιλίας, μπορείτε να συνομιλήσετε στο Chrome. Μπορείτε να κάνετε κλικ εδώ για να ανοίξετε μια συζήτηση στο <a href="chromerun://jnjprod.service-now.com/iris?id=irisgl_home&livechat=1&jnjsource=ietransfer">Chrome</a></p>'
    },
    cs: {
      BCCode: 'cs-CZ',
      virtualAgent: 'Virtuální agent (Chatbot):',
      translation: 'превод:',
      tranlationComments: 'Dejte nám prosím vědět, jak můžeme zlepšit překlad:',
      preferedLang: 'Preferovaný jazyk chatu',
      MSBrowserAlertMessage: '<p>Pro lepší zážitek z chatu si prosím povídejte v prohlížeči Chrome. Kliknutím sem otevřete chat v <a href="chromerun://jnjprod.service-now.com/iris?id=irisgl_home&livechat=1&jnjsource=ietransfer">Chrome</a></p>'
    },
    ru: {
      BCCode: 'ru-RU',
      virtualAgent: 'Виртуальный агент (чатбот):',
      translation: 'Перевод:',
      tranlationComments: 'Сообщите нам, как мы можем улучшить перевод:',
      preferedLang: 'Предпочитаемый язык чата',
      MSBrowserAlertMessage: '<p>Для лучшего общения, пожалуйста, общайтесь в Chrome. Вы можете нажать здесь, чтобы открыть чат в <a href="chromerun://jnjprod.service-now.com/iris?id=irisgl_home&livechat=1&jnjsource=ietransfer">Chrome</a></p>'
    },
    iw: {
      BCCode: 'he-IL',
      virtualAgent: 'וירטואלי סוכן (Chatbot):',
      translation: 'תרגום:',
      tranlationComments: 'אנא יידע אותנו כיצד נוכל לשפר את התרגום',
      preferedLang: "שפת צ'ט מועדפת",
      MSBrowserAlertMessage: "<p>לחוויית צ'אט טובה יותר אנא צ'ט ב- Chrome. אתה יכול ללחוץ כאן כדי לפתוח צ'אט ב- <a href=\"chromerun://jnjprod.service-now.com/iris?id=irisgl_home&livechat=1&jnjsource=ietransfer\">Chrome</a></p>"
    },
    'ar-eg': {
      BCCode: 'ar-EG',
      virtualAgent: 'الوكيل الافتراضي (Chatbot):',
      translation: 'ترجمة:',
      tranlationComments: 'واسمحوا لنا أن نعرف كيف يمكننا تحسين الترجمة:',
      preferedLang: 'لغة الدردشة المفضلة',
      MSBrowserAlertMessage: '<p>للحصول على تجربة دردشة أفضل ، يرجى الدردشة في Chrome. يمكنك النقر هنا لفتح الدردشة في <a href="chromerun://jnjprod.service-now.com/iris?id=irisgl_home&livechat=1&jnjsource=ietransfer">Chrome</a></p>'
    },
    th: {
      BCCode: 'th-TH',
      virtualAgent: 'ตัวแทนเสมือน (Chatbot):',
      translation: 'การแปล:',
      tranlationComments: 'โปรดแจ้งให้เราทราบว่าเราสามารถปรับปรุงการแปลได้อย่างไร:',
      preferedLang: 'ภาษาแชทที่ต้องการ',
      MSBrowserAlertMessage: '<p>للحصول على تجربة دردشة أفضل ، يرجى الدردشة في Chrome. يمكنك النقر هنا لفتح الدردشة في <a href="chromerun://jnjprod.service-now.com/iris?id=irisgl_home&livechat=1&jnjsource=ietransfer">Chrome</></p>'
    },
    zh: {
      BCCode: 'zh-CN',
      virtualAgent: '虚拟代理（Chatbot）:',
      translation: '翻译:',
      tranlationComments: '请让我们知道我们如何改进翻译:',
      preferedLang: '首選聊天語言',
      MSBrowserAlertMessage: '<p>为了获得更好的聊天体验，请在Chrome。 您可以单击此处在<a href="chromerun://jnjprod.service-now.com/iris?id=irisgl_home&livechat=1&jnjsource=ietransfer">Chrome</a>中打开聊天</p>'
    },
    ja: {
      BCCode: 'ja-JP',
      virtualAgent: '仮想エージェント（Chatbot）:',
      translation: '翻訳:',
      tranlationComments: '翻訳の改善方法を教えてください:',
      preferedLang: '優先チャット言語',
      MSBrowserAlertMessage: '<p>為了獲得更好的聊天體驗，請在Chrome或。 您可以單擊此處在<a href="chromerun://jnjprod.service-now.com/iris?id=irisgl_home&livechat=1&jnjsource=ietransfer">Chrome</a>中打開聊天</p>'
    },
    'ko-kr': {
      BCCode: 'ko-KR',
      virtualAgent: '가상 에이전트 (Chatbot):',
      translation: '번역:',
      tranlationComments: '번역 개선 방법을 알려주십시오:',
      preferedLang: '선호하는 채팅 언어',
      MSBrowserAlertMessage: '<p>더 나은 채팅 경험을 얻으려면 Chrome 또는. <a href="chromerun://jnjprod.service-now.com/iris?id=irisgl_home&livechat=1&jnjsource=ietransfer">Chrome</a>에서 채팅을 열려면 여기를 클릭하십시오</p>'
    }
  }; // Element.prototype.remove polyfill

  if (!Element.prototype.remove) {
    Element.prototype.remove = function () {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  } // Promise polyfill


  (function (global) {
    'use strict';

    var Promise,
      PENDING = {},
      FULFILLED = {},
      REJECTED = {};

    if (typeof global.Promise === 'function') {
      Promise = global.Promise;
    } else {
      Promise = function (_Promise) {
        function Promise(_x) {
          return _Promise.apply(this, arguments);
        }

        Promise.toString = function () {
          return _Promise.toString();
        };

        return Promise;
      }(function (callback) {
        var fulfilledHandlers = [],
          rejectedHandlers = [],
          state = PENDING,
          result,
          dispatchHandlers,
          makeResolver,
          fulfil,
          reject,
          promise;

        makeResolver = function makeResolver(newState) {
          return function (value) {
            if (state !== PENDING) {
              return;
            }

            result = value;
            state = newState;
            dispatchHandlers = makeDispatcher(state === FULFILLED ? fulfilledHandlers : rejectedHandlers, result); // dispatch onFulfilled and onRejected handlers asynchronously

            wait(dispatchHandlers);
          };
        };

        fulfil = makeResolver(FULFILLED);
        reject = makeResolver(REJECTED);
        callback(fulfil, reject);
        promise = {
          // `then()` returns a Promise - 2.2.7
          then: function then(onFulfilled, onRejected) {
            var promise2 = new Promise(function (fulfil, reject) {
              var processResolutionHandler = function processResolutionHandler(handler, handlers, forward) {
                // 2.2.1.1
                if (typeof handler === 'function') {
                  handlers.push(function (p1result) {
                    var x;

                    try {
                      x = handler(p1result);
                      resolve(promise2, x, fulfil, reject);
                    } catch (err) {
                      reject(err);
                    }
                  });
                } else {
                  // Forward the result of promise1 to promise2, if resolution handlers
                  // are not given
                  handlers.push(forward);
                }
              }; // 2.2


              processResolutionHandler(onFulfilled, fulfilledHandlers, fulfil);
              processResolutionHandler(onRejected, rejectedHandlers, reject);

              if (state !== PENDING) {
                // If the promise has resolved already, dispatch the appropriate handlers asynchronously
                wait(dispatchHandlers);
              }
            });
            return promise2;
          }
        };

        promise['catch'] = function (onRejected) {
          return this.then(null, onRejected);
        };

        return promise;
      });

      Promise.resolve = function (value) {
        return new Promise(function (fulfil) {
          fulfil(value);
        });
      };

      Promise.reject = function (reason) {
        return new Promise(function (fulfil, reject) {
          reject(reason);
        });
      };
    } // TODO use MutationObservers or something to simulate setImmediate


    function wait(callback) {
      setTimeout(callback, 0);
    }

    function makeDispatcher(handlers, result) {
      return function () {
        var handler;

        while (handler = handlers.shift()) {
          handler(result);
        }
      };
    }

    function resolve(promise, x, fulfil, reject) {
      // Promise Resolution Procedure
      var then; // 2.3.1

      if (x === promise) {
        throw new TypeError("A promise's fulfillment handler cannot return the same promise");
      } // 2.3.2


      if (x instanceof Promise) {
        x.then(fulfil, reject);
      } // 2.3.3
      else if (x && (_typeof(x) === 'object' || typeof x === 'function')) {
        try {
          then = x.then; // 2.3.3.1
        } catch (e) {
          reject(e); // 2.3.3.2

          return;
        } // 2.3.3.3


        if (typeof then === 'function') {
          var called, resolvePromise, rejectPromise;

          resolvePromise = function resolvePromise(y) {
            if (called) {
              return;
            }

            called = true;
            resolve(promise, y, fulfil, reject);
          };

          rejectPromise = function rejectPromise(r) {
            if (called) {
              return;
            }

            called = true;
            reject(r);
          };

          try {
            then.call(x, resolvePromise, rejectPromise);
          } catch (e) {
            if (!called) {
              // 2.3.3.3.4.1
              reject(e); // 2.3.3.3.4.2

              called = true;
              return;
            }
          }
        } else {
          fulfil(x);
        }
      } else {
        fulfil(x);
      }
    } // export as node module


    if (typeof module !== 'undefined' && module.exports) {
      module.exports = Promise;
    } // or as AMD module
    else if (typeof define === 'function' && define.amd) {
      define(function () {
        return Promise;
      });
    }

    global.Promise = Promise;
  })(typeof window !== 'undefined' ? window : void 0); // Object.assign polyfill


  if (typeof Object.assign !== 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, 'assign', {
      value: function assign(target, varArgs) {
        // .length of function is 2
        'use strict';

        if (target === null || target === undefined) {
          throw new TypeError('Cannot convert undefined or null to object');
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];

          if (nextSource !== null && nextSource !== undefined) {
            for (var nextKey in nextSource) {
              // Avoid bugs when hasOwnProperty is shadowed
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }

        return to;
      },
      writable: true,
      configurable: true
    });
  } // ************************TODO*************************************************
  // MOVE THIS FUNCTION TO CLIENT/FOOTER SCRIPT.
  //
  // this function allow the bot to switch, but without
  // redirecting the mobile window


  var bcFloat = null;

  window.mobileBotSwitch = function (type) {
    // close any previous open bot
    if (window._bcvmw) {
      window._bcvmw.closeChat();
    }

    if (window._bcvm) {
      window._bcvm.pageViewer.resetStaticQuery();
    } // remove previous launchers ($ is already present in the page)
    // $('.bcFloat').remove();


    var bcFloatDomElem = document.querySelector('.bcFloat');
    bcFloatDomElem.parentNode.removeChild(bcFloatDomElem);

    if (type === 'JP' || type === 'ZH') {
      openBold360Widget(type);
    }

    var openWidgetInterval = setInterval(function () {
      // add close listener for the iframe own dom elements
      bcFloat = document.querySelector('.bcFloat img');
      console.log(bcFloat);

      if (bcFloat) {
        clearInterval(openWidgetInterval);
        bcFloat.click();
      }
    }, 50);
  };

  var IsIE = function IsIE() {
    _newArrowCheck(this, _this);

    var isMsBrowser = false;

    if (/MSIE 10/i.test(navigator.userAgent)) {
      // This is internet explorer 10
      isMsBrowser = true;
    }

    if (/MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent)) {
      // This is internet explorer 9 or 11
      isMsBrowser = true;
    }

    return isMsBrowser;
  }.bind(void 0);

  var IsEdge = function IsEdge() {
    _newArrowCheck(this, _this);

    var isEdgeBrowser = false;

    if (/Edge\/\d./i.test(navigator.userAgent)) {
      // This is Microsoft Edge
      isEdgeBrowser = true;
    }

    return isEdgeBrowser;
  }.bind(void 0); // Killing the session using the sdk


  window.addEventListener('beforeunload', function () {
    _newArrowCheck(this, _this);

    if (configInWidget.debug) {
      console.log('on unload');
    } // For mobile app, do no clear history


    if (isWeb && window.g_lang !== 'ja' && !nanorep.floatingWidget.isLiveChatActive()) {
      window.clearCookiesAndSession();
    }
  }.bind(void 0));
  nanorep.floatingWidget.on('BoldChat:inQueue', function (params) {
    var startLang = window.g_lang || 'en';

    if (startLang !== 'en' || configInWidget.inQueue) {
      return null;
    }

    if (configInWidget.debug) {
      console.log('Currently in queue');
      console.log('Checking the queue size');
      console.log('Current Queue Size: ' + params.queuePosition);
    }

    if (params.queuePosition >= configInWidget.queueSize) {
      setTimeout(function () {
        addMessage(queueMessages.highVolume);
        setTimeout(function () {
          addMessage(queueMessages.scheduleQuestion);
        }, 2000);
      }, configInWidget.queueLinkDelay);
    }

    configInWidget.inQueue = true;
  }); // get the list of all the articles with the label no_helpulness_feedback

  getArticlesLabelsList().then(function (response) {
    var _this9 = this;

    _newArrowCheck(this, _this);

    var data = JSON.parse(response);
    data.articles.forEach(function (article) {
      _newArrowCheck(this, _this9);

      configInWidget.excludedArticles.push(article.id);
    }.bind(this));
  }.bind(void 0)); // intercepting button selection to execute customFunction for buttons

  var origHandler = nanorep.floatingWidget.$refs.core.conversationSession.onSelectOption;

  nanorep.floatingWidget.$refs.core.conversationSession.onSelectOption = function (choice, entry) {
    if (typeof choice.customFunction === 'function') choice.customFunction();
    return origHandler.apply(this, arguments);
  };

  var allowedLangs = boldObject.languagesOn ? boldObject.languagesOn.split(',') : [];
  window.selectedLanguage = null; // initialize language dropdown with the host language selection or the default value

  var applyLangSelection = function applyLangSelection() {
    var _this10 = this;

    _newArrowCheck(this, _this);

    var selectLanguageInterval = setInterval(function () {
      _newArrowCheck(this, _this10);

      var languageSelector = document.querySelector('select.language-selector');

      if (languageSelector) {
        var defaultLang = window.g_lang || 'en'; // map the host languages unsupported by geofluent to an equivalent code
        // portuguese is not supported by geofluent, so it's mapped to pt-BR

        if (defaultLang === 'pb') {
          defaultLang = 'pt';
        } // korean is not supported by geofluent, so it's mapped to ko-KR


        if (defaultLang === 'ko') {
          defaultLang = 'ko-kr';
        } // french canadian is not supported by geofluent, so it's mapped to fr-CA


        if (defaultLang === 'fq') {
          defaultLang = 'en';
        } // if the english bot is selected from the modal in JnJ japan, avoid
        // change it into japan, and continue with the user selection (english)
        // this also applies for Chinese simplified


        if (boldObject.countryName === 'JAPAN' || boldObject.countryName === 'CHINA') {
          defaultLang = 'en';
        }

        changeLanguageSelectorLanguage(languageSelector, defaultLang);
        callArticleAndTranslate(defaultLang);
        clearInterval(selectLanguageInterval);
      }
    }.bind(this), 50);
  }.bind(void 0);

  var changeLanguageSelectorLanguage = function changeLanguageSelectorLanguage(languageSelector, languageCode) {
    _newArrowCheck(this, _this);

    nanorep.floatingWidget.emit('translationLanguageChanged', languageCode);
  }.bind(void 0);

  var callArticleAndTranslate = function callArticleAndTranslate(langValue) {
    var _this11 = this;

    _newArrowCheck(this, _this);

    // Open the japanese widget if the language is japanese, or chinese if language is chinese
    var transitionLanguages = ['ja', 'zh'];

    if (transitionLanguages.indexOf(langValue) > -1) {
      var openWidget = function openWidget(type) {
        if (isWeb) {
          window.botSwitch(type);
        } else {
          window.mobileBotSwitch(type);
        }

        return false;
      };

      switch (langValue) {
        case 'ja':
          openWidget('JP');
          break;

        case 'zh':
          openWidget('ZH');
          break;
      }
    } // set the selected language global to the scope


    window.selectedLanguage = langValue; // change the window.g_lang value from inside the bot

    window.g_lang = langValue;
    updateDictionary(langValue);
    var langSelector = document.querySelector('select.language-selector'); // temporarily disable lang selector to avoid multiple calls

    langSelector.disabled = true; // listen for the next language changes

    attachLangChangeListener(langSelector); // temporarily disable the "OK" button

    var confirmLanguageButton = document.querySelector('.conversation-choices__button.conversation-choices__button--last');
    confirmLanguageButton.disabled = true; // delete all previous chat entries

    var chatEntries = document.getElementsByClassName('conversation-log__entry');

    while (chatEntries.length > 1) {
      // remove the previous entries
      chatEntries[chatEntries.length - 1].remove();
    } // Update the language context with the selected language
    // Use a IIFE to create a closure on langValue


    (function (langCode) {
      var _this12 = this;

      _newArrowCheck(this, _this11);

      nanorep.floatingWidget.getContext().then(function (data) {
        _newArrowCheck(this, _this12);

        var context = Object.assign({}, data, {
          language: languageNameMap[langCode] || languageNameMap['en']
        });

        var appContext = sessionStorage.getItem('irisAppContext');
        if (appContext) {
          context.application = appContext;
          sessionStorage.removeItem('irisAppContext');
        }

        nanorep.floatingWidget.setContext(context);
      }.bind(this));
    }).bind(this)(langValue); // geofluent doesn't recognize 'en' language. Use null instead

    if (langValue === 'en') {
      langValue = null;
    }

    var postTranslation = function postTranslation() {
      _newArrowCheck(this, _this11);

      // re-enable lang selector
      var languageSelector = document.querySelector('select.language-selector');
      languageSelector.disabled = false; // re-enable the "OK" button

      var confirmLanguageButton = document.querySelector('.conversation-choices__button.conversation-choices__button--last');
      confirmLanguageButton.disabled = false;

      if (window.g_lang === 'vi') {
        // insert alert message for vietnamese
        PSalertMessage(configInWidget.alertFlags.vietnamese);
      } else {
        removeAlertMessage(configInWidget.alertFlags.vietnamese);
      }
    }.bind(this); // change the initial article depending of the selected language


    nanorep.floatingWidget.api.conversation.useTranslation(langValue).then(postTranslation)["catch"](postTranslation);
  }.bind(void 0);

  var attachLangChangeListener = function attachLangChangeListener(langSelector) {
    var _this13 = this;

    _newArrowCheck(this, _this);

    if (IsIE() || IsEdge()) {
      langSelector.onchange = function (event) {
        _newArrowCheck(this, _this13);

        callArticleAndTranslate(event.currentTarget.value);
      }.bind(this);
    } else {
      document.addEventListener('input', function (event) {
        _newArrowCheck(this, _this13);

        var target = event.target; // avoid to apply for other elements on the DOM, and repeated calls if window.g_lang has not changed

        if (target && target.className !== 'language-selector') {
          return false;
        }

        window.g_lang = window.g_lang || 'en';

        if (target.value !== window.g_lang) {
          callArticleAndTranslate(target.value);
        }
      }.bind(this));
    }
  }.bind(void 0);

  var updateDictionary = function updateDictionary(langValue) {
    _newArrowCheck(this, _this);

    var updatedDictionary = null;
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        updatedDictionary = JSON.parse(xmlHttp.responseText); // Update in memory dictionary with proper section in the selected language

        nanorep.floatingWidget.cnf.languageDictionary.feedback = updatedDictionary.dictionary.feedback;
        nanorep.floatingWidget.cnf.languageDictionary.thumbs = updatedDictionary.dictionary.thumbs;
        nanorep.floatingWidget.cnf.languageDictionary.survey = updatedDictionary.dictionary.survey;
      }
    };

    xmlHttp.open('GET', "https://jnj.nanorep.co/api/widget/getLocalization?lang=".concat(langValue), true);
    xmlHttp.send(null);
  }.bind(void 0);

  var initializeGeofluent = function initializeGeofluent(languageCode) {
    _newArrowCheck(this, _this);

    // map the host languages unsupported by geofluent to an equivalent code
    var selectedLanguage;

    switch (languageCode) {
      case 'pb':
        selectedLanguage = 'pt';
        break;

      case 'ko':
        selectedLanguage = 'ko-kr';
        break;

      case 'en':
        // SN english code does not work for geofluent, use null value insted
        selectedLanguage = null;
        break;

      default:
        selectedLanguage = languageCode;
        break;
    }

    return nanorep.floatingWidget.api.conversation.useTranslation(selectedLanguage);
  }.bind(void 0);

  var skipIntro = function skipIntro() {
    _newArrowCheck(this, _this);

    // remove autoload question
    nanorep.floatingWidget.cnf.onloadQuestionId = null;
    return initializeGeofluent(window.g_lang);
  }.bind(void 0);

  nanorep.floatingWidget.on({
    load: function load() {
      var _this18 = this;

      try {
        var selectedLanguage;

        switch (window.g_lang) {
          case 'pb':
            selectedLanguage = 'pt';
            break;

          case 'ko':
            selectedLanguage = 'ko-kr';
            break;

          default:
            selectedLanguage = window.g_lang;
            break;
        }

        var _allowedLangs = nanorep.floatingWidget.cnf.translationSupportedLanguages;
        isLangSupported = _allowedLangs.indexOf(selectedLanguage) > -1;

        if (!isLangSupported) {
          selectedLanguage = 'en';
        }

        nanorep.floatingWidget.setPreferredTranslationLanguage(selectedLanguage);

        if (configInWidget.debug) {
          console.log('load event');
        }

        if (boldObject.sendToLiveAgent === 'true') {
          skipIntro().then(function () {
            var _this19 = this;

            _newArrowCheck(this, _this18);

            // display first bubble
            nanorep.floatingWidget.showArticle(configInWidget.liveAgentReferPreText);
            setTimeout(function () {
              _newArrowCheck(this, _this19);

              // display second bubble
              nanorep.floatingWidget.showArticle(configInWidget.liveAgentRefer);
            }.bind(this), 2000);
          }.bind(this));
          return;
        } // add "wrong translation link" on the widget footer


        var wrongTranslarionLinkinterval = setInterval(function () {
          var queryClass = '.translation-switcher__cell.translation-switcher__cell--text';
          var translationPlaceHolder = document.querySelector(queryClass);

          if (translationPlaceHolder) {
            var translationLabel = document.querySelector('#wrongTranslationLabel').innerHTML;
            var translationContent = document.querySelector('.translation-switcher'); // Create link element.

            var link = document.createElement('a');
            translationContent.appendChild(link); // Create the text node for anchor element.

            var linkText = document.createTextNode("".concat(translationLabel)); // Append the text node to anchor element.

            link.appendChild(linkText); // Set the title.

            link.title = "".concat(translationLabel);
            link.style.marginLeft = '16px'; // Set the href property.

            link.href = 'https://jnj.sharepoint.com/teams/IncorrectTranslationSubmissions?market=en-US';
            link.target = '_blank';
            var uiContent = document.querySelector('.conversation-ui__content');
            uiContent.style.height = uiContent.offsetHeight - 15 + 'px';
            clearInterval(wrongTranslarionLinkinterval);
          }
        }, 100); // hide the query input on load

        boldObject.fn.hideInputText(); // If we're coming from the Enterprise bot, skip welcome message and ask intent

        if (boldObject.transitionFromEnterpriseBot) {
          var originalIntent = sessionStorage.getItem('irisIntent');
          var selectedLanguageCode = boldObject.languageCode || 'en'; // show alert message when language is not available and default to english

          var isLanguageNotAvailable = unavailableLanguages.indexOf(selectedLanguageCode) > -1;

          if (isLanguageNotAvailable) {
            selectedLanguageCode = 'en';
            PSalertMessage(configInWidget.alertFlags.languageIsNotAvailable);
          } // initialize language globals


          window.selectedLanguage = selectedLanguageCode;
          window.g_lang = selectedLanguageCode;

          if (originalIntent) {
            skipIntro().then(function () {
              _newArrowCheck(this, _this18);

              return nanorep.floatingWidget.showArticle(configInWidget.enterpriseBotAlternativeMessage);
            }.bind(this)).then(function () {
              var _this20 = this;

              _newArrowCheck(this, _this18);

              setTimeout(function () {
                _newArrowCheck(this, _this20);

                nanorep.floatingWidget.ask(originalIntent);
                boldObject.fn.showInputText();
              }.bind(this), 3000);
            }.bind(this));
          }
        } else {
          // set default value for window.g_lang
          window.g_lang = window.g_lang || 'en'; // avoid multiple initial article calls, only apply for the last click
          // the initialArticleCall timeout is stored on the window object, if we save if on a variable
          // the timeout will be receiving a new variable reference each time the chat bot opens

          clearTimeout(window.initialArticleCall);
          window.initialArticleCall = setTimeout(applyLangSelection, 2000); // fix issue related to language selector label translation:
          // on not supported languages the label was not being translated on the intial state

          var selectLanguageInterval = setInterval(function () {
            _newArrowCheck(this, _this18);

            var languageSelectorLabel = document.querySelector('#preferred_chat_lang');

            if (languageSelectorLabel) {
              var LangDictionary = langMap[window.g_lang] || langMap['en'];
              languageSelectorLabel.textContent = LangDictionary.preferedLang;
              clearInterval(selectLanguageInterval);
            }
          }.bind(this), 50);
        } // warning message when the bot starts in an MS browser


        if (IsIE() || IsEdge()) {
          PSalertMessage(configInWidget.alertFlags.MsBrowser);
        } // For mobile app, do no show covid message


        if (isWeb) {
          setTimeout(function () {
            _newArrowCheck(this, _this18);

            addCovid19Link(); // Covid-19 link in the footer of thw chat window
          }.bind(this), 250);
        }

        var ignoredKeys = ['account', 'context', 'fn'];
        Object.keys(boldObject).forEach(function (key) {
          var _this21 = this;

          _newArrowCheck(this, _this18);

          // account and context are objects and don't need to be decoded
          var isIgnored = ignoredKeys.find(function (iKey) {
            _newArrowCheck(this, _this21);

            return iKey === key;
          }.bind(this));

          if (!isIgnored) {
            boldObject[key] = decodeURIComponent(boldObject[key]);
          }
        }.bind(this));
        var _boldObject = boldObject,
          firstName = _boldObject.firstName,
          lastName = _boldObject.lastName,
          phone = _boldObject.phone,
          mobile = _boldObject.mobile,
          email = _boldObject.email,
          language = _boldObject.language,
          userId = _boldObject.userId,
          vip = _boldObject.vip,
          location = _boldObject.location,
          company = _boldObject.company,
          manager = _boldObject.manager,
          wwid = _boldObject.wwid,
          specialInstructions = _boldObject.specialInstructions;
        this.setInitializedEntities({
          SNFIRSTNAME: firstName,
          SNLASTNAME: lastName,
          SNUSERID: userId,
          SNWWID: wwid,
          SNEMAIL: email,
        });
        var fullName = "".concat(firstName, " ").concat(lastName);

        window._bcvm.pageViewer.setParameter('WindowParameters', "vn=".concat(fullName));

        window._bcvm.pageViewer.setParameter('WindowParameters', "vp=".concat(phone ? phone : mobile));

        window._bcvm.pageViewer.setParameter('WindowParameters', "ve=".concat(email));

        window._bcvm.pageViewer.setParameter('WindowParameters', "lc=".concat(language));

        window._bcvm.pageViewer.setParameter('WindowParameters', "customField_VIP=".concat(vip));

        window._bcvm.pageViewer.setParameter('WindowParameters', "customField_UserID=".concat(userId));

        window._bcvm.pageViewer.setParameter('WindowParameters', "customField_Location=".concat(location));

        window._bcvm.pageViewer.setParameter('WindowParameters', "customField_Company=".concat(company));

        window._bcvm.pageViewer.setParameter('WindowParameters', "customField_Manager=".concat(manager));

        window._bcvm.pageViewer.setParameter('WindowParameters', "customField_WWID=".concat(wwid));

        window._bcvm.pageViewer.setParameter('WindowParameters', "customField_PhoneNumber=".concat(phone));

        window._bcvm.pageViewer.setParameter('WindowParameters', "customField_SI=".concat(specialInstructions)); // For DIY - Search Incident


        var customUrl = "curl=u_disable_bulk_notification=false^active=true^caller_id=".concat(userId);

        window._bcvm.pageViewer.setParameter('WindowParameters', "curl=".concat(customUrl)); // For DIY - Create Incident Classic


        var visitRef = "caller_id=".concat(userId, "^contact_type=chat");

        window._bcvm.pageViewer.setParameter('WindowParameters', "vr=".concat(visitRef)); // For DIY - Create Incident AW


        getChatId().then(function (chatId) {
          _newArrowCheck(this, _this18);

          // caller_id=d4d185742bec3540b9e6e27069da1559^contact_type=chat^u_state=200
          var createIncAWParams = "caller_id=".concat(userId, "^contact_type=chat^u_chat_id=").concat(chatId, "^u_state=200");

          window._bcvm.pageViewer.setParameter('WindowParameters', "customField_createIncAWParams=".concat(createIncAWParams));
        }.bind(this)); // For DIY - Search RITM

        var visitInfo = "active=true^request.opened_by=".concat(userId, "^ORrequest.requested_for=").concat(userId);

        window._bcvm.pageViewer.setParameter('WindowParameters', "vi=".concat(visitInfo));

        window._bcvm.pageViewer.updateParameters({});

        this.getContext().then(function (data) {
          var _this22 = this;

          _newArrowCheck(this, _this18);

          var context = Object.assign({}, data, boldObject.context, {
            isNewHire: "".concat(configInWidget.isNewHire),
            language: languageNameMap[window.selectedLanguage] || languageNameMap['en'],
            wwid: wwid
          }); // set the context based on the query string of the page

          var sitePageContext = window.location.href.split('?')[1];

          if (sitePageContext) {
            var queryParamsArray = sitePageContext.split('&'); // take the query string params a create a key value pair object

            var paramsObject = queryParamsArray.reduce(function (acc, curr) {
              _newArrowCheck(this, _this22);

              var _curr$split = curr.split('='),
                _curr$split2 = _slicedToArray(_curr$split, 2),
                key = _curr$split2[0],
                value = _curr$split2[1];

              acc[key] = value;
              return acc;
            }.bind(this), {}); // add an entry in the context object for each query param

            for (var prop in paramsObject) {
              context[prop] = paramsObject[prop];
            }
          }

          var appContext = sessionStorage.getItem('irisAppContext');
          if (appContext) {
            context.application = appContext;
            sessionStorage.removeItem('irisAppContext');
          }

          this.setContext(context);
        }.bind(this));
      } catch (e) {
        if (configInWidget.debug) {
          console.error('something went wrong during load event');
          console.error(e.message);
        }
      }
    },
    chatSessionStarted: function chatSessionStarted() {
      var _this23 = this;

      if (configInWidget.debug) {
        console.log('Live chat session started');
      }

      boldObject.fn.showInputText(); // detect live chat session
      // delete showDeflectionArticle reference

      showDeflectionArticle = function showDeflectionArticle() {
        _newArrowCheck(this, _this23);

        return null;
      }.bind(this);

      resetDeflectCounters();
      disableTextBox(false);
      isLiveAgent = true;
      clearTimeout(configInWidget.helpfulArticleTimeout);
    },
    chatSessionEnded: function chatSessionEnded() {
      if (configInWidget.debug) {
        console.log('Live chat session ended');
      }

      resetDeflectCounters();
      isLiveAgent = false; // On mobile, we need to call this func to close the parent tab

      if (isMobile) {
        window.clearCookiesAndSession();
      }
    },
    ask: function ask(query) {
      if (configInWidget.debug) {
        console.log("asking: ".concat(query));
      } // reset automatic close window 30 sec gap when users makes a new query


      window.closeSessionOnTimeout = false; // If the user asked for a ticket number, show the ticket information

      var numberRegex = /^(?:REQ|TASK|INC|RITM)\d+$/i;

      if (numberRegex.test(query)) {
        nanorep.floatingWidget.expand();
        nanorep.floatingWidget.api.conversation.sendStatement({
          statement: "What is the status of my ticket ".concat(query)
        });
      } // start analisys process only if is not on a live agent session and the language is allowed


      if (!nanorep.floatingWidget.isLiveChatActive() && isLangSupported) {
        getAnalysis(query);
      }
    },
    userAction: function userAction() {
      if (configInWidget.debug) {
        console.log('userAction: reset timers');
      }

      clearTimeout(followUpTimer);
      followUpTimer = setTimeout(triggerFollowUpMessage, configInWidget.postFollowUpTimer);
      clearTimeout(surveyTimer);
      surveyTimer = setTimeout(triggerEndSession, configInWidget.closeChatSurveyTimer);
    },
    showAnswer: function showAnswer(answer) {
      if (configInWidget.debug) {
        console.log("showAnswer: ".concat(answer));
      }
    },
    update: function update() {
      if (configInWidget.debug) {
        console.log('update: ');
        var readMore = document.getElementsByClassName('conversation-entry-bot__more-button');

        for (var i = 0; i < readMore.length; i++) {
          console.log(readMore[i]);
        }
      }
    },
    collapseWidget: function collapseWidget() {
      var covid19 = document.querySelector('.covid19');
      covid19.style.display = 'none';
    },
    expandWidget: function expandWidget() {
      var _this24 = this;

      var covid19 = document.querySelector('.covid19');
      setTimeout(function () {
        _newArrowCheck(this, _this24);

        covid19.style.display = 'block';
      }.bind(this), 250);
    },
    'BoldChat:postChat': function BoldChatPostChat() {
      customizePostChatForm();
    },
    closeWidget: function closeWidget() {
      queryCount = 0;
      clearTimeout(followUpTimer);
      clearTimeout(surveyTimer); // On mobile, we need to call this func to close the parent tab

      if (isMobile && g_lang !== 'ja') {
        window.clearCookiesAndSession();
        clearInterval(forceFullScreenInterval);
      }
    },
    initLanguageSelector: function initLanguageSelector(activeLanguageSelector) {
      if (boldObject.transitionFromEnterpriseBot && activeLanguageSelector) {
        var selectedLanguageCode = boldObject.languageCode || 'en'; // default to english if language is not available

        var isLanguageNotAvailable = unavailableLanguages.indexOf(selectedLanguageCode) > -1;

        if (isLanguageNotAvailable) {
          selectedLanguageCode = 'en';
        } // initialize the language dropdown with the previously selected language in the enterprise bot


        changeLanguageSelectorLanguage(activeLanguageSelector.$domElement, selectedLanguageCode);
      }
    }
  }); // Count user entries while chatting with the bot

  (function (origMethod) {
    nanorep.floatingWidget.$refs.core.$refs.conversationUI.addEntry = function (entry) {
      var _this25 = this;

      // User
      if (entry.type === 1) {
        console.log('entry.type === 1');
        if (configInWidget.debug) console.log("User entry: ".concat(entry.html));

        if (!nanorep.floatingWidget.isLiveChatActive()) {
          queryCount += 1;
        }

        clearTimeout(configInWidget.helpfulArticleTimeout); // delete any previous alert message on the bot

        removeAlertMessage(configInWidget.alertFlags.vietnamese);
        removeAlertMessage(configInWidget.alertFlags.MsBrowser);
      } // Bot


      if (entry.type === 2) {
        // clear any previous timeout
        clearTimeout(configInWidget.helpfulArticleTimeout); // current article response is included on the list

        if (configInWidget.excludedArticles.length > 1 && !(configInWidget.excludedArticles.indexOf(entry.articleId) > -1)) {
          // trigger "was this answer helpful?" articel after 30 seconds without user input
          configInWidget.helpfulArticleTimeout = setTimeout(function () {
            _newArrowCheck(this, _this25);

            if (!nanorep.floatingWidget.isLiveChatActive()) {
              nanorep.floatingWidget.showArticle(configInWidget.helpfulArticleId);
            }
          }.bind(this), configInWidget.helpfulTimeoutTrigger);
        }
      }

      return origMethod.apply(this, arguments);
    };
  })(nanorep.floatingWidget.$refs.core.$refs.conversationUI.addEntry); // Escalating to a live chat session using the conversationUI


  nanorep.floatingWidget.$refs.core.conversationSession.conversationUI.on('selectOption', function (channel) {
    _newArrowCheck(this, _this);

    // get the channel text for english and for not supported languages
    var channelText = channel.original || channel;

    if (channelText.text === escalationButtonText || channelText.text.toLowerCase() === escalationButtonText2.toLowerCase()) {
      var ticket = getEntity('TICKET');

      if (ticket) {
        for (var i = 0; ticket.properties.length; i++) {
          if (typeof ticket.properties[i].name !== 'undefined') {
            if (ticket.properties[i].name === 'NUMBER') {
              var ticketNumber = ticket.properties[i].value;

              window._bcvm.pageViewer.setParameter('WindowParameters', "customField_TicketNumber=".concat(ticketNumber));

              if (configInWidget.debug) console.log("Ticket Number ".concat(ticketNumber));
            }

            if (ticket.properties[i].name === 'SYS_ID') {
              var ticketID = ticket.properties[i].value;

              window._bcvm.pageViewer.setParameter('WindowParameters', "customField_TicketID=".concat(ticketID));

              window._bcvm.pageViewer.setParameter('WindowParameters', "ln=".concat(ticketID));

              if (configInWidget.debug) console.log("Ticket ID ".concat(ticketID));
            }
          }
        }
      }
    }
  }.bind(void 0));

  window.setRating = function (event, controlledDropdownId) {
    var _this26 = this;

    _newArrowCheck(this, _this);

    var rating = parseInt(event.target.value, 10);

    if (isNaN(rating) || rating < 1 || rating > 5) {
      return false;
    } // the widget can have multiple forms at the same time, filter out the invalid forms


    var postChatForm = Array.prototype.slice.call(document.querySelectorAll('.bc-form.boldchat-form')).filter(function (form) {
      _newArrowCheck(this, _this26);

      return form.length > 3;
    }.bind(this)).pop();
    var controlledDropdownSelect = postChatForm.querySelector("#".concat(controlledDropdownId, " select"));
    controlledDropdownSelect.value = rating;
  }.bind(void 0);

  var conversationUI = document.querySelector('.conversation-ui');
  conversationUI.addEventListener('DOMNodeInserted', function (e) {
    _newArrowCheck(this, _this);

    // remove the status message for geofluent translation "All bot messages will
    // be translated automatically" when languages are not supported.
    if (e.target.className === 'conversation-entry-status' && !isLangSupported) {
      // remove the lang status message
      document.querySelector('.conversation-entry-status').remove();
    }
  }.bind(void 0));
} catch (e) {
  if (configInWidget.debug) {
    console.log('Error in in-widget:', e);
  }
}