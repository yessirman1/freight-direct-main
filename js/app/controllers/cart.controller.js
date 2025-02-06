(function () {
    'use strict';
    angular.module('app').controller('cartController', [
        '$scope', '$q', '$http', 'ngDialog', 'AuthService', '$rootScope', 'CONSTANTS', '$window', 'CartService', 'CartItemService', 'MyService','ngToast',
        function ($scope, $q, $http, ngDialog, AuthService, $rootScope, CONSTANTS, $window, CartService, CartItemService, MyService, ngToast) {
            $scope.hostUrl = hostUrl;
            $scope.hasCart = false;
            // CartService.getAll().then(function (value) {
            //     $scope.carts = value.data.content;
            //     console.log($scope.carts);
            //     if ($scope.carts.length < 1) {
            //         ngDialog.open({
            //             template: 'noCartItemsTemplate'
            //         });
            //         window.location.href = '/';
            //     }
            // });

            $scope.clientIdStr = clientIdStr; $scope.clientId= clientId;
            $rootScope.$on(CONSTANTS.cartChanged, function (event, args) {
                console.log('cartChanged');
                // checkCart();
                refresh();
            });
            // getAllCarts();
            //
            // function getAllCarts() {
            //     CartService.getAll().then(function (value) {
            //         $scope.cartItems = value.data.content;
            //         console.log($scope.cartItems);
            //     });
            // }
            refresh();

            function refresh() {
                // $scope.hasCart = false;
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


                    // $scope.cartItems = value.data.content;
                    // console.log($scope.cartItems);
                    //
                    // $scope.totalPrice = 0;
                    // $scope.totalAmount = 0;
                    // $scope.cartItems.forEach(
                    //     function (data) {
                    //         $scope.totalPrice += data.amount * data.productSingle.promotionPrice;
                    //         $scope.totalAmount += data.amount;
                    //     }
                    // );
                    //
                    // console.log($scope.totalPrice);
                    // console.log($scope.totalAmount);
                });
            }

            // function caculateTotal() {
            //     $scope.totalPrice = 0;
            //     $scope.totalAmount = 0;
            //     $scope.carts.forEach(
            //         function (data) {
            //             $scope.totalPrice += data.amount * data.productSingle.promotionPrice;
            //             $scope.totalAmount += data.amount;
            //         }
            //     );
            // }

            $scope.add = function (cartItem) {
                cartItem.amount = cartItem.amount + 1;
                CartItemService.update(cartItem.id, cartItem).then(function (value) {
                    console.log(value);
                    refresh();
                }, function (err) {
                    console.log(err);
                })
            };

            $scope.desc = function (cartItem) {
                console.log(cartItem);
                if (cartItem.amount > 1) {
                    cartItem.amount = cartItem.amount - 1;
                    CartItemService.update(cartItem.id, cartItem).then(function (value) {
                        console.log(value);
                        refresh();
                    }, function (err) {
                        console.log(err);
                    })
                }
            };

            $scope.onAmountChanged = function (cartItem) {
                console.log(cartItem);
                if (cartItem.amount > 0) {
                    CartItemService.update(cartItem.id, cartItem).then(function (value) {
                        console.log(value);
                        refresh();
                    }, function (err) {
                        console.log(err);
                    })
                } else {
                    cartItem.amount = 1
                }
            };

            $scope.delete = function (id) {
                CartItemService.delete(id).then(function (value) {
                    console.log(value);
                    refresh();
                },function (err) {
                    refresh();
                });
            };

            $scope.clearShoppingCart = function () {
                MyService.clearShoppingCart().then(function (value) {
                    console.log(value);

                    refresh();
                },function (err) {
                    refresh();
                });
            };

            $scope.shippingSelect = 0;
            $scope.onShippingSelectChange = function (value) {
                console.log(value);
            };

            $scope.checkout = function () {
                window.location.href = '/checkout';
            }

        }]);

})();
