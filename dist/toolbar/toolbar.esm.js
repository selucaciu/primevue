import { openBlock, createBlock, createVNode, renderSlot } from 'vue';

var script = {
    name: 'Toolbar'
};

const _hoisted_1 = {
  class: "p-toolbar p-component",
  role: "toolbar"
};
const _hoisted_2 = { class: "p-toolbar-group-left" };
const _hoisted_3 = { class: "p-toolbar-group-right" };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("div", _hoisted_1, [
    createVNode("div", _hoisted_2, [
      renderSlot(_ctx.$slots, "start")
    ]),
    createVNode("div", _hoisted_3, [
      renderSlot(_ctx.$slots, "end")
    ])
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

var css_248z = "\n.p-toolbar {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: justify;\r\n        -ms-flex-pack: justify;\r\n            justify-content: space-between;\r\n    -ms-flex-wrap: wrap;\r\n        flex-wrap: wrap;\n}\n.p-toolbar-group-left,\r\n.p-toolbar-group-right {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\n}\r\n";
styleInject(css_248z);

script.render = render;
script.__file = "src/components/toolbar/Toolbar.vue";

export { script as default };
