var ChromeMessageService = {

    send: function(type, message, responseCallback) {
    chrome.runtime.sendMessage(
        {
            type: type,
            message: message
        },
        responseCallback
    );
},

on: function(type, callback) {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.type == type) {
            callback(message.message, sendResponse)
        }
    });
}


};

module.exports = ChromeMessageService;