/**
 * Created by giacomo on 30/04/16.
 */
(function () {
    'use strict';

    /**
     * Main controller for the application
     * @param BackendCallService
     * @param $location
     * @constructor
     */
    var MainController = function (BackendCallService,$location) {
        var ctrl = this;
        ctrl.$location = $location;

    };

    MainController.$inject = ['BackendCallService','$location'];
    angular.module('fg-gui').controller('MainController', MainController);

})();