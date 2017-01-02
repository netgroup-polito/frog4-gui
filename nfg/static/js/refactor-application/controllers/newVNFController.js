/**
 * Created by luigi on 30/11/16.
 */

(function () {
    'use strict';
    /**
     * Controller for the modal used to add a VNF from the client
     * @param BackendCallService
     * @param $uibModalInstance Instance of the modal used to load the controller.
     */
    var NewVNFController = function (BackendCallService, $uibModalInstance) {
        var ctrl = this;
        ctrl.url = "";
        BackendCallService.getRepoAddress().then(function (res) {
            ctrl.url = res;
        });
        ctrl.vnf_id = "";
        ctrl.selectedTemplate = null;
        ctrl.md5 = "";
        ctrl.form_data = [];
        ctrl.data = null;
        ctrl.progress = "";
        ctrl.current_offset = 0;
        ctrl.retries = 0;
        // ctrl.messages = "";
        ctrl.upload_disabled = true;
        ctrl.calculate_md5 = function (file, chunk_size) {
            var slice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
                chunks = Math.ceil(file.size / chunk_size),
                current_chunk = 0,
                spark = new SparkMD5.ArrayBuffer();

            function onload(e) {
                spark.append(e.target.result);  // append chunk
                current_chunk++;
                if (current_chunk < chunks) {
                    read_next_chunk();
                } else {
                    ctrl.md5 = spark.end();
                }
            }
            function read_next_chunk() {
                var reader = new FileReader();
                reader.onload = onload;
                var start = current_chunk * chunk_size,
                    end = Math.min(start + chunk_size, file.size);
                reader.readAsArrayBuffer(slice.call(file, start, end));
            }
            read_next_chunk();
        };

        /**
         * function used to close the modal, without doing anything
         */
        ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        ctrl.load = function () {
            if (ctrl.selectedTemplate && !ctrl.upload_disabled) {
                BackendCallService.putVNFTemplate(ctrl.selectedTemplate).then(function (result) {
                    ctrl.vnf_id = result;
                    ctrl.form_data.push({"name": "vnf_id", "value": ctrl.vnf_id});
                    ctrl.data.submit();
                }, function (fail) {
                    console.error(JSON.stringify(fail));
                });
            }
        };
        ctrl.upload_done = function () {
            var newVNF = {id: ctrl.vnf_id, template: ctrl.selectedTemplate};
            $uibModalInstance.close(newVNF);
        };
        ctrl.upload_aborted = function () {
            ctrl.progress = 0;
        }
    };

    NewVNFController.$inject = ['BackendCallService', '$uibModalInstance'];
    angular.module('fg-gui').controller('NewVNFController', NewVNFController);

})();

