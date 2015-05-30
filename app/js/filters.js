app.filter('keylength', function(){
    return function(input){
        if(!angular.isObject(input)){
            throw Error("Usage of non-objects with keylength filter!!")
        }
        return Object.keys(input).length;
    }
});

app.filter('mx_room_alias', ['mx_room_membersFilter', function (mx_room_membersFilter) {
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
app.filter('mx_room_members', function () {
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

app.filter('mx_room_messages', function () {
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