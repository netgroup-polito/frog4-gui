/**
 * Created by luigi on 09/12/16.
 */
(function () {

    var vnfImageUploader = function () {

        return {
			restrict: 'A',
			scope: {
                url: '@',
                vnfId: '@',
				md5: '@',
                formData: '=',
                data: '=',
                progress: '=',
                currentOffset: '=',
				retries: '=',
				messages: '=',
                timeout: '=',
				calculateMd5: '&',
                uploadDone: '&',
                uploadAborted: '&'
			},
            require: 'ngModel',
			link: function(scope, elem, attrs, ngModel) {
                elem.bind('change', function() {
                    scope.$apply(function() {
                        ngModel.$setViewValue(elem.val());
                        ngModel.$render();
                    });
                });
                scope.$watch('url', function(newVal) {
                    if(newVal) {
                        scope.url = newVal;
                        elem.fileupload({
                            url: scope.url + "v2/nf_image/chunked_upload/",
                            dataType: "json",
                            maxChunkSize: 1000000, // Chunks of 1000 kB
                            replaceFileInput: false,
                            add: function(e, data) { // Called when a file is chosen
                                scope.$apply(function() {
                                    scope.progress = 0;
                                    scope.messages = null;
                                    // If this is the second file you're uploading we need to remove the
                                    // old upload_id and reset some upload session variables.
                                    scope.formData = [];
                                    scope.currentOffset = 0;
                                    scope.retries = 0;
                                    scope.calculateMd5({file:data.files[0], chunk_size:1000000});  // Again, chunks of 1000 kB
                                    scope.data = data;
                                });
                            },
                            chunkdone: function (e, data) { // Called after uploading each chunk
                                scope.$apply(function() {
                                    if (scope.formData.length < 2) {
                                        scope.formData.push(
                                            {"name": "upload_id", "value": data.result.upload_id}
                                        );
                                    }
                                    scope.messages = null;
                                    scope.retries = 0;
                                    scope.currentOffset = data.result.offset;
                                    scope.progress = parseInt(data.loaded / data.total * 100.0, 10);
                                });
                            },
                            submit: function (e, data) { // Called before uploading each chunk
                                data.formData = scope.formData;
                            },
                            done: function (e, data) { // Called when the file has completely uploaded
                                scope.$apply(function () {
                                    scope.progress = 100;
                                });
                                $.ajax({
                                    type: "POST",
                                    url: scope.url + "v2/nf_image/chunked_upload_complete/",
                                    data: {
                                        upload_id: data.result.upload_id,
                                        md5: scope.md5,
                                        vnf_id: scope.vnfId
                                    },
                                    dataType: "json",
                                    success: function(data) {
                                        scope.$apply(scope.uploadDone());
                                    }
                                });
                            },
                            fail: function (e, data) {
                                var retry = function () {
                                        data.uploadedBytes = scope.currentOffset;
                                        // Clear the previous data and restart the upload from current offset
                                        data.data = null;
                                        data.submit();
                                    };
                                if (data.errorThrown !== 'abort' &&
                                        data.uploadedBytes < data.files[0].size &&
                                        scope.retries < 100) { // Max 100 retries
                                    scope.$apply(function() {
                                        scope.retries += 1;
                                        scope.messages = 'Error during NF image upload. Retry ' + scope.retries + '/100...';
                                        // Retry to upload the failed chunk every 1 second
                                        scope.timeout = window.setTimeout(retry, 1000);
                                    });
                                    return;
                                }
                                scope.$apply(scope.uploadAborted());
                            }
                        });
                    }
                }, true);
			}
		};

    };

    angular.module('fg-gui').directive('vnfImageUploader', vnfImageUploader);

})();
