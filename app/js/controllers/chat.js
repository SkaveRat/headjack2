headjackApp.controller('RoomCtrl', function ($scope, chmsg, $window) {

    var room_id = $window.room_id;
    var user_id = $window.user_id;

    chmsg.send('room.initsync', {room_id: room_id, user_id: user_id});

    chmsg.on('room.data', function (roomdata) {
        $scope.room = roomdata;
        $scope.$apply();

        chmsg.on('event.data', function (data) {
            if (data.type == 'm.room.message' && data.room_id == room_id) {
                $scope.room.messages.chunk.push(data);
                $scope.$apply();
            }
        });
    });


    $scope.sendMessage = function () {
        console.log($scope.msg);
    };

    //
    //$scope.sendMsg = function () {
    //    chmsg.send('send_msg', {
    //        msg: $scope.msg,
    //        room_id: room_id
    //    })
    //}

});