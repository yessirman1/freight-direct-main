(function () {
    'use strict';
    angular.module('app').controller('cargoHeaderController', [
        '$scope', '$q', '$http', 'ngDialog', 'CONSTANTS', '$rootScope', 'AuthService', '$window', 'HomeService', 'CartService', 'CartItemService', 'CategoryService', 'MyService',
        function ($scope, $q, $http, ngDialog, CONSTANTS, $rootScope, AuthService, $window, HomeService, CartService, CartItemService, CategoryService, MyService) {
            $scope.hostUrl = hostUrl;
            $scope.clientIdStr = clientIdStr;
            $scope.clientId = clientId;
            MyService.storeCurrentUrl();

            $scope.goHome = function () {
                window.location.href = '/';
            };

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
