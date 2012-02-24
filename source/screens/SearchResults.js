enyo.kind({
  name: "nl.SearchResults",
  kind: enyo.VFlexBox,
  published: {
      searchQuery: "",
      wordItems: []
  },
  events: { 
      onBack : "",
      onSelect: ""
  },
  components: [
      {kind : "PageHeader", components : [
          { name : "headerText", kind : enyo.VFlexBox, content : "Search Results", flex : 1 },
          { name: "loadingSpinner", kind : "Spinner" },
          { name : "backButton", kind : "Button", content : "Back", onclick : "backClick" }
      ]},
      { kind: "Scroller", flex: 1, components: [
          { name:'list', kind: 'VirtualList', flex:1, onSetupRow:'getListItem', components: [
              { name:'item', kind:'Item', tapHighlight:true, onclick:'listItemClick', layoutKind:'VFlexLayout', components:[
                      { kind:'HFlexBox', components:[
                          { name:'content', kind: "HtmlContent", allowHtml: 'true' }
                      ] }
              ] }
          ] }
      ] },
      { name: "searchService", kind: "WebService", onSuccess: "syncFinished", onFailure: "syncFailed" },
  ],
  create: function() {
      this.inherited(arguments);
      enyo.g11n.setLocale({uiLocale: "bg"});
      this.$.headerText.setContent($L('Menu_SearchResults'));
      this.$.backButton.setContent($L('Back'));
      this.$.loadingSpinner.hide();
      this.wordCount = 0;
  },
  performSearch: function(inSearchQuery) {
      this.searchQuery = inSearchQuery;
      this.wordItems = new Array();
      this.wordCount = 0;
      this.wordsDownloaded = 0;

      if (enyo.application.appSettings['OnlineSearch']) {
          this.$.loadingSpinner.show();
          this.$.searchService.setUrl(enyo.application.appSettings['ServiceURL'] + "Search&wd=1&q=" + this.searchQuery);
          this.$.searchService.call();
      }
      else {
          var that = this;
          Word.search("*" + this.searchQuery + "*").list(null, function(results) {
              results.forEach(function (off) {
                  that.wordItems.push(off);
                  that.refresh();
              });
          });
      }
  },
  refresh: function() {
      this.$.list.reset();
      this.$.list.refresh();  
  },
  getListItem: function(inSender, inIndex) {
      if (this.wordItems != null && this.wordItems.length > 0) {
          var r = this.wordItems[inIndex];
          if (r) {
              this.$.content.setContent(r.word);
              return true;
          }
      }
  },
  listItemClick: function(inSender, inEvent) {
      this.$.loadingSpinner.hide();
      var word = this.wordItems[inEvent.rowIndex];
      this.doSelect(word);
  },
  backClick : function() {
      this.doBack();
  },
  syncFinished: function(inSender, inResponse, inRequest) {
      if (inResponse !== null) {
          var that = this;
          this.wordCount = inResponse.SearchCount;
          enyo.forEach(inResponse.Search, function(ent) {
              Word.all().filter('wid', '=', ent.wid).one(function(existing) {
                  that.saveWord(ent, existing);
              });
          }, this);
      }
  },
  syncFailed: function(inSender, inResponse, inRequest) {
      this.$.loadingSpinner.hide();
      logThis(this, "Search failed (" + enyo.json.stringify(inResponse) + ")!");
  },
  saveWord: function(ent, existing) {
      this.wordsDownloaded++;
      logThis(this, "word count = " + this.wordCount + "; downloaded = " + this.wordsDownloaded);
      var t = null;
      if (!existing)
          t = new Word();
      else
          t = existing;
      t.wid = ent.wid;
      t.word = ent.word;
      t.wordletter = ent.wordletter;
      t.orderpos = ent.orderpos;
      t.example = ent.ex;
      t.nestid = ent.nestid;
      t.ethimology = ent.eth;
      t.description = ent.desc;
      t.commentcount = ent.commcount;
      t.addedbyurl = ent.addedby_url;
      t.addedbyemail = ent.addedby_email;
      t.addedby = ent.addedby;
      t.addedatdate = Date.parse(ent.createddate);
      t.addedatdatestamp = ent.createddatestamp;
      enyo.application.persistence.add(t);
      enyo.application.persistence.flush(function(){ });
      this.wordItems.push(t);
      this.refresh();
      if (this.wordCount == this.wordsDownloaded) {
          logThis(this, "Search finished!");
          this.$.loadingSpinner.hide();
      }
  }
});