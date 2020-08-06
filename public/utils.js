const apiURL = "http://localhost:5000/";
let tabState = new Map();

/*global chrome*/
export function getCurrentTab(callback) {
    chrome.tabs.query({
            active: true,
            currentWindow: true
        },
        (tabs) => {
            callback(tabs[0]);
        });
}

function createRequestOptions(httpMethod, body){
    return {
        method: httpMethod,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    };
}

function createApiURL(suffix){
    return apiURL + suffix;
}

export async function createRequests(url){
    try {
        let article =  await createScraperRequest(url);
        return await createPredictRequest(article);
    }
    catch (error) {
        console.error('There was an error calling the API!', error);
    }
}

async function createScraperRequest(url) {
    // POST request using fetch with error handling
    const currentURL = {"url": url};
    const requestOptions = createRequestOptions('POST', currentURL);
    const apiURL = createApiURL('scraper');
    return await fetch(apiURL, requestOptions)
        .then(async response => {
            const data = await response.json();
            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }
            return {"title": data.title, "text": data.text};

        });
}

async function createPredictRequest(article) {
    // POST request using fetch with error handling
    const requestOptions = createRequestOptions('POST', article);
    const apiURL = createApiURL('predict');
    return  await fetch(apiURL, requestOptions)
        .then(async response => {
            const data = await response.json();

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }

            return data.probability;

        })
}

export function formatNotificationBadge(probability, probabilityText){
    // Format notification badge
    const badgeColor = probability === -1 ? null
        : probability <= 20 ? 'green'
            : probability > 20 && probability <= 60 ? 'orange' :
                'red';
    chrome.browserAction.setBadgeText({text: probabilityText});
    chrome.browserAction.setBadgeBackgroundColor({color: badgeColor});
}

export function loadTabState(tab){
    if(!isURL(tab.url))
        return;

    const activeState = getTabState(tab.id);
    if(activeState ===  undefined || (activeState.enabled && activeState.url !== tab.url))
        createTabState(tab);
    else
        formatNotificationBadge(activeState.probability, activeState.probabilityText);
}

export function createTabState(tab){
    createRequests(tab.url).then(probability => {
        if(probability){
            // Format probabilities
            const probabilityNumber = parseFloat(probability) * 100;
            const probabilityPercentage = probabilityNumber.toString() + " %";

            setTabState(tab.id, tab.url, probabilityNumber, probabilityPercentage, true);
        }
        else {
            console.error('There was an error prediction!');
        }
    });
}

export function setTabState(tabId, url, probabilityNumber, probabilityPercentage, enabled){
    formatNotificationBadge(probabilityNumber, probabilityPercentage);

    // Save tab's state
    const state = {probabilityText: probabilityPercentage, probability: probabilityNumber, url:url, enabled:enabled};
    tabState.set(tabId, state);

}

export function getTabState(tabId){
    return tabState.get(tabId);
}

export function removeTab(tabId){
    if(tabState.has(tabId))
        tabState.delete(tabId);
}

function isURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ //port
        '(\\?[;&amp;a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i');
    return pattern.test(str);
}

export function printTabStates(){
    tabState.forEach((value, key, map) => {
        console.log(`m[${key}] = ${value}`);
    });
}