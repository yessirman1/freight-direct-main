(function () {
    'use strict';
    angular.module('app')
    //OrderResource
        .service('AccountResource', ['$resource', 'API', function ($resource, API) {
            return $resource(
                API.url,
                {id: "@id"},
                {
                    update: {
                        method: 'PUT',
                        url: 'api/admin/administrators'
                    },
                    search: {
                        method: 'GET',
                        url: 'api/admin/administrators/search'
                    },
                    login: {
                        headers: {"Content-Type": "application/x-www-form-urlencoded"},
                        method: 'POST',
                        url: API.url + 'login',
                    },
                    logout: {
                        method: 'POST',
                        url: API.url + 'logout',
                    }
                }
            );
        }])
        .service('FaqResource', ['$resource', 'API', function ($resource, API) {
            return $resource(
                API.url + 'question-and-answer?page=1&size=1000000',
                {id: "@id"},
                {}
            );
        }])

        .service('CategoryResource', ['$resource', 'API', function ($resource, API) {
            return $resource(
                "api/admin/categories/:id",
                {id: "@id"},
                {
                    update: {
                        method: 'PUT'
                    },
                    search: {
                        method: 'GET',
                        url: 'api/admin/categories/search'
                    }
                }
            );
        }]);
})();

// { 'get':    {method:'GET'},
//   'save':   {method:'POST'},
//   'query':  {method:'GET', isArray:true},
//   'remove': {method:'DELETE'},
//   'delete': {method:'DELETE'} };


(function () {
    'use strict';
    angular.module('app')
        .service('ExampleResource', ['$resource', 'API', function ($resource, API) {
            //服务配置方法：$resource(url，[paramDefaults]，[ actions]);
            return $resource(
                //------base url BEGIN----------
                "api/admin/locations/:id",
                //------base url END------------

                //------paramDefaults BEGIN-----
                {id: "@id"},
                //------paramDefaults END-------

                //-------扩展方法 actions BEGIN--
                {
                    //Update
                    update: {
                        method: 'PUT'
                    },
                    //action 2
                    getAll: {
                        method: 'GET',
                        url: '/api/admin/locations'
                        //params: { pageSize: '@pageSize', pageNumber: '@pageNumber', orderBy: '@orderBy' }
                    },
                    //action 3
                    getSomething:
                        {
                            method: 'GET', //POST
                            url: ''
                            // params:{
                            //   charge:true
                            // },
                            // isArray:boolean,
                            // transformRequest:函数或者函数数组
                            // transformResponse:函数或者函数数组
                            // cache:布尔型或缓存对象
                            // timeout:数值或promise对象
                            // withCredentials:布尔类型
                            // responseType:字符串，用来设置XMLHttpRequestResponseType属性
                        }
                }
                //-------actions END----------

            );
        }]);
})();
