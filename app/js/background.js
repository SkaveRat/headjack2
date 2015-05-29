chrome.app.runtime.onLaunched.addListener(function (launchData) {

    var headjackApp = angular.module('headjackApp', [
        'mxService',
        'accountmanagerService',
        'eventhandlerService',
        'chmsg'
    ]);

    angular.element(document).ready(function () {
        angular.bootstrap(document, ['headjackApp']);
    });

    headjackApp.run(
        ['mxService', 'accountmanagerService', 'eventhandlerService', 'chmsg',
        function (mxService, accountmanagerService, eventhandlerService, chmsg) {
        chrome.app.window.create('index.html', {
            id: "Contactlist",
            innerBounds: {
                width: 350,
                height: 600,
                left: 0,
                top: 0
            }
        });

        chmsg.on('account.getaccounts', function () {
            accountmanagerService.getAccounts()
                .then(function (accounts) {
                    accounts = accounts || [];
                    chmsg.send('account.list', accounts);
                });
        });

        chmsg.on('events.initsync', function (user_id) {
            accountmanagerService.getAccount(user_id)
                .then(mxService.initialSync)
                .then(function (syncData) {
                    chmsg.send('rooms.list', syncData.rooms);
                    chmsg.send('events.start', {user_id: user_id, from: syncData.end});
                });
        });

        chmsg.on('account.login', function (logindata, callback) {
            mxService.login(logindata)
                .then(function (accountdata) {
                    accountmanagerService.addAccount(accountdata)
                        .then(function (user_id) {
                           chmsg.send('contacts.refresh');
                        });
                });
                //TODO fail state
        });

        chmsg.on('room.open', function (msg) {
            chrome.app.window.create('room.html', {
                id: msg.room_id,
                innerBounds: {
                    width: 800,
                    height: 600,
                    left: 0,
                    top: 0
                }
            },
            function(createdWindow) { //inject data into new window
                createdWindow.contentWindow.room_id = msg.room_id;
                createdWindow.contentWindow.user_id = msg.user_id;
            })
        });

        chmsg.on('room.initsync', function (msg) {
            var room_id = msg.room_id;
            var user_id = msg.user_id;
            accountmanagerService.getAccount(user_id)
                .then(function (credentials) {
                    return mxService.getRoomInitSync(credentials, room_id)
                })
                .then(function (roomData) {
                    chmsg.send('room.data', roomData);
                });
        });


        chmsg.on('events.start', function (msg) {
            accountmanagerService.getAccount(msg.user_id)
                .then(function (credentials) {
                    return [credentials, msg.from];// requestEventloop(credentials, msg.from)
                })
                .then(requestEventloop);
        });

        function requestEventloop(requestdata) {
                var credentials = requestdata[0];
                var from = requestdata[1];
                mxService.events(credentials, from)
                    .then(function (eventData) {
                        eventhandlerService.parseEvents(eventData.chunk);
                        return [credentials, eventData.end];
                    })
                    .then(requestEventloop);
        }

    }]);
});
