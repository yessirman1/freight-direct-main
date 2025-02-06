(function () {
    'use strict';
    angular.module('app').controller('homeController', [
        '$scope', '$q', 'API', '$http', 'ngDialog', 'AuthService', '$window', 'HomeService', 'CartService', 'CartItemService', 'CategoryService', 'ProductSingleService', 'MyService',
        '$rootScope', 'CONSTANTS',
        function ($scope, $q, API, $http, ngDialog, AuthService, $window, HomeService, CartService, CartItemService, CategoryService, ProductSingleService, MyService,
                  $rootScope, CONSTANTS) {
            $scope.clientIdStr = clientIdStr;
            $scope.clientId = clientId;
            $scope.hostUrl = hostUrl;
            $scope.products = [];
            $scope.tokenStr = API.tokenStr;
            getAllFeaturedProducts();

            function getAllFeaturedProducts() {
                ProductSingleService.getByPaging(0, 6).then(function (resp) {
                    $scope.products = resp.data.content;
                    console.log(resp.data.content);
                })
            }


            $scope.addToCart = function (productId, amount) {
                var cartItem = {};

                cartItem.amount = amount;
                cartItem.productSingle = {};
                cartItem.productSingle.id = productId;

                console.log(cartItem);
                CartItemService.add(cartItem).then(function (value) {
                    console.log(value);
                });
            };

            $scope.gotoUrl = function (url) {
                console.log(url);
                window.location.href = url;
            };
            // $scope.data = 'home';
            // CategoryService.getAllCategories(true).then(function (value) {
            //     console.log(value);
            //     $scope.categories = value.data.content;
            //     // $scope.categories = _.filter($scope.categories, function (value) {
            //     //     return value.child && value.child.length > 0
            //     // });
            //     console.log($scope.categories);
            // });
            //
            // $scope.getProductsByCategoryId = function (id) {
            //     CategoryService.getProductsByCategoryId(id).then(function (value) {
            //         console.log(value);
            //         $scope.products = value.data.content;
            //         console.log($scope.products);
            //     });
            // };
            //
            // //家具 -> 餐厅
            // CategoryService.getProductsByCategoryId(24).then(function (value) {
            //     console.log(value);
            //     $scope.aProducts = value.data.content;
            //     console.log($scope.aProducts);
            // });
            //
            // $scope.addToCart = function (productId, amount) {
            //     if (!(amount > 0)) {
            //         amount = 1;
            //     }
            //     console.log(productId);
            //     CartService.add(productId, amount).then(function (value) {
            //         console.log(value);
            //     });
            //
            // }

            // -------- 双语 BEGIN --------
            $scope.isCn = MyService.getLanguageFromLocalStorage();
            $rootScope.$on(CONSTANTS.languageChanged, function (event, args) {
                $scope.isCn = MyService.getLanguageFromLocalStorage();
                console.log($scope.isCn);
            });

            // -------- 双语  END  --------

            // -------- 获取token  END  --------
            getTokenFromQueryParam();

            function getTokenFromQueryParam() {
                $scope.token = MyService.getParameterByName('token', null);
                console.log($scope.token);
                if ($scope.token) {
                    var resultJson = {
                        timestamp: new Date().getTime(),
                        access_token: $scope.token,
                        expires_in: 36000,
                        isAuthenticated: true
                    };
                    $http.defaults.headers.common.Authorization = 'Bearer ' + $scope.token;
                    AuthService.storeUserCredentials(JSON.stringify(resultJson));
                    $rootScope.$broadcast(CONSTANTS.AuthChanged);
                    $rootScope.$broadcast('auth-event');
                }
            }

        }]);

})();
