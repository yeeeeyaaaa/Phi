$(document).ready(function() {
    var canvas = document.getElementById('homeCanvas');
    //Lets resize the canvas to occupy the full page
    var W = window.innerWidth;
    var H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    //canvas.onmousedown = handleMousedown;
    if (canvas.getContext) {

        var myRect = [];

        myRect.push(new Shape(500, 0, 150, 155, "#333"));
        myRect.push(new Shape(0, 25, 25, 25, "#356"));
        myRect.push(new Shape(35, 0, 25, 25, "#339"));

        context = canvas.getContext('2d');
        for (var i in myRect) {
            oRec = myRect[i];
            context.fillStyle = oRec.fill;
            context.fillRect(oRec.x, oRec.y, oRec.w, oRec.h);

        }

    }
});

function Shape(x, y, w, h, fill) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.fill = fill;
}
