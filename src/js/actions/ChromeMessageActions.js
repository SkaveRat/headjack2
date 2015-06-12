var AppDispatcher = require('../dispatcher/AppDispatcher.js')
    , ContactListConstants = require('../constants/ContactListConstants')
    , ChromeMessageService = require('../services/ChromeMessageService')
    ;


var ChromeMessageActions = {
    load: function () {

        ChromeMessageService.on('event', function(event) {
            AppDispatcher.dispatchEvent(event);
        });

    }
};

module.exports = ChromeMessageActions;