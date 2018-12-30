const cx = require('classnames');
const React = require('react');
const PropTypes = require('react-proptypes');
const ReactDOM = require('react-dom');
const assign = require('object-assign');
const cssColor = require('color-functions/dist/css-color');
const rgbaColor = require('color-functions/dist/rgba');
const rgb2hsv = require('color-functions/dist/rgb2hsv');
const rgb2hex = require('color-functions/dist/rgb2hex');
const rgba2hex = require('color-functions/dist/rgba2hex');

const ColorPicker = require('./color-picker.js');

const KEY_ENTER = 13;

class InputColor extends React.Component {
  constructor(props) {
    super(props);

    this.propTypes = {
      value: PropTypes.string,
      defaultValue: PropTypes.string
    };

    this.defaultProps = {
      defaultValue: '#000000'
    };
    this.setState({
      color: this.getColor(this.props.value),
      colorPicker: false,
      colorPickerPosition: 0
    });
  }

  getColor(color) {
    color = color || this.props.defaultValue;

    const rgba = cssColor(color);
    let r = rgba.r, g = rgba.g, b = rgba.b, a = rgba.a;
    const hsv = rgb2hsv(r, g, b);

    return assign(hsv, {
      r: r,
      g: g,
      b: b,
      a: a,
      hex: rgb2hex(r, g, b)
    });
  };

  getRgbaBackground() {
    const color = this.state.color;
    const r = color.r;
    const g = color.g;
    const b = color.b;
    const a = color.a;
    return rgbaColor(r, g, b, a);
  };

  render() {
    const color = this.state.color;
    const rgbaBackground = this.getRgbaBackground();

    return (
      <span className={cx('m-input-color', {
        'color-picker-open': this.state.colorPicker
      })}>
        <span
          className="css-color"
          style={{background:rgbaBackground}}
          onClick={this._onClick}
        />

        <span
          className="remove"
          onClick={this.handleClickRemove}>&times;</span>
        {this.state.colorPicker ? <ColorPicker
          left={this.state.colorPickerPosition}
          color={this.state.color}
          onChange={this._onChange}/> : null}
      </span>
    );
  };

  componentDidMount() {
    document.addEventListener('click', this.closeColorPicker, false);
  };

  componentWillUnmount() {
    document.removeEventListener('click', this.closeColorPicker);
  };

  closeColorPicker() {
    this.setState({colorPicker: false});
  };

  componentWillReceiveProps(nextProps) {
    const cssColor = nextProps.value;

    // anti-pattern, maybe
    if(!this._updated) {
      this.setState({
        color: this.getColor(cssColor)
      });
    } else {
      this._updated = false;
    }
  };

  change(cssColor) {
    if(this.props.onChange) {
      this.props.onChange(cssColor);
    }
  };

  _onChange(color) {
    this.setState({
      cssColor: '#'+color.hex,
      color: color
    });

    this._updated = true;
    this.change('#'+rgba2hex(
      color.r,
      color.g,
      color.b,
      color.a
    ));
  };

  _onClick(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    const dom = ReactDOM.findDOMNode(this);
    const rect = dom.getBoundingClientRect();
    const ww = window.innerWidth;

    let left = -105;
    if(rect.right+105 > ww) {
      left = -210+ww-rect.right;
    } else if(rect.left-105 < 0) {
      left = -rect.left;
    }

    this.setState({
      colorPicker: !this.state.colorPicker,
      colorPickerPosition: left
    });
  };

  handleClickRemove(e) {
    this.change('');
  }
}

module.exports = InputColor;