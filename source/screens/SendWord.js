enyo.kind({
  name: "nl.SendWord",
  kind: "VFlexBox",
  events: { 
      onSelect: ""
  },
  components: [
      {kind: "PageHeader", components: [
          {name: "headerText", kind: enyo.VFlexBox, content: "Send Word"}
      ]}
  ],
  create: function() {
      this.inherited(arguments);
      enyo.g11n.setLocale({uiLocale: "bg"});
      this.$.headerText.setContent($L('Menu_SendWord'));
  }
});