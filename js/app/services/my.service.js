(function () {
    'use strict';

    angular.module('app')
        .factory('MyService', [
            '$q', 'CART_EVENTS', '$rootScope', '$http', 'API', 'AuthService', 'CONSTANTS', 'ngToast','CategoryService',
            function ($q, CART_EVENTS, $rootScope, $http, API, AuthService, CONSTANTS, ngToast, CategoryService) {
                var factory = {};

                factory.getParameterByName = function (name, url) {
                    if (!url) url = window.location.href;
                    name = name.replace(/[\[\]]/g, '\\$&');
                    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                        results = regex.exec(url);
                    if (!results) return null;
                    if (!results[2]) return '';
                    return decodeURIComponent(results[2].replace(/\+/g, ' '));
                };

                factory.getUrl = function () {
                    var newURL = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname + "/" + window.location.search;
                    return newURL;
                };

                factory.storeCurrentUrl = function () {
                    var currentURL = window.location.href;
                    if (currentURL.indexOf('signin') > -1 || currentURL.indexOf('register') > -1 || currentURL.indexOf('find-password') > -1) {
                        // do nothing
                    } else {
                        window.localStorage.setItem(CONSTANTS.currentUrl, currentURL);
                    }
                };

                factory.getCurrentUrl = function () {
                    return window.localStorage.getItem(CONSTANTS.currentUrl);
                };

                factory.payOrder = function (orderId, geteway) {

                    if (!AuthService.isAuthenticated()) {
                        window.location.href = '/signin';
                        return;
                    }
                    // checkout/{orderId}/{gateway}
                    return $q(
                        function (resolve, reject) {
                            //debugger;
                            return $http({
                                method: 'GET',
                                url: API.url + 'transaction-single/checkout/' + orderId + '/' + geteway + '?clientId=' + clientId,
                                data: null
                            }).then(
                                function (resp) {
                                    resolve(resp);
                                }, function (err) {
                                    reject(err);
                                });
                        });
                };

                factory.showLoading = function (isShow) {
                    if (isShow) {
                        $rootScope.$broadcast(CONSTANTS.showLoading);
                    } else {
                        $rootScope.$broadcast(CONSTANTS.hideLoading);
                    }
                };

                factory.toastError = function (msg) {
                    ngToast.create({
                        className: 'danger',
                        timeout: 2000,
                        content: '<a href="#">' + msg + '</a>'
                    })
                };

                factory.collect = function (id) {

                    if (!AuthService.isAuthenticated()) {
                        window.location.href = '/signin';
                    }

                    return $q(
                        function (resolve, reject) {
                            if (id) {
                                return $http({
                                    method: 'GET',
                                    url: API.url + 'coin-activity' + '/take/' + id + '?clientId=' + clientId
                                }).then(
                                    function (resp) {
                                        resolve(resp);
                                    }, function (err) {
                                        reject(err);
                                    });
                            } else {
                                reject(false);
                            }
                        });
                };

                factory.sendEmail = function (url, data) {
                    // debugger;
                    return $q(
                        function (resolve, reject) {
                            return $http({
                                method: 'Post',
                                url: API.url + url,
                                data: data
                            }).then(
                                function (resp) {
                                    // debugger;
                                    resolve(resp);
                                }, function (err) {
                                    reject(err);
                                });
                        });
                };

                factory.calculateShipmentFee = function (transactionSingle) {

                    AuthService.checkAuthStatus();
                    return $q(
                        function (resolve, reject) {
                            //debugger;
                            return $http({
                                method: 'POST',
                                url: API.url + 'transaction-single/calculate-fee' + '?clientId=' + clientId,
                                data: transactionSingle
                            }).then(
                                function (resp) {
                                    resolve(resp);
                                }, function (err) {
                                    reject(err);
                                });
                        });
                };

                factory.getShipmentFeeFromServer = function () {
                    return $q(
                        function (resolve, reject) {
                            return $http({
                                method: 'GET',
                                url: API.url + 'transaction-single' + '&clientId=' + clientId
                            }).then(
                                function (resp) {
                                    resolve(resp);
                                }, function (err) {
                                    reject(err);
                                });
                        });
                };

                // -------- 双语  END  --------

                factory.getLanguageFromLocalStorage = function () {
                    var lan;
                    var isCn;
                    var l = window.localStorage.getItem(CONSTANTS.languageChanged);
                    if (l) {
                        lan = JSON.parse(l);
                    }
                    if (lan && lan.isCn) {
                        isCn = true;
                    } else {
                        isCn = false;
                    }
                    return isCn;
                };
                // -------- 双语  END  --------


                // ----------- category 选择 BEGIN ---------

                function getCategories(isRoot) {
                    if (isRoot) {
                        isRoot = true;
                    } else {
                        isRoot = false;
                    }
                    var categorystr = '?page=1&size=10000&embedded=child,icon-images,detail-images&f_rootLevel=' + isRoot + '&f_rootLevel_op==';
                    CategoryService.getBySearchStr(categorystr).then(function (resp) {
                        $scope.categories = resp.data.content;
                        console.log($scope.categories);
                    });
                }


                factory.getCategories = function (isRoot, searchStr) {
                    isRoot = !!isRoot;
                    searchStr += '&f_rootLevel=' + isRoot + '&f_rootLevel_op==';
                    return $q(
                        function (resolve, reject) {
                            return CategoryService.getBySearchStr(searchStr).then(function (resp) {
                                resolve(resp.data.content);
                            }, function (err) {
                                reject(err);
                            });
                        });
                };
                // ----------- category 选择 END ---------

                // -----------  calculate fee BEGIN ---------

                factory.calculateFee = function (order) {

                    if (!AuthService.isAuthenticated()) {
                        window.location.href = '/signin';
                        return;
                    }
                     return $q(
                        function (resolve, reject) {
                            //debugger;
                            return $http({
                                method: 'POST',
                                url: API.url + 'transaction-single/calculate-fee',
                                data: order
                            }).then(
                                function (resp) {
                                    resolve(resp);
                                }, function (err) {
                                    reject(err);
                                });
                        });
                };
                // ----------- calculate fee END ---------

                // ----------- clear shopping cart BEGIN---------
                factory.clearShoppingCart = function () {
                    return $q(
                        function (resolve, reject) {
                            return $http({
                                method: 'DELETE',
                                url: API.url + 'cart/clear?clientId=' + clientId
                            }).then(
                                function (resp) {
                                    $rootScope.$broadcast(CONSTANTS.cartChanged);
                                    resolve(resp);
                                }, function (err) {
                                    reject(err);
                                });
                        });
                };
                // ----------- calculate fee END ---------

                return factory;

            }]);

})();
