var assign = require('object-assign')
    , EventEmitter = require('events').EventEmitter
    , AppDispatcher = require('../dispatcher/AppDispatcher.js')
    , ContactListConstants = require('../constants/ContactListConstants')
    , MatrixTypeConstants = require('../constants/MatrixTypeConstants')
    , MatrixActions = require('../actions/MatrixActions')
    ;

var contactListState = {
    rooms: []
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

    switch (action.actionType) {

        case MatrixTypeConstants.M_ROOM_MEMBER:
            console.log(payload.event);
            break;

        case ContactListConstants.FETCH_CONTACTS:
            MatrixActions.fetchContactlist();
            break;
    }

    return true;
});

module.exports = ContactListStore;