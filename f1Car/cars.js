var $gameContainer = $('#game-container');
var $track = $('.track',$gameContainer);
function Car() {
    this.sPosition = getPosition();
    this.iSpeed = 2;
    this.bLife = true;
    this.new();
    this.move();
}
Car.prototype.new = function () {
    this.carBody = $('<div class="enemy-car"></div>').css('top',-80).get(0);
    if(this.sPosition==='left'){
        $(this.carBody).appendTo($track.eq(0)).css('left',85);
    }else if(this.sPosition==='center'){
        $(this.carBody).appendTo($track.eq(1)).css('left',285);
    }else if(this.sPosition==='right'){
        $(this.carBody).appendTo($track.eq(2)).css('left',485);
    }
};
Car.prototype.move = function () {
    this.timer = setInterval(function () {
        this.carBody.style.top = this.carBody.offsetTop + this.iSpeed+'px';
        if(this.carBody.offsetTop>=$gameContainer.offset().top+$gameContainer.height()){
            clearInterval(this.timer);
            this.bLife = false;
            $(this.carBody).remove();
        }
    }.bind(this),50);
};
function getPosition() {
    var i = Math.round(Math.random()*2);
    switch (i){
        case 0:
            return 'left';
        case 1:
            return 'center';
        case 2:
            return 'right';
    }
}