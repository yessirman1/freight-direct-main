
(function () {
    'use strict';

    angular
        .module('app')
        .directive('validEmail', validEmail);

    validEmail.$inject = ['$window'];

    function validEmail($window) {

        // requires an isloated model
        return {
            // restrict to an attribute type.
            restrict: 'A',
            // element must have ng-model attribute.
            require: 'ngModel',
            link: function(scope, ele, attrs, ctrl){

                //https://stackoverflow.com/questions/19091685/parser-unshifthow-does-this-work
//
                //https://stackoverflow.com/questions/35718314/errors-parsetrue-prevent-enable-submit-button-in-angularjs
                /**
                 * This function is added to the list of the $parsers.
                 * It will be executed the DOM (the view value) change.
                 * Array.unshift() put it in the beginning of the list, so
                 * it will be executed before all the other
                 */

                // add a parser that will process each time the value is
                // parsed into the model when the user updates it.
                ctrl.$parsers.unshift(function(viewValue) {

                    scope.isvalid= (viewValue && /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(viewValue)) ? 'valid' : undefined; // Check if the string contains letter. RegExp.test() simply returns a boolean if the string matches the regex.

                    if(!scope.isvalid) { // 如果有错
                        ctrl.$setValidity('invalidEmailError', false); // Tell the controlller that the value is valid
                        return undefined; // Return this value (it will be put into the model)
                    } else { // … otherwise…
                        ctrl.$setValidity('invalidEmailError', true); //
                        return viewValue; // When the value is invalid, we should return `undefined`, as asked by the documentation
                    }

                });


            }
        }
    }

})();

