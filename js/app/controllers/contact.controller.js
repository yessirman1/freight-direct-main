﻿(function () {
    'use strict';
    angular.module('app').controller('contactController', [
        '$scope', '$q', '$http', 'ngDialog', 'API', 'MyService', 'ngToast', '$rootScope', 'CONSTANTS',
        function ($scope, $q, $http, ngDialog, API, MyService, ngToast, $rootScope, CONSTANTS) {
            $scope.clientIdStr = clientIdStr;
            $scope.clientId = clientId;
            $scope.data = {
                title: '',
                name: '',
                email: '',
                preferDate: '',
                phone: '',
                comments: ''
            };
            $scope.result = true;
            $scope.error = '';
            var contactModal;
            $scope.processForm = function (isValid) {
                console.log($scope.data);
                if (!isValid) {
                    ngToast.create({
                        className: 'danger',
                        timeout: 1000,
                        content: '<a href="#">Some fields are not properly filled, please check and try again.</a>'
                    });
                } else {
                    $scope.loadingPromises = MyService.sendEmail('send-email/contact-us', $scope.data).then(function (resp) {
                        // debugger;
                        console.log(resp);
                        $scope.result = true;
                        contactModal = ngDialog.open({
                            template: 'contactUsSuccessTemplate',
                            scope: $scope
                        });
                    }, function (err) {
                        $scope.result = false;
                        contactModal = ngDialog.open({
                            template: 'contactUsFailTemplate',
                            scope: $scope
                        });
                    })
                }
            };


            $scope.closeModal = function () {
                contactModal.close();
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
