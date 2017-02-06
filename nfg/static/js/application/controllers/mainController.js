/**
 * Created by giacomo on 30/04/16.
 */
(function () {
    'use strict';

    /**
     * Main controller for the application
     * @param BackendCallService
     * @param $location
     * @param $uibModal
     * @constructor
     */
    var MainController = function (BackendCallService,$location,$uibModal) {
        var ctrl = this;
        ctrl.$location = $location;
        
        ctrl.showInfo = function () {
            $uibModal.open({
                animation: false,
                templateUrl: '/static/pages/modals/guiInfo.html',
                controller: 'GuiInfoController',
                controllerAs: 'guiInfoCtrl',
                size: 'md'
            });
        }

    };

    MainController.$inject = ['BackendCallService','$location','$uibModal'];
    angular.module('fg-gui').controller('MainController', MainController);

})();