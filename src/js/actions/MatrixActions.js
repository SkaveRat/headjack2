

var MatrixActions = {
    fetchContactlist: function () {
        chrome.runtime.sendMessage('foobar');
    }
};


module.exports = MatrixActions;