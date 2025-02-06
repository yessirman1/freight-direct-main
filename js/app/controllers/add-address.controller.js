(function () {
    'use strict';
    angular.module('app').controller('addAddressController', [
        '$scope', '$q', '$http', 'ngDialog', 'AddressService', 'CartItemService', 'AuthService', 'CartService', 'ngToast',
        'TransactionSingleService', 'ShipmentFeeService', 'ProfileService',
        function ($scope, $q, $http, ngDialog, AddressService, CartItemService, AuthService, CartService, ngToast) {
            $scope.clientIdStr = clientIdStr; $scope.clientId= clientId;
            AuthService.checkAuthStatus();

            $scope.address = {
                id: '',
                streetLineOne: '',
                city: '',
                zipOrPostalCode: ''
            };

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
                    AddressService.add($scope.address).then(function (value) {
                        console.log(value);
                        if(value.status == 200){
                            ngToast.create({
                                className: 'success',
                                timeout: 1000,
                                content: '<a href="#">Address has been added!</a>'
                            });
                            refresh();
                        }
                    });
                }
            };
        }]);

})();
