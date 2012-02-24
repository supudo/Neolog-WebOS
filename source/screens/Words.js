enyo.kind({
  name: "nl.Words",
  kind: "VFlexBox",
  events: {
      onBack : "",
      onSelect: ""
  },
  components: [
      {kind: "PageHeader", components: [
          { name: "headerText", kind: enyo.VFlexBox, content: "Words", flex : 1 },
          { name : "backButton", kind : "Button", content : "Back", onclick : "backClick" },
      ]}
  ],
  create: function() {
      this.inherited(arguments);
      enyo.g11n.setLocale({uiLocale: "bg"});
      this.$.headerText.setContent($L('Menu_Words'));
      this.$.backButton.setCaption($L('Back'));
  },
  backClick : function() {
      this.doBack();
  }
});