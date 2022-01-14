import { openBlock, createBlock, renderSlot, createCommentVNode, createVNode } from 'vue';

var script = {
    name: 'Card'
};

const _hoisted_1 = { class: "p-card p-component" };
const _hoisted_2 = {
  key: 0,
  class: "p-card-header"
};
const _hoisted_3 = { class: "p-card-body" };
const _hoisted_4 = {
  key: 0,
  class: "p-card-title"
};
const _hoisted_5 = {
  key: 1,
  class: "p-card-subtitle"
};
const _hoisted_6 = { class: "p-card-content" };
const _hoisted_7 = {
  key: 2,
  class: "p-card-footer"
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("div", _hoisted_1, [
    (_ctx.$slots.header)
      ? (openBlock(), createBlock("div", _hoisted_2, [
          renderSlot(_ctx.$slots, "header")
        ]))
      : createCommentVNode("v-if", true),
    createVNode("div", _hoisted_3, [
      (_ctx.$slots.title)
        ? (openBlock(), createBlock("div", _hoisted_4, [
            renderSlot(_ctx.$slots, "title")
          ]))
        : createCommentVNode("v-if", true),
      (_ctx.$slots.subtitle)
        ? (openBlock(), createBlock("div", _hoisted_5, [
            renderSlot(_ctx.$slots, "subtitle")
          ]))
        : createCommentVNode("v-if", true),
      createVNode("div", _hoisted_6, [
        renderSlot(_ctx.$slots, "content")
      ]),
      (_ctx.$slots.footer)
        ? (openBlock(), createBlock("div", _hoisted_7, [
            renderSlot(_ctx.$slots, "footer")
          ]))
        : createCommentVNode("v-if", true)
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

var css_248z = "\n.p-card-header img {\r\n    width: 100%;\n}\r\n";
styleInject(css_248z);

script.render = render;

export { script as default };
