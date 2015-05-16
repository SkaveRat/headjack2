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

    }]);
});
