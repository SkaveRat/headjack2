chrome.app.runtime.onLaunched.addListener(function (launchData) {

    var app = angular.module('app', [
        'mxService',
        'mxSessionService',
        'mxRoomService',
        'accountmanagerService',
        'eventhandlerService',
        'chmsg'
    ]);

    angular.element(document).ready(function () {
        angular.bootstrap(document, ['app']);
    });

    app.run(
        ['mxService', 'accountmanagerService', 'mxSessionService', 'eventhandlerService', 'chmsg',
        function (mxService, accountmanagerService, mxSessionService, eventhandlerService, chmsg) {
            chrome.app.window.create('index.html', {
                id: "Contactlist",
                innerBounds: {
                    width: 350,
                    height: 600,
                    left: 0,
                    top: 0
                }
            });

            chmsg.on('contactlist.loaded', function () {
                accountmanagerService.getAccounts()
                    .then(mxSessionService.startSessions)
                    .then(function (sess) {
                        //console.log(sess[0].getUserId());
                    });
            });

        //chmsg.on('account.getaccounts', function () {
        //    accountmanagerService.getAccounts()
        //        .then(function (accounts) {
        //            accounts = accounts || [];
        //            chmsg.send('account.list', accounts);
        //        });
        //});
        //
        //chmsg.on('account.startclient', function (user_id) {
        //    accountmanagerService.getAccount(user_id)
        //        .then(function (credentials) {
        //            mxService.startClient(credentials, eventhandlerService.parseEvents);
        //            return credentials;
        //        })
        //        .then(function (credentials) {
        //            console.log(credentials);
        //
        //        });
        //});
        //
        //chmsg.on('account.login', function (logindata, callback) {
        //    mxService.login(logindata)
        //        .then(function (accountdata) {
        //            accountmanagerService.addAccount(accountdata)
        //                .then(function (user_id) {
        //                   chmsg.send('contacts.refresh');
        //                });
        //        });
        //        //TODO fail state
        //});
        //
        //chmsg.on('room.open', function (msg) {
        //    chrome.app.window.create('chat.html', {
        //        id: msg.room_id,
        //        innerBounds: {
        //            width: 800,
        //            height: 600,
        //            left: 0,
        //            top: 0
        //        }
        //    },
        //    function(createdWindow) { //inject data into new window
        //        createdWindow.contentWindow.room_id = msg.room_id;
        //        createdWindow.contentWindow.user_id = msg.user_id;
        //    })
        //});
        //
        //chmsg.on('room.initsync', function (msg) {
        //    var room_id = msg.room_id;
        //    var user_id = msg.user_id;
        //    accountmanagerService.getAccount(user_id)
        //        .then(function (credentials) {
        //            return mxService.getRoomInitSync(credentials, room_id)
        //        })
        //        .then(function (roomData) {
        //            chmsg.send('room.data', roomData);
        //        });
        //});
        //
        //chmsg.on('message.send', function (data) {
        //    accountmanagerService.getAccount(data.user_id)
        //        .then(function (credentials) {
        //            mxService.sendMessage(credentials, data);
        //        })
        //});


        //chmsg.on('events.start', function (msg) {
        //    accountmanagerService.getAccount(msg.user_id)
        //        .then(function (credentials) {
        //            return [credentials, msg.from];// requestEventloop(credentials, msg.from)
        //        })
        //        .then(requestEventloop);
        //});
        //
        //function requestEventloop(requestdata) {
        //        var credentials = requestdata[0];
        //        var from = requestdata[1];
        //        mxService.events(credentials, from)
        //            .then(function (eventData) {
        //                eventhandlerService.parseEvents(eventData.chunk);
        //                return [credentials, eventData.end];
        //            })
        //            .then(requestEventloop);
        //}

    }]);
});
