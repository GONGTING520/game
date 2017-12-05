$(function () {
    var $gameContainer = $('#game-container');
    var $line = $('.line', $gameContainer);
    var aCars = []; //定义所有的其他汽车
    var oMe = new MyCar(); //定义一个我的车
    var oOthers; //定义对向的车
    //让赛道的线动起来
    $gameContainer.get(0).lineTimer = setInterval(function () {
        $line.css({
            top: '+=4'
        });
        if ($line.get(0).offsetTop >= -10) {
            $line.css('top', -400);
        }
    }, 50);
    newCar(); //先生成一个对向的车
    // 通过定时器，每隔5秒生成一个对向的车
    $gameContainer.get(0).newCarTimer = setInterval(function () {
        newCar();
    }, 5000);
    /**
     * 生成对象的车，并加入到用来装对向车的aCars数组中
     * 
     */
    function newCar() {
        oOthers = new Car();
        aCars.push(oOthers);
    }


    document.onkeyup = function (e) {
        // console.log(e.keyCode);
        switch (e.keyCode) {
            case 37: //left
                $(oMe.carBody).animate({
                    left: '-=200'
                }, 500, function () {
                    if (oMe.collision(aCars)) {
                        gameOver();
                    }
                });
                break;
            case 38: //up
                $(oMe.carBody).animate({
                    top: '-=100'
                }, 500, function () {
                    if (oMe.collision(aCars)) {
                        gameOver();
                    }
                });
                break;
            case 39: //right
                $(oMe.carBody).animate({
                    left: '+=200'
                }, 500, function () {
                    if (oMe.collision(aCars)) {
                        gameOver();
                    }
                });
                break;
            case 40: //down
                $(oMe.carBody).animate({
                    top: '+=100'
                }, 500, function () {
                    if (oMe.collision(aCars)) {
                        gameOver();
                    }
                });
                break;
        }
    };

    function gameOver() {
        clearInterval($gameContainer.get(0).newCarTimer);
        clearInterval($gameContainer.get(0).lineTimer);
        document.onkeyup = null;
        $(aCars).each(function () {
            this.stop();
        });
    }
});