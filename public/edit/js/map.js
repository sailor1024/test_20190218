$('.mapContainer[origin=true] .mapImg img').click(function(e) {

    // $(".movingSpan").animate({
    //     'right': $('.mapImg img').width() - e.offsetX + 23 + 'px',
    //     'bottom': $('.mapImg img').height() - e.offsetY + 2 + 'px'
    // }, 1500);
   
    var vector2x = -(88 - e.offsetX) / 4.49 + 1.2;
    var vector2z = -(168 - e.offsetY) / 4.7 + 1.2;
    console.log(vector2x,vector2z)
    var minDot = 100;
    var minDotArrIndex = [];
    console.log(Math.pow(vector2x, 2) + Math.pow(vector2z, 2))

    for (var i = 0; i < viewPoint.length; i++) {
        if (Math.pow(viewPoint[i].x - vector2x, 2) + Math.pow(viewPoint[i].z - vector2z, 2) < minDot) {
            minDot = Math.pow(viewPoint[i].x - vector2x, 2) + Math.pow(viewPoint[i].z - vector2z, 2)
            minDotArrIndex.push(i)
        }
        // console.log(Math.pow(viewPoint[i].x - vector2x, 2) + Math.pow(viewPoint[i].z - vector2z, 2), i)
    }
    setWalkingViewPoint(minDotArrIndex[minDotArrIndex.length - 1])
        // console.log(minDotArrIndex[minDotArrIndex.length - 1])
})