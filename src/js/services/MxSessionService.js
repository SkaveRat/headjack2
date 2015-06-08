var MatrixSession = require('../objects/MatrixSession')
    ;


var sessions = [];

var MxSessionService = {
    startSessions: function (accounts) {
        accounts.forEach(function (account) {
            var matrixSession = new MatrixSession(account);
            sessions.push(matrixSession);
        });
        return sessions;
    }
};

module.exports = MxSessionService;