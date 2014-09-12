var current = 0;
var that = this;

function back() {
    if(that.current > 0) {
        that.current = that.current - 1;
        setCurrentImg();
    }
}

function forward() {
    if(that.current < images.length - 1){
        that.current = that.current + 1;
        setCurrentImg()
    }
}

function setCurrentImg() {
    //logImageSrc()
    $("#main-image").removeAttr('style');
    $("#main-image").one("load", function() {
        rescaleImg(); //rescaling after load is finished
    }).attr("src", images[current].filename);

}

function logImageSrc() {
    console.log("Setting image src to: " + images[that.current].filename);
}

function rescaleImg() {
    var image = $('#main-image');
    var wwidth = $(window).width();
    var wheight = $(window).height();
    var iwidth = image.width();
    var iheight = image.height();
    var factor = Math.min(wwidth/iwidth, wheight/iheight);
    var iwidthR = Math.round(iwidth * factor);
    var iheightR = Math.round(iheight * factor);
    var iwidthR2 = Math.round(wwidth - iwidthR)/2;
    var iheightR2 = Math.round(wheight - iheightR)/2;

    image.css({
        'position':'fixed',
        'width': iwidthR,
        'height': iheightR,
        'left': iwidthR2,
        'top': iheightR2
    });
}
