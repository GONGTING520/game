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
        }.bind(this), 50);
    } else {
        this.moveTimer = setInterval(function () {
            this.$shotBody.css({
                top: '+=4'
            });
        }.bind(this), 50);
    }
};