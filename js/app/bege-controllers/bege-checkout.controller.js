(function () {
    'use strict';
    angular.module('app').controller('begeCheckoutController', [
        '$scope', '$q', '$http', 'ngDialog', 'AddressService', 'CartItemService', 'AuthService', 'CartService', 'ngToast',
        'TransactionSingleService', 'ShipmentFeeService', 'ProfileService', 'MyService',
        function ($scope, $q, $http, ngDialog, AddressService, CartItemService, AuthService, CartService, ngToast,
                  TransactionSingleService, ShipmentFeeService, ProfileService, MyService) {
            $scope.coins = 0;
            $scope.order = {
                id: '',
                shipmentFee: null,
                coinUsed: 10,
                shipTo: {
                    streetLineOne: '',
                    city: '',
                    zipOrPostalCode: ''
                },
                billTo: {
                    streetLineOne: '',
                    city: '',
                    zipOrPostalCode: ''
                }
            };
            $scope.clientIdStr = clientIdStr;
            $scope.clientId = clientId;
            AuthService.checkAuthStatus();

            $scope.billToDifferentAddress = false;
            $scope.billToDifferentAddressChange = function () {
                if (!$scope.billToDifferentAddress) {
                    $scope.order.billTo = $scope.order.shipTo;
                    console.log($scope.order.billTo);
                }
            };

            MyService.getShipmentFeeFromServer().then(function (value) {
                $scope.order.shipmentFee = value;
                console.log(value);
            }, function (err) {
                console.log($scope.order.shipmentFee);
            });

            // MyService.calculateShipmentFee($scope.order).then(function (value) {
            //     $scope.order.shipmentFee = value;
            //     console.log(value);
            // }, function (err) {
            //     console.log($scope.order.shipmentFee);
            // });


            $scope.processForm = function (isValid) {
                console.log('process form');
                if (!$scope.billToDifferentAddress) {
                    $scope.order.billTo = $scope.order.shipTo;
                    console.log($scope.order.billTo);
                }

                if (!isValid) {
                    ngToast.create({
                        className: 'danger',
                        timeout: 1000,
                        content: '<a href="#">Some fields are not properly filled, please check and try again.</a>'
                    });
                    return;
                }

                calFeeAndCoin();
                console.log($scope.order.shipmentFee);
                // if (!$scope.order.shipmentFee) {
                //     ngToast.create({
                //         className: 'danger',
                //         timeout: 1000,
                //         content: '<a href="#">Please Calculate Shipping.</a>'
                //     })
                // } else {
                //     console.log($scope.order);
                //     TransactionSingleService.add($scope.order).then(function (value) {
                //         console.log(value);
                //         window.location.href = '/order-detail/' + value.data.id;
                //     },function (err) {
                //         console.log($scope.order.shipmentFee);
                //         ngToast.create({
                //             className: 'error',
                //             timeout: 1000,
                //             content: '<a href="#">Something wrong happens, please try again later.</a>'
                //         })
                //     });
                // }

                console.log($scope.order);
                TransactionSingleService.add($scope.order).then(function (value) {
                    console.log(value);
                    window.location.href = '/order-detail/' + value.data.id;
                }, function (err) {
                    console.log($scope.order.shipmentFee);
                    ngToast.create({
                        className: 'error',
                        timeout: 1000,
                        content: '<a href="#">Something wrong happens, please try again later.</a>'
                    })
                });
            };


                $scope.onShippingSelectChange = function (value) {
                    console.log(value);
                    $scope.order.shipmentFee = value;
                    calFeeAndCoin();
                };


                function calFeeAndCoin() {
                    if ($scope.order.shipmentFee) {
                        $scope.grandTotal = $scope.totalPrice + $scope.order.shipmentFee.price;
                    } else {
                        $scope.grandTotal = $scope.totalPrice;
                    }

                    if ($scope.useCoin) {
                        if ($scope.grandTotal >= $scope.coins / 10) {
                            $scope.feeNeedToPay = $scope.grandTotal - $scope.coins / 10;
                            $scope.order.coinUsed = $scope.coins / 10;
                        } else {
                            $scope.feeNeedToPay = 0;
                            $scope.order.coinUsed = $scope.grandTotal;
                        }
                    } else {
                        $scope.feeNeedToPay = $scope.grandTotal;
                        $scope.order.coinUsed = 0;
                    }

                }

                refresh();
                $scope.grandTotal = 0;

                function refresh() {
                    CartItemService.getAll().then(function (value) {
                        $scope.cartItems = value.data.content;
                        console.log($scope.cartItems);

                        $scope.totalPrice = 0;
                        $scope.totalAmount = 0;
                        $scope.cartItems.forEach(
                            function (data) {
                                $scope.totalPrice += data.amount * data.productSingle.promotionPrice;
                                $scope.grandTotal = $scope.totalPrice;
                                $scope.totalAmount += data.amount;
                            }
                        );
                        calFeeAndCoin();
                        console.log($scope.totalPrice);
                        console.log($scope.totalAmount);
                    });
                }

                getShippingFee();

                function getShippingFee() {
                    ShipmentFeeService.getAll().then(function (resp) {
                        $scope.shippingFee = resp.data.content;
                        console.log(resp.data.content);
                    })
                }

                MyService.calculateShipmentFee($scope.order).then(function (value) {
                    $scope.order.shipmentFee = value;
                    console.log(value);
                }, function (err) {
                    console.log($scope.order.shipmentFee);
                });

                $scope.useCoin = true;
                getCoin();

                function getCoin() {
                    ProfileService.getCoin().then(function (resp) {
                        $scope.coins = resp.data.coin;
                        if (!$scope.coins) {
                            $scope.coins = 0;
                        }
                        console.log(resp.data.content);
                    })
                }

                $scope.useMCoinChange = function () {
                    calFeeAndCoin();
                };


                // 获取所有地址
                AddressService.getAll().then(function (value) {
                    $scope.addresses = value.data.content;
                    console.log($scope.addresses);
                });
            }
        ]);

})();
