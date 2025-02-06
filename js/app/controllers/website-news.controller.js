(function () {
    'use strict';
    angular.module('app').controller('websiteNewsController', [
        '$scope', '$q', 'API', '$http', 'ngDialog', 'AuthService', '$window', 'HomeService', 'MyService', '$rootScope', 'CONSTANTS', 'WebsiteNewsService',
        function ($scope, $q, API, $http, ngDialog, AuthService, $window, HomeService, MyService, $rootScope, CONSTANTS, WebsiteNewsService) {

            $scope.gotoUrl = function (url) {
                console.log(url);
                window.location.href = url;
            };
            $scope.pageSize = 120;
            $scope.pageNumber = 1;
            $scope.SearchStr = '';

            $scope.news = [];

            getNews();

            function getNews() {
                $scope.SearchStr = '';
                if ($scope.pageNumber) {
                    $scope.SearchStr += '?page=' + $scope.pageNumber;
                }
                if ($scope.pageSize) {
                    $scope.SearchStr += '&size=' + $scope.pageSize;
                }
                $scope.SearchStr += '&f_published=true&f_published_op==';

                WebsiteNewsService.getBySearchStr($scope.SearchStr).then(function (resp) {
                    $scope.news = resp.data.content;
                    console.log($scope.news);
                })
            }

            // -------- 双语 BEGIN --------
            $scope.isCn = MyService.getLanguageFromLocalStorage();
            $rootScope.$on(CONSTANTS.languageChanged, function (event, args) {
                $scope.isCn = MyService.getLanguageFromLocalStorage();
                console.log($scope.isCn);
            });
            // -------- 双语  END  --------
        }]);

})();
