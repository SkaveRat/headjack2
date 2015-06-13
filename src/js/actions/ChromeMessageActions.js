var AppDispatcher = require('../dispatcher/AppDispatcher.js')
    , ContactListConstants = require('../constants/ContactListConstants')
    , ChromeMessageService = require('../services/ChromeMessageService')
    ;


var ChromeMessageActions = {
    initializeListeners: function () {
        ChromeMessageService.on('rooms.list', function(rooms) {
            AppDispatcher.dispatch({
                action: {actionType: ContactListConstants.ROOM_LIST},
                data: rooms
            });
        });
    },
    
    openRoom: function (room_id) {
        ChromeMessageService.send('room.open', room_id);
    }
    
};

module.exports = ChromeMessageActions;