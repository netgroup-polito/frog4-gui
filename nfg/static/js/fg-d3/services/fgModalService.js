/**
 * Created by giacomo on 03/07/16.
 */
(function () {
    'use strict';
    var fgModalService = function ($q, $uibModal) {

        /**
         *
         * @param fg
         * @param fgPos
         * @param schema
         * @returns {Window|*}
         * @private
         */
        var _newEndpointModal = function (fg, fgPos, schema) {
            return $uibModal.open({
                animation: false,
                templateUrl: '/static/js/fg-d3/modal_view/endpointModalView.html',
                controller: 'NewEndpointModalController',
                controllerAs: 'EPCtrl',
                size: 'lg',
                resolve: {
                    // the info passed to the controller of the modal
                    fg: clone(fg),
                    fgPos: clone(fgPos),
                    schema: clone(schema)
                }
            });
        };

        /**
         *
         * @param elem
         * @param pos
         * @param schema
         * @returns {Window|*}
         * @private
         */
        var _editEndpointModal = function (elem, pos, schema) {
            return $uibModal.open({
                animation: false,
                templateUrl: '/static/js/fg-d3/modal_view/endpointModalView.html',
                controller: 'EditEndpointModalController',
                controllerAs: 'EPCtrl',
                size: 'lg',
                resolve: {
                    // the info passed to the controller of the modal

                }
            });
        };

        return {
            newEndpointModal: _newEndpointModal,
            editEndpointModal: _editEndpointModal
        };
    };

    fgModalService.$inject = ['$q', '$uibModal'];

    angular.module('fg-gui').service('FgModalService', fgModalService);
})();