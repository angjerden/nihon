var images;

function loadJSONMedia() {
    console.log("loadJSONMedia called.");
    $.getJSON("images.json", function(data) {
        console.log("Inside getJSON-function");
        images = data;
        console.log("data: " + images[0].filename);
    });
    console.log("Images[0]: " + images[0]);
}

function imageback() {
    console.log("imageback called");
    $("#main-image").attr("src", "res/20140804_071725.jpg");
}

function imageforward() {
    console.log("imageforward called");
    $("#main-image").attr("src", "res/P8036881.JPG")
}