/**
 * Created by giacomo on 01/05/16.
 */
(function () {
    'use strict';

    var NFFGController = function (BackendCallService, $uibModal,d3Service) {
        var ctrl = this;

        d3Service.d3().then(function (d3) {
            ctrl.d3 = d3;
        });

        ctrl.showEditButton = false;
        ctrl.fg = null;

        ctrl.toggleEditButton = function () {
            ctrl.showEditButton = !ctrl.showEditButton;
        };

        ctrl.updateFGInfo = function () {
            var updateInfoModal = $uibModal.open({
                animation: false,
                templateUrl: '/static/pages/refactor/modals/newUserModal.html',
                controller: 'UpdateFGInfoController',
                controllerAs: 'UpdateFGInfoCtrl',
                size: 'lg',
                resolve: {
                    info: function () {
                        return {
                            id: fg.id,
                            description: fg.description,
                            name: fg.name
                        }
                    }
                }
            });
            updateInfoModal.result.then(function (res) {
                fg.id = res.id;
                fg.description = res.description;
                fg.name = res.name;
            })
        }

    };

    NFFGController.$inject = ['BackendCallService', '$uibModal','d3Service'];
    angular.module('fg-gui').controller('NFFGController', NFFGController);

})();