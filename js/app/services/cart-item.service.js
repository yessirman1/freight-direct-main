(function () {
    'use strict';

    angular.module('app')
        .factory('CartItemService', [
            '$q', '$interval', '$timeout', '$rootScope', '$http', 'API', 'AuthService', 'CONSTANTS','ngDialog', 'ngToast',
            function ($q, $interval, $timeout, $rootScope, $http, API, AuthService, CONSTANTS, ngDialog, ngToast) {
                var factory = {};
                //var clientId = clientId;
                var entity = 'cart-item';
                var listEmbeddedStr = '&embedded=product-single.main-images,product-single,product-multi,cart';

                factory.cartItem = {
                            id: '',
                            version: '',
                            createdAt: '',
                            updatedAt: '',
                            creator: '',
                            modifier: '',
                            user: '',
                            productSingle: '',
                            productMulti: '',
                            cart: '',
                            amount: '',
                    //one-to-one entity
                };

                factory.getByPaging = function (page,size) {
                    return $q(
                        function (resolve, reject) {
                            return $http({
                                method: 'GET',
                                url: API.url + entity + '?page=' + page + '&size=' + size + listEmbeddedStr + '&clientId=' + clientId
                            }).then(
                                function (resp) {
                                    resolve(resp);
                                }, function (err) {
                                    reject(err);
                                });
                        });
                };

                factory.getBySearchStr = function (str) {
                    return $q(
                        function (resolve, reject) {
                            return $http({
                                method: 'GET',
                                url: API.url + entity + str + listEmbeddedStr + '&clientId=' + clientId
                            }).then(
                                function (resp) {
                                    resolve(resp);
                                }, function (err) {
                                    reject(err);
                                });
                        });
                };

                factory.getAll = function () {
                    return $q(
                        function (resolve, reject) {
                            return $http({
                                method: 'GET',
                                url: API.url + entity + '?page=1&size=1000000' + listEmbeddedStr + '&clientId=' + clientId
                            }).then(
                                function (resp) {
                                    resolve(resp);
                                }, function (err) {
                                    reject(err);
                                });
                        });
                };

                factory.get = function (id) {
                    return $q(
                        function (resolve, reject) {
                            if (id) {
                                return $http({
                                    method: 'GET',
                                    url: API.url + entity + '/' + id + '?clientId=' + clientId
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

                factory.add = function (cartItem) {

                    AuthService.checkAuthStatus();
                    return $q(
                        function (resolve, reject) {
                            //debugger;
                            return $http({
                                method: 'POST',
                                url: API.url + entity  + '?clientId=' + clientId,
                                data: cartItem
                            }).then(
                                function (resp) {

                                    $rootScope.$broadcast(CONSTANTS.cartChanged);
                                    console.log('$rootScope.$broadcast(CONSTANTS.cartChanged);');

                                    // create a toast with settings:
                                    ngToast.create({
                                        className: 'success',
                                        timeout: 1000,
                                        content: '<a href="#">You have added the  product to shopping bag</a>'
                                    });

                                    resolve(resp);
                                }, function (err) {
                                    reject(err);
                                    if (err.status === 400){
                                        ngToast.create({
                                            className: 'danger',
                                            timeout: 1000,
                                            content: '<a href="#">Error happens, please try again.</a>'
                                        });
                                    }
                                });
                        });
                };

                factory.update = function (id, cartItem) {

                    AuthService.checkAuthStatus();
                    return $q(
                        function (resolve, reject) {
                            //debugger;
                            return $http({
                                method: 'PUT',
                                url: API.url + entity + '/' + id  + '?clientId=' + clientId,
                                data: cartItem
                            }).then(
                                function (resp) {
                                    // create a toast with settings:
                                    $rootScope.$broadcast(CONSTANTS.cartChanged);
                                    ngToast.create({
                                        className: 'success',
                                        timeout: 1000,
                                        content: '<a href="#">购物车成功更新</a>'
                                    });
                                    resolve(resp);
                                }, function (err) {
                                    reject(err);
                                });
                        });
                };

                factory.delete = function (id) {

                    AuthService.checkAuthStatus();
                    return $q(
                        function (resolve, reject) {
                            //debugger;
                            return $http({
                                method: 'DELETE',
                                url: API.url + entity + '/' + id + '?clientId=' + clientId,
                            }).then(
                                function (resp) {
                                    $rootScope.$broadcast(CONSTANTS.cartChanged);
                                    resolve(resp);
                                }, function (err) {
                                    reject(err);
                                });
                        });
                };

                function checkAuth(){
                    if (!AuthService.checkAuthStatus()) {
                        window.location.href = '/signin';
                        return;
                    }
                }

                return factory;

            }]);

})();