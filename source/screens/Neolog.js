enyo.kind({
    name : "nl.Neolog",
    kind : enyo.VFlexBox,
    components : [ {
        name : "pane", kind : "Pane", flex : 1, onSelectView: "viewChanged",
        components : [
            { name : "loading", className : "bgpattern", kind : "nl.Loading", onBack : "goBackLoading" },
            { name : "lettersAndNests", className : "bgpattern", kind : "nl.LettersAndNests", onNestSelect : "viewNest", onLetterSelect: "viewLetter" },
            { name : "words", className : "bgpattern", kind : "nl.Words", onBack : "goBack", onSelect : "viewWord" },
            { name : "wordDetails", className : "bgpattern", kind : "nl.WordDetails", onBack : "goBack", onSendComment: "sendWordComment", onViewComments: "viewWordComments" },
            { name : "sendComent", className : "bgpattern", kind : "nl.SendComment", onBack : "goBack" },
            { name : "wordComments", className : "bgpattern", kind : "nl.ViewComments", onBack : "goBack" },
            { name : "sendWord", className : "bgpattern", kind : "nl.SendWord" },
            { name : "search", className : "bgpattern", kind : "nl.Search", onFound: "viewSearchResults" },
            { name : "searchResults", className : "bgpattern", kind : "nl.SearchResults", onSelect : "viewWord", onBack : "goBack" },
            { name : "preferences", className : "bgpattern", kind : "nl.Preferences" },
            { name : "about", className : "bgpattern", kind : "nl.About" }
        ]
    },
    {
        name : "mainMenu",
        kind : "AppMenu",
        components : [
          { name: "mnLettersAndNests", caption : "Letters & Nests", onclick : "showLettersAndNests" },
          { name: "mnSendWord", caption : "Send word", onclick : "showSendWord" },
          { name: "mnSearch", caption : "Search", onclick : "showSearch" },
          { name: "mnPreferences", caption : "Preferences", onclick : "showPreferences" },
          { name: "mnAbout", caption : "About", onclick : "showAbout" }
        ]
    } ],
    // ------------------------------------------------
    create : function() {
        this.inherited(arguments);
        enyo.g11n.setLocale({uiLocale: "bg"});
        this.$.mainMenu.components[0].caption = $L('Menu_LettersAndNests');
        this.$.mainMenu.components[1].caption = $L('Menu_SendWord');
        this.$.mainMenu.components[2].caption = $L('Menu_Search');
        this.$.mainMenu.components[3].caption = $L('Menu_Preferences');
        this.$.mainMenu.components[4].caption = $L('Menu_About');
        this.$.pane.selectViewByName("loading");
    },
    // App Menu ------------------------------------------------
    openAppMenuHandler: function() {
        this.$.appMenu.open();
    },
    closeAppMenuHandler: function() {
        this.$.appMenu.close();
    },
    // ------------------------------------------------
    viewNest: function (inSender, inNest) {
        this.$.pane.selectViewByName("words");
        this.$.words.setNest(inNest);
        this.$.words.setLetter("");
        this.$.words.setLetterPos("");
        this.$.words.showItems();
    },
    viewLetter: function (inSender, inLetter, inLetterPos) {
        this.$.pane.selectViewByName("words");
        this.$.words.setNest(null);
        this.$.words.setLetter(inLetter);
        this.$.words.setLetterPos(inLetterPos);
        this.$.words.showItems();
    },
    viewWord : function(inSender, inWord) {
        this.$.pane.selectViewByName("wordDetails");
        this.$.wordDetails.setWord(inWord);
        this.$.wordDetails.resetShare();
    },
    sendWordComment: function(inSender, inWord) {
        this.$.pane.selectViewByName("sendComent");
        this.$.sendComent.setWord(inWord);
    },
    viewWordComments: function(inSender, inWord) {
        this.$.pane.selectViewByName("wordComments");
        this.$.wordComments.setWord(inWord);
        this.$.wordComments.showItems();
    },
    viewSearchResults: function(inSender, inSearchQuery) {
        this.$.pane.selectViewByName("searchResults");
        this.$.searchResults.performSearch(inSearchQuery);
    },
    // ------------------------------------------------
    goBackLoading : function(inSender, inEvent) {
        this.showLettersAndNests();
    },
    goBack : function(inSender, inEvent) {
        this.$.pane.back(inEvent);
    },
    // Menu ------------------------------------------------
    showLettersAndNests : function() {
        this.$.pane.selectViewByName("lettersAndNests");
    },
    showSendWord : function() {
        this.$.pane.selectViewByName("sendWord");
    },
    showSearch : function() {
        this.$.pane.selectViewByName("search");
    },
    showPreferences : function() {
        this.$.pane.selectViewByName("preferences");
    },
    showAbout : function() {
        this.$.pane.selectViewByName("about");
        this.$.about.viewAbout();
    }
});