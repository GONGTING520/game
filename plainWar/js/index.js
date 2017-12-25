$(function(){
    var i = new AnemyPlane();
    var oMe = new MyPlane();
    document.onkeydown = function (e) {
        e = e || window.event;
        switch (e.keyCode){
            case 37://left
                oMe.$planeBody.css({
                    left: '-=30px'
                });
                break;
            case 38://up
                oMe.$planeBody.css({
                    top: '-=30px'
                });
                break;
            case 39://right
                oMe.$planeBody.css({
                    left: '+=30px'
                });
                break;
            case 40://down
                oMe.$planeBody.css({
                    top: '+=30px'
                });
                break;
        }
    };
});