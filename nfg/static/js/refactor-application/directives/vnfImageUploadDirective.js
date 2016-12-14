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
				// messages: '=',
				uploadDisabled: '=',
				calculateMd5: '&',
                uploadDone: '&'
			},
			link: function(scope, elem, attrs) {
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
                                    scope.progress = "";
                                    // scope.messages = "";
                                    // If this is the second file you're uploading we need to remove the
                                    // old upload_id and reset some upload session variables.
                                    scope.formData = [];
                                    scope.currentOffset = 0;
                                    scope.retries = 0;
                                    scope.calculateMd5({file:data.files[0], chunk_size:1000000});  // Again, chunks of 1000 kB
                                    scope.data = data;
                                    scope.uploadDisabled = false; // When a file is chosen the Upload button becomes active
                                });
                            },
                            chunkdone: function (e, data) { // Called after uploading each chunk
                                scope.$apply(function() {
                                    if (scope.formData.length < 1) {
                                        scope.formData.push(
                                            {"name": "upload_id", "value": data.result.upload_id}
                                        );
                                    }
                                    // scope.messages += '<p>' + JSON.stringify(data.result) + '</p>';
                                    scope.currentOffset = data.result.offset;
                                    scope.progress = parseInt(data.loaded / data.total * 100.0, 10);
                                });
                            },
                            submit: function (e, data) { // Called before uploading each chunk
                                data.formData = scope.formData;
                            },
                            done: function (e, data) { // Called when the file has completely uploaded
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
                                        scope.uploadDone();
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
                                    });
                                    window.setTimeout(retry, 1000);  // Retry to upload the failed chunk every 1 second
                                    return;
                                }
                                scope.$apply(function() {
                                    scope.retries = 0;
                                });
                            }
                        });
                    }
                }, true);
			}
		};

    };

    angular.module('fg-gui').directive('vnfImageUploader', vnfImageUploader);
})();
