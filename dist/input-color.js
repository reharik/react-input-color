'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cx = require('classnames');
var React = require('react');
var PropTypes = require('react-proptypes');
var ReactDOM = require('react-dom');
var assign = require('object-assign');
var cssColor = require('color-functions/dist/css-color');
var rgbaColor = require('color-functions/dist/rgba');
var rgb2hsv = require('color-functions/dist/rgb2hsv');
var rgb2hex = require('color-functions/dist/rgb2hex');
var rgba2hex = require('color-functions/dist/rgba2hex');

var ColorPicker = require('./color-picker.js');

var KEY_ENTER = 13;

var InputColor = function (_React$Component) {
  _inherits(InputColor, _React$Component);

  function InputColor(props) {
    _classCallCheck(this, InputColor);

    var _this = _possibleConstructorReturn(this, (InputColor.__proto__ || Object.getPrototypeOf(InputColor)).call(this, props));

    _this.propTypes = {
      value: PropTypes.string,
      defaultValue: PropTypes.string
    };

    _this.defaultProps = {
      defaultValue: '#000000'
    };
    _this.setState({
      color: _this.getColor(_this.props.value),
      colorPicker: false,
      colorPickerPosition: 0
    });
    return _this;
  }

  _createClass(InputColor, [{
    key: 'getColor',
    value: function getColor(color) {
      color = color || this.props.defaultValue;

      var rgba = cssColor(color);
      var r = rgba.r,
          g = rgba.g,
          b = rgba.b,
          a = rgba.a;
      var hsv = rgb2hsv(r, g, b);

      return assign(hsv, {
        r: r,
        g: g,
        b: b,
        a: a,
        hex: rgb2hex(r, g, b)
      });
    }
  }, {
    key: 'getRgbaBackground',
    value: function getRgbaBackground() {
      var color = this.state.color;
      var r = color.r;
      var g = color.g;
      var b = color.b;
      var a = color.a;
      return rgbaColor(r, g, b, a);
    }
  }, {
    key: 'render',
    value: function render() {
      var color = this.state.color;
      var rgbaBackground = this.getRgbaBackground();

      return React.createElement(
        'span',
        { className: cx('m-input-color', {
            'color-picker-open': this.state.colorPicker
          }) },
        React.createElement('span', {
          className: 'css-color',
          style: { background: rgbaBackground },
          onClick: this._onClick
        }),
        React.createElement(
          'span',
          {
            className: 'remove',
            onClick: this.handleClickRemove },
          '\xD7'
        ),
        this.state.colorPicker ? React.createElement(ColorPicker, {
          left: this.state.colorPickerPosition,
          color: this.state.color,
          onChange: this._onChange }) : null
      );
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      document.addEventListener('click', this.closeColorPicker, false);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('click', this.closeColorPicker);
    }
  }, {
    key: 'closeColorPicker',
    value: function closeColorPicker() {
      this.setState({ colorPicker: false });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var cssColor = nextProps.value;

      // anti-pattern, maybe
      if (!this._updated) {
        this.setState({
          color: this.getColor(cssColor)
        });
      } else {
        this._updated = false;
      }
    }
  }, {
    key: 'change',
    value: function change(cssColor) {
      if (this.props.onChange) {
        this.props.onChange(cssColor);
      }
    }
  }, {
    key: '_onChange',
    value: function _onChange(color) {
      this.setState({
        cssColor: '#' + color.hex,
        color: color
      });

      this._updated = true;
      this.change('#' + rgba2hex(color.r, color.g, color.b, color.a));
    }
  }, {
    key: '_onClick',
    value: function _onClick(e) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      var dom = ReactDOM.findDOMNode(this);
      var rect = dom.getBoundingClientRect();
      var ww = window.innerWidth;

      var left = -105;
      if (rect.right + 105 > ww) {
        left = -210 + ww - rect.right;
      } else if (rect.left - 105 < 0) {
        left = -rect.left;
      }

      this.setState({
        colorPicker: !this.state.colorPicker,
        colorPickerPosition: left
      });
    }
  }, {
    key: 'handleClickRemove',
    value: function handleClickRemove(e) {
      this.change('');
    }
  }]);

  return InputColor;
}(React.Component);

module.exports = InputColor;