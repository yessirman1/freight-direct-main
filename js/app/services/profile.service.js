(function () {
    'use strict';

    angular.module('app')
        .factory('ProfileService', [
            '$q', '$interval', '$timeout', '$rootScope', '$http', 'API', 'AuthService', 'CONSTANTS','ngDialog', 'ngToast',
            function ($q, $interval, $timeout, $rootScope, $http, API, AuthService, CONSTANTS, ngDialog, ngToast) {
                var factory = {};
                var entity = 'profile';

                factory.getCoin = function () {
                    return $q(
                        function (resolve, reject) {
                            return $http({
                                method: 'GET',
                                url: API.url + 'user/' + entity + '?fields=coin' + API.tokenStr
                            }).then(
                                function (resp) {
                                    resolve(resp);
                                }, function (err) {
                                    reject(err);
                                });
                        });
                };

                return factory;

            }]);

})();