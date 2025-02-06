(function () {
    'use strict';

    angular.module('app')
        .factory('HomeService', [
            '$q', '$interval', '$timeout', '$rootScope', '$http', 'API',
            function ($q, $interval, $timeout, $rootScope, $http, API) {
                var factory = {};

                factory.getUser = function () {
                    return $q(
                        function (resolve, reject) {
                            return $http({
                                method: 'GET',
                                url: API.url + 'user'
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
                                url: API.url + 'question-and-answer?page=1&size=1000000'
                            }).then(
                                function (resp) {
                                    resolve(resp);
                                }, function (err) {
                                    reject(err);
                                });
                        });
                };

                factory.getAllCategories = function () {
                    return $q(
                        function (resolve, reject) {
                            return $http({
                                method: 'GET',
                                url: API.url + 'category?page=1&size=1000&embedded=child,images,icon-images&f_rootLevel=true&f_rootLevel_op=='
                            }).then(
                                function (resp) {
                                    resolve(resp);
                                }, function (err) {
                                    reject(err);
                                });
                        });
                };

                // factory.getProductsByCategoryId = function (id) {
                //     return $q(
                //         function (resolve, reject) {
                //             return $http({
                //                 method: 'GET',
                //                 url: API.url + 'product?page=1&size=100000&embedded=group,category,&f_category.id_op===&f_category.id=' + id
                //             }).then(
                //                 function (resp) {
                //                     resolve(resp);
                //                 }, function (err) {
                //                     reject(err);
                //                 });
                //         });
                // };


                factory.getCompanyTypes = function () {
                    return $q(
                        function (resolve, reject) {
                            return $http({
                                method: 'GET',
                                url: "/companyTypes "
                            }).then(
                                function (resp) {
                                    resolve(resp);
                                }, function (err) {
                                    reject(err);
                                });
                        });
                };

                factory.getIdTypes = function () {
                    return $q(
                        function (resolve, reject) {
                            //debugger;
                            return $http({
                                method: 'GET',
                                url: "/individualIdTypes "
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