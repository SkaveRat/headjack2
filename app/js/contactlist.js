headjackApp.controller('ContactlistCtrl', function ($scope, chmsg) {

    $scope.loading = true;

    $scope.accountcheck = { //TODO use spinner here
        display: false
    };
    $scope.loginform = {disabled: false};

    $scope.checkLogin = function () {
        $scope.loginform.disabled = true;
        chmsg.send('account.login', $scope.loginform);
    };

    function getAccounts() {
        chmsg.send('account.getaccounts');
    }

    chmsg.on('account.list', function (accounts) {
        $scope.accountcheck.display = !(accounts.length > 0);
        $scope.loading = (accounts.length > 0);
        $scope.$apply();
        console.log("loaded accounts. fetching contacts");
        if(accounts.length > 0) { //TODO genericify
            chmsg.send('rooms.get', accounts[0].user_id); //TODO use initialSync instead
        }
    });

    chmsg.on('rooms.list', function (rooms) {
        $scope.rooms = rooms;
        $scope.loading = false;
        $scope.$apply();
    });

    chmsg.on('contacts.refresh', function () {
        getAccounts();
    });

    getAccounts();
});