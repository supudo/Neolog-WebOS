enyo.kind({
  name: "nl.LettersAndNests",
  kind: enyo.VFlexBox,
  published: {
      nestsItems: [],
      nestYn: true
  },
  events: { 
      onNestSelect: "",
      onLetterSelect: ""
  },
  components: [
      {kind : "PageHeader", components : [
          { name : "headerText", kind : enyo.VFlexBox, content : "Nests And Letters", flex : 1 }
      ]},
      { name: 'tabBar', kind: "TabGroup", onChange: "tabButtonSelected", components: [
          { name: "tabNests", caption: "Nests" },
          { name: "tabLetters", caption: "Letters" }
      ]},
      { kind: "Scroller", flex: 1, components: [
          { name:'listItems', kind: 'VirtualList', flex:1, onSetupRow:'getListItem', components: [
              { name:'item', kind:'Item', align: "center", style: "font-weight: bold;", tapHighlight:true, onclick:'listItemClick', layoutKind:'VFlexLayout', components:[
                  { name: "header", kind:'HFlexBox', components:[
                      { name:'content', kind: "HtmlContent", allowHtml: 'true' }
                  ] }
              ] }
          ] }
      ] }
  ],
  create: function() {
      this.inherited(arguments);
      enyo.g11n.setLocale({uiLocale: "bg"});
      this.$.headerText.setContent($L('headerNestsAndLetters'));
      this.$.tabNests.setCaption($L('headerNests'));
      this.$.tabLetters.setCaption($L('headerLetters'));

      var that = this;

      this.nestsItems = new Array();
      Nest.all().order("orderpos", true).list(null, function (results) {
          results.forEach(function (ent) {
              that.nestsItems.push(ent);
              that.refreshItems();
          });
      });

      this.lettersItems = [];
      enyo.forEach(enyo.application.appSettings['Letters'], function(ent) {
          that.lettersItems.push({letter: ent});
          that.refreshItems();
      });
  },
  tabButtonSelected: function(inSender) {
      this.switchView(inSender.getValue());
  },
  switchView: function(tbVal) {
      this.$.tabNests.setState("depressed", false);
      this.$.tabLetters.setState("depressed", false);
      this.$.tabBar.value = 0;
      if (tbVal == 0) {
          this.$.tabNests.setState("depressed", true);
          this.nestYn = true;
          this.showNests();
      }
      else {
          this.$.tabLetters.setState("depressed", true);
          this.$.tabBar.value = 1;
          this.nestYn = false;
          this.showLetters();
      }
  },
  refreshItems: function() {
      this.$.listItems.reset();
      this.$.listItems.refresh();
  },
  getListItem: function(inSender, inIndex) {
      if (this.nestYn) {
          var r = this.nestsItems[inIndex];
          if (r) {
              this.$.content.setContent(r.nest);
              return true;
          }
      }
      else {
          var r = this.lettersItems[inIndex];
          if (r) {
              this.$.content.setContent(r.letter);
              return true;
          }
      }
  },
  listItemClick: function(inSender, inEvent) {
      if (this.nestYn) {
          var nest = this.nestsItems[inEvent.rowIndex];
          this.doNestSelect(nest);
      }
      else {
          var letter = this.lettersItems[inEvent.rowIndex];
          var letterPos = inEvent.rowIndex;
          if (inEvent.rowIndex == this.lettersItems.length)
              letterPos = "x";
          this.doLetterSelect(letter.letter, letterPos);
      }
  },
  showNests: function() {
      this.nestsItems = new Array();

      var that = this;
      Nest.all().order("nest", true).list(null, function (results) {
          results.forEach(function (ent) {
              that.nestsItems.push(ent);
              that.refreshItems();
          });
      });
  },
  showLetters: function() {
      this.lettersItems = new Array();

      var that = this;
      this.lettersItems = [];
      enyo.forEach(enyo.application.appSettings['Letters'], function(ent) {
          that.lettersItems.push({letter: ent});
          that.refreshItems();
      });
  }
});