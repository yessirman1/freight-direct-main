(function () {
    'use strict';
    angular.module('app').controller('addressController', [
        '$scope', '$q', '$http', 'ngDialog', 'AuthService', '$window', 'AddressService', 'API', '$timeout', 'MyService', 'RegistrationQuestionService',
        function ($scope, $q, $http, ngDialog, AuthService, $window, AddressService, API, $timeout, MyService, RegistrationQuestionService) {
            $scope.clientIdStr = clientIdStr; $scope.clientId= clientId;
            AuthService.checkAuthStatus();

            $scope.pageNumber = 1;
            $scope.current = 1;

            refresh();

            function refresh() {

                if ($scope.pageNumber) {
                    $scope.SearchStr += '?page=' + $scope.pageNumber;
                }

                AddressService.getAll().then(function (value) {
                    $scope.addresses = value.data.content;
                    console.log($scope.addresses);
                });
            }

            $scope.url = MyService.getUrl();
            console.log($scope.url);


            $scope.deleteAddress = function (addressId) {
                AddressService.delete(addressId).then(function (value) {
                    console.log(value);
                    refresh();
                });
            };

            $scope.pageChanged = function (newPage) {
                $scope.pageNumber = newPage;
                refresh();
            };



        }]);

})();
