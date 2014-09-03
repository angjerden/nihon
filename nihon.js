var current = 0;
var that = this;

function setInitialImage() {
    console.log("Inside setInitialImage");
    setCurrentImg();
}

function imageback() {
    console.log("imageback");
    console.log("Current: " + that.current);
    if(that.current > 0) {
        that.current = that.current - 1;
        setCurrentImg();
    }
}

function imageforward() {
    console.log("imageforward");
    console.log("Current: " + that.current);
    console.log("Images.length: " + images.length);
    if(that.current < images.length - 1){
        that.current = that.current + 1;
        setCurrentImg()
    }
}

function setCurrentImg() {
    logImageSrc()
    $("#main-image").attr("src", images[that.current].filename);
}

function logImageSrc() {
    console.log("Setting image src to: " + images[that.current].filename);
}