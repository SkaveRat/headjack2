chrome.app.runtime.onLaunched.addListener(function (launchData) {

    var headjackApp = angular.module('headjackApp', [
        'mxService',
        'accountmanagerService',
        'chmsg'
    ]);

    angular.element(document).ready(function () {
        angular.bootstrap(document, ['headjackApp']);
    });

    headjackApp.run(['mxService', 'accountmanagerService', 'chmsg', function (mxService, accountmanagerService, chmsg) {
        chrome.app.window.create('contactlist.html', {
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

        chmsg.on('rooms.get', function (user_id) {
            accountmanagerService.getAccount(user_id)
                .then(mxService.getRooms)
                .then(function (rooms) {
                    chmsg.send('rooms.list', rooms);
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
        })
    }]);
});
