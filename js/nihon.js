var pagetitle = "Japan 2014";
var resourcepath = "res/";
var imagepath = resourcepath + "images/";
var audiopath = resourcepath + "audio/";
var videopath = resourcepath + "video/";

var AudioType = {
    OGG: "audio/ogg",
    MP3: "audio/mpeg"
};

var VideoType = {
    OGG: "video/ogg",
    MP4: "video/mp4"
};

var current; //current image index to be shown
var previousMediagroup = - 1;
var autoplay; //autoplay sounds (boolean)

function initialize() {
    $(window).resize(function(){
        rescaleImg();
    });

    current = 0;
    $("title").text(pagetitle);
    $("#imagestotal").text("/" + images.length);
    $("#back").click(function() {
        back();
    });
    $("#forward").click(function() {
        forward();
    });
    enableLeftRightKeyboardNavigation();
    enableSwiping();
    $("#imageindex").keypress(function(e) {
        handleImageIndexInput(e);
    });
    $("#info").popover({ //enabling info popover
        trigger: 'click',
        'placement': 'top',
        container: 'body'
    });
    $("#toggleautoplay").click(function() {
        toggleAutoplay();
    });
    $("#toggleautoplay").tooltip({
        container: 'body',
        placement: 'top',
        trigger: 'hover'
    });
    autoplay = true; //hack to set tooltip-text
    toggleAutoplay(); //slightly ugly

    setCurrentImg();
    unsetDropdownHiding();
}

function back() {
    if(current > 0) {
        current = current - 1;
        setCurrentImg();
    }
}

function forward() {
    if(current < images.length - 1){
        current = current + 1;
        setCurrentImg();
    }
}

function enableLeftRightKeyboardNavigation() {
    $("body").keydown(function(e) {
      if(e.keyCode == 37) { // left
        back();
      }
      else if(e.keyCode == 39) { // right
        forward();
      }
    });
}

function enableSwiping() {
    $("body").on("swipeleft", function(){
        forward();

    });
    $("body").on("swiperight", function(){
        back();
    });
}

function setImageIndexToCurrent() {
    $("#imageindex").val((current + 1));
}

function handleImageIndexInput(e) {
    if (e.which == 13) {//the "Enter" key
        var inputIndex = $("#imageindex").val();
        if (inputIndex > 0 && inputIndex <= images.length) {
            current = inputIndex - 1;
            setCurrentImg();
        } else { //input index out of bounds
            setImageIndexToCurrent();
        }
    }
}

function setCurrentImg() {
    //removing style because old style sometimes lags onto next picture
    $("#main-image").removeAttr('style');

    //hiding info popover, in case it's already open
    $("#info").popover('hide');

    showLoader();

    var image = images[current];
    $("#main-image").one("load", function() {
        rescaleImg(); //rescaling after load is finished
        hideLoader();
    }).attr("src", imagepath + image.filename);

    setImageIndexToCurrent();
    $("#info").attr("data-content", image.description);
    $("#imagetitle").html(image.title);

    //setting sounds and videos
    setMediaGroup(image.mediagroup);

    playSoundForImage();
}

function showLoader() {
    $("#main-image").css({
        display: 'none'
    });
    $("#loader").css({
        display: 'block'
    });
}

function hideLoader() {
    $("#loader").css({
        display: 'none'
    });
    $("#main-image").css({
        display: 'block'
    });

}

function rescaleImg() {
    var image = $('#main-image');
    var wwidth = $(window).width();
    var wheight = $(window).height() - 55; // hack to avoid image clipping
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
    if (previousMediagroup != mediagroup) { //only reset mediagroup if different from previous image's
        previousMediagroup = mediagroup;
        $("#soundmenu").html("");
        $("#soundlink").html("<span class=\"glyphicon glyphicon-music\"></span> Sounds");
        $("#videomenu").html("");
        $("#videolink").html("<span class=\"glyphicon glyphicon-film\"></span> Videos");
        for (var i = 0; i < media.length; i++) {
            var mediaElement = media[i];
            if (mediaElement.mediagroup == mediagroup) {
                for (var soundindex = 0; soundindex < mediaElement.sounds.length; soundindex++) {
                    var soundElement = mediaElement.sounds[soundindex];
                    var audiotype = getAudioType(soundElement.filename);
                    $("#soundmenu").append("<h6 class=\"navbar-text\">" + soundElement.title + "</h6>" +
                        "<audio id=\"sound" + soundindex + "\"controls>" +
                        "<source src=\"" + audiopath + soundElement.filename +
                        "\" type=\"" + audiotype + "\">" +
                        "</audio>");
                }
                for (var videoindex = 0; videoindex < mediaElement.videos.length; videoindex++) {
                    var videoElement = mediaElement.videos[videoindex];
                    if (videoElement.filename.indexOf("youtube") >= 0) { //appending embedded youtube video
                        $("#videomenu").append("<li class=\"navbar-text\">" + videoElement.title + " " + videoElement.filename + "</li>");
                    }
                    else {
                        var videotype = getVideoType(videoElement.filename);
                        $("#videomenu").append("<h6 class=\"navbar-text\">" + videoElement.title + "</h6>" +
                            "<video id=\"video" + videoindex + "\" width=\"320\" height=\"240\" controls>" +
                            "<source src=\"" + videopath + videoElement.filename +
                            "\" type=\"" + videotype + "\">" +
                            "</video>");
                    }

                }
            }
        }
        if ($("#soundmenu").html() == "") {
            $("#soundmenu").html("<li class=\"navbar-text\">No sounds here...</li>");
            $("#soundlink").html("");
        }
        if ($("#videomenu").html() == "") {
            $("#videomenu").html("<li class=\"navbar-text\">No videos here...</li>");
            $("#videolink").html("");
        }
    }
}

function playSoundForImage() {
    if (autoplay && $("#sound0").length){ //checking for existence of sound0
        console.log("Autoplay is " + autoplay + ". Playing sound");
        $("#sound0").get(0).play();
    }
}

function toggleAutoplay() {
    if (autoplay) {
        autoplay = false;
        $("#toggleautoplay").attr("data-original-title", "Autoplay off");
        $("#toggleautoplayicon").attr("class", "glyphicon glyphicon-volume-off");
    } else {
        autoplay = true;
        $("#toggleautoplay").attr("data-original-title", "Autoplay on");
        $("#toggleautoplayicon").attr("class", "glyphicon glyphicon-volume-up");
    }
}

function getAudioType(filename) {
    filename = filename.toLowerCase();
    if (filename.indexOf(".ogg") != -1) {
        return AudioType.OGG;
    }
    if (filename.indexOf(".mp3") != -1) {
        return AudioType.MP3;
    }
}

function getVideoType(filename) {
    filename = filename.toLowerCase();
    if (filename.indexOf(".ogg") != -1) {
        return VideoType.OGG;
    }
    if (filename.indexOf(".mp4") != -1) {
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
