headjackApp.controller('ContactlistCtrl', function ($scope, chmsg) {

    $scope.openRoom = function(room_id) {
        console.log(room_id);
        chmsg.send('open_room', {room_id: room_id});
    };

    chmsg.on('rooms', function (message) {
        $scope.rooms = message.rooms;
        $scope.$apply();
    });

    /**
     * Window loaded, request an initial sync
     */
    chmsg.send('initsync');

});