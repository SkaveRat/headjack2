var Dispatcher = require('flux').Dispatcher
    , assign = require('object-assign')
    ;


var AppDispatcher = assign(new Dispatcher(), {
    dispatchEvent: function (data) {
        var event = data.event;
        this.dispatch({
            action: {
                actionType: event.type || 'm.unknown'
            },
            event: event
        });
    }
});

module.exports = AppDispatcher;