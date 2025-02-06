(function () {
    'use strict';

    angular.module('app')
    //--------------------Auth Service BEGIN------------------------------
        .service('AuthService', [
            '$q', '$http', 'ADMIN_ROLES', 'CONSTANTS', '$rootScope', '$window', '$document', '$timeout', 'AccountService', 'USER', 'KEYS',
            function ($q, $http, ADMIN_ROLES, CONSTANTS, $rootScope, $window, $document, $timeout, AccountService, USER, KEYS) {
                var LOCAL_TOKEN_KEY = KEYS.token;
                var username = '';
                // var isAuthenticated = false;
                var role = '';
                var authToken;
                var expiration;

                //the function will be called before anything else.
                loadUserCredentials();

                function checkAuthStatus() {
                    // console.log(isAuthenticated());
                    if (!isAuthenticated()) {
                        window.location.href = '/signin';
                        return;
                    }
                };

                function checkIfCredentialExpirated() {
                    var now = new Date();
                    // destroy credential if time expires
                    if (now > expiration) {
                        destroyUserCredentials();
                    }
                }

                function loadUserCredentials() {
                    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
                    if (token) {
                        useCredentials(token);
                        var object = JSON.parse(token);
                        username = object.username;
                        // set the expiration time to 1440 minutes
                        expiration = new Date(object.timestamp);
                        expiration.setMinutes(expiration.getMinutes() + 1440);
                    }
                }

                function storeUserCredentials(token) {
                    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
                    useCredentials(token);
                }

                //set authToken
                //get role from token
                //set token as header for your next requests
                function useCredentials(token) {
                    //username = token.split('.')[0];
                    var tk = JSON.parse(token);
                    username = tk.username;
                    authToken = token;
                    isAuthenticated = tk.isAuthenticated;
                    //set all users to admin role.
                    //role = USER_ROLES.admin
                    // Set the token as header for your next requests!
                    //$http.defaults.headers.common['X-Auth-Token'] = token;
                }

                function destroyUserCredentials() {
                    //remove everything in the localStorage
                    //angular.forEach($window.localStorage, function (i, v) {
                    //    $window.sessionStorage.removeItem(v);
                    //    ////console.log("item removed: "+ v);
                    //});
                    authToken = undefined;
                    username = '';
                    isAuthenticated = false;
                    ////console.log("destroyUserCredentials isAuthenticated: " + isAuthenticated);
                    //$http.defaults.headers.common['X-Auth-Token'] = undefined;
                    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
                }

                //登陆
                var login = function (user) {
                    return $q(function (resolve, reject) {
                        AccountService.login(user).then(
                            function (success) {
                                console.log(success);
                                resolve(success);
                                var resultJson = {
                                    timestamp: new Date().getTime(),
                                    access_token: success.access_token,
                                    expires_in: success.expires_in,
                                    type: success.type,
                                    isAuthenticated: true
                                };
                                // $http.defaults.headers.common.Authorization = 'Bearer ' + $base64.encode(success.access_token);
                                $http.defaults.headers.common.Authorization = 'Bearer ' + success.access_token;

                                ////console.log(JSON.stringify(resultJson));
                                //storeUserCredentials(name + '.yourServerToken');

                                storeUserCredentials(JSON.stringify(resultJson));
                                loadUserCredentials();
                                isAuthenticated = true;
                                $rootScope.$broadcast(CONSTANTS.AuthChanged);
                                $rootScope.$broadcast('auth-event');
                            }, function (error) {
                                ////console.log(error);
                                reject(error);
                                destroyUserCredentials();
                            });
                    });
                };

                function getToken() {
                    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
                    if (token) {
                        var object = JSON.parse(token);
                        var accessToken = JSON.parse(token).access_token;
                        return accessToken;
                    } else {
                        return null;
                    }
                }

                var getSystemType = function () {
                    checkIfCredentialExpirated();
                    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
                    var systemType;
                    if (token) {
                        var object = JSON.parse(token);
                        systemType = JSON.parse(token).systemType;
                    }
                    return systemType;
                };


                var getMerchantType = function () {
                    checkIfCredentialExpirated();
                    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
                    var merchantType = '';
                    if (token) {
                        var object = JSON.parse(token);
                        merchantType = JSON.parse(token).merchantType;
                    }
                    return merchantType;
                };


                var getRole = function () {
                    checkIfCredentialExpirated();
                    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
                    if (token) {
                        var object = JSON.parse(token);
                        var role = JSON.parse(token).role;
                    } else {
                        role = '';
                    }
                    return role;
                };


                var isBroker = function () {
                    checkIfCredentialExpirated();
                    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
                    if (token) {
                        var object = JSON.parse(token);
                        var role = JSON.parse(token).role;
                        if (role === USER.broker) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                };

                var isAuthenticated = function () {
                    checkIfCredentialExpirated();
                    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
                    if (token) {
                       return JSON.parse(token).isAuthenticated;
                    } else {
                        return false;
                    }
                };


                var getUsername = function () {
                    checkIfCredentialExpirated();
                    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
                    if (token) {
                        var object = JSON.parse(token);
                        return JSON.parse(token).username;
                    } else {
                        return '';
                    }
                };

                //获得本用户信息
                var getInfo = function () {
                    checkIfCredentialExpirated();
                    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
                    if (token) {
                        var object = JSON.parse(token);
                        var administrator = JSON.parse(token);
                    } else {
                        administrator = {};
                    }
                    return administrator;
                };

                var logout = function () {
                    destroyUserCredentials();
                    $http.defaults.headers.common.Authorization = '';
                    $rootScope.$broadcast(CONSTANTS.AuthChanged);

                    return AccountService.logout({}, {},
                        function (success) {
                            ////console.log('authservice logout');
                            //console.log(success);
                            destroyUserCredentials();
                            $http.defaults.headers.common.Authorization = '';
                            $rootScope.$broadcast(CONSTANTS.AuthChanged);
                        }, function (error) {
                            //console.log(error);
                            destroyUserCredentials();
                            $http.defaults.headers.common.Authorization = '';
                            $rootScope.$broadcast(CONSTANTS.AuthChanged);
                        });
                };

                var isAuthorized = function (authorizedRoles) {
                    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
                    if (token) {
                        var object = JSON.parse(token);
                        isAuthenticated = JSON.parse(token).isAuthenticated;
                    } else {
                        isAuthenticated = false;
                    }
                    //if authorizedRoles is not an array, make an array
                    ////console.log("authorizedRoles" + authorizedRoles);
                    if (!angular.isArray(authorizedRoles)) {
                        authorizedRoles = [authorizedRoles];
                    }
                    return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
                };



                return {
                    getInfo: getInfo,
                    login: login,  //login function
                    logout: logout,
                    isAuthenticated: isAuthenticated,
                    getToken: getToken,
                    username: username,
                    getRole: getRole,
                    isBroker: isBroker,
                    getUsername: getUsername,
                    getSystemType: getSystemType,
                    checkAuthStatus: checkAuthStatus,
                    getMerchantType: getMerchantType,
                    storeUserCredentials: storeUserCredentials
                };
            }]);
    //--------------------Auth Service END------------------------------

})();
