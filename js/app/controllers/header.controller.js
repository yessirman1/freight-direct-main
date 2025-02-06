(function () {
    'use strict';
    angular.module('app').controller('headerController', [
        '$scope', '$q', '$http', 'ngDialog', 'CONSTANTS', '$rootScope', 'AuthService', '$window', 'HomeService', 'CartService', 'CartItemService', 'CategoryService', 'MyService',
        function ($scope, $q, $http, ngDialog, CONSTANTS, $rootScope, AuthService, $window, HomeService, CartService, CartItemService, CategoryService, MyService) {
            $scope.hostUrl = hostUrl;
            $scope.clientIdStr = clientIdStr;
            $scope.clientId = clientId;
            MyService.storeCurrentUrl();

            $scope.categoryId = MyService.getParameterByName('categoryId');
            console.log($scope.categoryId);
            $scope.keyword = MyService.getParameterByName('keyword');


            $scope.checkout = function () {
                if ($scope.haveCarts) {
                    window.location.href = '/checkout';
                } else {
                    ngDialog.open({
                        template: 'noCartItemsTemplate'
                    });
                }
            };

            $scope.gotoCart = function () {
                if ($scope.haveCarts) {
                    window.location.href = '/cart';
                } else {
                    ngDialog.open({
                        template: 'noCartItemsTemplate'
                    });
                }
            };

            $scope.haveCarts = false;
            // checkCart();
            //
            // function checkCart() {
            //     CartService.getAll().then(function (value) {
            //         $scope.cartItems = value.data.content;
            //         console.log($scope.cartItems);
            //         if ($scope.cartItems.length > 0) {
            //             $scope.haveCarts = true;
            //         } else {
            //             $scope.havheCarts = false;
            //         }
            //     }, function (err) {
            //         $scope.haveCarts = false;
            //     });
            // }

            $scope.goHome = function () {
                window.location.href = '/';
            };

            $scope.logout = function () {
                AuthService.logout().then(function (value) {
                    console.log(data);
                });
                AuthService.logout();
                window.location.href = '/';
            };


            $rootScope.$on(CONSTANTS.AuthChanged, function (event, args) {
                getAuthData();
            });
            getAuthData();

            function getAuthData() {
                console.log('auth-event');
                $scope.isAuthenticated = AuthService.isAuthenticated();
                // $scope.profile = AuthService.getInfo();
                console.log($scope.profile);
                // do what you want to do
            }

            if (!AuthService.isAuthenticated()) {
                getAuthData();
            }

            // getUser();

            function getUser() {
                HomeService.getUser().then(function (value) {
                    console.log(value);
                });
            }

            $scope.defaultSc = {
                name: '分类',
                id: ''
            };
            // $scope.categoryId = categoryId;
            // $scope.keyword = keyword;
            console.log($scope.keyword);

            $scope.onKeywordChanged = function () {
                console.log($scope.keyword);
            };


            $scope.select = function (category) {
                console.log(category);
                $scope.sc = category;
            };

            getCategories(false);

            function getCategories(isRoot) {
                if (isRoot) {
                    isRoot = true;
                } else {
                    isRoot = false;
                }
                var categorystr = '?page=1&size=10000&embedded=child,icon-images,detail-images&f_rootLevel=' + isRoot + '&f_rootLevel_op==';
                console.log(categorystr);
                CategoryService.getBySearchStr(categorystr).then(function (resp) {
                    $scope.categories = resp.data.content;
                    console.log($scope.categories);
                });
            }


            getRootCategories(true);

            function getRootCategories(isRoot) {
                var categorystr = '?page=1&size=10000&embedded=child,icon-images,detail-images&f_rootLevel=' + isRoot + '&f_rootLevel_op==';
                console.log(categorystr);
                CategoryService.getBySearchStr(categorystr).then(function (resp) {
                    $scope.rootCategories = resp.data.content;
                    console.log($scope.rootCategories);
                });
            }

            $rootScope.$on(CONSTANTS.cartChanged, function (event, args) {
                console.log('cartChanged');
                // checkCart();
                refresh();
            });

            $rootScope.$on(CONSTANTS.AuthChanged, function (event, args) {
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
                // 登录之后才能获取购物车列表
                if (AuthService.isAuthenticated()) {
                    CartService.getAll().then(function (value) {
                        if(value.data.content && value.data.content.length > 0){
                            $scope.cart = value.data.content[0];
                            $scope.cartItems = value.data.content[0].cartItem;
                            $scope.cartItemAmount = 0;
                            angular.forEach($scope.cartItems, function(value, key){
                                $scope.cartItemAmount += value.amount;
                            });
                            console.log($scope.cart);
                            $scope.totalPrice = $scope.cart.totalAmount;
                        }else {
                            $scope.cartItemAmount = 0;
                            $scope.cart = null;
                            $scope.cartItems = null;
                            $scope.totalPrice = null;
                        }
                    });
                }
            }

            $scope.delete = function (id) {
                CartItemService.delete(id).then(function (value) {
                    console.log(value);
                    refresh();
                }, function (err) {
                    console.log(err);
                });
            };


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
            // $scope.addToCart = function (productId) {
            //     console.log(productId);
            //     CartService.add(productId, 1).then(function (value) {
            //         console.log(value);
            //     });
            // }

            // 搜索 🔍
            $scope.search = function () {
                var keywordStr = $scope.keyword ? '&keyword=' + $scope.keyword : '';
                var categoryIdStr = $scope.categoryId ? '&categoryId=' + $scope.categoryId : '';
                window.location.href = ('/products?' + keywordStr + categoryIdStr).replace('?&', '?');
            };


            //lewis theme
            //go to home page with anchor
            $scope.gotoHomeAnchor = function (hash) {
                // window.location.href = '/home' + "#" + hash;
                // window.location.hash =
                var url = location.hostname;               //Save down the URL without hash.
                location.href = "#" + hash;                 //Go to the target element.
            };

            function scrollTo(hash) {
                location.hash = "#" + hash;
            }

            // -------- 双语 BEGIN --------
            $scope.setCn = function (bool) {
                $scope.isCn = bool;
                var lan = {isCn: bool};
                window.localStorage.setItem(CONSTANTS.languageChanged, JSON.stringify(lan));
                $rootScope.$broadcast(CONSTANTS.languageChanged, lan);
                console.log(lan);
            };

            $scope.isCn = MyService.getLanguageFromLocalStorage();
            $rootScope.$on(CONSTANTS.languageChanged, function (event, args) {
                $scope.isCn = MyService.getLanguageFromLocalStorage();
                console.log($scope.isCn);
            });
            // -------- 双语 BEGIN --------


        }]);

})();
