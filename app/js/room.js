headjackApp.controller('RoomCtrl', function ($scope, chmsg, $window) {

    var room_id = $window.room_id;

    chmsg.send('room_initsync', {room_id: room_id}, function (roomdata) {
        $scope.room = roomdata;
        $scope.$apply();
    });

    $scope.sendMsg = function () {
        chmsg.send('send_msg', {
            msg: $scope.msg,
            room_id: room_id
        })
    }

});