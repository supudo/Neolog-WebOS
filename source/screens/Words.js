enyo.kind({
  name: "nl.Words",
  kind: enyo.VFlexBox,
  published: {
      wordItems: [],
      nest: null,
      letter: "",
      letterPos: "",
      isNest: true
  },
  events: { 
      onSelect: "",
      onBack : ""
  },
  components: [
      { kind : "PageHeader", components : [
          { name : "headerText", kind : enyo.VFlexBox, content : "Words", flex : 1 },
          { kind: "Spinner", name: "loadingSpinner" },
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
      ]},
      { name: "syncService", kind: "WebService", onSuccess: "syncFinished", onFailure: "syncFailed" }
  ],
  create: function() {
      this.inherited(arguments);
      enyo.g11n.setLocale({uiLocale: "bg"});
      this.$.headerText.setContent($L('Menu_Words'));
      this.db = enyo.application.persistence;
      this.wordItems = new Array();
      this.$.loadingSpinner.hide();
      this.wordCount = 0;
  },
  backClick : function() {
      this.$.loadingSpinner.hide();
      this.doBack();
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
      var word = this.wordItems[inEvent.rowIndex];
      this.$.loadingSpinner.hide();
      this.doSelect(word);
  },
  showItems: function() {
      this.wordItems = new Array();
      this.$.loadingSpinner.show();
      this.wordCount = 0;
      this.wordsDownloaded = 0;
      if (this.letter != "") {
          this.isNest = false;
          this.$.headerText.setContent($L('Menu_Words') + " - " + this.letter);
          this.$.syncService.setUrl(enyo.application.appSettings['ServiceURL'] + "FetchWordsForLetterPos&letter=" + this.letterPos + "&wd=1");
          this.$.syncService.call();
      }
      else if (this.nest != null) {
          this.isNest = true;
          this.$.headerText.setContent($L('Menu_Words') + " - " + this.nest.nest);
          this.$.syncService.setUrl(enyo.application.appSettings['ServiceURL'] + "FetchWordsForNest&nid=" + this.nest.nid + "&wd=1");
          this.$.syncService.call();
      }
      else
          this.doBack();
  },
  syncFailed: function() {
      this.$.loadingSpinner.hide();
      logThis(this, "Words download failed (" + this.serviceStatus + ")!");
  },
  syncFinished: function(inSender, inResponse, inRequest) {
      if (inResponse !== null) {
          var that = this;
          var jsonData = null;
          if (this.isNest) {
              this.wordCount = inResponse.FetchWordsForNestCount;
              jsonData = inResponse.FetchWordsForNest;
          }
          else {
              this.wordCount = inResponse.FetchWordsForLetterPosCount;
              jsonData = inResponse.FetchWordsForLetterPos;
          }
          enyo.forEach(jsonData, function(ent) {
              Word.all().filter('wid', '=', ent.wid).one(function(existing) {
                  that.saveWord(ent, existing);
              });
          }, this);
      }
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
      //this.displayWords();
      if (this.wordCount == this.wordsDownloaded) {
          logThis(this, "Words download finished!");
          this.$.loadingSpinner.hide();
      }
  },
  displayWords: function() {
      this.wordItems = new Array();
      var that = this;
      if (this.isNest)
          Word.all().filter('nestid', '=', this.nest.nid).order("word", true).list(null, function (results) {
              results.forEach(function (ent) {
                  that.wordItems.push(ent);
                  that.refresh();
              });
          });
      else
          Word.all().filter('wordletter', '=', this.letterPos).order("word", true).list(null, function (results) {
              results.forEach(function (ent) {
                  that.wordItems.push(ent);
                  that.refresh();
              });
          });
  }
});