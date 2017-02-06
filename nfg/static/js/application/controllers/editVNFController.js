/**
 * Created by luigi on 12/12/16.
 */
(function () {
    'use strict';
    /**
     * Controller for the modal used to add a VNF from the client
     * @param BackendCallService
     * @param $uibModalInstance Instance of the modal used to load the controller.
     * @param $dialogs
     * @param currentVNF
     * @param AppConstant
     */
    var EditVNFController = function (BackendCallService, $uibModalInstance, $dialogs, currentVNF, AppConstant) {
        var ctrl = this;
        ctrl.url = "";
        BackendCallService.getRepoAddress().then(function (res) {
            ctrl.url = res;
        });
        ctrl.vnf_id = currentVNF.id;
        ctrl.currentTemplate = currentVNF.template;
        ctrl.selectedImage = null;
        ctrl.image_upload_status = currentVNF["image-upload-status"];
        ctrl.remote_image = ctrl.image_upload_status == AppConstant.imgUploadStatus.REMOTE;
        ctrl.md5 = "";
        ctrl.form_data = [];
        ctrl.data = null;
        ctrl.progress = 0;
        ctrl.current_offset = 0;
        ctrl.retries = 0;
        ctrl.messages = null;
        ctrl.timeout = null;
        ctrl.uploadStep = false;
        ctrl.uploading = false;
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
            if (ctrl.uploading) {
                var confirm = $dialogs.confirm('Abort NF upload',
                    'NF image upload is in progress. Aborting the upload the NF image will not be updated. Are you sure?');
                confirm.result.then(function () {
                    window.clearTimeout(ctrl.timeout);
                    ctrl.data.abort();
                    $uibModalInstance.dismiss('cancel');
                });
            } else {
                $uibModalInstance.dismiss('cancel');
            }
        };
        ctrl.close = function () {
            if (!ctrl.messages) {
                var updatedVNF = {
                    "id": ctrl.vnf_id,
                    "template": ctrl.currentTemplate,
                    "image-upload-status": ctrl.image_upload_status
                };
                $uibModalInstance.close(updatedVNF);
            } else {
                $uibModalInstance.dismiss('cancel');
            }
        };
        ctrl.loadTemplate = function () {
            ctrl.uploadStep = true;
            ctrl.uploading = true;
            BackendCallService.updateVNFTemplate(ctrl.vnf_id, ctrl.currentTemplate).then(function () {
                ctrl.progress = 100;
                ctrl.uploading = false;
            }, function (fail) {
                console.error(JSON.stringify(fail));
                ctrl.messages = 'NF template update failed.';
                ctrl.uploading = false;
            });
        };
        ctrl.loadImage = function () {
            ctrl.uploadStep = true;
            ctrl.uploading = true;
            ctrl.form_data.push({"name": "vnf_id", "value": ctrl.vnf_id});
            ctrl.data.submit();
        };
        ctrl.upload_done = function () {
            ctrl.uploading = false;
        };
        ctrl.upload_aborted = function () {
            ctrl.messages = 'NF image upload aborted or timed out.';
            ctrl.uploading = false;
        };
    };

    EditVNFController.$inject = ['BackendCallService', '$uibModalInstance', 'dialogs', 'currentVNF', 'AppConstant'];
    angular.module('fg-gui').controller('EditVNFController', EditVNFController);

})();

