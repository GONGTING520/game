var $gameContent = $('#game .game-content');
/**
 * 一个生成俄罗斯方块的函数
 * 
 * @returns 生成的方块对象
 */
function newTetris() {
    var i = getRandom(0, 4);
    var oTetris; //表示要生成的方块
    switch (i) {
        case 0:
            oTetris = new Seven(); //生成一个7形状的方块
            break;
        case 1:
            oTetris = new Diamond(); //生成一个方形的方块
            break;
        case 2:
            oTetris = new DiamondZ(); //生成一个z形的方块
            break;
        case 3:
            oTetris = new Triangle(); //生成一个三角形的方块
            break;
        case 4:
            oTetris = new Line(); //生成一个直线型的方块
            break;
    }
    return oTetris;
}




// 定义一个父类
function Common() {
    this.iWidth = $gameContent.width() / 10;
    this.aDiv = [];
    // this.bLeftMovable = true; //记录能否左移动
    // this.bRightMovable = true; //记录能否右移动
    this.bMovable = true; //记录是否存活
    this.speed = 500;
    for (var i = 0; i < 4; i++) { //定义四个小方块
        this.aDiv.push($('<div></div>').get(0));
        this.aDiv[i].style.width = this.iWidth + 'px';
        this.aDiv[i].style.height = this.iWidth + 'px';
    }
    this.sDirction = getRandom(1, 2) == 1 ? 'left' : 'right'; //获取方向
}
// 定义一个下落一格的方法
Common.prototype.fallOne = function () {
    $(this.aDiv).each(function (index, elem) {
        $(this).css({
            top: '+=' + $(elem).height()
        });
    });
};
/**
 * 定义一个检测自身能否与下边界碰撞而停止的方法
 * 
 * @return bFlag 表示是否停止，true表示停止，false表示不停止
 */
Common.prototype.collisionBottom = function () {
    var bFlag = false;
    var $gameContentOffset = $gameContent.offset();
    var iBottom = $gameContentOffset.top + $gameContent.height();
    $(this.aDiv).each(function (index, elem) {
        if ($(this).offset().top + $(this).height() >= iBottom) {
            bFlag = true;
        }
    });
    return bFlag;
};
/**
 * 定义一个检测自身能否与arr中其他元素碰撞而停止的方法
 * 
 * @param {Array} arr 表示判断arr中所有的原生对象是否与自身碰撞
 * @return bFlag 表示是否停止，true表示停止，false表示不停止
 */
Common.prototype.collisionArrElem = function (arr) {
    var bFlag = false;
    var oThis = this; //当前下落的方块
    $(arr.aDiv).each(function (index, elem) {
        var iArrElemTop = elem.offsetTop;
        // 让每个div方块去比较当前下落的对象的每一个div
        for (var i = 0; i < oThis.aDiv.length; i++) {
            var iDownBottom = oThis.aDiv[i].offsetTop + $(oThis.aDiv[i]).height();
            if (iDownBottom >= iArrElemTop) {
                bFlag = true;
            }
        };
    });
    return bFlag;
};


// 生成一个形状类似于7的方块
function Seven() {
    Common.call(this); //继承父类的属性
    var sDir = this.sDirction;
    var iWid = this.iWidth;
    $(this.aDiv).each(function (index) {
        this.className = 'seven'; //给每一块都添加一个类名
        if (index < 2) { //若是前两个  0和1
            $(this).css({
                top: -3 * iWid,
                left: (index + 4) * iWid
            });
        } else {
            $(this).css({
                top: (index - 4) * iWid
            });
            sDir === 'left' ? $(this).css('left', 4 * iWid) : $(this).css('left', 5 * iWid);
        }
        $gameContent.append($(this));
    });
}
Seven.prototype = new Common(); //继承方法
Seven.prototype.constructor = Seven; //将构造函数改为自己



// 生成一个四方形的方块
function Diamond() {
    Common.call(this);
    var iWid = this.iWidth;
    $(this.aDiv).each(function (index) {
        this.className = 'diamond'; //给每一块都添加一个类名
        if (index < 2) { //若是前两个  0和1
            $(this).css({
                top: -2 * iWid,
                left: (index + 4) * iWid
            });
        } else {
            $(this).css({
                top: -iWid,
                left: (index + 2) * iWid
            });
        }
        $gameContent.append($(this));
    });
}
Diamond.prototype = new Common(); //继承方法
Diamond.prototype.constructor = Diamond; //将构造函数改为自己


// 生成一个类似闪电形状或“z形”的方块
function DiamondZ() {
    Common.call(this);
    var sDir = this.sDirction;
    var iWid = this.iWidth;
    $(this.aDiv).each(function (index) {
        this.className = 'diamond-z'; //给每一块都添加一个类名
        if (index < 2) { //若是前两个  0和1
            $(this).css({
                top: -(3 - index) * iWid,
                left: (sDir === 'left' ? 4 : 5) * iWid
            });
        } else {
            $(this).css({
                top: -(4 - index) * iWid,
                left: (sDir === 'left' ? 5 : 4) * iWid
            });
        }
        $gameContent.append($(this));
    });
}
DiamondZ.prototype = new Common(); //继承方法
DiamondZ.prototype.constructor = DiamondZ; //将构造函数改为自己


// 生成一个类似三角形状的方块
function Triangle() {
    Common.call(this);
    var iWid = this.iWidth;
    $(this.aDiv).each(function (index) {
        this.className = 'triangle'; //给每一块都添加一个类名
        if (index === 0) { //若是第一个
            $(this).css({
                top: -2 * iWid,
                left: 4 * iWid
            });
        } else {
            $(this).css({
                top: -iWid,
                left: (index + 2) * iWid
            });
        }
        $gameContent.append($(this));
    });
}
Triangle.prototype = new Common(); //继承方法
Triangle.prototype.constructor = Triangle; //将构造函数改为自己



// 生成一条直线的方块
function Line() {
    Common.call(this);
    var iWid = this.iWidth;
    $(this.aDiv).each(function (index) {
        this.className = 'line'; //给每一块都添加一个类名
        $(this).css({
            top: -(index + 1) * iWid,
            left: 4 * iWid
        });
        $gameContent.append($(this));
    });
}
Line.prototype = new Common(); //继承方法
Line.prototype.constructor = Line; //将构造函数改为自己