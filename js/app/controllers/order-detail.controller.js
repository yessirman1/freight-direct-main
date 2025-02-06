(function () {
    'use strict';
    angular.module('app').controller('orderDetailController', [
        '$scope', '$q', '$http', 'ngDialog', 'AuthService', '$window', 'TransactionSingleService', 'API', '$timeout', 'GatewayService', 'MyService',
        function ($scope, $q, $http, ngDialog, AuthService, $window, TransactionSingleService, API, $timeout, GatewayService, MyService) {
            $scope.clientIdStr = clientIdStr;
            $scope.clientId = clientId;

            $scope.hostUrl = hostUrl;
            $scope.orderId = orderId;
            console.log($scope.orderId);
            $scope.data = 'order';
            getOrder();

            function getOrder() {
                TransactionSingleService.get($scope.orderId).then(function (value) {
                    console.log(value.data);
                    $scope.order = value.data;
                    $scope.selectedOrder = $scope.order;
                })
            }


            $scope.payOrder = function (gateway) {
                if ($scope.selectedOrder && gateway.type) {
                    var newWindow = window.open('', '_self');
                    MyService.payOrder($scope.selectedOrder.id, gateway.type.toLowerCase()).then(function (resp) {
                        console.log(resp);
                        $scope.paymentLink = resp.data.payUrl;
                        // openPayDialog();
                        window.open($scope.paymentLink);
                        newWindow.location.href = $scope.paymentLink;
                    }, function (err) {
                        $scope.paymentLink = '';
                    })
                    // /v1/order-header/check/{orderheader的id}/{bank的id}
                }
            };

            var payDialog;
            $scope.fxTheme = fxTheme;
            $scope.selectedOrder = null;
            $scope.openPayDialog = function (order) {

                if ($scope.fxTheme === 'hcode-kidsdressing') {
                    payDialog = ngDialog.open({
                        template: 'kidDressingPayDialogModal',
                        scope: $scope
                    });

                    // $scope.closeDressingPayDialog = function () {
                    //     dressingPayDialog.close();
                    // };
                } else {
                    $scope.selectedOrder = order;
                    payDialog = ngDialog.open({
                        template: 'payDialogModal',
                        scope: $scope
                    });

                    $scope.pay = function (gateway) {
                        console.log(gateway);
                        // if (gateway == 1) {
                        //     console.log('payment type is 1')
                        // }
                        // if (gateway == 2) {
                        //     console.log('payment type is 2')
                        // }
                        $scope.payOrder(gateway);
                    }
                }

                $scope.closePayDialog = function () {
                    payDialog.close();
                };

            };

            getGateways();

            function getGateways() {
                GatewayService.getAll().then(function (resp) {
                    $scope.gateways = resp.data;
                    console.log($scope.gateways);
                }, function (err) {
                    console.log(err);
                })
            }

        }]);

})();
