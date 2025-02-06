(function () {
    'use strict';
    angular.module('app').controller('cargoHomeController', [
        '$scope', '$q', 'API', '$http', 'ngDialog', 'AuthService', '$window', 'HomeService', 'MyService', '$rootScope', 'CONSTANTS',
        function ($scope, $q, API, $http, ngDialog, AuthService, $window, HomeService, MyService, $rootScope, CONSTANTS) {

            $scope.gotoUrl = function (url) {
                console.log(url);
                window.location.href = url;
            };


            // -------- 双语 BEGIN --------
            $scope.isCn = MyService.getLanguageFromLocalStorage();
            $rootScope.$on(CONSTANTS.languageChanged, function (event, args) {
                $scope.isCn = MyService.getLanguageFromLocalStorage();
                console.log($scope.isCn);
            });
            // -------- 双语  END  --------
        }]);

})();
