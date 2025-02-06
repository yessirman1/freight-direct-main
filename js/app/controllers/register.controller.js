(function () {
    'use strict';
    angular.module('app').controller('registerController', [
        '$scope', '$q', '$http', 'ngDialog', '$window', 'AccountService','ngToast','RegistrationQuestionService',
        function ($scope, $q, $http, ngDialog, $window, AccountService, ngToast, RegistrationQuestionService) {
            // var vm = this;
            $scope.clientIdStr = clientIdStr; $scope.clientId= clientId;

            $scope.data = {
                username: '',
                phone: '',
                password: '',
                confirmPassword: '',
                email: '',
                registrationAnswers: []
            };
            $scope.result = true;
            $scope.error = '';

            $scope.agreePrivacyPolicy = true;

            $scope.processForm = function (isValid) {
                console.log($scope.data);
                if($scope.agreePrivacyPolicy === true){
                    if (!isValid) {
                        ngToast.create({
                            className: 'danger',
                            timeout: 1000,
                            content: '<a href="#">Some fields are not properly filled, please check and try again.</a>'
                        });
                    }else{
                        $scope.loadingPromises = AccountService.register($scope.data).then(function (resp) {
                            // debugger;
                            console.log(resp);
                            $scope.result = true;
                            $window.location.href = 'signin';
                        }, function (err) {
                            $scope.result = false;
                            var errMsg = '';
                            if(err.error.indexOf('Duplicate') > -1){
                                errMsg = 'Username is duplicated, please try another one';
                            }else {
                                errMsg = 'Something wrong happens, please try again later';
                            }
                            ngToast.create({
                                className: 'danger',
                                timeout: 2000,
                                content: '<a href="#">' + errMsg + '</a>'
                            })
                        })
                    }
                } else {
                    ngToast.create({
                        className: 'danger',
                        timeout: 2000,
                        content: '<a href="#">' + 'Please accept the privacy policy' + '</a>'
                    })
                }

            };

            // errDialog();
            function errDialog() {
                var dialog = ngDialog.open({
                    template: 'registerFormTemplate',
                    scope: $scope
                });

                $scope.close = function () {
                    dialog.close();
                };
            }


            $scope.setupAccount = function () {
                console.log('setupAccount');
                $window.location.href = '/onboarding';
            };

            function submit(data) {
                // debugger;
                console.log(data);
                return $q(
                    function (resolve, reject) {
                        return $http({
                            method: 'Post',
                            url: "auth/register",
                            // transformRequest: function (obj) {
                            //     var str = [];
                            //     for (var p in obj)
                            //         str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            //     return str.join("&");
                            // },
                            data: data
                        }).then(
                            function (resp) {
                                // debugger;
                                resolve(resp);
                            }, function (err) {
                                reject(err);
                            });
                    });
            }


            // Registration email validation

            $scope.validateEmail = function (data) {
                //debugger;
                $http.get("/auth/checkEmail?email=" + $scope.data.email)
                    .success(function (response) {
                        //debugger;
                        if (response == 1) {
                            $scope.msg = "The email has been taken";
                            $scope.disableBtn = false;
                        } else {
                            $scope.msg = "";
                            $scope.disableBtn = true;
                        }
                    }).error(function () {
                    console.log("something goes wrong");
                });
            };

            $scope.v = function () {
                return test($scope.data.password);
            };

            var tests = [/[0-9]/, /[a-z]/, /[A-Z]/, /[^A-Z-0-9]/i]

            function test($scope) {
                if ($scope.data.password == null)
                    return -1;
                var s = 0;
                if ($scope.data.password.length < 6)
                    return 0;
                for (var i in tests)
                    if (tests[i].test($scope.data.password))
                        s++;
                return s;
            }

            getQuestions();
            function getQuestions() {
                $scope.data.registrationAnswers = [];
                // https://admin.suoyanmall.com/api/v1/registration-question
                RegistrationQuestionService.getAll().then(function (resp) {
                    console.log(resp.data.content);
                    $scope.questions = resp.data.content;
                    $scope.questions.map(function (q) {
                        $scope.data.registrationAnswers.push({
                            question: q.question,
                            sort: q.sort,
                            type: q.type,
                            answer: '',
                            registrationQuestionOptions: q.registrationQuestionOptions
                        })
                    });
                }, function (err) {
                    console.log(err);
                })
            }

            // Selected fruits
            $scope.selection = [];

            // Toggle selection for a given fruit by name
            $scope.toggleSelection = function toggleSelection(option, qa) {
                var idx = $scope.selection.indexOf(option);

                // Is currently selected
                if (idx > -1) {
                    $scope.selection.splice(idx, 1);
                }

                // Is newly selected
                else {
                    $scope.selection.push(option);
                }

                console.log($scope.selection);
                qa.answer = $scope.selection.join(',');

            };


            $scope.gotoLogin = function () {
                window.location.href = '/signin';
            }
        }]);

})();
