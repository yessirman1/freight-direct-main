(function () {
    'use strict';
    angular.module('app').controller('detailController', [
        '$scope', '$q', '$http', 'ngDialog', 'AuthService', '$rootScope', 'CONSTANTS', '$window', 'MyService', 'CartService', 'CartItemService', 'ngToast',
        'ProductSingleService',
        function ($scope, $q, $http, ngDialog, AuthService, $rootScope, CONSTANTS, $window, MyService, CartService, CartItemService, ngToast,
                  ProductSingleService) {
            $scope.hostUrl = hostUrl;
            $scope.clientIdStr = clientIdStr;
            $scope.clientId = clientId;
            $scope.productId = productId;
            $scope.cartItem = {
                productSingle: {
                    id: ''
                },
                amount: 1
            };
            $scope.getProductFinished = false;
            $scope.colorChoosed = true;
            $scope.addToCart = function (productId, amount) {
                $scope.cartItem.productSingle.id = productId;
                $scope.cartItem.amount = amount;
                CartItemService.add($scope.cartItem).then(function (resp) {
                    console.log(resp);
                });
            };

            getProduct();

            function getProduct() {
                ProductSingleService.get(productId).then(function (resp) {
                    $scope.product = resp.data;
                    $scope.getProductFinished = true;
                    $scope.selectedProduct = resp.data;

                    if ($scope.fxTheme === 'hcode-kidsdressing') {
                        // 设置最初选择的尺寸
                        $scope.selectedSizeItem = {};
                        if($scope.selectedProduct && $scope.selectedProduct.productSize){
                            $scope.selectedSizeItem.size = $scope.selectedProduct.productSize.name;
                        }

                        console.log(resp);
                        if ($scope.product && $scope.product.productSingleGroup) {
                            getGroupedList($scope.product.productSingleGroup.id);
                        }
                    }

                })
            }

            function getGroupedList(productSingleGroupId) {
                var str = '?page=1&size=100000&f_productSingleGroup.id=' + productSingleGroupId + '&f_productSingleGroup.id_op==';
                // str = '?page=1&size=100000';
                ProductSingleService.getBySearchStr(str).then(function (resp) {
                    $scope.groupedList = resp.data.content;
                    if ($scope.fxTheme === 'hcode-kidsdressing') {
                        getSizeItems();
                    }
                    console.log(resp);
                    console.log(_.last([1, 2, 3]));
                })
            }

            function getSizeItems() {
                if ($scope.groupedList && $scope.groupedList.length > 0) {
                    $scope.sizeItems = _.chain($scope.groupedList)
                        .groupBy(function (g) {
                            return g.productSize.name
                        })
                        .toPairs()
                        .map(function (currentItem) {
                            return _.fromPairs(_.zip(["size", "items"], currentItem));
                        })
                        .value();
                    console.log($scope.sizeItems);

                    $scope.currentSizeItem = _.find($scope.sizeItems, function (item) {
                        return item.size == $scope.product.productSize.name;
                    });

                    $scope.colorItems = $scope.currentSizeItem.items;
                }
            }

            $scope.selectSizeItem = function (item) {
                $scope.selectedProduct = null;
                $scope.colorItems = item.items;
                // $scope.selectedProduct = null;
                $scope.selectedSizeItem = item;
                console.log($scope.colorItems);
                console.log($scope.selectedSizeItem);
            };

            $scope.selectColorItem = function (p) {
                window.location.href = '/detail/' + p.id;
            };

            // -------- 双语 BEGIN --------
            $scope.isCn = MyService.getLanguageFromLocalStorage();
            $rootScope.$on(CONSTANTS.languageChanged, function (event, args) {
                $scope.isCn = MyService.getLanguageFromLocalStorage();
                console.log($scope.isCn);
            });
            // -------- 双语  END  --------


            // function getColorsAndSizes() {
            //     if ($scope.groupedList && $scope.groupedList.length > 0) {
            //         $scope.colorItems = _.chain($scope.groupedList)
            //             .groupBy(function (g) {
            //                 return g.productColour.rgb
            //             })
            //             .toPairs()
            //             .map(function (currentItem) {
            //                 return _.fromPairs(_.zip(["color", "items"], currentItem));
            //             })
            //             .value();
            //         console.log($scope.colorItems);
            //
            //         $scope.currentColorItem = _.find($scope.colorItems, function (item) {
            //             return item.color == $scope.product.productColour.rgb;
            //         });
            //
            //         $scope.sizeItems = $scope.currentColorItem.items;
            //     }
            // }


            // $scope.selectColorItem = function (item) {
            //     $scope.selectedProduct = null;
            //     $scope.sizeItems = item.items;
            //     console.log($scope.sizeItems);
            // };
            //
            // $scope.selectSizeItem = function (product) {
            //     // $scope.currentSizeItem = product;
            //     $scope.selectedProduct = product;
            //     console.log($scope.selectedProduct);
            //     window.location.href = '/detail/'+ $scope.selectedProduct.id;
            // };

        }]);

})();
