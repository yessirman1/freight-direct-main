(function () {
    'use strict';
    angular.module('app').controller('footerController', [
        '$scope', '$q', '$http', 'FooterService', 'ngDialog','$sce', 'CONSTANTS', '$rootScope', 'AuthService', '$window', 'HomeService', 'CartService', 'CategoryService', 'MyService',
        function ($scope, $q, $http, FooterService, ngDialog,$sce, CONSTANTS, $rootScope, AuthService, $window, HomeService, CartService, CategoryService, MyService) {
            $scope.clientIdStr = clientIdStr; $scope.clientId= clientId;

            // FooterService.getAllFooters(true).then(function (value) {
            //     console.log('all-footers', value);
            //     $scope.rootFooters = value.data.content;
            // });

            // -------- 双语 BEGIN --------
            $scope.isCn = MyService.getLanguageFromLocalStorage();
            $rootScope.$on(CONSTANTS.languageChanged, function (event, args) {
                $scope.isCn = MyService.getLanguageFromLocalStorage();
                console.log($scope.isCn);
            });
            // -------- 双语  END  --------

            // if(footerId){
            //     FooterService.get(footerId).then(function (value) {
            //         console.log('one footers', value);
            //         $scope.footer = value.data.content;
            //         $scope.footerHtml = $sce.trustAsHtml($scope.footer);
            //
            //     })
            // }
        }]);

})();
