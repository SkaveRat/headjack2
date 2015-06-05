'use strict';

angular.module('accountmanagerService', [])
    .factory('accountmanagerService', [
        'chmsg',
        function (chmsg) {

            /**
             * @param accountData
             * @returns Q
             */
            function addAccount(accountData) {
                var deferred = Q.defer();
                chrome.storage.local.set(
                    {accounts: [accountData]},
                    function () {
                        deferred.resolve(accountData.user_id);
                    }
                );
                return deferred.promise;
            }

            function getAccount(user_id) {
                var deferred = Q.defer();
                chrome.storage.local.get("accounts", function (accounts) {
                    angular.forEach(accounts.accounts, function (account) {
                        if(account.user_id == user_id)
                            deferred.resolve(account);
                    })
                });
                return deferred.promise;
            }

            /**
             * @returns Promise
             */
            function getAccounts() {
                var deferred = Q.defer();
                chrome.storage.local.get("accounts", function (accounts) {
                    deferred.resolve(accounts.accounts);
                });
                return deferred.promise;
            }

            return {
                addAccount: addAccount,
                getAccount: getAccount,
                getAccounts: getAccounts
            }
        }
    ]
);