(function () {
    'use strict';
    angular.module('app').controller('findPasswordController', [
        '$scope', '$q', '$http', 'ngDialog', 'AuthService', '$window', 'AccountService', 'ngToast',
        function ($scope, $q, $http, ngDialog, AuthService, $window, AccountService, ngToast) {
            $scope.clientIdStr = clientIdStr; $scope.clientId= clientId;
            // refresh();
            // function refresh() {
            //
            //     AccountService.getUserName().then(function (value) {
            //         $scope.profile = value.data;
            //         console.log($scope.profile);
            //     });
            // }

            $scope.processForm = function (isValid) {

                if (!isValid) {
                    ngToast.create({
                        className: 'danger',
                        timeout: 1000,
                        content: '<a href="#">Some fields are not properly filled, please check and try again.</a>'
                    });
                }else{
                    AccountService.resetPassword($scope.data).then(function (value) {
                        console.log(value.data);

                        var resetPasswordModal =  ngDialog.open({
                            template: 'resetPasswordTemplate',
                            scope: $scope
                        });

                        resetPasswordModal.closePromise.then(function (data) {
                            //debugger;
                            console.log(data.id + ' has been dismissed.');
                            window.location.href = '/signin';
                        });

                        $scope.closerRsetPasswordModal = function () {
                            resetPasswordModal.close();
                            window.location.href = '/signin';
                        };

                    },function (error) {
                        ngToast.create({
                            className: 'danger',
                            timeout: 1000,
                            content: '<a href="#">Something is wrong, please check you username.</a>'
                        });
                    });

                }

            };

        }]);

})();
