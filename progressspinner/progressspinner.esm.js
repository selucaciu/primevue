import { openBlock, createBlock, createVNode } from 'vue';

var script = {
    name: 'ProgressSpinner',
    props: {
        strokeWidth: {
            type: String,
            default: '2'
        },
        fill: {
            type: String,
            default: 'none'
        },
        animationDuration: {
            type: String,
            default: '2s'
        }
    },
    computed: {
        svgStyle() {
            return {
                'animation-duration': this.animationDuration
            };
        }
    }
};

const _hoisted_1 = {
  class: "p-progress-spinner",
  role: "alert",
  "aria-busy": "true"
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("div", _hoisted_1, [
    (openBlock(), createBlock("svg", {
      class: "p-progress-spinner-svg",
      viewBox: "25 25 50 50",
      style: $options.svgStyle
    }, [
      createVNode("circle", {
        class: "p-progress-spinner-circle",
        cx: "50",
        cy: "50",
        r: "20",
        fill: $props.fill,
        "stroke-width": $props.strokeWidth,
        strokeMiterlimit: "10"
      }, null, 8 /* PROPS */, ["fill", "stroke-width"])
    ], 4 /* STYLE */))
  ]))
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "\n.p-progress-spinner {\r\n    position: relative;\r\n    margin: 0 auto;\r\n    width: 100px;\r\n    height: 100px;\r\n    display: inline-block;\n}\n.p-progress-spinner::before {\r\n     content: '';\r\n     display: block;\r\n     padding-top: 100%;\n}\n.p-progress-spinner-svg {\r\n    -webkit-animation: p-progress-spinner-rotate 2s linear infinite;\r\n            animation: p-progress-spinner-rotate 2s linear infinite;\r\n    height: 100%;\r\n    -webkit-transform-origin: center center;\r\n            transform-origin: center center;\r\n    width: 100%;\r\n    position: absolute;\r\n    top: 0;\r\n    bottom: 0;\r\n    left: 0;\r\n    right: 0;\r\n    margin: auto;\n}\n.p-progress-spinner-circle {\r\n    stroke-dasharray: 89, 200;\r\n    stroke-dashoffset: 0;\r\n    stroke: #d62d20;\r\n    -webkit-animation: p-progress-spinner-dash 1.5s ease-in-out infinite, p-progress-spinner-color 6s ease-in-out infinite;\r\n            animation: p-progress-spinner-dash 1.5s ease-in-out infinite, p-progress-spinner-color 6s ease-in-out infinite;\r\n    stroke-linecap: round;\n}\n@-webkit-keyframes p-progress-spinner-rotate {\n100% {\r\n        -webkit-transform: rotate(360deg);\r\n                transform: rotate(360deg);\n}\n}\n@keyframes p-progress-spinner-rotate {\n100% {\r\n        -webkit-transform: rotate(360deg);\r\n                transform: rotate(360deg);\n}\n}\n@-webkit-keyframes p-progress-spinner-dash {\n0% {\r\n        stroke-dasharray: 1, 200;\r\n        stroke-dashoffset: 0;\n}\n50% {\r\n        stroke-dasharray: 89, 200;\r\n        stroke-dashoffset: -35px;\n}\n100% {\r\n        stroke-dasharray: 89, 200;\r\n        stroke-dashoffset: -124px;\n}\n}\n@keyframes p-progress-spinner-dash {\n0% {\r\n        stroke-dasharray: 1, 200;\r\n        stroke-dashoffset: 0;\n}\n50% {\r\n        stroke-dasharray: 89, 200;\r\n        stroke-dashoffset: -35px;\n}\n100% {\r\n        stroke-dasharray: 89, 200;\r\n        stroke-dashoffset: -124px;\n}\n}\n@-webkit-keyframes p-progress-spinner-color {\n100%,\r\n    0% {\r\n        stroke: #d62d20;\n}\n40% {\r\n        stroke: #0057e7;\n}\n66% {\r\n        stroke: #008744;\n}\n80%,\r\n    90% {\r\n        stroke: #ffa700;\n}\n}\n@keyframes p-progress-spinner-color {\n100%,\r\n    0% {\r\n        stroke: #d62d20;\n}\n40% {\r\n        stroke: #0057e7;\n}\n66% {\r\n        stroke: #008744;\n}\n80%,\r\n    90% {\r\n        stroke: #ffa700;\n}\n}\r\n";
styleInject(css_248z);

script.render = render;

export { script as default };
