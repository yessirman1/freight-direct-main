(function () {
    'use strict';
    angular.module('app').controller('accountController', [
        '$scope', '$q', '$http', 'ngDialog', 'AuthService', '$window', 'AccountService', 'ngToast', 'MyService',
        function ($scope, $q, $http, ngDialog, AuthService, $window, AccountService, ngToast, MyService) {
            $scope.clientIdStr = clientIdStr; $scope.clientId= clientId;
            AuthService.checkAuthStatus();

            refresh();
            function refresh() {

                AccountService.getProfile().then(function (value) {
                    $scope.profile = value.data;
                    console.log($scope.profile);
                });
            }


            $scope.processForm = function (isValid) {

                if (!isValid) {
                    ngToast.create({
                        className: 'danger',
                        timeout: 1000,
                        content: '<a href="#">Some fields are not properly filled, please check and try again.</a>'
                    });
                }else{
                    AccountService.resetPassword($scope.data.oldPassword, $scope.data.password, $scope.data.confirmPassword).then(function (value) {
                        console.log(value);
                        if(value.status == 200){
                            ngToast.create({
                                className: 'success',
                                timeout: 1000,
                                content: '<a href="#">Password has been updated!</a>'
                            });
                            refresh();
                        }
                    }, function (err) {
                        ngToast.create({
                            className: 'danger',
                            timeout: 1000,
                            content: '<a href="#">Old password is not correct!</a>'
                        });
                        refresh();
                    });

                }

            };

        }]);

})();
