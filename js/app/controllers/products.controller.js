(function () {
    'use strict';
    angular.module('app').controller('productsController', [
        '$scope', '$q', 'API', '$http', 'ngDialog', 'AuthService', '$window', 'HomeService', 'CartItemService', 'CategoryService', 'ProductSingleService', 'MyService','$rootScope','CONSTANTS',
        function ($scope, $q, API, $http, ngDialog, AuthService, $window, HomeService, CartItemService, CategoryService, ProductSingleService, MyService, $rootScope,CONSTANTS) {
            $scope.fxTheme = fxTheme;
            $scope.clientIdStr = clientIdStr;
            $scope.clientId = clientId;
            $scope.categoryId = MyService.getParameterByName('categoryId');
            $scope.keyword = MyService.getParameterByName('keyword');

            if (!$scope.categoryId) {
                $scope.categoryId = "";
            }
            console.log($scope.categoryId);

            $scope.SearchStr = '';
            $scope.pageSize = 12;
            $scope.pageNumber = 1;
            $scope.current = 1;

            $scope.productName = '';
            $scope.keyword = keyword;
            $scope.productName = keyword;
            console.log($scope.keyword);

            $scope.hostUrl = hostUrl;
            $scope.products = [];
            $scope.tokenStr = API.tokenStr;

            $scope.refresh = function () {
                $scope.SearchStr = '';
                var embeddedStr = '&embedded=inventory-detail,category,feature-types,tags,feedbacks,slider-images,main-images,detail-images';
                var groupedStr = "&f_onTheGroupPage=true&f_onTheGroupPage_op==";
                embeddedStr += groupedStr;

                if ($scope.pageNumber) {
                    $scope.SearchStr += '?page=' + $scope.pageNumber;
                }
                if ($scope.pageSize) {
                    $scope.SearchStr += '&size=' + $scope.pageSize;
                }
                if ($scope.sort) {
                    $scope.SearchStr += '&sort=' + $scope.sort;
                }


                if ($scope.fxTheme === 'hcode-kidsdressing') {
                    if ($scope.subCategoryId && $scope.subCategoryId != 'null') {
                        $scope.SearchStr += '&f_category.id_op==&f_category.id=' + $scope.subCategoryId;
                    }

                    if ($scope.categoryId && $scope.categoryId != 'null') {
                        $scope.SearchStr += '&f_category.parent.id_op==&f_category.parent.id=' + $scope.categoryId;
                    }

                }else {
                    if ($scope.categoryId && $scope.categoryId != 'null') {
                        $scope.SearchStr += '&f_category.id_op==&f_category.id=' + $scope.categoryId;
                    }
                }


                if ($scope.keyword) {
                    $scope.SearchStr += '&name=' + $scope.keyword;
                }
                $scope.SearchStr += embeddedStr;
                $scope.SearchStr += $scope.priceStr;
                console.log($scope.categoryId);
                requestBackend();
            };

            function requestBackend() {
                //家具 -> 餐厅
                console.log($scope.categoryId);
                $scope.first = true;
                $scope.last = true;
                ProductSingleService.getBySearchStr($scope.SearchStr).then(function (resp) {
                    console.log('---------- categoryController getAllBySearchStr ----------', resp);
                    $scope.products = resp.data.content;
                    $scope.totalCount = resp.data.totalElements;
                    $scope.first = resp.data.first;
                    $scope.last = resp.data.last;
                    console.log($scope.products);
                });
            };

            $scope.pageChanged = function (newPage) {
                $scope.pageNumber = newPage;
                $scope.refresh();
            };

            // $scope.listOfOptions = ['Price: low to high', 'Price: high to low'];

            // $scope.makeSort = function (str, sortDisplay) {
            //     $scope.sortDisplay = sortDisplay;
            //     $scope.sort = str;
            //     $scope.refresh();
            // };

            $scope.listOfOptions = [
                {
                    name: 'Price from low to high',
                    str: 'price,asc'
                },
                {
                    name: 'Price from high to low',
                    str: 'price,desc'
                },
                {
                    name: 'Newest',
                    str: 'updatedAt,desc'
                },
                {
                    name: 'Oldest',
                    str: 'updatedAt,asc'
                }
            ];
            $scope.makeSort = function (sortStr) {
                $scope.sort = sortStr;
                $scope.refresh();
            };

            // --------- 类别筛选逻辑 BEGIN---------
            var categoryEmbededStr = '?page=1&size=10000&embedded=child,icon-images,detail-images';

            // 儿童服装主题逻辑
            if ($scope.fxTheme === 'hcode-kidsdressing') {
                $scope.rootCategoryId = MyService.getParameterByName('categoryId');
                console.log($scope.rootCategoryId);
                MyService.getCategories(true, categoryEmbededStr).then(function (resp) {
                    $scope.rootCategories = resp;
                    $scope.rootCategory = $scope.rootCategories.find(function (c) {
                        return c.id == $scope.rootCategoryId;
                    });
                    console.log($scope.rootCategory);
                    if ($scope.rootCategory && $scope.rootCategory.child.length > 0) {
                        $scope.subCategories = $scope.rootCategory.child;
                    } else {
                        $scope.subCategories = [];
                    }
                    console.log($scope.rootCategories);
                });
            } else {
                MyService.getCategories(false, categoryEmbededStr).then(function (resp) {
                    $scope.categories = resp;
                    console.log($scope.categories);
                });
            }

            $scope.selectCategory = function (c) {

                if (!c) {
                    $scope.categoryId = "";
                    $scope.categoryId = "";
                } else {
                    $scope.selectedCategory = c;
                    $scope.categoryId = c.id;
                }

                $scope.refresh();
            };

            $scope.selectSubCategory = function (c) {

                if (!c) {
                    $scope.subCategoryId = "";
                } else {
                    $scope.selectedSubCategory = c;
                    $scope.subCategoryId = c.id;
                }

                $scope.refresh();
            };

            $scope.selectRootCategory = function (c) {

                if (!c) {
                    $scope.rootCategoryId = "";
                } else {
                    $scope.rootCategory = c;
                    $scope.rootCategoryId = c.id;
                }
                if ($scope.rootCategory && $scope.rootCategory.child.length > 0) {
                    $scope.subCategories = $scope.rootCategory.child;
                } else {
                    $scope.subCategories = [];
                }
                console.log($scope.rootCategory);

                // $scope.refresh();
            };
            // --------- 类别筛选逻辑 END---------

            // --------- 价格筛选逻辑 BEGIN---------
            $scope.priceStr = '';
            $scope.priceRanges = [
                {priceFrom: 20, priceTo: 29.99},
                {priceFrom: 30, priceTo: 39.99},
                {priceFrom: 40, priceTo: 49.99},
                {priceFrom: 50, priceTo: 59.99},
                {priceFrom: 60, priceTo: 10000},
            ];

            $scope.selectPrice = function (priceFrom, priceTo) {

                $scope.priceFrom = priceFrom;
                $scope.priceTo = priceTo;

                if ($scope.priceFrom && $scope.priceTo) {
                    $scope.priceStr = `&f_price=${$scope.priceFrom}&f_price=${$scope.priceTo}`
                } else {
                    $scope.priceStr = '';
                }
                $scope.refresh();
            };
            // --------- 价格筛选逻辑 END---------

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

            $scope.refresh();

            // -------- 双语 BEGIN --------
            $scope.isCn = MyService.getLanguageFromLocalStorage();
            $rootScope.$on(CONSTANTS.languageChanged, function (event, args) {
                $scope.isCn = MyService.getLanguageFromLocalStorage();
                console.log($scope.isCn);
            });
            // -------- 双语  END  --------

        }]);

})();
