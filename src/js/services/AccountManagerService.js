var RSVP = require('rsvp')
    ;

var AccountManagerService = {
    addAccount: function (accountData) {
        var deferred = RSVP.defer();
        chrome.storage.local.set(
            {accounts: [accountData]},
            function () {
                deferred.resolve(accountData.user_id);
            }
        );
        return deferred.promise;
    },

    getAccount: function (user_id) {
        var deferred = RSVP.defer();
        chrome.storage.local.get("accounts", function (accounts) {
            angular.forEach(accounts.accounts, function (account) {
                if (account.user_id == user_id)
                    deferred.resolve(account);
            })
        });
        return deferred.promise;
    },

    /**
     * @returns Promise
     */
    getAccounts: function () {
        var deferred = RSVP.defer();
        chrome.storage.local.get("accounts", function (accounts) {
            deferred.resolve(accounts.accounts);
        });
        return deferred.promise;
    }

};

module.exports = AccountManagerService;