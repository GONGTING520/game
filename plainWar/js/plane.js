var $container = $('#container');
var $containerDivs = $('div', $container);
//飞机类
function Plane() {
    this.$planeBody = $('<div></div>');
    this.aShot = [];
    switch (Math.round(Math.random() * 2)) {
        case 0:
            this.sPosition = 'left';
            break;
        case 1:
            this.sPosition = 'center';
            break;
        case 2:
            this.sPosition = 'right';
            break;
    }
}
Plane.prototype.shoot = function () {
    var that = this;
    this.shootTimer = setInterval(function () {
        if (that.aShot.length < 6) {
            that.aShot.push(new Shot(that));
        }
    }, 500);
};

//敌人的飞机
function AnemyPlane() {
    Plane.call(this); //继承飞机类
    this.$planeBody.addClass('anemy');
    switch (this.sPosition) {
        case 'left':
            this.$planeBody.appendTo($containerDivs[0]);
            break;
        case 'center':
            this.$planeBody.appendTo($containerDivs[1]);
            break;
        case 'right':
            this.$planeBody.appendTo($containerDivs[2]);
            break;
    }
    this.shoot();
}
AnemyPlane.prototype = new Plane(); //继承飞机类的方法
AnemyPlane.prototype.constructor = AnemyPlane; //将构造函数改为自己

//我的飞机
function MyPlane() {
    Plane.call(this); //继承飞机类
    this.$planeBody.addClass('mine').appendTo($containerDivs[1]).css('bottom', 10);
    this.sPosition = 'center';
    this.shoot();
}
MyPlane.prototype = new Plane(); //继承飞机类的方法
MyPlane.prototype.constructor = MyPlane; //将构造函数改为自己