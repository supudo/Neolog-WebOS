enyo.kind({
  name: "nl.LettersAndNests",
  kind: "VFlexBox",
  events: { 
      onSelect: ""
  },
  components: [
      {kind: "PageHeader", components: [
          {name: "headerText", kind: enyo.VFlexBox, content: "Letters And Nests"}
      ]}
  ],
  create: function() {
      this.inherited(arguments);
      enyo.g11n.setLocale({uiLocale: "bg"});
      this.$.headerText.setContent($L('Menu_LettersAndNests'));
  }
});