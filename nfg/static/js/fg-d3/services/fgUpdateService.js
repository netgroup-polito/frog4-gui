/**
 * Created by giacomo on 20/08/16.
 */
(function () {
    "use strict";
    /**
     *
     * @returns {{updateEP: _updateEP, updateVNF: _updateVNF, updateBS: _updateBS}}
     * @param fgModalService
     */
    var fgUpdateService = function (fgModalService) {

        function _updateEP(scope) {
            //contex menu su di un endpoint
            return function (elem, pos) {
                return fgModalService.editEndpointModal(elem, pos, scope.schema);
            }
        }

        function _updateVNF(scope) {
            //contex menu di una vnf
            //apro il modale corrispondente
            return function (elem, pos) {
                return fgModalService.editVNFModal(elem, pos, scope.schema,scope.onTemplateRequest);
            }
        }

        function _updateBS() {
            //contex menu del big switch
            //apro il modale corrispondente
        }

        return {
            updateEP: _updateEP,
            updateVNF: _updateVNF,
            updateBS: _updateBS
        }

    };
    fgUpdateService.$inject = ['FgModalService'];

    angular.module('d3').service('fgUpdateService', fgUpdateService);
})();