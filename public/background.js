let tabState = new Map()

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    console.log("Ekso 11111"+changeInfo.status);
    if (changeInfo.status === 'complete' && tab.active) {
        console.log("Mesa");
        chrome.tabs.executeScript(tab.id, {
            file: 'index.js'
        });
        //window.location.assign("/index.html");
    }
})

chrome.runtime.onMessage.addListener((message, sender, response) => {
    console.log("Receive message: "+message.type+"\n");
    switch (message.type) {
        case 'INIT_POPUP':
            const activeState = tabState.get(message.tabId);
            if(activeState !== undefined)
                formatNotificationBadge(activeState.probability, activeState.probabilityText);

            response(activeState);
            break;
        case 'UPDATE_POPUP':
            formatNotificationBadge(message.probability, message.probabilityText);

            // Save tab's state
            const state = {probabilityText: message.probabilityText, probability: message.probability};
            tabState.set(message.tabId, state);

            response("OK");
            break;
        default:
            response('Unknown Request');
            break;
    }
});

function formatNotificationBadge(probability, probabilityText){
    // Format notification badge
    const badgeColor = probability <= 20 ? 'green' : probability > 20 && probability <= 60 ? "orange" : "red";
    chrome.browserAction.setBadgeText({text: probabilityText});
    chrome.browserAction.setBadgeBackgroundColor({color: badgeColor});
}