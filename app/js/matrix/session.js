define(['jquery', 'promise'], function($, Promise) {

    var MatrixSession = function (sessionData) {
        this._access_token = sessionData.access_token
    };

    return MatrixSession;
});