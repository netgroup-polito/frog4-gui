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
                            url: scope.url + "v1/VNF/chunked_upload/",
                            dataType: "json",
                            maxChunkSize: 1000000, // Chunks of 1000 kB
                            replaceFileInput: false,
                            add: function(e, data) { // Called before starting upload
                                scope.$apply(function() {
                                    scope.progress = "";
                                    // scope.messages = "";
                                    // If this is the second file you're uploading we need to remove the
                                    // old upload_id.
                                    scope.formData = [];
                                    scope.currentOffset = 0;
                                    scope.retries = 0;
                                    scope.calculateMd5({file:data.files[0], chunk_size:1000000});  // Again, chunks of 1000 kB
                                    //$('#uploadbtn').data(data).prop("disabled", false);
                                    scope.data = data;
                                    scope.uploadDisabled = false;
                                });
                            },
                            chunkdone: function (e, data) { // Called after uploading each chunk
                                scope.$apply(function() {
                                    if (scope.formData.length < 1) {
                                        scope.formData.push(
                                            {"name": "upload_id", "value": data.result.upload_id}
                                        );
                                    }
                                    //$("#messages").append($('<p>').text(JSON.stringify(data.result)));
                                    // scope.messages += '<p>' + JSON.stringify(data.result) + '</p>';
                                    scope.currentOffset = data.result.offset;
                                    // var progress = parseInt(data.loaded / data.total * 100.0, 10);
                                    // scope.progress = Array(progress).join("=") + "> " + progress + "%";
                                    scope.progress = parseInt(data.loaded / data.total * 100.0, 10);
                                });
                            },
                            submit: function (e, data) { // Called before uploading each chunk
                                data.formData = scope.formData;
                            },
                            done: function (e, data) { // Called when the file has completely uploaded
                                $.ajax({
                                    type: "POST",
                                    url: scope.url + "v1/VNF/chunked_upload_complete/",
                                    data: {
                                        upload_id: data.result.upload_id,
                                        md5: scope.md5,
                                        vnf_id: scope.vnfId
                                    },
                                    dataType: "json",
                                    success: function(data) {
                                        // scope.$apply(function() {
                                            // scope.messages += '<p>' + JSON.stringify(data) + '</p>';
                                        // });
                                        scope.uploadDone();
                                    }
                                });
                            },
                            fail: function (e, data) {
                                // jQuery Widget Factory uses "namespace-widgetname" since version 1.10.0:
                                var retry = function () {
                                        data.uploadedBytes = scope.currentOffset;
                                        // clear the previous data:
                                        data.data = null;
                                        data.submit();
                                    };
                                if (data.errorThrown !== 'abort' &&
                                        data.uploadedBytes < data.files[0].size &&
                                        scope.retries < 100) {
                                    scope.$apply(function() {
                                        scope.retries += 1;
                                    });
                                    window.setTimeout(retry, 1000);
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

    // vnfImageUploader.$inject = ["$q"];
    angular.module('fg-gui').directive('vnfImageUploader', vnfImageUploader);
})();
