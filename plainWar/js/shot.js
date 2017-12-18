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
}
