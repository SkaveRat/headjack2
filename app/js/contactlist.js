headjackApp.controller('ContactlistCtrl', function ($scope, chmsg) {


    chmsg.on('rooms', function (message) {
        $scope.rooms = message.rooms;
        $scope.$apply();
    });

    /**
     * Window loaded, request an initial sync
     */
    chmsg.send('initsync');

});