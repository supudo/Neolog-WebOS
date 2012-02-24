enyo.kind({
  name: "nl.Preferences",
  kind: enyo.VFlexBox,
  events: {
      onReceive: "",
      onSave: "",
      onCancel: ""
  },
  components: [
      {
          name: "getPreferencesCall",
          kind: "PalmService",
          service: "palm://com.palm.systemservice/",
          method: "getPreferences",
          onSuccess: "getPreferencesSuccess",
          onFailure: "getPreferencesFailure"
      },
      {
          name: "setPreferencesCall",
          kind: "PalmService",
          service: "palm://com.palm.systemservice/",
          method: "setPreferences",
          onSuccess: "setPreferencesSuccess",
          onFailure: "setPreferencesFailure"
      },
      { kind: "PageHeader", name : "headerText", content: "Preferences" },
      { kind: "Scroller", flex: 1, components: [
          { kind: "VFlexBox", components: [
              { kind: "RowGroup", name : "grpPrivateData", caption: "Private data", components: [
                  { kind: "HFlexBox", align: "center", style: "padding: 5px", components: [
                      { name: "lblSavePrivateData", content: "Save data", flex: 1 },
                      { name: "sSavePrivateData", kind: "ToggleButton", onChange: "savePrivateDataClicked" }
                  ]},
                  { kind: "RowGroup", align: "center", components: [
                      { name: "pdEmail", kind: "Input", hint: "PD Email", autoCapitalize: "lowercase", autoWordComplete: "false", inputType: "email", onchange: "emailChange" }
                  ]},
              ]},
              { kind: "RowGroup", name : "grpOnlineSearch", caption: "Search", components: [
                  { kind: "HFlexBox", align: "center", style: "padding: 5px", components: [
                      { name: "lblOnlineSearch", content: "Online search", flex: 1 },
                      { name: "sOnlineSearch", kind: "ToggleButton", onChange: "onlineSearchClicked" }
                  ]},
              ]},
              { kind: "RowGroup", name : "grpInAppEmail", caption: "Email", components: [
                  { kind: "HFlexBox", align: "center", style: "padding: 5px", components: [
                      { name: "lblInAppEmail", content: "InApp Email", flex: 1 },
                      { name: "sInAppEmail", kind: "ToggleButton", onChange: "inAppEmailClicked" }
                  ]},
              ]}
          ] },
      ] },
  ],
  create: function() {
      this.inherited(arguments);
      enyo.g11n.setLocale({uiLocale: "bg"});
      this.$.headerText.setContent($L('Menu_Preferences'));

      this.$.grpPrivateData.setCaption($L('prefs_PrivateData_title'));
      this.$.lblSavePrivateData.setContent($L('prefs_PrivateData_desc'));
      this.$.sSavePrivateData.setOnLabel($L('YES'));
      this.$.sSavePrivateData.setOffLabel($L('NO'));
      this.$.pdEmail.setHint("...");

      this.$.grpOnlineSearch.setCaption($L('prefs_OnlineSearch_title'));
      this.$.lblOnlineSearch.setContent($L('prefs_OnlineSearch_desc'));
      this.$.sOnlineSearch.setOnLabel($L('YES'));
      this.$.sOnlineSearch.setOffLabel($L('NO'));

      this.$.grpInAppEmail.setCaption($L('prefs_InAppEmail_title'));
      this.$.lblInAppEmail.setContent($L('prefs_InAppEmail_desc'));
      this.$.sInAppEmail.setOnLabel($L('YES'));
      this.$.sInAppEmail.setOffLabel($L('NO'));

      this.$.getPreferencesCall.call(
      {
          "keys": ["onlineSearch", "inAppEmail", "privateData", "pdEmail"]
      });
  },
  onlineSearchClicked: function(inSender) {
      this.$.setPreferencesCall.call({"onlineSearch": inSender.getState()});
      enyo.application.appSettings['OnlineSearch'] = inSender.getState();
  },
  inAppEmailClicked: function(inSender) {
      this.$.setPreferencesCall.call({"inAppEmail": inSender.getState()});
      enyo.application.appSettings['InAppEmail'] = inSender.getState();
  },
  savePrivateDataClicked: function(inSender) {
      this.$.setPreferencesCall.call({"privateData": inSender.getState()});
      enyo.application.appSettings['PrivateData'] = inSender.getState();
      if (inSender.getState()) {
          this.$.setPreferencesCall.call({"pdEmail": this.$.pdEmail.getValue()});
          enyo.application.appSettings['PDEmail'] = this.$.pdEmail.getValue();
      }
      else {
          this.$.setPreferencesCall.call({"pdEmail": ""});
          enyo.application.appSettings['PDEmail'] = "";
      }
  },
  emailChange: function() {
      if (this.$.sSavePrivateData.getState()) {
          this.$.setPreferencesCall.call({"pdEmail": this.$.pdEmail.getValue()});
          enyo.application.appSettings['PDEmail'] = this.$.pdEmail.getValue();
      }
  },
  getPreferencesSuccess: function(inSender, inResponse) {
      this.$.sOnlineSearch.setState(inResponse.onlineSearch);
      this.$.sInAppEmail.setState(inResponse.inAppEmail);
      this.$.sSavePrivateData.setState(inResponse.privateData);

      if (inResponse.pdEmail == undefined)
          this.$.pdEmail.setHint("...");
      else
          this.$.pdEmail.setValue(inResponse.pdEmail);
  },
  getPreferencesFailure: function(inSender, inResponse) {
      logThis(this, "Settings read error! " + inResponse);
  },
  setPreferencesSuccess: function(inSender, inResponse) {
      logThis(this, "Settings saved!");
  },
  setPreferencesFailure: function(inSender, inResponse) {
      logThis(this, "Settings save error! " + inResponse);
  }
});