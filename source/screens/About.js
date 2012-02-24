enyo.kind({
  name: "nl.About",
  kind: "VFlexBox",
  events: { 
      onSelect: ""
  },
  components: [
      {kind: "PageHeader", components: [
          {name: "headerText", kind: enyo.VFlexBox, content: "About"}
      ]},
      {kind: "Scroller", flex: 1, components: [
          {name: "txtContent", kind: "HtmlContent", className: "enyo-view", onLinkClick: "htmlContentLinkClick" }
      ]},
      {
          kind: "PalmService",
          name: "launchBrowserCall",
          service: "palm://com.palm.applicationManager/",
          method: "launch",
          onSuccess: "launchFinished",
          onFailure: "launchFail",
          onResponse: "gotResponse",
          subscribe: true
     },
  ],
  create: function() {
      this.inherited(arguments);
      enyo.g11n.setLocale({uiLocale: "bg"});
      this.$.headerText.setContent($L('Menu_About'));
  },
  viewAbout: function() {
      var that = this;
      TextContent.all().filter('cid', '=', '2').one(null, function(tc) {
          if (tc) {
              var c = "<div class=\"scAbout\">" + tc.content + "</div>";
              that.$.txtContent.setContent(c);
          }
      });
  },
  htmlContentLinkClick: function(inSender, inUrl) {
      this.$.launchBrowserCall.call({"id": "com.palm.app.browser", "params":{"target": inUrl}});
  },
  launchFinished: function(inSender, inResponse) {
      enyo.log("Launch browser success, results=" + enyo.json.stringify(inResponse));
  },
  launchFail: function(inSender, inResponse) {
      enyo.log("Launch browser failure, results=" + enyo.json.stringify(inResponse));
  },
});