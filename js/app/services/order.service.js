(function () {
    'use strict';

    angular.module('app')
        .factory('OrderService', [
            '$q', '$interval', '$timeout', '$rootScope', '$http', 'AuthService', 'CART_CONSTANTS', 'API',
            function ($q, $interval, $timeout, $rootScope, $http, AuthService, CART_CONSTANTS, API) {
                var factory = {};

                factory.get = function (orderId) {
                    return $q(
                        function (resolve, reject) {
                            return $http({
                                method: 'GET',
                                url: API.url + 'order-header/' + orderId  + '?embedded=order-from,ship-to,coupon,order-items,order-items.product,order-items.product.detail-images'
                            }).then(
                                function (resp) {
                                    resolve(resp);
                                }, function (err) {
                                    reject(err);
                                });
                        });
                };

                factory.placeOrder = function (order) {
                    return $q(
                        function (resolve, reject) {
                            return $http({
                                method: 'POST',
                                url: API.url + 'order-header',
                                data: order
                            }).then(
                                function (resp) {
                                    resolve(resp);
                                }, function (err) {
                                    reject(err);
                                });
                        });
                };

                factory.getBanks = function () {
                    return $q(
                        function (resolve, reject) {
                            return $http({
                                method: 'GET',
                                url: API.url + 'ainong-bank-code?size=100000'
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
                                url: API.url + 'order-header?page=1&size=1000000&embedded=order-from,ship-to,coupon,order-items,order-items.product'
                            }).then(
                                function (resp) {
                                    resolve(resp);
                                }, function (err) {
                                    reject(err);
                                });
                        });
                };

                factory.getPaymentTypes = function () {
                    return $q(
                        function (resolve, reject) {
                            return $http({
                                method: 'GET',
                                url: API.url + 'enum/PaymentTypeEnum'
                            }).then(
                                function (resp) {
                                    resolve(resp);
                                }, function (err) {
                                    reject(err);
                                });
                        });
                };

                // factory.getBanks = function () {
                //     return $q(
                //         function (resolve, reject) {
                //             return $http({
                //                 method: 'GET',
                //                 url: API.url + 'enum/PaymentTypeEnum'
                //             }).then(
                //                 function (resp) {
                //                     resolve(resp);
                //                 }, function (err) {
                //                     reject(err);
                //                 });
                //         });
                // };

                factory.payOrder = function (orderId, bankId) {
                    // /v1/order-header/check/{orderheader的id}/{bank的id} (edited)
                    return $q(
                        function (resolve, reject) {
                            return $http({
                                method: 'GET',
                                url: API.url + 'order-header/check/' + orderId + '/' + bankId
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