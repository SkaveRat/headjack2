var headjackApp = angular.module('headjackApp', ['ngResource', 'chmsg', 'ngMaterial', 'ngAnimate', 'ngAria', 'ngRoute']);
headjackApp.config(['$mdThemingProvider', function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('lime')
}]);

headjackApp.filter('keylength', function(){
    return function(input){
        if(!angular.isObject(input)){
            throw Error("Usage of non-objects with keylength filter!!")
        }
        return Object.keys(input).length;
    }
});

headjackApp.filter('mx_room_alias', ['mx_room_membersFilter', function (mx_room_membersFilter) {
    return function(room) {
        var alias = '';
        if(!room) { return ''; }

        angular.forEach(room.state, function (state) {
            if(state.type=='m.room.aliases') {
                alias = state.content.aliases[0];
            }
        });

        var members = mx_room_membersFilter(room);
        if(members.length <= 2) {
            if(members[0] == room.me) { //remove own account
                alias = members[1]
            }else{
                alias = members[0]
            }
        }
        return alias;
    }
}]);

//TODO use displaynames
//TODO number not correct. Name changes? Leavings?
headjackApp.filter('mx_room_members', function () {
    return function (room) {
        var members = [];
        angular.forEach(room.state, function (state) {
            if(state.type=='m.room.member') {
                members.push(state.user_id);
            }
        });
        return members;
    }
});

headjackApp.filter('mx_room_messages', function () {
    return function (room) {
        if(!room) { return []; }
        var messages = [];
        angular.forEach(room.messages.chunk, function (message) {
            if(message.type=='m.room.message') {
                messages.push(message);
            }
        });
        return messages;
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
            scope.openRoom = function(room_id, user_id) {
                chmsg.send('room.open', {room_id: room_id, user_id: user_id});
            };
        }
    }
}]);

headjackApp.directive('mxAvatar', ['chmsg', function (chmsg) {
    return {
        template: '<img src="{{ avatar_url }}" class="circle" />',
        scope: {
            user_id: '=userId'
        },
        restrict: 'E',
        link: function(scope, element, attr) {
            scope.avatar_url = 'data:image/png;base64,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';
        }
    }
}]);