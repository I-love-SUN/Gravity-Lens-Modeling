// Generated by CoffeeScript 1.6.3
(function() {
  var EllipseTool, Tool,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tool = ((typeof window !== "undefined" && window !== null ? window.MarkingSurface : void 0) || require('marking-surface')).Tool;

  EllipseTool = (function(_super) {
    __extends(EllipseTool, _super);

    EllipseTool.prototype.handleRadius = EllipseTool.mobile ? 20 : 10;

    EllipseTool.prototype.strokeWidth = 2;

    EllipseTool.prototype.defaultRadius = 2;

    EllipseTool.prototype.defaultSquash = 0.5;

    EllipseTool.prototype.startOffset = null;

    function EllipseTool() {
      EllipseTool.__super__.constructor.apply(this, arguments);
      this.mark.x = 0;
      this.mark.y = 0;
      this.mark.angle = 0;
      this.mark.rx = 0;
      this.mark.ry = 0;
      this.radii = this.addShape('path.radii', {
        stroke: 'currentColor'
      });
      this.outline = this.addShape('ellipse.outline', {
        fill: 'transparent',
        stroke: 'currentColor'
      });
      this.xHandle = this.addShape('circle.x-handle', {
        fill: 'currentColor'
      });
      this.yHandle = this.addShape('circle.y-handle', {
        fill: 'currentColor'
      });
      this.addEvent('marking-surface:element:start', '.outline', this.startDrag);
      this.addEvent('marking-surface:element:move', '.outline', this.moveOutline);
      this.addEvent('marking-surface:element:move', '.x-handle', this.dragXHandle);
      this.addEvent('marking-surface:element:move', '.y-handle', this.dragYHandle);
    }

    //在椭圆工具开始绘制时被调用。它设置了椭圆的初始位置和大小。
    EllipseTool.prototype.onInitialStart = function(e) {
      var x, y, _ref;
      EllipseTool.__super__.onInitialStart.apply(this, arguments);
      _ref = this.coords(e), x = _ref.x, y = _ref.y;
      return this.mark.set({
        x: x,
        y: y,
        rx: this.defaultRadius,
        ry: this.defaultRadius * this.defaultSquash
      });
    };

    //在椭圆工具开始移动时被调用。它更新了椭圆的大小和角度。
    EllipseTool.prototype.onInitialMove = function(e) {
      EllipseTool.__super__.onInitialMove.apply(this, arguments);
      this.dragXHandle(e);
      return this.mark.set('ry', this.mark.rx * this.defaultSquash);
    };

    //在用户开始拖动椭圆时被调用。它存储了椭圆工具开始拖动时的偏移量。
    EllipseTool.prototype.startDrag = function(e) {
      var x, y, _ref;
      _ref = this.coords(e), x = _ref.x, y = _ref.y;
      return this.startOffset = {
        x: this.mark.x - x,
        y: this.mark.y - y
      };
    };

    //在用户拖动椭圆时被调用。它更新了椭圆的位置。
    EllipseTool.prototype.moveOutline = function(e) {
      var x, y, _ref;
      _ref = this.coords(e), x = _ref.x, y = _ref.y;
      return this.mark.set({
        x: x + this.startOffset.x,
        y: y + this.startOffset.y
      });
    };

    //方法在用户拖动椭圆的 X 轴控制点时被调用。它更新了椭圆的大小和角度。
    EllipseTool.prototype.dragXHandle = function(e) {
      var x, y, _ref;
      _ref = this.coords(e), x = _ref.x, y = _ref.y;
      return this.mark.set({
        angle: this.getAngle(this.mark.x, this.mark.y, x, y),
        rx: this.getDistance(this.mark.x, this.mark.y, x, y)
      });
    };

    //在用户拖动椭圆的 Y 轴控制点时被调用。它更新了椭圆的大小和角度。
    EllipseTool.prototype.dragYHandle = function(e) {
      var x, y, _ref;
      _ref = this.coords(e), x = _ref.x, y = _ref.y;
      return this.mark.set({
        angle: this.getAngle(this.mark.x, this.mark.y, x, y) - 90,
        ry: this.getDistance(this.mark.x, this.mark.y, x, y)
      });
    };

    //在椭圆工具需要重新渲染时被调用。它更新了椭圆的外观。
    EllipseTool.prototype.render = function() {
      var handleRadius, scale, strokeWidth, _ref, _ref1, _ref2;
      EllipseTool.__super__.render.apply(this, arguments);
      scale = (((_ref = this.markingSurface) != null ? _ref.scaleX : void 0) + ((_ref1 = this.markingSurface) != null ? _ref1.scaleY : void 0)) / 2;
      strokeWidth = this.strokeWidth / scale;
      handleRadius = this.handleRadius / scale;
      this.radii.attr('strokeWidth', strokeWidth / 2);
      this.outline.attr('strokeWidth', strokeWidth);
      this.xHandle.attr('r', handleRadius);
      this.yHandle.attr('r', handleRadius);
      this.attr('transform', "translate(" + this.mark.x + ", " + this.mark.y + ") rotate(" + (-this.mark.angle) + ")");
      this.radii.attr('d', "M 0 " + (-this.mark.ry) + " L 0 0 M " + this.mark.rx + " 0 L 0 0");
      this.outline.attr({
        rx: this.mark.rx,
        ry: this.mark.ry
      });
      this.xHandle.attr('cx', this.mark.rx);
      this.yHandle.attr('cy', -this.mark.ry);
      return (_ref2 = this.controls) != null ? _ref2.moveTo(this.mark) : void 0;
    };

    //计算两点之间的角度。
    EllipseTool.prototype.getAngle = function(x1, y1, x2, y2) {
      var deltaX, deltaY;
      deltaX = x2 - x1;
      deltaY = y2 - y1;
      return Math.atan2(deltaY, deltaX) * (-180 / Math.PI);
    };

    //计算两点之间的距离。
    EllipseTool.prototype.getDistance = function(x1, y1, x2, y2) {
      var aSquared, bSquared;
      aSquared = Math.pow(x2 - x1, 2);
      bSquared = Math.pow(y2 - y1, 2);
      return Math.sqrt(aSquared + bSquared);
    };

    return EllipseTool;

  })(Tool);

  if (typeof window !== "undefined" && window !== null) {
    window.MarkingSurface.EllipseTool = EllipseTool;
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = EllipseTool;
  }

}).call(this);
