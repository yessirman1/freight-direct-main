(function () {
    'use strict';
    angular.module('app').controller('faqController', [
        '$scope', '$q', '$http', 'ngDialog', 'AuthService', '$window', 'FaqService',
        function ($scope, $q, $http, ngDialog, AuthService, $window, FaqService) {
            $scope.clientIdStr = clientIdStr; $scope.clientId= clientId;
            $scope.data = 'home';

            FaqService.getAll().then(function (value) {
                $scope.faqs = value.data.content;
                console.log($scope.faqs);
            })

        }]);

})();
