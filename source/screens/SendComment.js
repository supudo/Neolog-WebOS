enyo.kind({
  name: "nl.SendComment",
  kind: enyo.VFlexBox,
  published : {
      word : null
  },
  events: { 
      onBack : "",
      onSelect: ""
  },
  components: [
      { kind : "PageHeader", components : [
          { name : "headerText", kind : enyo.VFlexBox, content : "Neolog", flex : 1 },
          { name : "backButton", kind : "Button", content : "Back", onclick : "backClick" },
          { name : "sendButton", kind : "Button", content : "Send", onclick : "sendClick", className: "btn-send-message" }
      ] },
      { name: "txtAuthor", kind: "Input", hint: "Author...", autoCapitalize: "lowercase", autoWordComplete: "false", inputType: "email", onchange: "emailChange" },
      { name: "pMessage", kind: "RichText", hint: "...", style: "margin: 4px; height: 80%;", autoWordComplete: "false", alwaysLooksFocused: "true" },
      { name: "msgService", kind: "WebService", onSuccess: "syncFinished", onFailure: "syncFailed", method: "POST" },
      { name: "mdPostOK", kind: "ModalDialog", components: [
          { name: "mdPostOKMessage", content: "Thanks", style: "text-align: center;" },
          { layoutKind: "HFlexLayout", pack: "center", components: [
              { name: "btnClose", kind: "Button", caption: "Close", onclick: "closeClick" }
          ]}
      ]}
  ],
  create: function() {
      this.inherited(arguments);
      enyo.g11n.setLocale({uiLocale: "bg"});
      this.$.backButton.setCaption($L('Back'));
      this.$.sendButton.setCaption($L('send_button'));
      this.$.txtAuthor.setHint($L('author'));
      enyo.keyboard.show();
  },
  sendClick: function(inSender, inEvent) {
      var j = {w : this.word.wid, author: addSlashes(this.$.txtAuthor.getValue()), comment : addSlashes(this.$.pMessage.getValue())};
      if (this.$.pMessage.getValue() != "") {
          this.$.msgService.setUrl(enyo.application.appSettings['ServiceURL'] + "SendComment");
          this.$.msgService.call("jsonobj=" + enyo.json.stringify(j));
      }
  },
  syncFinished: function(inSender, inResponse, inRequest) {
      enyo.scrim.hide();
      this.$.mdPostOK.open();
      this.$.btnClose.setCaption($L('close_alertbox'));
      this.$.mdPostOKMessage.setContent($L('message_sent'));
      logThis(this, "Message success - " + enyo.json.stringify(inResponse) + "!");
  },
  syncFailed: function(inSender, inResponse, inRequest) {
      enyo.scrim.hide();
      logThis(this, "Message failed (" + enyo.json.stringify(inResponse) + ")!");
  },
  backClick : function() {
      this.doBack();
  },
  closeClick: function() {
      this.$.pMessage.setValue("");
      this.$.mdPostOK.close();
      this.doBack();
  }
});