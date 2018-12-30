const React = require('react');
const objectAssign = require('object-assign');
const InputSlider = require('react-input-slider');
const InputNumber = require('react-input-number');

const rgb2hsv = require('color-functions/dist/rgb2hsv');
const hsv2hex = require('color-functions/dist/hsv2hex');
const hsv2rgb = require('color-functions/dist/hsv2rgb');
const rgb2hex = require('color-functions/dist/rgb2hex');
const hex2rgb = require('color-functions/dist/hex2rgb');
const rgba = require('color-functions/dist/rgba');

const KEY_ENTER = 13;

class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.setState({
      hex: this.props.color.hex,
      hsvMode: false
    });
  };

  render() {
    const color = this.props.color;
    const r = color.r, g = color.g, b = color.b;
    const h = color.h, s = color.s, v = color.v;
    const a = color.a, hex = color.hex;

    const rgbaBackground = rgba(r, g, b, a);
    const opacityGradient = 'linear-gradient(to right, '+
      rgba(r, g, b, 0)+', '+
      rgba(r, g, b, 100)+')';
    const hueBackground = '#'+hsv2hex(h, 100, 100);

    return (
      <div className="m-color-picker" style={{left: this.props.left}} onClick={this._onClick}>
        <div className="selector"
        style={{backgroundColor: hueBackground}}>
          <div className="gradient white"></div>
          <div className="gradient dark"></div>
          <InputSlider
            className="slider slider-xy"
            axis="xy"
            x={s} xmax={100}
            y={100-v} ymax={100}
            onChange={this._onSVChange}
          />
        </div>

        <div className="sliders">
          <InputSlider
            className="slider slider-x hue"
            axis="x" x={h} xmax={359}
            onChange={this._onHueChange}
          />
          <InputSlider
            className="slider slider-x opacity"
            axis="x" x={a} xmax={100}
            style={{background: opacityGradient}}
            onChange={this._onAlphaChange}
          />
          <div className="color" style={{backgroundColor: rgbaBackground}}></div>
        </div>

        <div className="inputs">
          <div className="input hex">
            <input type="text" className="value" value={this.state.hex}
              onChange={this._onHexChange} onKeyUp={this._onHexKeyUp}/>
            <span className="label">Hex</span>
          </div>

          {!this.state.hsvMode ? (
          <div>
            <div className="input r">
              <InputNumber
                className="value" value={r}
                onChange={this.changeRGB.bind(null, 'r')}/>
              <span className="label">R</span>
            </div>
            <div className="input g">
              <InputNumber
                className="value" value={g}
                onChange={this.changeRGB.bind(null, 'g')}/>
              <span className="label">G</span>
            </div>
            <div className="input b">
              <InputNumber
                className="value" value={b}
                onChange={this.changeRGB.bind(null, 'b')}/>
              <span className="label">B</span>
            </div>
          </div>
          ) : (
          <div>
            <div className="input h">
              <InputNumber
                className="value" value={h}
                onChange={this.changeHSV.bind(null, 'h')}/>
              <span className="label">H</span>
            </div>
            <div className="input s">
              <InputNumber
                className="value" value={s}
                onChange={this.changeHSV.bind(null, 's')}/>
              <span className="label">S</span>
            </div>
            <div className="input v">
              <InputNumber
                className="value" value={v}
                onChange={this.changeHSV.bind(null, 'v')}/>
              <span className="label">V</span>
            </div>
          </div>
          )}

          <div className="input a">
            <InputNumber
              className="value" value={a}
              onChange={this.changeAlpha}/>
            <span className="label">A</span>
          </div>
        </div>
      </div>
    );
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const hex = nextProps.color.hex;
    this.setState({
      hex: hex
    });
  };

  changeHSV(p, val) {
    if(this.props.onChange) {
      let j = p; if(typeof j === 'string') { j = {}; j[p] = val; }
      const color = this.props.color;
      const rgb = hsv2rgb(j.h||color.h, j.s||color.s, j.v||color.v);
      const hex = rgb2hex(rgb.r, rgb.g, rgb.b);
      this.props.onChange(objectAssign(color, j, rgb, {hex: hex}));
    }
  };

  changeRGB(p, val) {
    if(this.props.onChange) {
      letj = p; if(typeof j === 'string') { j = {}; j[p] = val; }

      const color = this.props.color;
      const rgb = [
        j.r !== void 0 ? j.r : color.r,
        j.g !== void 0 ? j.g : color.g,
        j.b !== void 0 ? j.b : color.b
      ];

      const hsv = rgb2hsv.apply(null, rgb);
      const hex = rgb2hex.apply(null, rgb);

      this.props.onChange(objectAssign(color, j, hsv, {hex: hex}));
    }
  };

  changeAlpha(a) {
    if(this.props.onChange) {
      if(a <= 100 && a >= 0) {
        this.props.onChange(objectAssign(this.props.color, {a: a}));
      }
    }
  };

  _onSVChange(pos) {
    this.changeHSV({
      s: pos.x,
      v: 100-pos.y
    });
  };

  _onHueChange(pos) {
    this.changeHSV({
      h: pos.x
    });
  };

  _onAlphaChange(pos) {
    this.changeHSV({
      a: parseInt(pos.x, 10)
    });
  };

  _onHexChange(e) {
    this.setState({
      hex: e.target.value.trim()
    });
  };

  _onHexKeyUp(e) {
    if(e.keyCode === KEY_ENTER) {
      const hex = e.target.value.trim();
      const rgb = hex2rgb(hex);
      this.changeRGB(objectAssign(rgb, {hex: hex}));
    }
  };

  _onClick(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }
}

module.exports = ColorPicker;