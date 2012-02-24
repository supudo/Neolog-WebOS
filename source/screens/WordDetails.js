enyo.kind({
  name: "nl.WordDetails",
  kind: "VFlexBox",
  events: { 
      onBack : "",
      onSelect: ""
  },
  components: [
      {kind: "PageHeader", components: [
          { name: "headerText", kind: enyo.VFlexBox, content: "Word Details", flex : 1 },
          { name : "backButton", kind : "Button", content : "Back", onclick : "backClick" },
          { width: "10px" },
          { name : "sharePicker", kind: "Picker", caption: "", value: "", onclick:'clearShare', onChange: "shareChange", onFocusChange: "shareFocus", className: "btn-share" }
      ]}
  ],
  create: function() {
      this.inherited(arguments);
      enyo.g11n.setLocale({uiLocale: "bg"});
      this.$.headerText.setContent($L('Menu_WordDetails'));
      this.$.backButton.setCaption($L('Back'));
  },
  backClick : function() {
      this.doBack();
  }
});