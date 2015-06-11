var assign = require('object-assign')
    , EventEmitter = require('events').EventEmitter
    , AppDispatcher = require('../dispatcher/AppDispatcher.js')
    , ContactListConstants = require('../constants/ContactListConstants')
    , MatrixActions = require('../actions/MatrixActions')
    ;

var contactListState = {
    contacts: []
};


var ContactListStore = assign({}, EventEmitter.prototype, {
    emitChange: function () {
        this.emit('change');
    },

    getState: function () {
        return contactListState;
    }
});

AppDispatcher.register(function (payload) {
    var action = payload.action;

    console.log(payload);

    switch (action.actionType) {
        case ContactListConstants.FETCH_CONTACTS:
            MatrixActions.fetchContactlist();
            break;

        case ContactListConstants.CONTACTS:
            contactListState.contacts = payload.contacts;
            ContactListStore.emitChange();
            console.log(contactListState);
            break;
    }

    return true;
});


module.exports = ContactListStore;