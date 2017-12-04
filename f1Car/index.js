$(function () {
    var $gameContainer = $('#game-container');
    var $line = $('.line',$gameContainer);
    var aCars=[];//定义所有的其他汽车
    var oMe;
    var oOthers;
    var timer = setInterval(function () {//让赛道的线动起来
        $line.css({
            top:'+=4'
        });
        if($line.get(0).offsetTop>=-10){
            $line.css('top',-400);
        }
    },50);
    newCar();
    var timer2 = setInterval(function () {
        newCar();
    },5000);
    function newCar() {
        oOthers=new Car();
        aCars.push(oOthers);
    }
});
