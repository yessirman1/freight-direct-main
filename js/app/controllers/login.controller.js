(function () {
    'use strict';
    angular.module('app').controller('loginController', [
        '$scope', '$q', '$http', 'ngDialog', 'AuthService', '$window', 'ngToast', 'MyService',
        function ($scope, $q, $http, ngDialog, AuthService, $window, ngToast, MyService) {
            $scope.clientIdStr = clientIdStr;
            $scope.clientId = clientId;
            $scope.data = {
                username: '',
                password: ''
            };
            $scope.result = true;
            $scope.error = '';
            $scope.processForm = function (isValid) {
                console.log($scope.data);
                $scope.loadingPromises = AuthService.login($scope.data).then(function (resp) {
                    // debugger;
                    console.log(resp);
                    $scope.result = true;
                    if (MyService.getCurrentUrl()) {
                        window.location.href = MyService.getCurrentUrl();
                    } else {
                        window.location.href = '/';
                    }

                    // getUser();

                }, function (err) {
                    $scope.result = false;
                    // ngDialog.open({
                    //     template: 'loginFailTemplate',
                    //     scope: $scope
                    // });

                    // create a toast with settings:
                    // ngToast.create({
                    //     className: 'success',
                    //     content: '<a href="#">成功添加商品到购物车</a>'
                    // });
                })
            };

            $scope.register = function () {
                $window.location.href = 'register';
            };

            var dialog;
            function openDialog() {
                //1 individual
                //2 company
                //3 website

                if (!$scope.isOnboarded) {
                    dialog = ngDialog.open({
                        template: 'beginMakingTransactionsTemplate',
                        scope: $scope
                    });
                } else {
                    dialog = ngDialog.open({
                        template: 'selectTransactionProductTemplate',
                        scope: $scope
                    });
                }


                dialog.closePromise.then(function (data) {
                    console.log(data.id + ' has been dismissed.');
                    $window.location.href = '/MingYuan?active=rateTrace#rate-tabs'
                });
            }


            // function submit(data) {
            //     // debugger;
            //     return $q(
            //         function (resolve, reject) {
            //             return $http({
            //                 method: 'Post',
            //                 url: "/auth/login",
            //                 transformRequest: function (obj) {
            //                     var str = [];
            //                     for (var p in obj)
            //                         str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            //                     return str.join("&");
            //                 },
            //                 data: data,
            //                 headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            //             }).then(
            //                 function (resp) {
            //                     // debugger;
            //                     resolve(resp);
            //                 }, function (err) {
            //                     reject(err);
            //                 });
            //         });
            // }


            function getUserService() {
                // debugger;
                return $q(
                    function (resolve, reject) {
                        return $http({
                            method: 'GET',
                            url: "/auth/user"
                        }).then(
                            function (resp) {
                                // debugger;
                                resolve(resp);
                            }, function (err) {
                                reject(err);
                            });
                    });
            }


        }]);

})();
