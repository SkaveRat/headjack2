var headjackApp = angular.module('headjackApp', ['ngResource', 'matrixService', 'chmsg']);
headjackApp.filter('keylength', function(){
    return function(input){
        if(!angular.isObject(input)){
            throw Error("Usage of non-objects with keylength filter!!")
        }
        return Object.keys(input).length;
    }
});

headjackApp.directive('mxContactlistEntry', ['chmsg', function (chmsg) {
    return {
        templateUrl: "templates/contactlistItem.html",
        scope: {
            room: '='
        },
        restrict: 'E',
        link: function(scope, element, attr) {
            scope.openRoom = function(room_id) {
                chmsg.send('open_room', {room_id: room_id});
            };
        }
    }
}]);