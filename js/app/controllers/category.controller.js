(function () {
    'use strict';
    angular.module('app').controller('categoryController', [
        '$scope', '$q', '$http', 'ngDialog', 'AuthService', '$window', 'CategoryService', 'CartService',
        function ($scope, $q, $http, ngDialog, AuthService, $window, CategoryService, CartService) {
            $scope.clientIdStr = clientIdStr; $scope.clientId= clientId;
            // ione new add
            $scope.onCategoryChanged = function (category) {
                console.log(category);
            };


            //http://api.gooodquality.com/v1/product?
            // page=1&size=12
            // &embedded=group,category,detail-images,main-image,list-image,slide-image,advertisement-image
            // &f_group=GOOD
            // &f_name=GOOD
            // &f_productGrade=GOOD
            // &f_category=GOOD
            // &f_inventory=GOOD
            // &f_price=GOOD
            // &f_promotionPrice=GOOD
            // &f_featureType=GOOD
            // &sort=price,asc
            $scope.searchCondition = '';
            $scope.pageSize = 24;
            $scope.pageNumber = 1;
            $scope.productName = '';
            $scope.categoryId = categoryId;
            console.log($scope.categoryId);
            $scope.keyword = keyword;
            $scope.productName = keyword;
            console.log($scope.keyword);
            // $scope.aaaaa = document.getElementsByClassName("slider-range");


            $scope.getSearchCondition = function () {
                $scope.searchCondition = '&embedded=group,category,detail-images,main-image,list-image,slide-image,advertisement-image';
                if ($scope.sort) {
                    $scope.searchCondition += '&sort=' + $scope.sort;
                }
                if ($scope.pageNumber) {
                    $scope.searchCondition += '&page=' + $scope.pageNumber;
                }
                if ($scope.pageSize) {
                    $scope.searchCondition += '&size=' + $scope.pageSize;
                }

                if ($scope.categoryId) {
                    $scope.searchCondition += '&f_category.id_op==&f_category.id=' + $scope.categoryId;
                }

                if ($scope.productName) {
                    $scope.searchCondition += '&f_name-group.name-group.brand=' + $scope.productName;
                }

                // http://api.gooodquality.com/v1/product?embedded=group,category,detail-images,main-image,list-image,slide-image,advertisement-image&page=1&size=24&f_category.id_op==&f_category.id=11&f_name-group.name-group.brand=apple

                $scope.refresh();
            };

            $scope.data = 'carts';
            $scope.categoryId = categoryId;
            $scope.setCategoryId = function (id) {
                console.log(id);
                $scope.categoryId = id;
                $scope.getSearchCondition();
            };

            $scope.addToCart = function (productId) {
                console.log(productId);
                CartService.add(productId, 1).then(function (value) {
                    console.log(value);
                });
            };

            $scope.refresh = function () {
                //家具 -> 餐厅
                console.log($scope.categoryId);
                // if ($scope.categoryId && $scope.categoryId != undefined) {
                //     CategoryService.getProductsByCategoryId($scope.categoryId).then(function (value) {
                //         console.log('---------- categoryController ----------', value);
                //         $scope.products = value.data.content;
                //         console.log($scope.products);
                //     });
                // }
                $scope.first = true;
                $scope.last = true;
                CategoryService.getBySearchStr($scope.searchCondition).then(function (value) {
                    console.log('---------- categoryController getAllBySearchStr ----------', value);
                    $scope.products = value.data.content;
                    $scope.first = value.data.first;
                    $scope.last = value.data.last;
                    console.log($scope.products);
                });
            };

            $scope.getSearchCondition();

            CategoryService.getAll().then(function (value) {
                $scope.categories = value.data.content;
                // console.log($scope.orders);
                console.log($scope.categories);
            });
            // CategoryService.getAllCategories(true).then(function (value) {
            //     console.log(value);
            //     $scope.categories = value.data.content;
            //     // $scope.categories = _.filter($scope.categories, function (value) {
            //     //     return value.child && value.child.length > 0
            //     // });
            //     console.log($scope.categories);
            // });

            $scope.sortDisplay = '请选择';
            $scope.makeSort = function (str, sortDisplay) {
                $scope.sortDisplay = sortDisplay;
                $scope.sort = str;
                $scope.getSearchCondition();
            };

            $scope.lastPage = function () {
                $scope.pageNumber = $scope.pageNumber - 1;
                $scope.getSearchCondition();
            };

            $scope.nextPage = function () {
                $scope.pageNumber = $scope.pageNumber + 1;
                $scope.getSearchCondition();
            };

            $scope.changePageSize = function (pageSize) {
                $scope.pageSize = pageSize;
                $scope.getSearchCondition();
            };

        }]);

})();
