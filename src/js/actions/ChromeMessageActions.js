var AppDispatcher = require('../dispatcher/AppDispatcher.js')
    , ContactListConstants = require('../constants/ContactListConstants')
    , ChromeMessageService = require('../services/ChromeMessageService')
    ;


var ChromeMessageActions = {
    load: function () {
        ChromeMessageService.on('rooms.list', function(rooms) {
            AppDispatcher.dispatch({
                action: {actionType: ContactListConstants.ROOM_LIST},
                data: rooms
            });
        });
    }
};

module.exports = ChromeMessageActions;