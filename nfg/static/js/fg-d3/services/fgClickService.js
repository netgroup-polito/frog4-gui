/**
 * Created by giacomo on 09/08/16.
 */
(function () {
    "use strict";
    /**
     * 
     * @param graphConstant
     * @param d3Service
     * @returns {{clickEP: _clickEP, clickVNF: _clickVNF, clickBS: _clickBS}}
     */
    var fgClickService = function (graphConstant, d3Service) {
        
        function _clickEP() {
            //click di un endpoint
            //elemento selezionato è l'end point
            //secondo click sullo stesso deseleziona
            //evento di click propagato o elemento selezionato aggiornato
        }
        
        function _clickVNF() {
            //click di una vnf
            //elemento selezionato è la vnf
            //secondo click sullo stesso deseleziona
            //evento di click propagato o elemento selezionato aggiornato
        }
        
        function _clickBS() {
            //click del big switch
            //elemento selezionato è il bigswitch
            //secondo click sullo stesso deseleziona
            //evento di click propagato o elemento selezionato aggiornato
        }

        return {
            clickEP: _clickEP,
            clickVNF: _clickVNF,
            clickBS: _clickBS
        }

    };
    fgClickService.$inject = ['graphConstant', 'd3Service'];

    angular.module('d3').service('fgClickService', fgClickService);
})();