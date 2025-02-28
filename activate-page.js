function openImageViewer(targetImages){
  chrome.runtime.sendMessage({method: "Get options"}, function(response) {
    var options = response.status;

    options.closeButton = true;
    $(targetImages).imageViewer(options);
  });
}

if(!$('html').hasClass('has-image-viewer')){
  var imagesInPage = [],
    uniqueImages = [],
    uniqueImagesInPage = [],
    imgs = document.querySelectorAll('img[src]')
    bgs = [];

  // Find image in imgs
  for(var index = 0; index < imgs.length; index++){
    imagesInPage.push(imgs[index]);
  }

  // Find background-image in all elements
  $.each($('*'), function(){
    var bg = $(this).css('background-image');

    if(bg.indexOf('url') === 0){
      var self = this,
        bgUrl = bg.substring(4, bg.length-1).replace(/'/g,'').replace(/"/g,''),
        img = new Image;

      if(!bgs.has(bgUrl)){
        bgs.push(bgUrl);
        img.src = bgUrl;
        imagesInPage.push(img);
      }
    }
  });

  for(var index = 0; index < imagesInPage.length; index++){
    var image = imagesInPage[index].src;
    if(!uniqueImages.has(image)){
      uniqueImages.push(image);
      uniqueImagesInPage.push(imagesInPage[index]);
    }
  }
  /*
  // Find background-image in CSS
  var styleSheets = document.styleSheets;
  if(styleSheets){
    for(var cssIndex = 0; cssIndex < styleSheets.length; cssIndex++){
      var styleSheet = styleSheets[cssIndex],
        cssRules = styleSheet.cssRules;

      if(cssRules){
        for(var index = 0; index < cssRules.length; index++){
          var cssRule = cssRules[index];

          if(cssRule.style){
            var bg = cssRule.style['background-image'],
              bgUrl = bg.substring(4, bg.length-1).replace(/'/g,'').replace(/"/g,'');

            if(bg.indexOf('url') === 0 && !bgs.has(bgUrl)){
              var img = new Image;

              bgs.push(bgUrl);
              img.src = bgUrl;
              imagesInPage.push(img);
            }
          }
        }
      }
    }
  }
  */

  openImageViewer(uniqueImagesInPage);
}else{
  $('.image-viewer').fadeOut(200, function(){
    $('.image-viewer').remove();
    $('html').removeClass('has-image-viewer');
  });
}
