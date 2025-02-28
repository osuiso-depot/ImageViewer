var href = location.href,
	images = document.querySelectorAll('body img[src="'+href+'"]'),
	table = 'options';

if(
	images.length == 1 && images[0].src == href
	&& !(navigator.userAgent.toLowerCase().indexOf('chrome/24.0') >= 0 || navigator.userAgent.toLowerCase().indexOf('chrome/25.0') >= 0)
){
	images[0].style.display = 'none';
	
	chrome.runtime.sendMessage({method: "Get options"}, (response) => {
        console.log("message is ...");
        console.log(response);
		var options = response.status;
		options.minWidth = 0;
		options.minHeight = 0;
		$(images).imageViewer(options);
	});
}