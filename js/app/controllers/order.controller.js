(function () {
    'use strict';
    angular.module('app').controller('orderController', [
        '$scope', '$q', '$http', 'ngDialog', 'AuthService', '$window', 'TransactionSingleService', 'API', '$timeout',
        'MyService', 'GatewayService',
        function ($scope, $q, $http, ngDialog, AuthService, $window, TransactionSingleService, API, $timeout,
                  MyService, GatewayService) {
            AuthService.checkAuthStatus();
            $scope.clientIdStr = clientIdStr; $scope.clientId= clientId;
            $scope.data = 'order';
            refresh();
            MyService.showLoading(true);
            $scope.fxTheme = fxTheme;
            function refresh() {

                if ($scope.pageNumber) {
                    $scope.SearchStr += '?page=' + $scope.pageNumber;
                }

                TransactionSingleService.getAll().then(function (value) {
                    $scope.orders = value.data.content;
                    console.log($scope.orders);
                    MyService.showLoading(false);
                }, function (err) {
                    MyService.showLoading(false);
                });
            }

            $scope.pay = function (order) {
                console.log(order);
            };

            $scope.gotoOrder = function (order) {
                window.location.href = '/orderDetail/' + order.id;
            };

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
                        $scope.paymentLink = 'erwerwe';
                    })
                    // /v1/order-header/check/{orderheader的id}/{bank的id}
                }
            };

            var payDialog;
            $scope.selectedOrder = null;
            $scope.openPayDialog = function (order) {

                if ($scope.fxTheme === 'hcode-kidsdressing') {
                    $scope.selectedOrder = order;
                    payDialog = ngDialog.open({
                        template: 'kidDressingPayDialogModal',
                        scope: $scope
                    });

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

            $scope.pageNumber = 1;
            $scope.current = 1;
            $scope.pageChanged = function (newPage) {
                $scope.pageNumber = newPage;
                $scope.refresh();
            };

            // $scope.timeInMs = 0;
            //
            // function countUp() {
            //     refresh();
            //     $timeout(countUp, 30000);
            // }
            //
            // $timeout(countUp, 30000);

        }]);

})();
