function install() {}
function uninstall() {}

async function startup({ id, version, rootURI }) {
    Zotero.PreferencePanes.register({
        pluginID: 'make-it-red@example.com',
        src: rootURI + 'preferences.xhtml',
        scripts: [rootURI + 'preferences.js']
    });
    Services.scriptloader.loadSubScript(rootURI + 'make-it-red.js');
    MakeItRed.init({ id, version, rootURI });
    MakeItRed.addToAllWindows();
    await MakeItRed.main();
}

function shutdown() {
    MakeItRed.removeFromAllWindows();
    MakeItRed = undefined;
}