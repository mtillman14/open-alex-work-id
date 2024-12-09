if (!OpenAlexWorkID) var OpenAlexWorkID = {};

OpenAlexWorkID = {
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
        menuItem.setAttribute("label", "OpenAlex Work ID");
        menuItem.setAttribute("id", "workid-menuitem");
        menuItem.addEventListener("command", async () => {            
            try {
                // Get selected items
                let selectedItems = Zotero.getActiveZoteroPane().getSelectedItems();
                if (!selectedItems || selectedItems.length === 0) {
                    window.alert("No items selected.");
                    return;
                }

                num_items = selectedItems.length;
                let num_items_added = 0;
                for (let i = 0; i < num_items; i++) {
                    let item = selectedItems[i];
                    if (!item.isRegularItem()) {
                        if (num_items==1) {
                            window.alert("Selected item is not a regular Zotero item.");
                        }
                        continue;
                    }

                    // Debug logging using Zotero's system
                    Zotero.debug("Selected item:");
                    Zotero.debug(item);
                    Zotero.debug("Item type: " + item.itemType);
                               
                    let data = await fetchOpenAlexJSON(item,window);
                    if (!data) {
                        if (num_items==1) {
                            window.alert("No Work ID found for the selected item. Check the item's DOI");
                        }
                        continue;
                    }
                    let workID = data.id.split("/").pop();

                    Zotero.debug("Work ID:")
                    Zotero.debug(workID)

                    if (!workID) {
                        window.alert("No Work ID found for the selected item. Check the item's DOI");
                        continue;
                    }
                    
                    // Add the Work ID to the 'extra' field
                    let extra = item.getField('extra') || '';
                    if (!extra.includes(`OpenAlex Work ID:`)) {
                        // Add the OpenAlex Work ID
                        extra += (extra ? '\n' : '') + `OpenAlex Work ID: ${workID}`;
                        item.setField('extra', extra);
                        await item.saveTx(); // Save the changes to the item
                        num_items_added += 1;
                        if (num_items==1) {
                            window.alert("OpenAlex Work ID added to 'extra' field.");
                        }
                    } else {
                        // Work ID already added
                        if (num_items==1) {
                            window.alert("OpenAlex Work ID already exists for the selected item, no changes made.");
                        }
                    }
                }
                if (num_items > 1) {
                    window.alert(`Finished adding OpenAlex Work IDs to ${num_items} items (${num_items_added} new).`)
                }
            } catch (error) {
                Zotero.debug("Error adding OpenAlex Work ID:", error);
                window.alert("An error occurred while processing the OpenAlex Work ID.");
            }
        });
        itemMenuPopup.appendChild(menuItem);

        itemMenuPopup.addEventListener("popupshowing", () => {
            menuItem.hidden = Zotero.getActiveZoteroPane().getSelectedItems().length === 0;
        });
    },

    removeFromWindow(window) {
        let document = window.document;
        let menuItem = document.getElementById("workid-menuitem");
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

// Example function to fetch OpenAlex Work ID (this is a placeholder)
async function fetchOpenAlexJSON(item,window) {
    // Example: Use a doi to search OpenAlex
    let doi = item.getField('DOI');
    Zotero.debug("DOI:")
    Zotero.debug(doi)

    if (!doi) {        
        return null;
    }

    // More carefully convert to string and check its value
    doi = String(doi).trim();
    Zotero.debug("DOI after string conversion:");
    Zotero.debug(doi);

    if (!doi) {
        Zotero.debug("DOI is empty after conversion");
        return null;
    }

    if (doi.startsWith("10")) {
        doi = `https://doi.org/${doi}`;
        Zotero.debug("DOI after URL conversion:");
        Zotero.debug(doi);
    }

    full_api_url = `https://api.openalex.org/works/${doi}`
    Zotero.debug("Full API URL:")
    Zotero.debug(full_api_url)
    let response = await fetch(full_api_url);    
    if (response.ok) {
        let data = await response.json();
        Zotero.debug("Data:")
        Zotero.debug(data)        
        return data;
    }
    return null;
}

if (typeof window === 'undefined') {
    this.OpenAlexWorkID = OpenAlexWorkID;
}