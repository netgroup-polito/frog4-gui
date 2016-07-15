/**
 * Created by giacomo on 03/07/16.
 */
(function () {
    'use strict';
    var fgModalService = function ($q,$uibModal) {

        /**
         *
         * @private
         */
        var _endPointModal = function () {
            return $uibModal.open({
                animation: false,
                templateUrl: '../modal_view/enpointModalView.html',
                controller: 'EndpointModalController',
                controllerAs: 'EPCtrl',
                size: 'lg',
                resolve: {
                    // the info passed to the controller of the modal

                }
            });
        };

        return {
            endPointModal: _endPointModal
        };
    };

    fgModalService.$inject = ['$q','$uibModal'];

    angular.module('fg-gui').service('FgModalService', fgModalService);
})();