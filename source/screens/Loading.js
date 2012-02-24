enyo.kind({
    name : "nl.Loading",
    kind : enyo.VFlexBox,
    events : {
        onBack : ""
    },
    components : [
        { name: 'lblLoading', content: 'Loading...', className: 'loadingLabel' },
        { name: 'loadingProgress', kind: "ProgressBar", minimum: 0, maximum: 2, position: 0, className: "loadingProgressBar" },
        { name: 'loadingProgressSmall', kind: "ProgressBar", minimum: 0, maximum: 100, position: 0, className: "loadingProgressBarSmall" },
        { name: "syncService", kind: "WebService", onSuccess: "syncFinished", onFailure: "syncFailed" },
        {
            name : "getConnMgrStatus",
            kind : "PalmService",
            service : "palm://com.palm.connectionmanager/",
            method : "getStatus",
            onSuccess : "statusFinished",
            onFailure : "statusFail",
            onResponse : "gotResponse",
            subscribe : true
        },
        {
            name: "getPreferencesCall",
            kind: "PalmService",
            service: "palm://com.palm.systemservice/",
            method: "getPreferences",
            onSuccess: "getPreferencesSuccess",
            onFailure: "getPreferencesFailure"
        }
    ],
    create: function() {
        this.inherited(arguments);
        enyo.g11n.setLocale({uiLocale: "bg"});
        this.$.lblLoading.setContent($L('Loading'));
        this.db = enyo.application.persistence;
        
        this.$.getPreferencesCall.call(
        {
            "keys": ["onlineSearch", "inAppEmail", "privateData", "pdEmail"]
        });

        this.$.loadingProgressSmall.hide();
        this.nestsTotal = 0;
        this.nestsSynced = 0;
        if (enyo.application.appSettings['WipeDatabase']) {
            var that = this;
            enyo.application.persistence.reset();
            enyo.application.persistence.transaction(function(tx) {
                enyo.application.persistence.flush(tx, function() {
                    logThis(that, 'Database wiped!');
                });
            });
        }
        else {
            this.serviceURL = enyo.application.appSettings['ServiceURL'];
            this.$.getConnMgrStatus.call();
        }
    },
    getPreferencesSuccess: function(inSender, inResponse) {
        enyo.application.appSettings['OnlineSearch'] = inResponse.onlineSearch;
        enyo.application.appSettings['InAppEmail'] = inResponse.inAppEmail;
        enyo.application.appSettings['PrivateData'] = inResponse.privateData;
        enyo.application.appSettings['PDEmail'] = inResponse.pdEmail;
    },
    getPreferencesFailure: function(inSender, inResponse) {
        logThis(this, "Preferences loading error!");
    },
    statusFinished : function(inSender, inResponse) {
        logThis(this, "getStatus success, results=" + enyo.json.stringify(inResponse));
        this.syncTextContent();
    },
    statusFail : function(inSender, inResponse) {
        logThis(this, "getStatus failure, results=" + enyo.json.stringify(inResponse));
    },
    getStatus : function(inSender, inResponse) {
        this.$.getConnMgrStatus.call({ "subscribe": true });
    },
    syncFinished: function(inSender, inResponse, inRequest) {
        if (inResponse !== null) {
            if (this.serviceStatus == 1 && inResponse.GetContent != null) {
                enyo.forEach(inResponse.GetContent, function(ent) {
                    TextContent.all().filter('cid', '=', ent.id).one(function(existing) {
                        if (!existing) {
                            var t = new TextContent();
                            t.cid = ent.id;
                            t.title = ent.title;
                            t.content = ent.content;
                            enyo.application.persistence.add(t);
                            enyo.application.persistence.flush(function(){ });
                        }
                        else {
                            existing.cid = ent.id;
                            existing.title = ent.title;
                            existing.content = ent.content;
                            enyo.application.persistence.flush(function(){ });
                        }
                    });
                }, this);
                enyo.application.persistence.flush(function(){ });
                logThis(this, "Sync done ... text content!");
                this.$.loadingProgress.setPosition(1);
                this.syncNests();
            }
            else if (inResponse.GetNests != null) {
                var that = this;
                this.nestsTotal = inResponse.GetNestsCount;
                this.$.loadingProgressSmall.setMaximum(this.nestsTotal);
                enyo.forEach(inResponse.GetNests, function(ent) {
                    Nest.all().filter('nid', '=', ent.nid).one(function(existing) {
                        if (!existing) {
                            var t = new Nest();
                            t.nid = ent.nid;
                            t.nest = ent.nest;
                            t.orderpos = ent.orderpos;
                            enyo.application.persistence.add(t);
                            that.nestsSynced++;
                            //logThis(that, "total = " + that.nestsTotal + "; synced new = " + that.nestsSynced);
                            that.nestsSync();
                        }
                        else {
                            existing.nid = ent.nid;
                            existing.nest = ent.nest;
                            existing.orderpos = ent.orderpos;
                            that.nestsSynced++;
                            //logThis(that, "total = " + that.nestsTotal + "; synced existing = " + that.nestsSynced);
                            that.nestsSync();
                        }
                    });
                }, this);
            }
            else
                this.syncDone();
        }
        else
            this.syncFailed();
    },
    syncFailed: function() {
        logThis(this, "Synchronization failed (" + this.serviceStatus + ")!");
    },
    syncDone: function() {
        this.$.loadingProgress.setPosition(1);
        logThis(this, "Synchronization completed!");
        this.doBack();
    },
    nestsSync: function() {
        if (this.nestsTotal == this.nestsSynced) {
            enyo.application.persistence.flush(function(){});
            logThis(this, "Sync done ... nests!");
            this.$.loadingProgressSmall.hide();
            this.syncDone();
        }
        else
            this.$.loadingProgressSmall.setPosition(this.nestsSynced);
    },
    syncTextContent: function() {
        this.serviceStatus = 1;
        this.$.syncService.setUrl(this.serviceURL + "GetContent");
        this.$.syncService.call();
    },
    syncNests: function() {
        this.serviceStatus = 2;
        this.$.loadingProgressSmall.show();
        this.$.syncService.setUrl(this.serviceURL + "GetNests");
        this.$.syncService.call();
    }
});