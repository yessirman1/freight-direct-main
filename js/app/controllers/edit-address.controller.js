(function () {
    'use strict';
    angular.module('app').controller('editAddressController', [
        '$scope', '$q', '$http', 'ngDialog', 'AuthService', '$window', 'AddressService', 'API', '$timeout', 'MyService', 'RegistrationQuestionService','ngToast',
        function ($scope, $q, $http, ngDialog, AuthService, $window, AddressService, API, $timeout, MyService, RegistrationQuestionService, ngToast) {
            $scope.clientIdStr = clientIdStr; $scope.clientId= clientId;
            AuthService.checkAuthStatus();

            $scope.addressId = addressId;
            refresh();
            function refresh() {
                AddressService.get(addressId).then(function (value) {
                    $scope.address = value.data;
                    console.log($scope.address);
                });
            }

            $scope.processForm = function (isValid) {

                if (!isValid) {
                    ngToast.create({
                        className: 'danger',
                        timeout: 1000,
                        content: '<a href="#">Some fields are not properly filled, please check and try again.</a>'
                    });
                    return;
                }else {
                    console.log($scope.address);
                    AddressService.update(addressId,$scope.address).then(function (value) {
                        console.log(value);
                        if(value.status == 200){
                            ngToast.create({
                                className: 'success',
                                timeout: 1000,
                                content: '<a href="#">Address has been updated!</a>'
                            });
                            refresh();
                        }
                    }, function (err) {
                        ngToast.create({
                            className: 'danger',
                            timeout: 1000,
                            content: '<a href="#">Error</a>'
                        });
                        refresh();
                    });
                }
            };



        }]);

})();
