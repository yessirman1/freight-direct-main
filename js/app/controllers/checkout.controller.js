(function () {
    'use strict';
    angular.module('app').controller('checkoutController', [
        '$scope', '$q', '$http', 'ngDialog', 'AddressService', 'CartItemService', 'AuthService', 'CartService', 'ngToast',
        'TransactionSingleService', 'ShipmentFeeService', 'ProfileService', 'MyService','$rootScope','CONSTANTS',
        function ($scope, $q, $http, ngDialog, AddressService, CartItemService, AuthService, CartService, ngToast,
                  TransactionSingleService, ShipmentFeeService, ProfileService, MyService, $rootScope, CONSTANTS) {
            $scope.coins = 0;
            $scope.order = {
                id: '',
                shipmentFee: null,
                coinUsed: 0,
                shipTo: {
                    streetLineOne: '',
                    city: '',
                    zipOrPostalCode: '',
                    country: null
                },
                billTo: {
                    streetLineOne: '',
                    city: '',
                    zipOrPostalCode: '',
                    country: null
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

                // calFeeAndCoin();

                if (!$scope.order.shipmentFee) {
                    ngToast.create({
                        className: 'danger',
                        timeout: 1000,
                        content: '<a href="#">Please Calculate Shipping.</a>'
                    })
                } else {
                    console.log($scope.order);
                    TransactionSingleService.add($scope.order).then(function (value) {
                        console.log(value);
                        window.location.href = '/order-detail/' + value.data.id;
                    }, function (err) {
                        ngToast.create({
                            className: 'danger',
                            timeout: 1000,
                            content: '<a href="#">Something wrong happens, please try again later.</a>'
                        })
                    });
                }
            };

            $scope.onShippingSelectChange = function (value) {
                console.log(value);
                $scope.order.shipmentFee = value;
                calFee();
            };


            // function calFeeAndCoin() {
            //     if ($scope.order.shipmentFee) {
            //         $scope.grandTotal = $scope.totalPrice + $scope.order.shipmentFee.price;
            //     } else {
            //         $scope.grandTotal = $scope.totalPrice;
            //     }
            //
            //     if ($scope.useCoin) {
            //         if ($scope.grandTotal >= $scope.coins / 10) {
            //             $scope.feeNeedToPay = $scope.grandTotal - $scope.coins / 10;
            //             $scope.order.coinUsed = $scope.coins / 10;
            //         } else {
            //             $scope.feeNeedToPay = 0;
            //             $scope.order.coinUsed = $scope.grandTotal;
            //         }
            //     } else {
            //         $scope.feeNeedToPay = $scope.grandTotal;
            //         $scope.order.coinUsed = 0;
            //     }
            //
            // }

            refresh();
            $scope.grandTotal = 0;

            function refresh() {
                CartService.getAll().then(function (value) {

                    if(value.data.content && value.data.content.length > 0){
                        $scope.cart = value.data.content[0];
                        $scope.cartItems = value.data.content[0].cartItem;
                        console.log($scope.cart);
                        $scope.totalPrice = $scope.cart.totalPrice;
                    }
                });

                // CartItemService.getAll().then(function (value) {
                //     $scope.cartItems = value.data.content;
                //     console.log($scope.cartItems);
                //
                //     $scope.totalPrice = 0;
                //     $scope.totalAmount = 0;
                //     $scope.cartItems.forEach(
                //         function (data) {
                //             $scope.totalPrice += data.amount * data.productSingle.promotionPrice;
                //             $scope.grandTotal = $scope.totalPrice;
                //             $scope.totalAmount += data.amount;
                //         }
                //     );
                //     calFeeAndCoin();
                //     console.log($scope.totalPrice);
                //     console.log($scope.totalAmount);
                // });
            }

            getShippingFee();
            // 获取运费选择列表
            function getShippingFee() {
                ShipmentFeeService.getAll().then(function (resp) {
                    $scope.shippingFees = resp.data.content;
                    console.log(resp.data.content);
                })
            }

            // $scope.useCoin = true;
            // getCoin();
            //
            // function getCoin() {
            //     ProfileService.getCoin().then(function (resp) {
            //         $scope.coins = resp.data.coin;
            //         if (!$scope.coins) {
            //             $scope.coins = 0;
            //         }
            //         console.log(resp.data.content);
            //     })
            // }

            // $scope.useMCoinChange = function () {
            //     calFeeAndCoin();
            // };


            // 获取所有地址
            AddressService.getAll().then(function (value) {
                $scope.addresses = value.data.content;
                console.log($scope.addresses);
            });

            // 后台返回的费用计算
            $scope.calFee = {
                cartItemsPrice: 0, // 商品总价
                coinAmount: 0,
                couponAmount: 0,
                description: '',
                discount: 0,
                discountPrice: 0,
                finalPrice: 0, //最终价格
                gst: 0, //税费
                gstRate: 0,
                shippingFee: 0 //运费
            };
            calFee();
            function calFee() {
                MyService.calculateFee($scope.order).then(function (resp) {
                    $scope.calFee = resp.data;
                    console.log($scope.calFee);
                })
            }
            // “cartItemsPrice” : 100.00,
            // “discountPrice”: 80.00,
            // “shippingFee”: 10.00,
            // “coinAmount”: 0.0,
            // “couponAmount”:0.0
            // “finalPrice” : 90.00


            // 获取购物车
            getCarts();
            function getCarts() {
                CartService.getAll().then(function (value) {
                    if(value.data.content && value.data.content.length > 0){
                        $scope.cart = value.data.content[0];
                        $scope.cartItems = value.data.content[0].cartItem;
                        if($scope.cartItems && $scope.cartItems.length > 0){
                            $scope.hasCart = true;
                        }else {
                            $scope.hasCart = false;
                        }
                        console.log($scope.cart);
                        $scope.totalPrice = $scope.cart.totalAmount;
                    }else{
                        $scope.cartItemAmount = 0;
                        $scope.cart = null;
                        $scope.cartItems = null;
                        $scope.totalPrice = null;
                        $scope.hasCart = false;
                    }
                });
            }

            $rootScope.$on(CONSTANTS.cartChanged, function (event, args) {
                console.log('cartChanged');
                // checkCart();
                refresh();
            });


        }]);

})();
