headjackApp.controller('RoomCtrl', function ($scope, chmsg, $window) {

    var room_id = $window.room_id;

    chmsg.send('room_initsync', {room_id: room_id});

    chmsg.on('room_initdata', function(message) {
        if(message.room.room_id == room_id) {
            console.log(message);
            $scope.room = message.room;
            $scope.$apply();
        }
    })



});