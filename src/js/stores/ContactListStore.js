var assign = require('object-assign')
    , EventEmitter = require('events').EventEmitter
    , AppDispatcher = require('../dispatcher/AppDispatcher.js')
    , ContactListConstants = require('../constants/ContactListConstants')
    , MatrixTypeConstants = require('../constants/MatrixTypeConstants')
    , MatrixActions = require('../actions/MatrixActions')
    ;

var CHANGE_EVENT = 'change';

var contactListState = {
    rooms: []
};


var ContactListStore = assign({}, EventEmitter.prototype, {
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    getState: function () {
        return contactListState;
    }
});

AppDispatcher.register(function (payload) {
    var action = payload.action;

    switch (action.actionType) {

        case ContactListConstants.ROOM_LIST:
            contactListState.rooms = payload.data;
            ContactListStore.emitChange();
            break;
        case ContactListConstants.FETCH_CONTACTS:
            MatrixActions.fetchContactlist();
            break;
    }

    return true;
});

module.exports = ContactListStore;