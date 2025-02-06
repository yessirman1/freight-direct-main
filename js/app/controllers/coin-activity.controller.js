(function () {
    'use strict';
    angular.module('app').controller('coinActivityController', [
        '$scope', '$q', '$http', 'ngDialog', 'AuthService', '$window', 'CoinActivityService', 'API', '$timeout', 'MyService',
        function ($scope, $q, $http, ngDialog, AuthService, $window, CoinActivityService, API, $timeout, MyService) {
            $scope.result = false;
            $scope.activityId = activityId;
            collect();
            $scope.clientIdStr = clientIdStr; $scope.clientId= clientId;
            function collect() {
                MyService.collect($scope.activityId).then(function (value) {
                    $scope.coin = value.data;
                    $scope.result = true;
                    console.log($scope.coins);
                },function (err) {
                    $scope.result = false;
                });
            }
        }]);

})();
