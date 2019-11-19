//
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.method === 'showAlert') {
        chrome.tabs.create({ url: chrome.extension.getURL('signup.html')});
    }
});
