(function () {
    'use strict';

    angular.module('app')
        .factory('AccountService', [
            '$q', 'CART_EVENTS', '$rootScope', '$http', 'API', 'CONSTANTS',
            function ($q, CART_EVENTS, $rootScope, $http, API, CONSTANTS) {
                var factory = {};


                //-----------login BEGIN------------------
                factory.login = function (user) {
                    //console.log(user);
                    return $q(
                        function (resolve, reject) {
                            $http({
                                method: 'POST',
                                url: API.url + 'login' + '?clientId=' + clientId,
                                transformRequest: function (obj) {
                                    var str = [];
                                    for (var p in obj)
                                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                    return str.join("&");
                                },
                                data: user,
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                            }).success(function (resp) {
                                resolve(resp);
                                console.log(resp);
                                $rootScope.$broadcast(CONSTANTS.AuthChanged);
                            }).error(function (err) {
                                reject(err);
                                //console.log(err);
                            })
                        });
                };
                //-----------login END--------------------


                //-----------login BEGIN------------------
                factory.logout = function () {
                    $rootScope.$broadcast(CONSTANTS.AuthChanged);
                    return $q(
                        function (resolve, reject) {
                            $http({
                                method: 'POST',
                                url: API.url + 'logout' + '?clientId=' + clientId,
                            }).success(function (resp) {
                                resolve(resp);
                                //console.log(resp)
                            }).error(function (err) {
                                reject(err);
                                //console.log(err);
                            })
                        });
                };

                //-----------login BEGIN------------------
                factory.register = function (data) {
                    // $rootScope.$broadcast('auth-event');
                    return $q(
                        function (resolve, reject) {
                            $http({
                                method: 'POST',
                                url: API.url + 'user/my-register' + '?clientId=' + clientId,
                                data: data
                            }).success(function (resp) {
                                resolve(resp);
                                //console.log(resp)
                            }).error(function (err) {
                                reject(err);
                                //console.log(err);
                            })
                        });
                };

                /**
                 * change password
                 * */
                factory.changePassword = function (user) {
                    //console.log(user);
                    return $q(
                        function (resolve, reject) {
                            $http({
                                method: 'POST',
                                url: API.url + 'v1/user/password' + '?clientId=' + clientId,
                                transformRequest: function (obj) {
                                    var str = [];
                                    for (var p in obj)
                                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                    return str.join("&");
                                },
                                data: user,
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                            }).success(function (resp) {
                                resolve(resp);
                            }).error(function (err) {
                                reject(err);
                            })
                        });
                };

                factory.getProfile = function () {
                    return $q(
                        function (resolve, reject) {
                            return $http({
                                method: 'GET',
                                url: API.url + 'user/profile?embedded=role' + '&clientId=' + clientId,
                            }).then(
                                function (resp) {
                                    resolve(resp);
                                }, function (err) {
                                    reject(err);
                                });
                        });
                };

                factory.resetPassword = function (oldPassword, newPassword, confirmPassword) {
                    return $q(
                        function (resolve, reject) {
                            return $http({
                                method: 'POST',
                                url: API.url + 'user/password?oldPassword='+ oldPassword +'&newPassword=' + newPassword +'&confirmPassword=' + confirmPassword + '&clientId=' + clientId,
                            }).then(
                                function (resp) {
                                    resolve(resp);
                                }, function (err) {
                                    reject(err);
                                });
                        });
                };

                factory.resetPassword = function (user) {
                    return $q(
                        function (resolve, reject) {
                            return $http({
                                method: 'POST',
                                url: API.url + 'find-pwd-send-log/apply' + '?clientId=' + clientId,
                                transformRequest: function (obj) {
                                    var str = [];
                                    for (var p in obj)
                                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                                    return str.join("&");
                                },
                                data: user,
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
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
