function install() {}
function uninstall() {}

async function startup({ id, version, rootURI }) {
    Zotero.PreferencePanes.register({
        pluginID: 'open-alex-work-id@example.com',
        src: rootURI + 'preferences.xhtml',
        scripts: [rootURI + 'preferences.js']
    });
    Services.scriptloader.loadSubScript(rootURI + 'open-alex-work-id.js');
    OpenAlexWorkID.init({ id, version, rootURI });
    OpenAlexWorkID.addToAllWindows();
    await OpenAlexWorkID.main();
}

function shutdown() {
    OpenAlexWorkID.removeFromAllWindows();
    OpenAlexWorkID = undefined;
}