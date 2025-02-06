(function () {
    'use strict';
    angular.module('app').controller('coinController', [
        '$scope', '$q', '$http', 'ngDialog', 'AuthService', '$window', 'CoinHistoryService', 'API', '$timeout','MyService',
        function ($scope, $q, $http, ngDialog, AuthService, $window, CoinHistoryService, API, $timeout, MyService) {
            $scope.clientIdStr = clientIdStr; $scope.clientId= clientId;
            AuthService.checkAuthStatus();
            $scope.current = 1;
            $scope.pageNumber = 1;
            $scope.pageSize = 12;
            refresh();
            function refresh() {
                CoinHistoryService.getByPaging($scope.pageNumber, $scope.pageSize).then(function (resp) {
                    $scope.coins = resp.data.content;
                    $scope.totalCount = resp.data.totalElements;
                    console.log($scope.coins);
                });
            }
            $scope.url = MyService.getUrl();
            console.log($scope.url);


            $scope.pageChanged = function (newPage) {
                $scope.pageNumber = newPage;
                refresh();
            };


        }]);

})();
