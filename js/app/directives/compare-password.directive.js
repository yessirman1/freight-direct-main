(function () {
    'use strict';
    angular.module('app').directive('comparePassword', function () {
        return {
            require: "ngModel",
            scope: {
                reference: "=comparePassword"
            },
            link: function (scope, element, attributes, ngModel, ctrl) {
                ctrl.$parsers.unshift(function (viewValue, $scope) {
                   var noMatch = viewValue != scope.reference
                   ctrl.$setValidity('noMatch', !noMatch);
                   return (noMatch)? noMatch:!noMatch;
                });

                // ngModel.$validators.compareTo = function (modelValue) {
                //     return modelValue == scope.otherModelValue;
                // };
                scope.$watch("reference", function (value) {
                    ctrl.$setValidity('noMatch', value === ctrl.$viewValue);
                });
            }
        };
    });
})();
