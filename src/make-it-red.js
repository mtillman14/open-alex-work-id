if (!MakeItRed) var MakeItRed = {};

MakeItRed = {
    init({ id, version, rootURI }) {
        this.id = id;
        this.version = version;
        this.rootURI = rootURI;
    },

    addToWindow(window) {
        let document = window.document;
        let itemMenuPopup = document.querySelector("#zotero-itemmenu");
        if (!itemMenuPopup) return;

        let menuItem = document.createXULElement("menuitem");
        menuItem.setAttribute("label", "Custom Item Menu");
        menuItem.setAttribute("id", "make-it-red-menuitem");
        menuItem.addEventListener("command", () => {
            window.alert("Custom Item Menu clicked!");
        });
        itemMenuPopup.appendChild(menuItem);

        itemMenuPopup.addEventListener("popupshowing", () => {
            menuItem.hidden = Zotero.getActiveZoteroPane()
                .getSelectedItems()
                .some(item => !item.isRegularItem());
        });
    },

    removeFromWindow(window) {
        let document = window.document;
        let menuItem = document.getElementById("make-it-red-menuitem");
        if (menuItem) menuItem.remove();
    },

    addToAllWindows() {
        var windows = Zotero.getMainWindows();
        for (let win of windows) {
            this.addToWindow(win);
        }
    },

    removeFromAllWindows() {
        var windows = Zotero.getMainWindows();
        for (let win of windows) {
            this.removeFromWindow(win);
        }
    },

    async main() {}
};

if (typeof window === 'undefined') {
    this.MakeItRed = MakeItRed;
}