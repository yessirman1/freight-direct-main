(function () {
    'use strict';
    angular.module('app').controller('dashboardController', [
        '$scope', '$q', '$http', 'MyService', 'ngDialog','$sce', 'CONSTANTS', '$rootScope', 'AuthService',
        'API', 'HomeService', 'CartService', 'CategoryService',
        function ($scope, $q, $http, MyService, ngDialog,$sce, CONSTANTS, $rootScope, AuthService,
                  API, HomeService, CartService, CategoryService) {
            $scope.url = MyService.getUrl();
            console.log($scope.url);

            $scope.clientIdStr = clientIdStr; $scope.clientId= clientId;
            $scope.loading = false;

            $rootScope.$on(CONSTANTS.showLoading, function (event, args) {
                $scope.loading = true;
            });

            $rootScope.$on(CONSTANTS.hideLoading, function (event, args) {
                $scope.loading = false;
            });


            $scope.qrId = qrId;
            $scope.qrCode = API.url + 'coin-activity/qr/' + $scope.qrId;
            //https://api.suoyanmall.com/v1/coin-activity/qr/1
            // $http({
            //     method: 'GET',
            //     url: API.url + 'coin-activity/qr/' + $scope.qrId
            // }).then(
            //     function (resp) {
            //        $scope.qrCode = resp.data;
            //        console.log(resp);
            //     }, function (err) {
            //         console.log(err);
            //     });
        }]);

})();
