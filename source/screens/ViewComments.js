enyo.kind({
  name: "nl.ViewComments",
  kind: "VFlexBox",
  published: {
      word: null
  },
  events: { 
      onBack : "",
      onSelect: ""
  },
  components: [
      {kind: "PageHeader", components: [
          {name: "headerText", kind: enyo.VFlexBox, content: "Comments"}
      ]}
  ],
  create: function() {
      this.inherited(arguments);
      enyo.g11n.setLocale({uiLocale: "bg"});
      this.$.headerText.setContent("...");
  }
});