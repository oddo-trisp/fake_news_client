import {
    loadTabState,
    formatNotificationBadge,
    getCurrentTab,
    createRequests,
    setTabState, getTabState,
    removeTab
} from "./utils.js";

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    formatNotificationBadge(-1, "");
    if (changeInfo.status === 'complete' && tab.active) {
        getCurrentTab((tab) => {
            loadTabState(tab);
        });
    }
})

chrome.tabs.onActivated.addListener( function (tabId, changeInfo, tab) {
    formatNotificationBadge(-1, "");
    getCurrentTab((tab) => {
        loadTabState(tab);
    });
})

chrome.tabs.onRemoved.addListener(function(tabId) {
    removeTab(tabId);
})

chrome.runtime.onMessage.addListener((message, sender, response) => {
    switch (message.type) {
        case 'INIT_POPUP':
            const activeState = getTabState(message.tabId);
            response(activeState);
            break;
        case 'UPDATE_POPUP':
            setTabState(message.tabId, message.url, message.probability, message.probabilityText, message.article, message.enabled);
            response("OK");
            break;
        case 'GET_CURRENT_TAB':
            getCurrentTab((tab) => response(tab));
            return true;        //To send asynchronous response
        case 'CREATE_REQUESTS':
            createRequests(message.currentURL).then(resp => response(resp));
            return true;        //To send asynchronous response
        default:
            response('Unknown Request');
            break;
    }
});

