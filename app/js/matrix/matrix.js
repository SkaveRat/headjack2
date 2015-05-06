define(['jquery', 'matrix/session', 'promise'], function($, MatrixSession, Promise){

    var Matrix = function() {};

    Matrix.prototype.createPasswordSession = function(username, password) {

        var loginRequest = $.ajax({
            url: 'https://matrix.org/_matrix/client/api/v1/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                "type": "m.login.password",
                "user": username,
                "password": password
            })
        });

        function createSession(data) {
            return new MatrixSession(data)
        }

        var requestpromise = Promise.cast(loginRequest);
        return requestpromise.then(createSession);

    };

    /**
     *
     * @param session MatrixSession
     */
    Matrix.prototype.initialSync = function (session) {

        console.log(session);

        var initialSyncRequest = $.ajax({
            method: 'GET',
            url: 'https://matrix.org/_matrix/client/api/v1/initialSync',
            data: {
                'access_token': session._access_token
            }
        });

        return Promise.cast(initialSyncRequest);
    };

    return Matrix;
});
