var $container = $('#container');
var $containerDivs = $('div', $container);
//子弹类
function Shot(owner) {
    this.$shotBody = $('<div class="shot"></div>');
    this.$shotBody.css({
        left: owner.$planeBody.position().left
    });
    this.owner = owner;
    //如果所有者是我的飞机
    if (owner.constructor == MyPlane) {
        this.$shotBody.css({
            top: owner.$planeBody.position().top
        });
    } else {
        this.$shotBody.css({
            top: owner.$planeBody.position().top + owner.$planeBody.height() - 4
        });
    }
    switch (owner.sPosition) {
        case 'left':
            this.$shotBody.appendTo($containerDivs[0]);
            break;
        case 'center':
            this.$shotBody.appendTo($containerDivs[1]);
            break;
        case 'right':
            this.$shotBody.appendTo($containerDivs[2]);
            break;
    }
    this.move();
}
Shot.prototype.move = function () {
    //如果所有者是我的飞机
    if (this.owner.constructor == MyPlane) {
        this.moveTimer = setInterval(function () {
            this.$shotBody.css({
                top: '-=4'
            });
            //若子弹飞出边框，则停止定时器
            if (this.$shotBody.offset().top + this.$shotBody.height() < $container.offset().top) {
                clearInterval(this.moveTimer);
                //删除owner中aShot中相应的子弹
                for (var i = 0; i < this.owner.aShot.length; i++) {
                    if (this.owner.aShot[i] == this) {
                        //如果这颗子弹是数组中的第i个，则从数组中删除这个
                        this.owner.aShot.splice(i, 1);
                    }
                }
            }
        }.bind(this), 50);
    } else {
        this.moveTimer = setInterval(function () {
            this.$shotBody.css({
                top: '+=4'
            });
            //若子弹飞出边框，则停止定时器
            if (this.$shotBody.position().top > $container.offset().top + $container.height()) {
                clearInterval(this.moveTimer);
                //删除owner中aShot中相应的子弹
                for (var i = 0; i < this.owner.aShot.length; i++) {
                    if (this.owner.aShot[i] == this) {
                        //如果这颗子弹是数组中的第i个，则从数组中删除这个
                        this.owner.aShot.splice(i, 1);
                    }
                }
            }
        }.bind(this), 50);
    }
};