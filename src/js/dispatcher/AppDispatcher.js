var Dispatcher = require('flux').Dispatcher
    , assign = require('object-assign')
    ;


var AppDispatcher = assign(new Dispatcher(), {});

module.exports = AppDispatcher;