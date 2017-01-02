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
    var NewVNFController = function (BackendCallService, $uibModalInstance, $dialogs, AppConstant) {
        var ctrl = this;
        ctrl.url = "";
        BackendCallService.getRepoAddress().then(function (res) {
            ctrl.url = res;
        });
        ctrl.vnf_id = "";
        ctrl.selectedTemplate = null;
        ctrl.selectedImage = null;
        ctrl.md5 = "";
		ctrl.form_data = [];
		ctrl.data = null;
        ctrl.progress = 0;
        ctrl.current_offset = 0;
        ctrl.retries = 0;
        ctrl.messages = null;
        ctrl.timeout = null;
        ctrl.remote_image = false;
        ctrl.image_upload_status = AppConstant.imgUploadStatus.IN_PROGRESS;
        ctrl.uploadStep = false;
        ctrl.uploading = false;
        ctrl.showTemplate = false;
		ctrl.calculate_md5 = function(file, chunk_size) {
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
			};
			function read_next_chunk() {
				var reader = new FileReader();
				reader.onload = onload;
				var start = current_chunk * chunk_size,
				end = Math.min(start + chunk_size, file.size);
				reader.readAsArrayBuffer(slice.call(file, start, end));
			};
			read_next_chunk();
		};

        /**
         * function used to close the modal, without doing anything
         */
        ctrl.cancel = function () {
            if (ctrl.uploading) {
                var confirm = $dialogs.confirm('Abort NF upload',
                    'NF upload is in progress. Aborting the upload the NF will not be added. Are you sure?');
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
            if (ctrl.image_upload_status != AppConstant.imgUploadStatus.IN_PROGRESS && !ctrl.messages) {
                var newVNF = {
                    "id": ctrl.vnf_id,
                    "template": ctrl.selectedTemplate,
                    "image-upload-status": ctrl.image_upload_status
                };
                $uibModalInstance.close(newVNF);
            } else {
                $uibModalInstance.dismiss('cancel');
            }
        };
        ctrl.load = function () {
            ctrl.uploadStep = true;
            ctrl.uploading = true;
            if (ctrl.remote_image) {
                BackendCallService.putVNFTemplate(ctrl.selectedTemplate, ctrl.image_upload_status).then(function (result) {
                    ctrl.vnf_id = result;
                    ctrl.progress = 100;
                    ctrl.uploading = false;
                }, function (fail) {
                    console.error(JSON.stringify(fail));
                    ctrl.messages = 'NF template upload failed.';
                    ctrl.uploading = false;
                });
            } else {
                BackendCallService.putVNFTemplate(ctrl.selectedTemplate, ctrl.image_upload_status).then(function (result) {
                    ctrl.vnf_id = result;
                    ctrl.form_data.push({"name": "vnf_id", "value": ctrl.vnf_id});
                    ctrl.data.submit();
                }, function (fail) {
                    console.error(JSON.stringify(fail));
                    ctrl.messages = 'NF template upload failed.';
                    ctrl.uploading = false;
                });
            }
        };
        ctrl.upload_done = function () {
            ctrl.image_upload_status = AppConstant.imgUploadStatus.COMPLETED;
            ctrl.uploading = false;
        };
        ctrl.upload_aborted = function () {
            ctrl.messages = 'NF image upload aborted or timed out.';
            ctrl.uploading = false;
        };
        ctrl.toggle_upload_status = function () {
            ctrl.image_upload_status = ctrl.remote_image ?
                AppConstant.imgUploadStatus.REMOTE : AppConstant.imgUploadStatus.IN_PROGRESS;
            ctrl.selectedImage = null;
        };
        ctrl.toggle_edit_template = function () {
            ctrl.showTemplate = !ctrl.showTemplate;
        };
    };

    NewVNFController.$inject = ['BackendCallService', '$uibModalInstance', 'dialogs', 'AppConstant'];
    angular.module('fg-gui').controller('NewVNFController', NewVNFController);

})();

