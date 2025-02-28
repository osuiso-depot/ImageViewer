function openImageViewer(targetImages){
  chrome.runtime.sendMessage({ method: "Get options" }, function (response) {
    if (!response || !response.status) {
      console.error("Failed to retrieve options");
      return;
    }

    var options = response.status || {};
    options.closeButton = false;
    options.minWidth = 0;
    options.minHeight = 0;

    if (targetImages) {
      $(targetImages).imageViewer(options);
    } else {
      console.error("No target images provided to openImageViewer");
    }
  });
}

if (!$('html').hasClass('has-image-viewer')) {
  $('html').addClass('has-image-viewer'); // 先に追加
  chrome.runtime.sendMessage({ method: "Get tmp" }, function (response) {
    if (!response || !response.status || !response.status.image) {
      console.error("No image data available");
      return;
    }

    var tmpImage = new Image();
    tmpImage.src = response.status.image;
    openImageViewer(tmpImage);
  });
} else {
  $('.image-viewer').fadeOut(200, function () {
    $('.image-viewer').remove();
    $('html').removeClass('has-image-viewer');
  });
}
