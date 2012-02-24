enyo.kind({
  name: "nl.WordDetails",
  kind: "VFlexBox",
  published: {
      word: null
  },
  events: { 
      onBack : "",
      onSelect: "",
      onSendComment: "",
      onViewComments: ""
  },
  components : [
      { kind : "PageHeader", components : [
          { name: "headerText", kind: enyo.VFlexBox, content: "Word Details", flex : 1 },
          { name : "backButton", kind : "Button", content : "Back", onclick : "backClick" },
          { width: "10px" },
          { name : "sharePicker", kind: "Picker", caption: "", value: "", onclick:'clearShare', onChange: "shareChange", onFocusChange: "shareFocus", className: "btn-share" }
      ] },
      { kind : "Scroller", flex : 1, layoutKind: "VFlexLayout", components : [
          { name : "wordContent", kind : "HtmlContent", allowHtml : "true", style: "padding: 2px;", onLinkClick: "htmlContentLinkClick" },
          { name: "viewCommentsButton", kind: "Button", caption: "View comments", onclick: "viewCommentsClick", className: "btn-send-message" },
          { name: "sendCommentButton", kind: "Button", caption: "Send comment", onclick: "sendCommentClick", className: "btn-send-message" }
      ] },
      { name: "mdEmails", kind: "ModalDialog", components: [
          { kind: "RowGroup", name : "grpEmail", caption: "Email", components: [
              { kind: "HFlexBox", align: "center", components: [
                  { name: "emFrom", kind: "Input", hint: "Your email...", autoCapitalize: "lowercase", autoWordComplete: "false", inputType: "email" }
              ]},
              { kind: "HFlexBox", align: "center", components: [
                  { name: "emTo", kind: "Input", hint: "Send to...", autoCapitalize: "lowercase", autoWordComplete: "false", inputType: "email" }
              ]},
          ]},
          { layoutKind: "HFlexLayout", pack: "center", components: [
              { name: "btnSend", kind: "Button", caption: "Send", onclick: "sendClick" },
              { name: "btnCancel", kind: "Button", caption: "Cancel", onclick: "cancelClick" }
          ]}
      ]},
      { name: "emService", kind: "WebService", onSuccess: "syncFinished", onFailure: "syncFailed", method: "POST" },
      { name: "mdService", kind: "ModalDialog", components: [
          { name: "mdServiceMessage", content: "Thanks", style: "text-align: center;" },
          { layoutKind: "HFlexLayout", pack: "center", components: [
              { name: "btnClose", kind: "Button", caption: "Close", onclick: "closeClick" }
          ]}
      ]},
      {
          name: "launchAppCall",
          kind: "PalmService",
          service: "palm://com.palm.applicationManager/",
          method: "launch",
          onSuccess: "launchFinished",
          onFailure: "launchFail",
          onResponse: "gotResponse"
      },
      {
          name: "openEmailCall",
          kind: "PalmService",
          service: "palm://com.palm.applicationManager/",
          method: "open",
          onSuccess: "openEmailSuccess",
          onFailure: "openEmailFailure",
          onResponse: "gotResponse",
          subscribe: true
      }
  ],
  create: function() {
      this.inherited(arguments);
      enyo.g11n.setLocale({uiLocale: "bg"});
      this.$.headerText.setContent($L('Menu_WordDetails'));
      this.$.backButton.setCaption($L('Back'));
      this.$.sendCommentButton.setCaption($L('send_comment'));
      this.$.viewCommentsButton.setCaption($L('view_comments'));
      this.shareNets = [];
      this.shareNets.push({caption: $L('share_title'), value: 0});
      this.shareNets.push({caption: "Facebook", value: 1});
      //this.shareNets.push({caption: "Twitter", value: 2});
      this.shareNets.push({caption: "Email", value: 3});
      this.shareNets.push({caption: $L('send_message'), value: 4});
      this.resetShare();
      this.shareOption = 0;
  },
  backClick : function() {
      this.doBack();
  },
  wordChanged : function() {
      var w = "";
      w += "<b>" + this.word.word + "</b><br>";
      w += this.word.description + "<br><br>";

      if (this.word.example != "")
          w += "<b>" + $L('word_Examples') + "</b><br>" + this.word.example + "<br><br>";
      if (this.word.ethimology != "")
          w += "<b>" + $L('word_Ethimology') + "</b><br>" + this.word.ethimology + "<br><br>";

      w += this.word.addedby + " @ " + getDateForDetails(this.word.addedatdate);

      w += '<div class="scAbout">'
      if (this.word.addedbyemail != "" )
          w += "<br><a href=\"mailto:" + this.word.addedbyemail + "\">" + this.word.addedbyemail + "</a>";
      if (this.word.addedbyurl != "" )
          w += "<br><a href=\"" + ((this.word.addedbyurl.substring(0, 7) == 'http://') ? '' : 'http://') + this.word.addedbyurl + "\">" + this.word.addedbyurl + "</a>";
      w += '</div><br />';

      this.$.wordContent.setContent(w);
  },
  viewCommentsClick: function() {
      this.doViewComments(this.word);
  },
  sendCommentClick: function() {
      this.doSendComment(this.word);
  },
  htmlContentLinkClick: function(inSender, inUrl) {
      this.$.launchBrowserCall.call({"id": "com.palm.app.browser", "params":{"target": inUrl}});
  },
  launchFinished: function(inSender, inResponse) {
      enyo.log("Launch browser success, results=" + enyo.json.stringify(inResponse));
  },
  launchFail: function(inSender, inResponse) {
      enyo.log("Launch browser failure, results=" + enyo.json.stringify(inResponse));
  },
  // Share ---------------------------------
  shareChange: function(inSender) {
      var shareTo = this.$.sharePicker.getValue();
      this.clearShare();
      switch (shareTo) {
          case 1:
              this.doShareFacebook();
              break;
          case 2:
              this.doShareTwitter();
              break;
          case 3:
              this.doShareEmail();
              break;
          case 4:
              this.doSendComment(this.word);
              break;
          default :
              break;
      }
  },
  shareFocus: function(inSender) {
      this.clearShare();
  },
  clearShare: function() {
      this.$.sharePicker.setValue(0);
      this.$.sharePicker.setCaption("");
  },
  resetShare: function() {
      this.$.sharePicker.setCaption("");
      this.$.sharePicker.setItems(this.shareNets);
      this.$.sharePicker.render();
  },
  getShareMessage: function() {
      var tweet = "Neolog.bg - " + this.word.title;
      tweet += " http://neolog.bg/word/" + this.word.oid;
      tweet += " #neolog";
      return tweet;
  },
  // Share Facebook ---------------------------------
  doShareFacebook: function() {
      logThis(this, "share Facebook");
      this.shareOption = 1;
      this.$.launchAppCall.call({ "id": "com.palm.app.facebook", "params": {"status": this.getShareMessage()}});
  },
  // Share Twitter ---------------------------------
  doShareTwitter: function() {
      logThis(this, "share Twitter");
      this.shareOption = 2;
      //this.$.launchAppCall.call({ "id": "com.palm.app.twitter", "params": {"action" : "", "status": this.getShareMessage()}});
  },
  // Share email ---------------------------------
  doShareEmail: function() {
      logThis(this, "share Email");
      this.shareOption = 3;
      if (enyo.application.appSettings['InAppEmail']) {
          var emailBody = "";
          emailBody += this.word.word + "<br /><br />";
          /*
          emailBody += "<b>" + this.offer.title + "</b><br /><br />";
          emailBody += "<i>" + getDateForDetails(this.offer.publishdate) + "</i><br /><br />";
          emailBody += $L('FreelanceYn') + " " + ((this.offer.freelanceyn) ? $L('YES') : $L('NO')) + "<br /><br />";
          if (this.offer.humanyn == "true") {
              emailBody += "<b>" + $L('odetails_Human_Positiv') + "</b> " + this.offer.positivism + "<br /><br />";
              emailBody += "<b>" + $L('odetails_Human_Negativ') + "</b> " + this.offer.negativism + "<br /><br />";
          }
          else {
              emailBody += "<b>" + $L('odetails_Company_Positiv') + "</b> " + this.offer.positivism + "<br /><br />";
              emailBody += "<b>" + $L('odetails_Company_Negativ') + "</b> " + this.offer.negativism + "<br /><br />";
          }
          */
          emailBody += "<br /><br /> Sent from Neolog ...";

          var params =  {
              "summary" : $L('email_subject'),
              "text" : emailBody, 
              "recipients" : [{"type" : "email", "contactDisplay" : "", "role" : 1, "value" : "" }],
          };
          this.$.openEmailCall.call({"id" : "com.palm.app.email", "params" : params});
      }
      else {
          this.$.mdEmails.open();
          this.$.grpEmail.setCaption($L('message_title'));
          this.$.emFrom.setHint($L('message_fromEmail'));
          this.$.emTo.setHint($L('message_toEmail'));
          this.$.btnSend.setCaption($L('message_btn_send'));
          this.$.btnCancel.setCaption($L('message_btn_cancel'));
      }
  },
  sendClick: function() {
      var j = {from : addSlashes(this.$.emFrom.getValue()), to : addSlashes(this.$.emTo.getValue())};
      this.$.emService.setUrl(enyo.application.appSettings['ServiceURL'] + "SendEmailMessage&oid=" + this.offer.oid);
      this.$.emService.call("jsonobj=" + enyo.json.stringify(j));
      this.$.mdEmails.close();
  },
  cancelClick: function() {
      this.$.mdEmails.close();
  },
  syncFinished: function(inSender, inResponse, inRequest) {
      enyo.scrim.hide();
      this.$.mdService.open();
      this.$.mdServiceMessage.setContent($L('message_sent'));
      this.$.btnClose.setCaption($L('close_alertbox'));
      logThis(this, "Email sending success - " + enyo.json.stringify(inResponse) + "!");
  },
  syncFailed: function(inSender, inResponse, inRequest) {
      enyo.scrim.hide();
      logThis(this, "Email sending failed (" + enyo.json.stringify(inResponse) + ")!");
  },
  openEmailSuccess : function(inSender, inResponse) {
      enyo.log("Open email success, results=" + enyo.json.stringify(inResponse));
  },
  openEmailFailure : function(inSender, inResponse) {
      enyo.log("Open email failure, results=" + enyo.json.stringify(inResponse));
  },
  // ------------------------------------------------------------------
  launchFinished: function(inSender, inResponse) {
      logThis(this, "Launch ok - " + enyo.json.stringify(inResponse));
  },
  launchFail: function(inSender, inError, inRequest) {
      logThis(this, "Launch error - " + enyo.json.stringify(inError));
      if (this.shareOption == 1) {
          this.$.mdService.open();
          this.$.mdServiceMessage.setContent($L('share_no_facebook_app'));
          this.$.btnClose.setCaption($L('close_alertbox'));
      }
      else if (this.shareOption == 2) {
          this.$.mdService.open();
          this.$.mdServiceMessage.setContent($L('share_no_twitter_app'));
          this.$.btnClose.setCaption($L('close_alertbox'));
      }
  },
  closeClick: function() {
      this.$.mdService.close();
  }
});