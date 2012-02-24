enyo.kind({
  name: "nl.Search",
  kind: enyo.VFlexBox,
  events: { 
      onFound: ""
  },
  components: [
      { kind : "PageHeader", components : [
          { name : "headerText", kind : enyo.VFlexBox, content : "Search", flex : 1 }
      ] },
      { kind: "RowGroup", name: "lblSearch", caption: "Search", style: "padding: 2px; margin-top: 10px;", components: [
          { name: "searchQ", kind: "Input", hint: "...", autoCapitalize: "lowercase", autoWordComplete: "false" }
      ]},
      { kind: "HFlexBox", pack: "center", className: "btn-gaz-cont", components: [
          { name: "searchButton", kind: "CustomButton", caption: "Search", onclick: "searchClick", className: "btn-gaz" }
      ] }
  ],
  create: function() {
      this.inherited(arguments);
      enyo.g11n.setLocale({uiLocale: "bg"});
      this.$.headerText.setContent($L('Menu_Search'));
      this.$.lblSearch.setCaption($L('search_for'));
      this.$.searchButton.setContent($L('button_search'));
  },
  searchClick: function() {
      this.doFound(this.$.searchQ.getValue());
  }
});