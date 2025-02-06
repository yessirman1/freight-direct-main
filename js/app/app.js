(function () {
    'use strict';
    Dropzone.autoDiscover = false;

    // https://code.angularjs.org/1.5.8
    angular.module('app', [
        'angularSpinner',
        'mnBusy',
        'ngDialog',
        'highcharts-ng',
        'ngMessages',
        'mgo-angular-wizard',
        'thatisuday.dropzone',
        'datePicker',
        'ngToast',
        'angularUtils.directives.dirPagination'
    ]);


    angular.module('app')
    // allow DI for use in controllers, unit tests
        .constant('_', window._)
        // use in views, ng-repeat="x in _.range(3)"
        .run(function ($rootScope) {
            $rootScope._ = window._;
        });


    // paging
    // https://github.com/michaelbromley/angularUtils/blob/master/src/directives/pagination/README.md

    angular.module('app').config(function(paginationTemplateProvider) {
        paginationTemplateProvider.setPath('/js/app-libs/angular-utils-pagination/dirPagination.tpl.html');
    });

    angular.module('app').config(['ngToastProvider', function(ngToastProvider) {
        ngToastProvider.configure({
            additionalClasses: 'my-ng-toast',
            horizontalPosition: 'center',
            verticalPosition: 'center',
            maxNumber: 1,
            timeout: 10000
        });
    }]);

    //https://stackoverflow.com/questions/23785002/angularjs-auto-prefixes-forward-slash
    angular.module('app')
        .config(function ($locationProvider) {
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false,
                rewriteLinks: false
            });
        });


    angular.module('app').config(['ngDialogProvider', function (ngDialogProvider) {
        ngDialogProvider.setDefaults({
            // className: 'ngdialog-theme-default',
            // plain: true,
            // showClose: true,
            // closeByDocument: false,
            // closeByEscape: true
        });
    }]);


    // allow DI for use in controllers, unit tests
    angular.module('app').constant('_', window._)
    // use in views, ng-repeat="x in _.range(3)"
        .run(function ($rootScope) {
            $rootScope._ = window._;
        });

    // angular.module('app')
    //     .config(function(dropzoneOpsProvider){
    //     dropzoneOpsProvider.setOptions({
    //         url : '/upload_1.php',
    //         acceptedFiles : 'image/jpeg, images/jpg, image/png',
    //         addRemoveLinks : true,
    //         dictDefaultMessage : 'Click to add or drop photos',
    //         dictRemoveFile : 'Remove photo',
    //         dictResponseError : 'Could not upload this photo'
    //     });
    // });
    //


    angular.module('app').run(function ($rootScope, $location, $anchorScroll, api) {
        //when the route is changed scroll to the proper element.
        $rootScope.$on('$routeChangeSuccess', function (newRoute, oldRoute) {
            if ($location.hash()) $anchorScroll();
        });
        api.init();
    });


    angular.module('app').factory('api', function ($http, AuthService, $rootScope, CONSTANTS, API) {
        return {
            init: function (token) {
                console.log('token', token);
                if (AuthService.isAuthenticated()) {
                    $http.defaults.headers.common['Authorization'] = 'Bearer ' + AuthService.getToken();
                } else {
                    $rootScope.$broadcast(CONSTANTS.NotAuthenticated);
                    // window.location.href = '/signin';
                }
            }
        };
    });

    angular.module('app').controller('contactController', function ($scope, $http, sendService, ngDialog) {

        $scope.send = function (firstName, lastName, email, subject, message) {
            $scope.loadingPromises = sendService.sendMail(firstName, lastName, email, subject, message).then(function (result) {
                //console.log(result);
                ngDialog.open({template: '<p>Succesfully sent the message!</p>', plain: true});
            }, function (err) {
                ngDialog.open({
                    template: '<p style="color:red;">Please fill all the fields with right email! <p/> <br /> <p> If keep failing, Please send mail in your own mail account!</p>',
                    plain: true
                });
            });
        };

        $scope.gotoContactForm = function () {
            console.log($(".clear1").offset().top);
            $("body").animate({scrollTop: ($(".clear1").offset().top - 50)}, "slow");
        }

        $scope.arrs = [
            {
                image: "Images/tips/1.jpg",
                content: "Leave enough space between the cook-top and the wall, avoid sticking the cook-top to the wall, or the kitchen-wares will go against the wall."
            },
            {
                image: "Images/tips/2.jpg",
                content: "The cabinet relies on the wall must be considered the external process of door line, avoid influencing the opening and closing of doors, drawers and pull-out baskets."
            },
            {
                image: "Images/tips/3.jpg",
                content: "More counter space(above 800mm) ideally between the range and sink, it helps those cook frequently or prepare not simple meals."
            },
            {
                image: "Images/tips/4.jpg",
                content: "Pay attention to the reasonable configuration of the fittings, although the fittings of the kitchen are varied, those suitable for each kitchen are different, they should be easy to use."
            },
            {
                image: "Images/tips/5.jpg",
                content: "Pay attention to the reserved position of the socket, the socket between the benchtop and the upper cabinet should not be in the position of the gutter, the outlet of the refrigerator is best set on the side or upper side of the main wall, as well as the microwave, rangehood, disinfection cabinet and the oven etc. "
            },
            {
                image: "Images/tips/6.jpg",
                content: "For the location of Up and down nozzles, the upper pipeline has better not to be less than 400 mm, the height of the water pipe is best not to exceed 100 mm or not less than 200 mm, when installing a cabinet, the position of the moving saw could be reduced to a minimum. Because the bottom of the cabinet has adjustment leg, the position of kit-board is between 150mm to 160mm commonly."
            },
            {
                image: "Images/tips/7.jpg",
                content: "There are two ways of setting the pipes of kitchen ventilators, one of which is to, before the ceiling is sealed, preset the pipes inside the ceiling while find out the exit of the pipes. And the other approach is to set the pipes under the ceiling and cover them with boards. However, in the latter procedure, the requirement that the gap between the pipes and the main wall is less than 300mm should be met."
            }
        ]

        $scope.box = $scope.arrs[0];
        var i = 0;
        $scope.set = function () {
            i = i + 1;
            if (i > 6) {
                i = 0;
            }
            $scope.box = $scope.arrs[i];

        }
    });


    angular.module('app').controller('tipController', function ($scope, $http, sendService, ngDialog) {
        $scope.arrs = [
            {
                image: "Images/tips/1.jpg",
                content: "Leave enough space between the cook-top and the wall, avoid sticking the cook-top to the wall, or the kitchen-wares will go against the wall."
            },
            {
                image: "Images/tips/2.jpg",
                content: "Leave enough space between the cook-top and the wall, avoid sticking the cook-top to the wall, or the kitchen-wares will go against the wall."
            },
            {
                image: "Images/tips/3.jpg",
                content: "Leave enough space between the cook-top and the wall, avoid sticking the cook-top to the wall, or the kitchen-wares will go against the wall."
            },
            {
                image: "Images/tips/4.jpg",
                content: "Leave enough space between the cook-top and the wall, avoid sticking the cook-top to the wall, or the kitchen-wares will go against the wall."
            },
            {
                image: "Images/tips/5.jpg",
                content: "Leave enough space between the cook-top and the wall, avoid sticking the cook-top to the wall, or the kitchen-wares will go against the wall."
            },
            {
                image: "Images/tips/6.jpg",
                content: "Leave enough space between the cook-top and the wall, avoid sticking the cook-top to the wall, or the kitchen-wares will go against the wall."
            },
            {
                image: "Images/tips/7.jpg",
                content: "Leave enough space between the cook-top and the wall, avoid sticking the cook-top to the wall, or the kitchen-wares will go against the wall."
            }
        ]
        $scope.m = "sdfdsf";
        $scope.i = 1;
        $scope.next = function () {
            console.log($scope.i);
        }
    });
})();


(function () {
    'use strict';

    angular.module('app')
        .service('sendService', function ($q, $http) {

            var sendMail = function (firstName, lastName, email, subject, message) {
                return $q(function (resolve, reject) {
                    $http({
                        url: "/Contact/SendEmail",
                        method: "POST",
                        data: {
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            subject: subject,
                            message: message
                        }
                    }).success(function (data, status, headers, config) {
                        if (data.Result === true) {
                            resolve(data.Result);
                        } else {
                            reject(data.Result);
                        }
                    }).error(function (data, status, headers, config) {
                    });
                });
            };

            return {
                sendMail: sendMail
            };
        });

})();

(function () {
    'use strict';
    angular.module('app').controller('homeController', [
        '$scope', 'ngDialog', '$location', '$window', '$anchorScroll',
        function ($scope, ngDialog, $location, $window, $anchorScroll) {

            $scope.data = 'dfsdf';
            // $anchorScroll();

            //  function gotoHash(newHash) {
            //     if ($location.hash() !== newHash) {
            //         // set the $location.hash to `newHash` and
            //         // $anchorScroll will automatically scroll to it
            //         $location.hash(newHash);
            //     } else {
            //         // call $anchorScroll() explicitly,
            //         // since $location.hash hasn't changed
            //         $anchorScroll();
            //     }
            // };


            $scope.gotoContactUs = function () {
                $location.hash('contact-us');
                $anchorScroll.scroll();
            };


            $scope.goto = function (id) {
                $location.hash(id);
                $anchorScroll.scroll();
            };


            $scope.wechatClick = function () {
                ngDialog.open({
                    template: '<p><img src="images/cfg/home/wechat.png" alt=""></p>',
                    plain: true,
                    className: 'ngdialog-theme-default wechat-dialog'
                });
            }

        }]);


    angular.module('app').controller('footerController', [
        '$scope', 'ngDialog', '$q', '$http', '$location', '$anchorScroll',
        function ($scope, ngDialog, $q, $http, $location, $anchorScroll) {


            $scope.goto = function (id) {
                $location.hash(id);
                $anchorScroll.scroll();
            };

            $scope.goto = function (newHash) {
                if ($location.hash() !== newHash) {
                    // set the $location.hash to `newHash` and
                    // $anchorScroll will automatically scroll to it
                    $location.hash(newHash);
                } else {
                    // call $anchorScroll() explicitly,
                    // since $location.hash hasn't changed
                    $anchorScroll();
                }
            };

            $scope.wechatClick = function () {
                ngDialog.open({
                    template: '<p><img src="images/cfg/home/wechat.png" alt=""></p>',
                    plain: true,
                    className: 'ngdialog-theme-default wechat-dialog'
                });
            };

            $scope.data = {
                name: '',
                email: ''
            };

        }]);

})();



