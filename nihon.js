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
    $("#imageindex").html((current + 1) + "/" + images.length);
    setMediaGroup(images[current].mediagroup);
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

function setMediaGroup(mediagroup) {
    $("#soundmenu").html("");
    $("#videomenu").html("");
    for (var i = 0; i < media.length; i++) {
        var mediaElement = media[i];
        if (mediaElement.mediagroup == mediagroup) {
            for (var soundindex = 0; soundindex < mediaElement.sounds.length; soundindex++) {
                var soundElement = mediaElement.sounds[soundindex];
                $("#soundmenu").append("" +
                    "<li class=\"navbar-text\">" +
                    "<span class=\"glyphicon glyphicon-play\"></span>" +
                    "<span class=\"glyphicon glyphicon-stop\"></span>" +
                        soundElement.title +
                    "</li>");
            }
            for (var videoindex = 0; videoindex < mediaElement.videos.length; videoindex++) {
                var videoElement = mediaElement.videos[videoindex];
                $("#videomenu").append("" +
                    "<li class=\"navbar-text\">" +
                    "<span class=\"glyphicon glyphicon-play\"></span>" +
                    "<span class=\"glyphicon glyphicon-stop\"></span>" +
                        videoElement.title +
                    "</li>");
            }
        }
    }

}
