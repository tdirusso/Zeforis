var initESW = function (gslbBaseURL) {
  let userDetails = JSON.parse(sessionStorage.getItem('userSessionDetails'));
  let chatTranscript = JSON.parse(localStorage.getItem('nanorep.float.conversational.jnj.kb2187981671'));
  let chatLog = '';
  let counter = 0;
  for (var i = 0; i < chatTranscript.convLog.length; i++) {
    var obj = chatTranscript.convLog[i];
    if (obj.type == '2' || obj.type == '2') { } else {
      chatLog += '[' + chatTranscript.convLog[i].html + '] ';
      counter++;
    }
  }
  chatLog = chatLog.replace(/<\/?[^>]+(>|$)/g, "");
  chatLog = chatLog.substring(chatLog.length - 255);
  let userWWID = userDetails.wwid;
  embedded_svc.settings.displayHelpButton = false; //Or false
  embedded_svc.settings.language = ''; //For example, enter 'en' or 'en-US'

  embedded_svc.addEventHandler("onSettingsCallCompleted", function (data) {
    embedded_svc.bootstrapEmbeddedService();
  });


  embedded_svc.addEventHandler("afterMaximize", function () {
    localStorage.removeItem('nanorep-sessionId');
    window._bcvmw.closeChat();
    document.querySelector('.bcFloat').remove();
    const callBackInMilliSeconds = 20;
    let timeInterval = setInterval(function () {
      const embServiceButton = document.querySelectorAll(".embeddedServiceSidebarButton");
      for (let value of embServiceButton) {
        if (value.innerHTML.indexOf("Resubmit Chat Request") !== -1) {
          value.style.display = 'none';
          clearInterval(timeInterval);
        }
      }
    }, callBackInMilliSeconds);
  });

  embedded_svc.snippetSettingsFile.autoOpenPostChat = false;

  embedded_svc.addEventHandler("afterDestroy", function (data) {
    window._bcvma.push(["addFloat", { type: "chat", id: "831878762516931034" }]);
    window._bcvma.push(["pageViewed"]);
    window.pageViewer.load();
    embedded_svc.liveAgentAPI.clearSession();
  });

  embedded_svc.settings.directToButtonRouting = function (prechatFormData) {
    return prechatFormData[8].value;
  };
  embedded_svc.settings.extraPrechatInfo = [{
    "entityFieldMaps": [{
      "doCreate": false,
      "doFind": true,
      "fieldName": "WWID__c",
      "isExactMatch": true,
      "label": "WWID"
    }],
    "entityName": "Contact"
  }];

  embedded_svc.settings.prepopulatedPrechatFields = {
    WWID__c: userWWID,
    Subject: chatLog,
    FirstName: userDetails.fName
  };

  embedded_svc.settings.extraPrechatFormDetails = [{
    "label": "Type",
    "transcriptFields": ["Business_Function__c"]
  },

  {
    "label": "Category",
    "transcriptFields": ["Category__c"]
  },
  {
    "label": "Country Name",
    "transcriptFields": ["Contact_Country__c"]
  },

  {
    "label": "WWID",
    "transcriptFields": ["Contact_WWID__c"]
  },

  {
    "label": " Region (Invalid)",
    "transcriptFields": ["Contact_Region__c"]
  },

  {
    "label": "Contact Language",
    "transcriptFields": ["Language__c"]
  },
  {
    "label": "Product Code",
    "value": "Home",
    "transcriptFields": ["Chat_Launch__c"]
  },
  {
    "label": "Link Chat Case",
    "transcriptFields": ["CaseId"]
  },
  {
    "label": "Subject",
    "transcriptFields": ["Case_Subject__c"]
  },
  {
    "label": "Description Live Chat",
    "transcriptFields": ["Case_Description__c"]
  }
  ];

  embedded_svc.settings.enabledFeatures = ['LiveAgent'];
  embedded_svc.settings.entryFeature = 'LiveAgent';

};


if (!window.embedded_svc) {
  var s = document.createElement('script');
  s.setAttribute('src', 'https://jnjgsportal--devsbjc.my.salesforce.com/embeddedservice/5.0/esw.min.js');
  s.onload = function () {
    initESW(null);
  };
  document.body.appendChild(s);
} else {
  embedded_svc.bootstrapEmbeddedService();
  initESW('https://service.force.com');

}