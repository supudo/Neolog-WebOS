enyo.kind({
  name: "nl.WordDetails",
  kind: "VFlexBox",
  events: { 
      onSelect: ""
  },
  components: [
      {kind: "PageHeader", components: [
          {name: "headerText", kind: enyo.VFlexBox, content: "Word Details"}
      ]}
  ],
  create: function() {
      this.inherited(arguments);
      enyo.g11n.setLocale({uiLocale: "bg"});
      this.$.headerText.setContent($L('Menu_WordDetails'));
  }
});