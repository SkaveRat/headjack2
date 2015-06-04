app.controller('ContactlistCtrl', ['$scope', 'chmsg', function ($scope, chmsg) {

    $scope.rooms = [];

    chmsg.send('contactlist.loaded');

    chmsg.on('room.listing', function (data) {
        $scope.rooms.push({
            room_id: data.room_id,
            user_id: data.user_id
        });
        $scope.$apply();
    });


    chmsg.on('room.alias', function (data) {
        $scope.rooms.forEach(function (foo) {
            if(foo.room_id == data.room_id) {
                foo.alias = data.alias;
                $scope.$apply();
            }
        });
    });



    //$scope.loading = true;
    //
    //$scope.accountcheck = { //TODO use spinner here
    //    display: false
    //};
    //$scope.loginform = {disabled: false};
    //
    //function getAccounts() {
    //    chmsg.send('account.getaccounts');
    //}
    //
    //chmsg.on('account.list', function (accounts) {
    //    $scope.accountcheck.display = !(accounts.length > 0);
    //    $scope.loading = (accounts.length > 0);
    //    $scope.$apply();
    //    console.log("loaded accounts. fetching contacts");
    //    if(accounts.length > 0) { //TODO genericify
    //        chmsg.send('account.startclient', accounts[0].user_id); //TODO use initialSync instead
    //    }
    //});
    //
    //
    //chmsg.on('event.data', onEvent);
    //
    ///**
    // *
    // * @param event MatrixEvent
    // */
    //function onEvent(event) {
    //    var foo = mxService.MatrixEvent(event);
    //    console.log(foo.getType());
    //    //console.log(mxService.MatrixEvent);
    //    //console.log(event.getType());
    //}

    //
    //chmsg.on('rooms.list', function (rooms) {
    //    $scope.rooms = rooms;
    //    $scope.loading = false;
    //    $scope.$apply();
    //});

    //getAccounts();
}]);