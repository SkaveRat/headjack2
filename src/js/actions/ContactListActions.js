var AppDispatcher = require('../dispatcher/AppDispatcher.js')
    , ContactListConstants = require('../constants/ContactListConstants')
    ;


var ContactListActions = {
    fetchContactlist: function () {
        AppDispatcher.dispatch({
            action: {
                actionType: ContactListConstants.FETCH_CONTACTS
            }
        });
    }
};

module.exports = ContactListActions;