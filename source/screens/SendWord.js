enyo.kind({
  name: "nl.SendWord",
  kind: enyo.VFlexBox,
  events: { 
      onSelect: ""
  },
  components: [
      { kind : "PageHeader", components : [
          { name : "headerText", kind : enyo.VFlexBox, content : "Send word", flex : 1 }
      ] },
      { kind : "Scroller", flex : 1, layoutKind: "VFlexLayout", components : [
          { kind: "RowGroup", name: "lblName", caption: "Name", style: "padding: 2px; margin-top: 10px;", components: [
              { kind: "Input", name: "txtName", hint: "Name", autoWordComplete: "false" }
          ]},
          { kind: "RowGroup", name: "lblEmail", caption: "Email", style: "padding: 2px; margin-top: 10px;", components: [
              { kind: "Input", name: "txtEmail", hint: "Email", autoCapitalize: "lowercase", autoWordComplete: "false", inputType: "email" }
          ]},
          { kind: "RowGroup", name: "lblURL", caption: "URL", style: "padding: 2px; margin-top: 10px;", components: [
              { kind: "Input", name: "txtURL", hint: "URL", autoWordComplete: "false" }
          ]},
          { kind: "RowGroup", name: "lblWord", caption: "Word", style: "padding: 2px; margin-top: 10px;", components: [
              { kind: "Input", name: "txtWord", hint: "Word", autoWordComplete: "false" }
          ]},
          { kind: "HFlexBox", align: "center", style: "padding: 2px; margin-top: 10px;", components: [
              { kind: "Picker", name: "ddNests", caption: "Nest", className: "post-cat-dd" }
          ]},
          { kind: "RowGroup", name: "lblDescription", caption: "Description", style: "color: #000000; padding: 2px; margin-top: 10px;", components: [
              { kind: "RichText", name: "txtDescription", hint: "Description", autoWordComplete: "false" }
          ]},
          { kind: "RowGroup", name: "lblExamples", caption: "Examples", style: "color: #000000; padding: 2px; margin-top: 10px;", components: [
              { kind: "RichText", name: "txtExamples", hint: "Examples", autoWordComplete: "false" }
          ]},
          { kind: "RowGroup", name: "lblEthimology", caption: "Ethimology", style: "color: #000000; padding: 2px; margin-top: 10px;", components: [
              { kind: "RichText", name: "txtEthimology", hint: "Ethimology", autoWordComplete: "false" }
          ]},
          { name: "errorMsgCont", kind: "HFlexBox", pack: "center", style: "padding: 2px; margin: 6px;", components: [
              { name: "errorMsg", kind: "HtmlContent", className: "btn-post-error" }
          ] },
          { kind: "HFlexBox", pack: "center", className: "btn-post-cont", components: [
              { name: "saveButton", kind: "CustomButton", caption: "Save", onclick: "saveClick", className: "btn-gaz" }
          ] }
      ] },
      { name: "postService", kind: "WebService", onSuccess: "syncFinished", onFailure: "syncFailed", method: "POST" },
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
      this.$.headerText.setContent($L('Menu_SendWord'));
      this.nests = [];
      var that = this;
      Nest.all().order("orderpos", true).list(null, function (results) {
          results.forEach(function (ent) {
              that.nests.push({caption: ent.nest, value: ent.nid});
          });
      });
      this.refreshLabels();
  },
  refreshLabels: function() {
      this.$.ddNests.setCaption($L('post_nest'));
      this.$.ddNests.setItems(this.nests);
      this.$.ddNests.render();
      this.$.lblEmail.setCaption($L('post_email'));
      this.$.txtEmail.setValue(((enyo.application.appSettings['PrivateData']) ? enyo.application.appSettings['PDEmail'] : "..."));
      this.$.lblName.setCaption($L('post_name'));
      this.$.txtName.setHint("...");
      this.$.lblURL.setCaption($L('post_url'));
      this.$.txtURL.setHint("...");
      this.$.lblWord.setCaption($L('post_word'));
      this.$.txtWord.setHint("...");
      this.$.lblDescription.setCaption($L('post_description'));
      this.$.txtDescription.setHint("...");
      this.$.lblExamples.setCaption($L('post_examples'));
      this.$.txtExamples.setHint("...");
      this.$.lblEthimology.setCaption($L('post_ethimology'));
      this.$.txtEthimology.setHint("...");
      this.$.saveButton.setContent($L('post_gaz'));
      this.$.errorMsgCont.hide();
  },
  saveClick: function(inSender, inEvent) {
      var oNestID = this.$.ddNests.getValue();
      var oEmail = this.$.txtEmail.getValue();
      var oURL = this.$.txtURL.getValue();
      var oName = this.$.txtName.getValue();
      var oWord = this.$.txtWord.getValue();
      var oDescription = this.$.txtDescription.getValue();
      var oExamples = this.$.txtExamples.getValue();
      var oEthimology = this.$.txtEthimology.getValue();

      var errorText = "";
      var emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      var validationError = true;
      if (oWord == "" ||
              (oEmail == "" || !emailFilter.test(oEmail)) ||
              oName == "" ||
              oDescription == "" ||
              oExamples == "")
          errorText = $L('post_error');
      else
          validationError = false;

      var j = {
                  added_by: addSlashes(oName),
                  added_by_email: addSlashes(oEmail),
                  added_by_url: addSlashes(oURL),
                  word: addSlashes(oWord),
                  nest: oNestID,
                  word_desc: addSlashes(oDescription),
                  example: addSlashes(oExamples),
                  ethimology: addSlashes(oEthimology),
              };
      if (validationError) {
          this.$.errorMsg.setContent(errorText);
          this.$.errorMsgCont.show();
      }
      else {
          enyo.scrim.show();
          logThis(this, "sending word - " + enyo.json.stringify(j));
          this.$.errorMsgCont.hide();
          this.$.postService.setUrl(enyo.application.appSettings['ServiceURL'] + "SendWord");
          this.$.postService.call("jsonobj=" + enyo.json.stringify(j));
      }
  },
  syncFinished: function(inSender, inResponse, inRequest) {
      enyo.scrim.hide();
      this.$.mdPostOK.open();
      this.$.btnClose.setCaption($L('close_alertbox'));
      this.$.mdPostOKMessage.setContent($L('post_thanks'));
      logThis(this, "Send word success - " + enyo.json.stringify(inResponse) + "!");
  },
  syncFailed: function(inSender, inResponse, inRequest) {
      enyo.scrim.hide();
      logThis(this, "Send word failed (" + enyo.json.stringify(inResponse) + ")!");
  },
  closeClick: function() {
      this.$.ddNests.setValue(0);
      this.$.ddNests.setCaption($L('post_nest'));
      this.$.txtEmail.setValue(((enyo.application.appSettings['PrivateData']) ? enyo.application.appSettings['PDEmail'] : "..."));
      this.$.txtName.setValue("");
      this.$.txtURL.setValue("");
      this.$.txtWord.setValue("");
      this.$.txtDescription.setValue("");
      this.$.txtExamples.setValue("");
      this.$.txtEthimology.setValue("");
      this.$.mdPostOK.close();
  }
});