(function () {

    'use strict';

    angular.module('app')
        .constant("CUSTOMER_EVENTS", {
            "INFO_UPDATE": "update_infomation"
        })
        .constant('CONSTANTS', {
            AuthChanged: 'authenticated-changed',
            showLoading: 'showLoading',
            hideLoading: 'hideLoading',
            currentUrl: 'currentUrl',
            NotAuthenticated: 'NotAuthenticated',
            cartChanged: 'cartChanged',
            languageChanged: 'languageChanged',

        })
        .constant("API", {
            "url": hostUrl + "/v1/",
            "token": "",
            "tokenStr": ""
        })
        .constant("KEYS", {
            "token": "dhhjadfhkjdahfkjalklkkllkoiioeoofojo"
        })
        .constant("USER", {
            broker: 'BROKER',
            individual: 'INDIVIDUAL',
            company: 'COMPANY'
        })
        .constant("STATUS", {
            booked: "BOOKED",
            payeesAdded: "PAYEES_ADDED",
            processing: "PROCESSING",
            received: "RECEIVED",
            canceled: "CANCELED",
            settled: "SETTLED",
            statusForSpot: [
                "BOOKED",
                "PAYEES_ADDED",
                "PROCESSING",
                'CANCELED'
            ]
        })
        .constant("EVENT", {
            "rateUpdated": "rate-updated"
        })
        .constant('CART_EVENTS', {
            "cartChange": 'cartChange'
        })
        .constant('CART_CONSTANTS', {
            "CART_TOKEN": 'sdfrtrtw453fdgert34trtretergdf',
            'CART_UPDATE': 'update_cart'
        })
        .constant('USER_ROLES', {
            "admin": 'admin_role',
            "public": 'public_role'
        })
        .constant('ADMIN_ROLES', {
            "admin": 'admin_role',
            "normal": 'normal_role'
        })

})();
