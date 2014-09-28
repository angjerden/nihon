var current = 0; //current image to be shown


function back() {
    if(current > 0) {
        current = current - 1;
        setCurrentImg();
    }
}

function forward() {
    if(current < images.length - 1){
        current = current + 1;
        setCurrentImg()
    }
}

function setCurrentImg() {
    $("title").text(pagetitle);
    var image = images[current];
    $("#main-image").removeAttr('style');
    $("#main-image").one("load", function() {
        rescaleImg(); //rescaling after load is finished
    }).attr("src", image.filename);
    $("#imageindex").html((current + 1) + "/" + images.length);
    //$("#info").tooltipster(image.description, image.description);
    $("#title").html(image.title);
    //$(".tooltip").tooltipster();
    setMediaGroup(image.mediagroup);
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
                var audiotype = getAudioType(soundElement.filename);
                $("#soundmenu").append("<h6 class=\"navbar-text\">" + soundElement.title + "</h6>" +
                        "<audio controls>" +
                            "<source src=\"" +  soundElement.filename +
                            "\" type=\"" + audiotype + "\">" +
                        "</audio>");
            }
            for (var videoindex = 0; videoindex < mediaElement.videos.length; videoindex++) {
                var videoElement = mediaElement.videos[videoindex];
                var videotype = getVideoType(videoElement.filename);
                $("#videomenu").append("<h6 class=\"navbar-text\">" + videoElement.title + "</h6>" +
                    "<video width=\"320\" height=\"240\" controls>" +
                    "<source src=\"" +  videoElement.filename +
                    "\" type=\"" + videotype + "\">" +
                    "</video>");
            }
        }
    }
}

function getAudioType(filename) {
    if (filename.contains(".ogg")) {
        return AudioType.OGG;
    }
    if (filename.contains("mp3")) {
        return AudioType.MP3;
    }
}

function getVideoType(filename) {
    if (filename.contains(".ogg")) {
        return VideoType.OGG;
    }
    if (filename.contains("mp4")) {
        return VideoType.MP4;
    }
}

function unsetDropdownHiding() {
    $('#sounddropdown .dropdown-menu').on({
        "click": function(e) {
            e.stopPropagation();
        }
    });
    $('#videodropdown .dropdown-menu').on({
        "click": function(e) {
            e.stopPropagation();
        }
    });
}
