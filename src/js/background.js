var   AccountManagerService = require('./services/AccountManagerService')
    , MxSessionService = require('./services/MxSessionService')
    ;

chrome.app.runtime.onLaunched.addListener(function (launchData) {

    chrome.app.window.create('index.html', {
        id: "Contactlist",
        innerBounds: {
            width: 350,
            height: 600,
            left: 0,
            top: 0
        }
    });

    chrome.runtime.onMessage.addListener(function (message) {
        AccountManagerService.getAccounts()
        .then(function (credentials) {
                MxSessionService.startSessions(credentials);
            });
    });
});