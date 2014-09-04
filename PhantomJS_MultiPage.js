//This script is called by phantomjs.exe 
//Phantomjs is a headless web browser, meaning it will open web pages, but they are not seen
//This script works in conjunction with phantomjs to snap .jpg images of the signed html eform
//Variables that are passed to this program are as follows:
//address is the full address of the local html file
//output is the location and basename for the output .jpg files
//size is the image size in pixels that is to be captures from the html viewportSize
//Changing the size will modify the look of the output images for multiple pages
//The pixel range and padding will have to be manually recalculated if the output size is changed
//Pulling doc height properties does not reveal the final image height accurately
//numPages is the total number of pages in the html doc
//SYNTAX: phantomjs.exe MultiImage.js <url> <dest folder\base file name> "1912*2475" <number of pages>
//SAMPLE USAGE: phantomjs.exe MultiImage.js "MySourceFile.html" "C:\MyDestFolder\basefilename" "1912*2475" "1"

var page = require('webpage').create(),
    system = require('system'),
    address, output, curOutput, size, numPages;

address = system.args[1];
output = system.args[2];
size = system.args[3].split('*');
pageWidth = parseInt(size[0], 10);
pageHeight = parseInt(size[1], 10);
page.viewportSize = { width: pageWidth, height: pageHeight };
numPages = system.args[4];
page.open(address, function (status) {
	if (status !== 'success') {
		console.log('Unable to load the address!');
		phantom.exit();
	} 
	else {
		window.setTimeout(function () {
			var TopLeftY, pixelRange, pixelPadding, curOutput, currentPageNum;
			pixelRange = 2476;
			pixelPadding = 8;
			for (var currentPageNum = 1; currentPageNum <= (numPages); currentPageNum++) { 
				console.log('Page ' + currentPageNum + ' of ' + numPages);
				TopLeftY = ((currentPageNum - 1))*pixelRange + pixelPadding;
				page.clipRect = { top: TopLeftY, left: pixelPadding, width: pageWidth, height: pageHeight };
				curOutput = output + "_" + currentPageNum + ".jpg";
				page.render(curOutput); 
			}
			phantom.exit();
		}, 200);
	}
});


