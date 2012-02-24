enyo.kind({
  name: "nl.ViewComments",
  kind: "VFlexBox",
  published: {
      word: null,
      commentItems: []
  },
  events: { 
      onBack : ""
  },
  components: [
      {kind: "PageHeader", components: [
          { name: "headerText", kind: enyo.VFlexBox, content: "Comments", flex: 1 },
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
      this.$.headerText.setContent($L('Menu_Comments'));
      this.$.loadingSpinner.hide();
      this.commentItems = new Array();
      this.commentCount = 0;
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
      if (this.commentItems != null && this.commentItems.length > 0) {
          var r = this.commentItems[inIndex];
          if (r) {
              var c = '';
              c += r.author + '<br />';
              c += "@ " + getDateForDetails(r.createddate) + '<br /><br />';
              c += r.comment + '<br />';
              this.$.content.setContent(c);
              return true;
          }
      }
  },
  listItemClick: function(inSender, inEvent) {
      var comm = this.commentItems[inEvent.rowIndex];
      this.$.loadingSpinner.hide();
  },
  showItems: function() {
      this.commentItems = new Array();
      this.$.loadingSpinner.show();
      this.commentCount = 0;
      this.commentsDownloaded = 0;
      this.$.syncService.setUrl(enyo.application.appSettings['ServiceURL'] + "FetchWordComments&wordID=" + this.word.wid + "&wd=1");
      this.$.syncService.call();
  },
  syncFailed: function() {
      this.$.loadingSpinner.hide();
      logThis(this, "Comments download failed (" + this.serviceStatus + ")!");
  },
  syncFinished: function(inSender, inResponse, inRequest) {
      if (inResponse !== null) {
          var that = this;
          this.commentCount = inResponse.FetchWordCommentsCount;
          enyo.forEach(inResponse.FetchWordComments, function(ent) {
              that.commentsDownloaded++;
              that.commentItems.push(ent);
              that.refresh();
              if (that.commentCount == that.commentsDownloaded) {
                  logThis(that, "Comments download finished!");
                  that.$.loadingSpinner.hide();
              }
          }, this);
      }
  }
});