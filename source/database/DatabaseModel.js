enyo.application.persistence = persistence;
persistence.store.websql.config(persistence, 'neolog.webos', "Neolog for WebOS", 65536);
persistence.search.config(persistence, persistence.store.websql.sqliteDialect);
enyo.application.models = {};

var TextContent = enyo.application.models.TextContent = persistence.define('TextContent', {
    cid: 'INT',
    title: 'TEXT',
    content: 'TEXT'
});

var Nest = enyo.application.models.Nest = persistence.define('Nest', {
    nid: 'INT',
    nest: 'TEXT',
    orderpos: 'INT'
});

var Word = enyo.application.models.Word = persistence.define('Word', {
    wid: 'INT',
    cid: 'INT',
    word: 'TEXT',
    wordletter: 'TEXT',
    orderpos: 'INT',
    nestid: 'INT',
    example: 'TEXT',
    ethimology: 'TEXT',
    description: 'TEXT',
    derivatives: 'TEXT',
    commentcount: 'INT',
    addedbyurl: 'TEXT',
    addedbyemail: 'TEXT',
    addedby: 'TEXT',
    addedatdate: 'TEXT',
    addedatdatestamp: 'TEXT',
});

Word.textIndex('word');
Word.textIndex('example');
Word.textIndex('ethimology');
Word.textIndex('description');
Word.textIndex('derivatives');
Word.textIndex('addedby');

persistence.schemaSync();

persistence.debug = enyo.application.appSettings['InDatabaseDebug'];