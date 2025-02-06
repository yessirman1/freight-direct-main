(function () {
    'use strict';

    angular.module('app').directive('fileDropzone', function () {

        var controller = ['$scope', function ($scope) {

                console.log($scope.fileDropzone);
                /**
                 * -----------------------------------------------
                 * ----------drop zone forAddress BEGIN---------
                 * -----------------------------------------------
                 * */
                //Set options for dropzone
                //Visit http://www.dropzonejs.com/#configuration-options for more options

                //fileDropzone 绑定的参数是文件类型， 1 ==> Id 文件， 7 ==> 地址文件
                //id: folderNameId: 1
                //OfficeAddress:  folderNameId:7

                $scope.dzOptions = {
                    url: '/upload/uploadFileDoc?folderNameId=' + $scope.fileDropzone,
                    paramName: 'photo',
                    maxFilesize: '10',
                    parallelUploads: 1, //How many file uploads to process in parallel (See the Enqueuing file uploads documentation section for more info)
                    // autoProcessQueue: false,
                    uploadMultiple: false, //Whether to send multiple files in one request.
                    acceptedFiles: 'image/jpeg, images/jpg, image/png, .pdf',
                    addRemoveLinks: true,
                    dictDefaultMessage: 'Click to add or drop files',
                    dictResponseError: 'Could not upload this file',
                    dictRemoveFile: 'Remove file'
                };

                var AddressFiles = [];

                $scope.files = [];
                //Handle events for dropzone
                //Visit http://www.dropzonejs.com/#events for more events
                $scope.dzCallbacks = {
                    'addedfile': function (file) {

                        console.log(file);
                        $scope.newFile = file;
                    },
                    'removedfile': function (file) {
                        var index = $scope.files.indexOf(file);
                        if (index > -1) {
                            $scope.files.splice(index, 1);
                        }
                        console.log($scope.files);
                    },
                    'success': function (file, resp) {
                        console.log(file);
                        console.log(resp);

                        file.key = resp[0].key;
                        $scope.files.push(file);
                        console.log($scope.files);

                        var a = document.createElement('a');
                        a.setAttribute('href', "/uploads/" + file.name);
                        a.innerHTML = "<br>download";
                        file.previewTemplate.appendChild(a);
                    }
                };

                //Apply methods for dropzone
                //Visit http://www.dropzonejs.com/#dropzone-methods for more methods
                $scope.dzMethods = {};
                $scope.removeNewFile = function () {
                    $scope.dzMethods.removeFile($scope.newFile); //We got $scope.newFile from 'addedfile' event callback
                };

                /**
                 * -----------------------------------------------
                 * ------------drop zone forAddress END-----------
                 * -----------------------------------------------
                 * */

            }],

            template = '<div class="dropzone" options="dzOptions" callbacks="dzCallbacks" methods="dzMethods" ng-dropzone></div>';

        return {
            restrict: 'EA', //Default in 1.3+
            scope: {
                files: '=',
                fileDropzone:'='
            },
            controller: controller,
            template: template
        };
    });



})();
