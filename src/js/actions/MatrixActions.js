var ChromeMessageService = require('../services/ChromeMessageService')
    ;

var MatrixActions = {
    fetchContactlist: function () {
        ChromeMessageService.send('contactlist.load');
    }
};


module.exports = MatrixActions;